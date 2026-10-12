import { NextResponse } from "next/server";

export interface OriginGuardOptions {
  allowWebhooks?: boolean;
  allowedOrigins?: string[];
}

/**
 * Validates Origin and Referer headers on mutating requests (POST, PUT, PATCH, DELETE)
 * to prevent Cross-Site Request Forgery (CSRF) and Origin Spoofing.
 */
export function verifyTrustedOrigin(
  req: Request,
  options?: OriginGuardOptions
): { valid: boolean; response?: NextResponse } {
  // Safe read-only methods don't need origin verification
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return { valid: true };
  }

  const pathname = new URL(req.url).pathname;

  // Webhooks are server-to-server and don't carry browser Origin headers
  if (options?.allowWebhooks || pathname.startsWith("/api/webhooks/")) {
    return { valid: true };
  }

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  // If both origin and referer are completely missing on a browser-targeted endpoint,
  // in non-development environments, we can enforce strict check.
  const sourceUrl = origin || referer;
  if (!sourceUrl) {
    // Permissive for local dev or native cURL tools if host is local
    if (process.env.NODE_ENV !== "production" || host?.includes("localhost")) {
      return { valid: true };
    }
    return {
      valid: false,
      response: NextResponse.json(
        { success: false, error: "Missing origin or referer header." },
        { status: 403 }
      ),
    };
  }

  try {
    const parsedSource = new URL(sourceUrl);
    const sourceHost = parsedSource.host; // e.g. "localhost:3000" or "labsstdio.com"

    // 1. Direct host match (Current app host)
    if (host && sourceHost === host) {
      return { valid: true };
    }

    // 2. Allowed origins list
    const envAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const allowed = [
      "localhost:3000",
      "127.0.0.1:3000",
      ...(envAppUrl ? [new URL(envAppUrl).host] : []),
      ...(options?.allowedOrigins || []),
    ];

    if (allowed.some((h) => sourceHost === h || sourceHost.endsWith(`.${h}`))) {
      return { valid: true };
    }

    console.warn(`[SECURITY_BLOCKED] Untrusted origin rejected: ${sourceHost} (Target host: ${host})`);
    return {
      valid: false,
      response: NextResponse.json(
        { success: false, error: "Cross-Origin Request Blocked by Security Policy." },
        { status: 403 }
      ),
    };
  } catch {
    return {
      valid: false,
      response: NextResponse.json(
        { success: false, error: "Malformed origin header." },
        { status: 403 }
      ),
    };
  }
}
