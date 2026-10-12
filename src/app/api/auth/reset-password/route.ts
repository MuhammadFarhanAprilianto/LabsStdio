import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing recovery token." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 1. Find user by resetToken and ensure it has not expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "This password recovery link is invalid or has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // 2. Hash new password with Bcrypt (12 salt rounds)
    const passwordHash = await hashPassword(newPassword);

    // 3. Update user: new password, clear token, reset any security locks
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
        failedAttempts: 0,
        lockedUntil: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been updated successfully. You can now sign in.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reset password.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
