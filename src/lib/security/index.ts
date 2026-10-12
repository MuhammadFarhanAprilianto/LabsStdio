import { NextResponse } from "next/server";
import { sanitizeInput } from "./sanitizer";
import { checkPayloadSize, safeParseJson } from "./payload-guard";
import { verifyTrustedOrigin } from "./origin-guard";
import { shieldError } from "./error-shield";
import { checkRateLimit, getClientIp } from "../rate-limit";

export * from "./sanitizer";
export * from "./payload-guard";
export * from "./origin-guard";
export * from "./error-shield";

export interface SecurityShieldOptions {
  maxBodyBytes?: number;
  rateLimitKey?: string;
  rateLimitMax?: number;
  rateLimitWindowMs?: number;
  allowCrossSiteWebhooks?: boolean;
}

export interface SecurityShieldResult<T = any> {
  success: boolean;
  response?: NextResponse;
  data?: T;
  clientIp?: string;
}

/**
 * Enterprise Zero-Trust Security Shield
 * A unified composable wrapper applying:
 * 1. Payload Size Limiting (anti-Large Body DoS)
 * 2. Origin & Referer Verification (anti-CSRF)
 * 3. In-Memory Sliding-Window Rate Limiting (anti-Spam & brute force)
 * 4. Deep Recursive Input Sanitization (anti-XSS & prototype pollution)
 */
export async function applySecurityShield<T = any>(
  req: Request,
  options?: SecurityShieldOptions
): Promise<SecurityShieldResult<T>> {
  // 1. Guard against oversized payloads
  const payloadCheck = checkPayloadSize(req, {
    maxBytes: options?.maxBodyBytes,
  });
  if (!payloadCheck.valid) {
    return { success: false, response: payloadCheck.response };
  }

  // 2. Guard against untrusted origins & CSRF
  const originCheck = verifyTrustedOrigin(req, {
    allowWebhooks: options?.allowCrossSiteWebhooks,
  });
  if (!originCheck.valid) {
    return { success: false, response: originCheck.response };
  }

  // 3. Sliding-window IP Rate Limiting
  const clientIp = getClientIp(req);
  if (options?.rateLimitKey) {
    const rateCheck = checkRateLimit(
      `${options.rateLimitKey}:${clientIp}`,
      options.rateLimitMax ?? 10,
      options.rateLimitWindowMs ?? 60000
    );
    if (!rateCheck.success) {
      return {
        success: false,
        response: NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please wait before retrying.",
          },
          { status: 429 }
        ),
      };
    }
  }

  // 4. Safe JSON parsing & Deep Recursive Sanitization (for mutating methods with bodies)
  const method = req.method.toUpperCase();
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    const parsed = await safeParseJson<T>(req, options?.maxBodyBytes);
    if (!parsed.success) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: parsed.error },
          { status: 400 }
        ),
      };
    }

    // Sanitize input to eliminate XSS, prototype pollution, null-bytes
    const sanitizedData = sanitizeInput<T>(parsed.data as T);
    return { success: true, data: sanitizedData, clientIp };
  }

  return { success: true, clientIp };
}
