// File: app/api/users/[id]/route.ts
// CORRECTED: New file for managing individual users

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

interface UpdateUserRequestBody {
  name?: string; // Optional because not all fields might be sent for update
  email?: string;
  role?: 'SUPERADMIN' | 'SCHOOL_ADMIN' | 'USER'; // Make sure this matches your actual roles
  assignedSchoolId?: string | number | null; // Can be string from form input, or number/null
  password?: string;
}

interface PrismaUserUpdateData {
  name?: string;
  email?: string;
  role?: "SUPERADMIN" | "SCHOOL_ADMIN" | "USER";
  assignedSchoolId?: number | null; // Prisma expects number or null for assignedSchoolId
  passwordHash?: string;
}

// PUT update a user (SUPERADMIN only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Fixed parameter type
) {
  const resolvedParams = await params; // Await the params Promise
  const userId = resolvedParams.id;

  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  try {
    const body : UpdateUserRequestBody = await req.json();
    const { name, email, role, assignedSchoolId, password } = body;

    const dataToUpdate: PrismaUserUpdateData = {};

    // If a new password is provided, hash it and include it in the update
    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (role !== undefined) dataToUpdate.role = role;

      // Handle assignedSchoolId conversion and conditional assignment
    if (role === 'SCHOOL_ADMIN') {
      dataToUpdate.assignedSchoolId = assignedSchoolId ? Number(assignedSchoolId) : null;
    } else if (assignedSchoolId !== undefined) {
      // If role is not SCHOOL_ADMIN and assignedSchoolId is explicitly sent,
      // it means it should be nullified (or handled as per your logic)
      dataToUpdate.assignedSchoolId = null;
    }

    // If a new password is provided, hash it and include it in the update
    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }


    // Prevent a SUPERADMIN from changing their own role
    if (userId === session.user.id && role !== session.user.role) {
      return NextResponse.json(
        { error: "You cannot change your own role." },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    const { ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);

  } catch (error: unknown) { // Use 'unknown' for caught errors as best practice
    if (error instanceof Error) {
      // Now 'error' is of type Error, and you can access its properties
      console.error("Error updating user:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }

    // Handle Prisma errors specifically
    if (typeof error === 'object' && error !== null && 'code' in error) {
        // Type assertion to ensure 'error.code' exists and is a string
        const prismaError = error as { code: string };
        if (prismaError.code === 'P2002') { // Unique constraint failed (email)
            return NextResponse.json({ error: "Email is already in use by another account." }, { status: 409 });
        }
        if (prismaError.code === 'P2025') { // Record to update not found
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a user (SUPERADMIN only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Fixed parameter type
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resolvedParams = await params; // Await the params Promise
  const userId = resolvedParams.id;

  // Prevent SUPERADMIN from deleting themselves
  if (userId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 403 }
    );
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
      console.error("Failed to update school:", err);
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
          return NextResponse.json({ message: "School not found for update." }, { status: 404 });
      }
    console.error("Error deleting user:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
