import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hash } from "@node-rs/argon2";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0], // Use part of email as default name
      },
    });

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 