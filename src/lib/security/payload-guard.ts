import { NextResponse } from "next/server";

export interface PayloadGuardOptions {
  maxBytes?: number; // default: 512 KB
}

const DEFAULT_MAX_BYTES = 512 * 1024; // 512 KB

/**
 * Checks request Content-Length to prevent Large Body DoS attacks.
 * Rejects before loading massive payloads into server memory.
 */
export function checkPayloadSize(
  req: Request,
  options?: PayloadGuardOptions
): { valid: boolean; response?: NextResponse } {
  const maxBytes = options?.maxBytes ?? DEFAULT_MAX_BYTES;
  const contentLength = req.headers.get("content-length");

  if (contentLength) {
    const bytes = parseInt(contentLength, 10);
    if (!isNaN(bytes) && bytes > maxBytes) {
      return {
        valid: false,
        response: NextResponse.json(
          {
            success: false,
            error: `Payload too large. Maximum allowed size is ${Math.round(maxBytes / 1024)} KB.`,
          },
          { status: 413 }
        ),
      };
    }
  }

  return { valid: true };
}

/**
 * Safely parse JSON with size limitation and syntax protection
 */
export async function safeParseJson<T = any>(
  req: Request,
  maxBytes: number = DEFAULT_MAX_BYTES
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const text = await req.text();
    if (text.length > maxBytes) {
      return { success: false, error: "Payload exceeds size threshold." };
    }
    const data = JSON.parse(text);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: "Malformed or invalid JSON payload." };
  }
}
