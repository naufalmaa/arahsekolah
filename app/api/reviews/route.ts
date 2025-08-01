// File: app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CreateReviewSchema  } from "@/lib/schemas"; // Import schemas

export async function GET(req: NextRequest) {
  const schoolIdParam = req.nextUrl.searchParams.get("schoolId");
  let schoolId: number | undefined;

  // Validate schoolId query parameter if present
  if (schoolIdParam) {
    const parsedId = parseInt(schoolIdParam, 10);

    if (isNaN(parsedId)) {
      return NextResponse.json(
        { message: "Invalid schoolId query parameter. Must be a number." },
        { status: 400 }
      );
    }
    schoolId = parsedId;
  }

  try {
    const reviews = await prisma.review.findMany({
      where: schoolId ? { schoolId: schoolId } : {}, // Filter by schoolId if valid
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }, // Add ordering for consistency
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "USER") {
    return NextResponse.json(
      {
        message:
          "Forbidden: Only authenticated users with 'USER' role can create reviews.",
      },
      { status: 403 }
    );
  }

  const body = await req.json();

  // Validate the request body with Zod
  const validationResult = CreateReviewSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        message: "Invalid request body for review creation.",
        issues: validationResult.error.issues,
      },
      { status: 400 }
    );
  }

  const validatedData = validationResult.data;

  try {
    const review = await prisma.review.create({
      data: {
        school: { connect: { id: validatedData.schoolId } }, // Use validated schoolId
        user: { connect: { id: session.user.id } },
        name: validatedData.name || session.user.name, // Use validated data and fallback to session name
        role: validatedData.role,
        biaya: validatedData.biaya,
        komentar: validatedData.komentar,
        kenyamanan: validatedData.kenyamanan,
        pembelajaran: validatedData.pembelajaran,
        fasilitas: validatedData.fasilitas,
        kepemimpinan: validatedData.kepemimpinan,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating review:", err);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}
