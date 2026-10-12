import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJWT, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, organizationName, requestedRole, adminPasscode } = body;

    // 1. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // 2. Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email is already registered. Please sign in instead." },
        { status: 409 }
      );
    }

    // 3. Determine Role & Password (Secret prefix "LABSADMIN" + password)
    const rawPassword = String(password);
    const upperPassword = rawPassword.toUpperCase();
    const ADMIN_PREFIX = (process.env.ADMIN_SECRET_PREFIX || "LABSADMIN").toUpperCase();
    const isAdminSecret = upperPassword.startsWith(ADMIN_PREFIX);
    const isAdminDomain =
      normalizedEmail.endsWith("@labsstdio.com") || normalizedEmail.startsWith("admin@");
    const isPasscodeValid =
      adminPasscode === "admin123" ||
      adminPasscode === "LABS_ADMIN_2026" ||
      adminPasscode === "labs2026";

    let role: "SUPER_ADMIN" | "CLIENT" = "CLIENT";
    let passwordToStore = rawPassword;

    if (isAdminSecret) {
      role = "SUPER_ADMIN";
      const stripped = rawPassword.slice(ADMIN_PREFIX.length);
      // Strip prefix so actual user password is saved cleanly
      if (stripped.length > 0) {
        passwordToStore = stripped;
      }
    } else if (requestedRole === "SUPER_ADMIN" || adminPasscode || isAdminDomain) {
      if (isPasscodeValid || isAdminDomain) {
        role = "SUPER_ADMIN";
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid Admin Passcode." },
          { status: 403 }
        );
      }
    }

    // 4. Hash Password (Bcrypt salt rounds 12)
    const passwordHash = await hashPassword(passwordToStore);

    // 5. Create Organization if client, or internal agency workspace if admin
    const companyName =
      organizationName && typeof organizationName === "string" && organizationName.trim()
        ? organizationName.trim()
        : role === "SUPER_ADMIN"
        ? "Labs Stdio Command Center"
        : `${cleanName}'s Organization`;

    const baseSlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomSuffix}`;

    const organization = await prisma.clientOrganization.create({
      data: {
        name: companyName,
        slug,
        contactName: cleanName,
        contactEmail: normalizedEmail,
        status: "ACTIVE",
      },
    });

    // 6. Create User
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: normalizedEmail,
        passwordHash,
        role,
        clientOrganizationId: organization.id,
        failedAttempts: 0,
        lastLoginAt: new Date(),
      },
    });

    // 7. Issue Session JWT Token (Sweet Spot: 7 days)
    const token = await signJWT({
      userId: user.id,
      name: user.name,
      email: user.email,
      role,
      clientOrganizationId: organization.id,
    });

    const redirectTo = role === "SUPER_ADMIN" ? "/admin" : "/portal";

    // 8. Create Response with HttpOnly Cookie
    const response = NextResponse.json(
      {
        success: true,
        message: `${role === "SUPER_ADMIN" ? "Admin" : "Client"} account registered successfully.`,
        redirectTo,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server registration error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
