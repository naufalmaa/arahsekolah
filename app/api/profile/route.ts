// File: app/api/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
});

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  // Logic to handle password change
  if (body.currentPassword && body.newPassword) {
    const validation = changePasswordSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: "User not found or password not set." }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(
            validation.data.currentPassword,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
        }
        
        const newPasswordHash = await bcrypt.hash(validation.data.newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error during password update." }, { status: 500 });
    }
  }
  
  // Logic to handle profile info update
  else if (body.name) {
    const validation = updateProfileSchema.safeParse(body);
     if (!validation.success) {
        return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name: validation.data.name },
            select: { id: true, name: true, email: true, image: true, role: true },
        });
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error during profile update." }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
}