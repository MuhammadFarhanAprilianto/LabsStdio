import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Security best practice: Don't reveal if user does not exist
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If that email address is registered, a password recovery link has been prepared.",
      });
    }

    // 2. Generate secure random 64-character hex token & 1-hour expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 3. Save reset token to user in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

    return NextResponse.json({
      success: true,
      message: "If that email address is registered, a password recovery link has been prepared.",
      resetUrl,
      isDev: process.env.NODE_ENV !== "production",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process request.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
