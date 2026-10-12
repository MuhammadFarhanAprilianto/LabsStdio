/**
 * Enterprise Input Sanitizer & Anti-XSS Engine
 * Protects against Stored XSS, Prototype Pollution, Null-byte injections,
 * and malicious payload tampering.
 */

const DANGEROUS_TAGS_REGEX = /<\s*(script|iframe|object|embed|applet|meta|link|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>|<\s*(script|iframe|object|embed|applet|meta|link|style)[^>]*\/?\s*>/gi;
const DANGEROUS_HANDLERS_REGEX = /\b(on\w+)\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi;
const DANGEROUS_PROTOCOLS_REGEX = /(javascript|vbscript|data):/gi;

/**
 * Sanitizes a single string value
 */
export function sanitizeString(val: string): string {
  if (typeof val !== "string") return val;

  let cleaned = val
    // Remove null bytes
    .replace(/\0/g, "")
    // Remove dangerous HTML tags
    .replace(DANGEROUS_TAGS_REGEX, "")
    // Strip on* event handlers (e.g. onclick="...", onload=...)
    .replace(DANGEROUS_HANDLERS_REGEX, "")
    // Strip javascript: pseudo-protocol
    .replace(DANGEROUS_PROTOCOLS_REGEX, "");

  // Normalize Unicode characters to prevent bypasses
  try {
    cleaned = cleaned.normalize("NFKC");
  } catch {
    // fallback if normalization fails
  }

  return cleaned.trim();
}

/**
 * Deep recursive sanitizer for objects, arrays, and primitives.
 * Also neutralizes Prototype Pollution by omitting __proto__, constructor, prototype.
 */
export function sanitizeInput<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === "string") {
    return sanitizeString(input) as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item)) as unknown as T;
  }

  if (typeof input === "object" && !(input instanceof Date) && !(input instanceof RegExp)) {
    const cleanObj: Record<string, any> = {};

    for (const [key, value] of Object.entries(input)) {
      // Prevent Prototype Pollution
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        continue;
      }

      cleanObj[key] = sanitizeInput(value);
    }

    return cleanObj as T;
  }

  return input;
}
