import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "labs_stdio_super_secure_enterprise_key_2026_jwt_token_auth"
);

const COOKIE_NAME = "labs_session";

interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "PROJECT_MANAGER" | "CLIENT";
  clientOrganizationId?: string | null;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  // 1. Guard /admin routes (Only SUPER_ADMIN & PROJECT_MANAGER)
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "SUPER_ADMIN" && session.role !== "PROJECT_MANAGER") {
      // If a client tries to open /admin, redirect to /portal
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  // 2. Guard /portal routes (All authenticated roles can access portal)
  if (pathname.startsWith("/portal")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. If already logged in and visiting /login or /signup, redirect to their home
  if ((pathname === "/login" || pathname === "/signup") && session) {
    if (session.role === "CLIENT") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login", "/signup"],
};
