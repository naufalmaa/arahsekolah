// File: app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UpdateReviewSchema, IdParamSchema } from "@/lib/schemas"; // Import schemas

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id || !session.user.role) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const paramValidation = IdParamSchema.safeParse(params);
  if (!paramValidation.success) {
    return NextResponse.json(
      {
        message: "Invalid Review ID format.",
        issues: paramValidation.error.issues,
      },
      { status: 400 }
    );
  }

  const reviewId = paramValidation.data.id;

  try {
    const reviewToDelete = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!reviewToDelete) {
      return NextResponse.json(
        { message: "Review not found." },
        { status: 404 }
      );
    }
    const isOwner = reviewToDelete.userId === session.user.id;
    const isAdmin =
      session.user.role === "SCHOOL_ADMIN" ||
      session.user.role === "SUPERADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: You are not authorized to delete this review." },
        { status: 403 }
      );
    }
    // Corrected: use `await` to ensure the deletion is complete before returning
    await prisma.review.delete({ where: { id: reviewId } });
    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting review:", error);

    return NextResponse.json(
      { message: "Failed to delete review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Use session.user.id for consistency with other checks
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate 'id' parameter
  const paramValidation = IdParamSchema.safeParse(params);
  if (!paramValidation.success) {
    return NextResponse.json(
      {
        message: "Invalid Review ID format.",
        issues: paramValidation.error.issues,
      },
      { status: 400 }
    );
  }
  const reviewId = paramValidation.data.id;

  const body = await req.json();

  // Validate request body using Zod schema
  const validationResult = UpdateReviewSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        message: "Invalid request body for review update.",
        issues: validationResult.error.issues,
      },
      { status: 400 }
    );
  }

  const validatedData = validationResult.data;
  try {
    // CORRECTED: Explicitly check if the review exists before attempting to update.
    const reviewToUpdate = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, schoolId: true }, // Select schoolId to handle potential future logic
    });
    if (!reviewToUpdate) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }
    const isOwner = reviewToUpdate.userId === session.user.id;
    const isAdmin =
      session.user.role === "SCHOOL_ADMIN" ||
      session.user.role === "SUPERADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: You are not authorized to update this review." },
        { status: 403 }
      );
    }

    const dataToUpdate = Object.fromEntries(
      Object.entries(validatedData).filter(([, value]) => value !== undefined)
    );

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: dataToUpdate,
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error(err);
    // CORRECTED: The explicit `findUnique` check above makes this catch block less critical
    // for not-found errors, but it's good to keep for other potential errors.
    return NextResponse.json(
      { message: "Failed to update review" },
      { status: 500 }
    );
  }
}
