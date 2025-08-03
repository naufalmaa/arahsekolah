// File: app/api/schools/route.ts - Explicit type fix
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { CreateSchoolSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      include: {
        _count: {
          select: { reviews: true },
        },
        reviews: {
          select: {
            kenyamanan: true,
            pembelajaran: true,
            fasilitas: true,
            kepemimpinan: true,
          },
        },
      },
    });

    // Proses data untuk menambahkan avgRating
    const schoolsWithAvgRating = schools.map(school => {
      const reviewCount = school._count.reviews;
      let avgRating = 0;
      if (reviewCount > 0) {
        const totalRating = school.reviews.reduce((sum, review) => 
          sum + review.kenyamanan + review.pembelajaran + review.fasilitas + review.kepemimpinan, 0);
        avgRating = totalRating / (reviewCount * 4); // 4 kriteria per ulasan
      }
      
      // Hapus data reviews yang besar agar response API lebih ramping
      const { reviews, ...schoolData } = school;

      return {
        ...schoolData,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviewCount,
      };
    });

    return NextResponse.json(schoolsWithAvgRating);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json({ message: "Error fetching schools" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ message: "Forbidden: Only Superadmin can create schools." }, { status: 403 });
  }

  const body = await req.json();

  // Validate the request body with Zod
  const validationResult = CreateSchoolSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { message: "Invalid request body for school creation.", issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const validatedData = validationResult.data;

  try {
    // Use the validated data directly
    const newSchool = await prisma.school.create({
      data: {
        name: validatedData.name,
        status: validatedData.status,
        npsn: validatedData.npsn,
        bentuk: validatedData.bentuk,
        alamat: validatedData.alamat,
        kelurahan: validatedData.kelurahan,
        kecamatan: validatedData.kecamatan,
        telp: validatedData.telp || "", // Provide empty string if null/undefined (if keeping telp required)
        lat: validatedData.lat,
        lng: validatedData.lng,
        achievements: validatedData.achievements,
        contact: validatedData.contact,
        description: validatedData.description,
        programs: validatedData.programs,
        website: validatedData.website || null, // Convert empty string to null
      },
    });
    return NextResponse.json(newSchool, { status: 201 });
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json({ message: "Failed to create school" }, { status: 500 });
  }
}