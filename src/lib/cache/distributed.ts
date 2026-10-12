/**
 * Enterprise Distributed Cache & Key-Value Engine
 * Hybrid Architecture:
 * - If UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN are set: uses global low-latency Redis REST API
 * - Otherwise: gracefully falls back to ultra-fast local memory cache with TTL auto-eviction
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  tag?: string;
}

// In-memory fallback cache storage
const memoryCache = new Map<string, CacheEntry<any>>();

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const HAS_DISTRIBUTED_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);

/**
 * Execute Upstash Redis REST command
 */
async function redisCommand(command: string[]): Promise<any> {
  if (!HAS_DISTRIBUTED_REDIS) return null;

  try {
    const res = await fetch(`${REDIS_URL}/${command.map(encodeURIComponent).join("/")}`, {
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Redis REST error: ${res.statusText}`);
    }

    const json = await res.json();
    return json.result;
  } catch (err) {
    console.warn("[DISTRIBUTED_REDIS_WARN] Falling back to local memory cache:", (err as Error).message);
    return null;
  }
}

/**
 * Retrieve a cached item by key
 */
export async function getCache<T>(key: string): Promise<T | null> {
  // 1. Try Distributed Redis if configured
  if (HAS_DISTRIBUTED_REDIS) {
    try {
      const result = await redisCommand(["get", key]);
      if (result !== null && result !== undefined) {
        return typeof result === "string" ? JSON.parse(result) : result;
      }
    } catch {
      // Graceful fallback to memoryCache below
    }
  }

  // 2. Memory Cache fallback
  const entry = memoryCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Store an item in the cache with Time-To-Live (TTL) in seconds
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = 3600,
  tag?: string
): Promise<void> {
  const expiresAt = Date.now() + ttlSeconds * 1000;

  // 1. Set in Distributed Redis if configured
  if (HAS_DISTRIBUTED_REDIS) {
    try {
      const serialized = JSON.stringify(value);
      await redisCommand(["set", key, serialized, "ex", String(ttlSeconds)]);
    } catch {
      // Handled by local fallback
    }
  }

  // 2. Set in Memory Cache
  memoryCache.set(key, { value, expiresAt, tag });

  // Memory hygiene: Prune expired keys if map grows large
  if (memoryCache.size > 2000) {
    const now = Date.now();
    for (const [k, v] of memoryCache.entries()) {
      if (now > v.expiresAt) memoryCache.delete(k);
    }
  }
}

/**
 * Delete a specific key from cache
 */
export async function deleteCache(key: string): Promise<void> {
  if (HAS_DISTRIBUTED_REDIS) {
    await redisCommand(["del", key]).catch(() => null);
  }
  memoryCache.delete(key);
}

/**
 * Tag-based on-demand invalidation: Purge all cached items marked with a specific tag
 */
export async function invalidateCacheByTag(tag: string): Promise<number> {
  let invalidatedCount = 0;

  for (const [key, entry] of memoryCache.entries()) {
    if (entry.tag === tag) {
      memoryCache.delete(key);
      if (HAS_DISTRIBUTED_REDIS) {
        redisCommand(["del", key]).catch(() => null);
      }
      invalidatedCount++;
    }
  }

  return invalidatedCount;
}

/**
 * Check cache engine status
 */
export function getCacheEngineStatus(): {
  mode: "DISTRIBUTED_REDIS" | "IN_MEMORY_FALLBACK";
  itemCount: number;
} {
  return {
    mode: HAS_DISTRIBUTED_REDIS ? "DISTRIBUTED_REDIS" : "IN_MEMORY_FALLBACK",
    itemCount: memoryCache.size,
  };
}
