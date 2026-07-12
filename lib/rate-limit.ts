/**
 * Lightweight in-memory rate limiter, keyed by client identifier (usually IP).
 *
 * This is sufficient for a single serverless region / low volume. For
 * production scale across many instances, swap the store for a shared backend
 * (e.g. Upstash Redis) behind the same `rateLimit()` signature.
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

const MAX = Number(process.env.RATE_LIMIT_MAX ?? 10);
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  identifier: string,
  { max = MAX, windowMs = WINDOW_MS }: { max?: number; windowMs?: number } = {}
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(identifier);

  if (!existing || existing.resetAt <= now) {
    const bucket: Bucket = { count: 1, resetAt: now + windowMs };
    store.set(identifier, bucket);
    return { allowed: true, remaining: max - 1, resetAt: bucket.resetAt };
  }

  existing.count += 1;
  const allowed = existing.count <= max;
  return {
    allowed,
    remaining: Math.max(0, max - existing.count),
    resetAt: existing.resetAt,
  };
}

/** Best-effort client IP extraction from standard proxy headers. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Opportunistic cleanup so the map doesn't grow unbounded.
export function sweep(): void {
  const now = Date.now();
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}
