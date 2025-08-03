// file: app/api/stats/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { School, User } from "@prisma/client";

// Helper untuk menghitung kelengkapan profil sekolah
const calculateProfileCompleteness = (school: School): number => {
  const fields = ["description", "programs", "achievements", "website"];
  let filledFields = 0;
  fields.forEach((field) => {
    const value = school[field as keyof School];
    if (value && String(value).trim() !== "") {
      filledFields++;
    }
  });
  return Math.round((filledFields / fields.length) * 100);
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: userId, role } = session.user;

  try {
    if (role === "SUPERADMIN") {
      const [userCount, schoolCount, reviewCount, recentReviews, userSignups] =
        await Promise.all([
          prisma.user.count(),
          prisma.school.count(),
          prisma.review.count(),
          prisma.review.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
              user: { select: { name: true } },
              school: { select: { name: true } },
            },
          }),
          // Agregasi pendaftaran pengguna per bulan untuk 6 bulan terakhir
          prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
                    SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month, COUNT(id) as count
                    FROM "users"
                    WHERE "createdAt" >= NOW() - INTERVAL '6 months'
                    GROUP BY month
                    ORDER BY month ASC;
                `,
        ]);

      // Konversi BigInt ke Number
      const formattedSignups = userSignups.map((item) => ({
        ...item,
        count: Number(item.count),
      }));

      return NextResponse.json({
        userCount,
        schoolCount,
        reviewCount,
        recentReviews,
        userSignups: formattedSignups,
      });
    }

    if (role === "SCHOOL_ADMIN") {
      const admin = await prisma.user.findUnique({ where: { id: userId } });
      if (!admin?.assignedSchoolId) {
        return NextResponse.json(
          { error: "Admin not assigned to any school" },
          { status: 403 }
        );
      }

      const school = await prisma.school.findUnique({
        where: { id: admin.assignedSchoolId },
        include: { _count: { select: { reviews: true } } },
      });
      if (!school) {
        return NextResponse.json(
          { error: "Assigned school not found" },
          { status: 404 }
        );
      }

      const reviews = await prisma.review.findMany({
        where: { schoolId: admin.assignedSchoolId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      });

      const avgRatings = await prisma.review.aggregate({
        where: { schoolId: admin.assignedSchoolId },
        _avg: {
          kenyamanan: true,
          pembelajaran: true,
          fasilitas: true,
          kepemimpinan: true,
        },
      });

      const avg = avgRatings._avg;

      const overallAvg =
        ((avg.kenyamanan ?? 0) +
          (avg.pembelajaran ?? 0) +
          (avg.fasilitas ?? 0) +
          (avg.kepemimpinan ?? 0)) /
        4;

      return NextResponse.json({
        assignedSchoolId: school.id, // ADDED: Kirim ID sekolah ke client
        schoolName: school.name,
        reviewCount: school._count.reviews,
        averageRating: parseFloat(overallAvg.toFixed(2)),
        recentReviews: reviews,
        profileCompleteness: calculateProfileCompleteness(school),
      });
    }

    if (role === "USER") {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      // If user is not found, use default average values
      let avg = {
        kenyamanan: 0,
        pembelajaran: 0,
        fasilitas: 0,
        kepemimpinan: 0,
      };

      if (user) {
        const avgRatings = await prisma.review.aggregate({
          where: { userId: user.id },
          _avg: {
            kenyamanan: true,
            pembelajaran: true,
            fasilitas: true,
            kepemimpinan: true,
          },
        });

        avg = {
          kenyamanan: avgRatings._avg.kenyamanan ?? 0,
          pembelajaran: avgRatings._avg.pembelajaran ?? 0,
          fasilitas: avgRatings._avg.fasilitas ?? 0,
          kepemimpinan: avgRatings._avg.kepemimpinan ?? 0,
        };
      }

      const round = (num: number) => Math.round(num * 100) / 100;

      const overallAvg = round(
        (avg.kenyamanan + avg.pembelajaran + avg.fasilitas + avg.kepemimpinan) /
          4
      );

      const [reviewCount, recentUserReviews] = await Promise.all([
        prisma.review.count({ where: { userId } }),
        prisma.review.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { school: { select: { name: true } } },
        }),
      ]);

      return NextResponse.json({
        reviewCount,
        recentUserReviews,
        overallAvgRatingRecents: parseFloat(overallAvg.toFixed(2)),
      });
    }

    return NextResponse.json({ error: "Invalid user role" }, { status: 403 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
