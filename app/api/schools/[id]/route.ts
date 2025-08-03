// app/api/schools/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IdParamSchema, UpdateSchoolSchema } from '@/lib/schemas'; 
import { Prisma } from '@prisma/client';
// ADDED: Import untuk mengambil sesi server-side
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
  // ADDED: Otorisasi berdasarkan sesi dan peran pengguna
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const resolvedParams = await params; 
  const paramValidation = IdParamSchema.safeParse(resolvedParams);
  if (!paramValidation.success) {
    return NextResponse.json(
      { message: "Invalid School ID format.", issues: paramValidation.error.issues },
      { status: 400 }
    );
  }
  const schoolIdToEdit = paramValidation.data.id;
  
  // ADDED: Logika keamanan untuk SCHOOL_ADMIN
  if (session.user.role === 'SCHOOL_ADMIN') {
    if (session.user.assignedSchoolId !== schoolIdToEdit) {
      return NextResponse.json(
        { message: "Forbidden: You are not authorized to edit this school." },
        { status: 403 }
      );
    }
  } else if (session.user.role !== 'SUPERADMIN') {
    // Hanya SUPERADMIN dan SCHOOL_ADMIN yang diizinkan melanjutkan
    return NextResponse.json(
      { message: "Forbidden: You do not have permission to perform this action." },
      { status: 403 }
    );
  }

  const body = await request.json();
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
      where: { id: schoolIdToEdit }, // REPLACED: Menggunakan schoolIdToEdit yang sudah divalidasi
      data: dataToUpdate,
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