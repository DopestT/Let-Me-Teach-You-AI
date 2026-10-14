/**
 * Supabase subscriber store (server-side). Every signup is saved here so no
 * email is ever lost, even if the newsletter sender (Beehiiv) is down or not
 * configured. Uses only the publishable key + locked-down RPC functions
 * (see supabase/migrations/20261005_subscribers.sql).
 */
import { logger } from "@/lib/logger";

// Publishable key is safe to ship (designed to be public); env vars override.
const URL = process.env.SUPABASE_URL ?? "https://zctmntqjvllgfvkauirk.supabase.co";
const KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_vDxT-IH85fgNFhpLSL8atg_vUAXwh5b";

export const isSubscriberStoreConfigured = () => Boolean(URL && KEY);

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  if (!isSubscriberStoreConfigured()) return null;
  try {
    const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json", ...(KEY.startsWith("eyJ") ? { Authorization: `Bearer ${KEY}` } : {}) },
      body: JSON.stringify(args),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      logger.error("subscribers.rpc_failed", { fn, status: res.status });
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    logger.error("subscribers.rpc_error", { fn, err: String(err) });
    return null;
  }
}

export type StoredSubscriber = { already: boolean; referral_code: string; referrals: number };

export const storeSubscriber = (a: { email: string; firstName?: string; source?: string; ref?: string }) =>
  rpc<StoredSubscriber>("lmtyai_subscribe", {
    p_email: a.email,
    p_first_name: a.firstName || null,
    p_source: a.source ?? "website",
    p_ref: a.ref || null,
  });

export const subscriberCount = () => rpc<number>("lmtyai_subscriber_count", {});
export const referralStats = (code: string) => rpc<{ referrals: number }>("lmtyai_referral_stats", { p_code: code });
