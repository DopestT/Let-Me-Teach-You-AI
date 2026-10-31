/**
 * Newsletter integration (server-side only). Provider: Brevo.
 *
 * Supabase remains the durable first-party record of signup source/referral
 * metadata. Brevo receives only what it needs for email delivery: the email,
 * optional first name, and the dedicated LMTYAI list ID.
 *
 * Provider-agnostic env names are retained to avoid changing callers:
 *   NEWSLETTER_API_KEY     -> Brevo API key
 *   NEWSLETTER_AUDIENCE_ID -> Brevo list ID
 */

import { logger } from "@/lib/logger";
import { subscribeToBrevo } from "@/lib/brevo-newsletter";

type SubscribeArgs = {
  email: string;
  firstName?: string;
  referringSite?: string;
  utmSource?: string;
};

export type SubscribeOutcome =
  | { ok: true; alreadySubscribed: boolean; devFallback?: false }
  | { ok: true; alreadySubscribed: false; devFallback: true }
  | { ok: false; reason: "upstream_error" };

export function isNewsletterConfigured(): boolean {
  return Boolean(
    process.env.NEWSLETTER_API_KEY && process.env.NEWSLETTER_AUDIENCE_ID
  );
}

export async function subscribe(
  args: SubscribeArgs
): Promise<SubscribeOutcome> {
  if (!isNewsletterConfigured()) {
    logger.warn("newsletter.dev_fallback", {
      note: "NEWSLETTER_API_KEY / NEWSLETTER_AUDIENCE_ID not set",
    });
    return { ok: true, alreadySubscribed: false, devFallback: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const result = await subscribeToBrevo({
      apiKey: process.env.NEWSLETTER_API_KEY!,
      listId: process.env.NEWSLETTER_AUDIENCE_ID!,
      email: args.email,
      firstName: args.firstName,
      signal: controller.signal,
    });

    if (!result.ok) {
      logger.error("newsletter.upstream_error", { provider: "brevo" });
      return result;
    }

    logger.info("newsletter.subscribed", {
      provider: "brevo",
      alreadySubscribed: result.alreadySubscribed,
      signupSource: args.utmSource ?? "website",
    });
    return result;
  } catch (err) {
    logger.error("newsletter.request_failed", {
      provider: "brevo",
      aborted: (err as Error)?.name === "AbortError",
    });
    return { ok: false, reason: "upstream_error" };
  } finally {
    clearTimeout(timeout);
  }
}
