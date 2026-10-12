import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signJWT, COOKIE_NAME } from "@/lib/auth";
import { applySecurityShield, shieldError } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const shield = await applySecurityShield(request, {
      maxBodyBytes: 128 * 1024,
      rateLimitKey: "login",
      rateLimitMax: 15,
      rateLimitWindowMs: 60000,
    });
    if (!shield.success) return shield.response!;

    const { email, password, rememberMe } = shield.data || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // 1. Find user in database
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 2. Anti Brute-Force: Check if account is temporarily locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / (1000 * 60)
      );
      return NextResponse.json(
        {
          success: false,
          error: `Security lock active due to failed attempts. Try again in ${remainingMinutes} minute(s).`,
        },
        { status: 423 }
      );
    }

    // 3. Verify Password
    let isValid = await verifyPassword(password, user.passwordHash);

    // Flexible fallback: if login failed and password starts with ADMIN_PREFIX, also check stripped version
    const ADMIN_PREFIX = (process.env.ADMIN_SECRET_PREFIX || "LABSADMIN").toUpperCase();
    if (!isValid && typeof password === "string" && password.toUpperCase().startsWith(ADMIN_PREFIX)) {
      const stripped = password.slice(ADMIN_PREFIX.length);
      if (stripped.length > 0) {
        isValid = await verifyPassword(stripped, user.passwordHash);
      }
    }

    if (!isValid) {
      const nextAttempts = user.failedAttempts + 1;
      const shouldLock = nextAttempts >= 5;
      const lockDuration = shouldLock
        ? new Date(Date.now() + 10 * 60 * 1000) // 10 minutes lockout
        : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: shouldLock ? 0 : nextAttempts,
          lockedUntil: lockDuration,
        },
      });

      if (shouldLock) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many failed attempts. Account locked for 10 minutes.",
          },
          { status: 423 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Invalid credentials. (${5 - nextAttempts} attempt(s) remaining)`,
        },
        { status: 401 }
      );
    }

    // 4. Reset failed attempts & update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // 5. Generate Signed JWT Token (7 days, or 30 days if rememberMe)
    const durationDays = rememberMe ? 30 : 7;
    const token = await signJWT(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role as "SUPER_ADMIN" | "PROJECT_MANAGER" | "CLIENT",
        clientOrganizationId: user.clientOrganizationId,
      },
      durationDays
    );

    // 6. Response with HttpOnly Secure Cookie (The Sweet Spot)
    const response = NextResponse.json(
      {
        success: true,
        message: "Authentication successful.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectTo: user.role === "CLIENT" ? "/portal" : "/admin",
      },
      { status: 200 }
    );

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: durationDays * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return shieldError(error, "Internal server error during authentication.");
  }
}
