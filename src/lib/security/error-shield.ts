import { NextResponse } from "next/server";
import crypto from "crypto";

export interface SecureErrorResponse {
  success: false;
  error: string;
  requestId: string;
  devDetails?: string;
}

/**
 * Standardized Enterprise Error Shield
 * Masks internal database queries, file paths, and stack traces in production,
 * while tagging each error with a unique correlation Request ID for internal debugging.
 */
export function shieldError(
  error: unknown,
  fallbackMessage: string = "An internal error occurred. Please try again later.",
  statusCode: number = 500
): NextResponse<SecureErrorResponse> {
  const requestId = `req_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Log full error internally for agency observability
  console.error(`[ERROR_SHIELD][${requestId}]`, {
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date().toISOString(),
  });

  const isProd = process.env.NODE_ENV === "production";

  // In production, never leak raw SQL, file paths, or ORM syntax to the client
  const clientMessage = isProd ? fallbackMessage : errorMessage || fallbackMessage;

  return NextResponse.json(
    {
      success: false,
      error: clientMessage,
      requestId,
      ...(isProd ? {} : { devDetails: errorStack?.split("\n")[1]?.trim() }),
    },
    { status: statusCode }
  );
}
