// app/api/schools/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IdParamSchema, UpdateSchoolSchema } from '@/lib/schemas'; // Import schemas
import { Prisma } from '@prisma/client'; // Import Prisma

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const paramValidation = IdParamSchema.safeParse(resolvedParams);
  if (!paramValidation.success) {
    return NextResponse.json(
      { message: "Invalid School ID format.", issues: paramValidation.error.issues },
      { status: 400 }
    );
  }
  const schoolId = paramValidation.data.id;

  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        reviews: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!school) {
      return NextResponse.json({ message: "School not found." }, { status: 404 });
    }

    const reviewCount = school.reviews.length;
    let avgRating = 0;
    if (reviewCount > 0) {
      const totalRating = school.reviews.reduce((sum, review) =>
        sum + review.kenyamanan + review.pembelajaran + review.fasilitas + review.kepemimpinan, 0);
      avgRating = totalRating / (reviewCount * 4);
    }

    return NextResponse.json({ 
        ...school, 
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviewCount 
    });
  } catch (error: unknown) {
    console.error("Failed to fetch school:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate 'id' parameter
  const resolvedParams = await params; // Await the params Promise

  const paramValidation = IdParamSchema.safeParse(resolvedParams);
  if (!paramValidation.success) {
    return NextResponse.json(
      { message: "Invalid School ID format.", issues: paramValidation.error.issues },
      { status: 400 }
    );
  }
  const schoolId = paramValidation.data.id;

  const body = await request.json();

  // Validate request body using Zod schema
  const validationResult = UpdateSchoolSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { message: "Invalid request body for school update.", issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const validatedData = validationResult.data;

  const dataToUpdate = Object.fromEntries(
      Object.entries(validatedData).filter(([, value]) => value !== undefined)
    );

  try {
    const updatedSchool = await prisma.school.update({
      where: { id: schoolId },
      data: dataToUpdate, // Use validated data
    });
    return NextResponse.json(updatedSchool);
  } catch (err: unknown) {
    console.error("Failed to update school:", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return NextResponse.json({ message: "School not found for update." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Failed to update school." },
      { status: 500 }
    );
  }
}