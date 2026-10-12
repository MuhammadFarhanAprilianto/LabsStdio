import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "labs_stdio_super_secure_enterprise_key_2026_jwt_token_auth"
);

export const COOKIE_NAME = "labs_session";

export interface JWTPayload {
  userId: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "PROJECT_MANAGER" | "CLIENT";
  clientOrganizationId?: string | null;
}

// Password Hashing with Salt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Password Verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Sign JWT Token with 7-day default duration (The Sweet Spot)
export async function signJWT(payload: JWTPayload, expiresInDays = 7): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expiresInDays}d`)
    .sign(SECRET);
}

// Verify JWT Token
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// Retrieve Current Active Session
export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyJWT(token);
  } catch {
    return null;
  }
}
