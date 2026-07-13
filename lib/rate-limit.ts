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

/* ---------------------------------------------------------------------------
   Tiered limiting (per-minute / per-hour / per-day ceiling).

   Uses a durable, shared Upstash store when configured so limits hold across
   serverless instances; otherwise falls back to the in-memory buckets above.
--------------------------------------------------------------------------- */

import { isDurableStoreConfigured, pipeline } from "@/lib/upstash";

export type Tier = { label: string; windowMs: number; max: number };

const num = (name: string, fallback: number) =>
  Number(process.env[name] ?? fallback);

/** Default abuse ceilings for the AI endpoint; each is env-overridable. */
export const AI_TIERS: Tier[] = [
  { label: "min", windowMs: 60_000, max: num("AI_RATE_PER_MIN", 8) },
  { label: "hour", windowMs: 3_600_000, max: num("AI_RATE_PER_HOUR", 60) },
  { label: "day", windowMs: 86_400_000, max: num("AI_RATE_PER_DAY", 300) },
];

export type TierResult = { allowed: boolean; retryAfterSec: number };

/** Enforce every tier for an identifier. Blocked by the soonest-resetting tier. */
export async function enforceTiers(
  identifier: string,
  tiers: Tier[] = AI_TIERS
): Promise<TierResult> {
  const now = Date.now();

  if (isDurableStoreConfigured()) {
    const cmds: (string | number)[][] = [];
    const meta = tiers.map((t) => {
      const bucket = Math.floor(now / t.windowMs);
      const key = `airl:${identifier}:${t.label}:${bucket}`;
      cmds.push(["INCR", key], ["PEXPIRE", key, t.windowMs]);
      return { t, resetAt: (bucket + 1) * t.windowMs };
    });
    try {
      const res = await pipeline(cmds);
      let soonestBlockedReset = Infinity;
      meta.forEach((m, i) => {
        const count = Number(res[i * 2]);
        if (count > m.t.max) soonestBlockedReset = Math.min(soonestBlockedReset, m.resetAt);
      });
      if (soonestBlockedReset !== Infinity) {
        return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((soonestBlockedReset - now) / 1000)) };
      }
      return { allowed: true, retryAfterSec: 0 };
    } catch {
      // Store unreachable — fall back to in-memory rather than fail open/closed.
      return enforceInMemory(identifier, tiers, now);
    }
  }

  return enforceInMemory(identifier, tiers, now);
}

function enforceInMemory(identifier: string, tiers: Tier[], now: number): TierResult {
  for (const t of tiers) {
    const r = rateLimit(`${identifier}:${t.label}`, { max: t.max, windowMs: t.windowMs });
    if (!r.allowed) {
      return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((r.resetAt - now) / 1000)) };
    }
  }
  return { allowed: true, retryAfterSec: 0 };
}
