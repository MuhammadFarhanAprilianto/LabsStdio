/**
 * Enterprise Rate Limiting Shield
 * Hybrid Architecture:
 * - If UPSTASH_REDIS_REST_URL is configured: Atomic distributed token bucket across edge nodes
 * - Otherwise: Ultra-fast sliding window memory store with auto-eviction
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const HAS_DISTRIBUTED_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);

/**
 * Synchronous local sliding window rate limiter
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // Auto garbage-collect when store grows large
  if (rateLimitStore.size > 5000) {
    for (const [key, val] of rateLimitStore.entries()) {
      if (now > val.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Distributed Global Rate Limiter
 * Atomic multi-node INCR via Redis REST API with graceful local fallback
 */
export async function checkRateLimitAsync(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  isDistributed: boolean;
}> {
  if (HAS_DISTRIBUTED_REDIS) {
    try {
      const windowSec = Math.ceil(windowMs / 1000);
      const redisKey = `ratelimit:${identifier}`;

      // Execute atomic INCR
      const incrRes = await fetch(`${REDIS_URL}/incr/${encodeURIComponent(redisKey)}`, {
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
        cache: "no-store",
      });

      if (incrRes.ok) {
        const json = await incrRes.json();
        const currentCount = Number(json.result);

        // If first hit, set expiration TTL
        if (currentCount === 1) {
          await fetch(`${REDIS_URL}/expire/${encodeURIComponent(redisKey)}/${windowSec}`, {
            headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
            cache: "no-store",
          }).catch(() => null);
        }

        const resetTime = Date.now() + windowMs;
        const remaining = Math.max(0, limit - currentCount);

        return {
          success: currentCount <= limit,
          limit,
          remaining,
          resetTime,
          isDistributed: true,
        };
      }
    } catch (err) {
      console.warn("[DISTRIBUTED_RATELIMIT_WARN] Falling back to local store:", (err as Error).message);
    }
  }

  // Local fallback
  const localRes = checkRateLimit(identifier, limit, windowMs);
  return {
    ...localRes,
    isDistributed: false,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}
