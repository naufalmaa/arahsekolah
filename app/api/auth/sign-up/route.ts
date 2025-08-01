// File: app/api/auth/sign-up/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // 1. Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // 2. Hash password
    const saltRounds = 10;
    // const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Create user
    // const user = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     passwordHash, // use passwordHash instead of password
    //     role: "USER",           // default role
    //     assignedSchoolId: null, // no school yet
    //   },
    // });

    return NextResponse.json(
      { message: "Account created. Please sign in." },
      { status: 201 }
    );
  } catch (err: unknown) {
    // Prisma “unique constraint” error code
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 409 }
      );
    }
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
