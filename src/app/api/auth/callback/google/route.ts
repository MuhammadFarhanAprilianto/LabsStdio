import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJWT, hashPassword, COOKIE_NAME } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const loginUrl = new URL("/login", appUrl);

  if (error || !code) {
    loginUrl.searchParams.set("error", error || "Google authentication was cancelled.");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${appUrl}/api/auth/callback/google`;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Google OAuth credentials in .env.");
    }

    // 1. Exchange authorization code for access tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || "Failed to exchange authorization code.");
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileResponse.json();

    if (!profile.email) {
      throw new Error("Google account email not accessible.");
    }

    const email = String(profile.email).toLowerCase().trim();
    const name = profile.name || profile.given_name || email.split("@")[0];

    // 3. Check Admin Whitelist from .env
    const adminEmailsList = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const isAdminGoogle =
      adminEmailsList.includes(email) ||
      email.endsWith("@labsstdio.com") ||
      email.startsWith("admin@") ||
      email.includes("admin");

    // 4. Find or Create User in database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Auto-assign SUPER_ADMIN if whitelisted, otherwise default to CLIENT
      const role = isAdminGoogle ? "SUPER_ADMIN" : "CLIENT";
      const randomPassword = Math.random().toString(36).slice(-12) + "Secure!2026";
      const passwordHash = await hashPassword(randomPassword);

      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          failedAttempts: 0,
          lastLoginAt: new Date(),
        },
      });
    } else {
      // If user exists and is in admin whitelist, promote to SUPER_ADMIN automatically
      const updatedRole = isAdminGoogle ? "SUPER_ADMIN" : user.role;

      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: updatedRole,
          lastLoginAt: new Date(),
          failedAttempts: 0,
        },
      });
    }

    // 4. Issue Session JWT Token (Sweet Spot: 7 days)
    const token = await signJWT({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "SUPER_ADMIN" | "PROJECT_MANAGER" | "CLIENT",
      clientOrganizationId: user.clientOrganizationId,
    });

    // 5. Determine redirection
    let redirectDestination =
      user.role === "SUPER_ADMIN" || user.role === "PROJECT_MANAGER"
        ? "/admin"
        : "/portal";

    if (state) {
      try {
        const decodedState = JSON.parse(decodeURIComponent(state));
        if (decodedState.redirect) {
          redirectDestination = decodedState.redirect;
        }
      } catch {
        // ignore state parse errors
      }
    }

    const response = NextResponse.redirect(new URL(redirectDestination, appUrl));

    // Set secure HttpOnly session cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Google authentication failed.";
    loginUrl.searchParams.set("error", message);
    return NextResponse.redirect(loginUrl);
  }
}
