/**
 * Newsletter integration (server-side only). Provider: Beehiiv.
 *
 * Beehiiv owns the subscriber list, the 5-email welcome sequence, and
 * lead-magnet (PDF) delivery via its automations. We send only the minimum
 * personal data required to subscribe: email + optional first name.
 *
 * Provider-agnostic env names so the provider can be swapped without touching
 * callers:
 *   NEWSLETTER_API_KEY     -> Beehiiv API key
 *   NEWSLETTER_AUDIENCE_ID -> Beehiiv Publication ID
 *
 * Docs: https://developers.beehiiv.com
 */

import { logger } from "@/lib/logger";

const API_BASE = "https://api.beehiiv.com/v2";
const SIGNUP_TAG = process.env.NEWSLETTER_SIGNUP_TAG ?? "beginner-prompt-pack";

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
  // Local-dev fallback: clearly labeled, never pretends to be a real
  // production subscription.
  if (!isNewsletterConfigured()) {
    logger.warn("newsletter.dev_fallback", {
      note: "NEWSLETTER_API_KEY / NEWSLETTER_AUDIENCE_ID not set",
    });
    return { ok: true, alreadySubscribed: false, devFallback: true };
  }

  const audienceId = process.env.NEWSLETTER_AUDIENCE_ID!;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(
      `${API_BASE}/publications/${audienceId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEWSLETTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          email: args.email,
          reactivate_existing: true,
          send_welcome_email: true, // triggers the welcome automation + PDF
          utm_source: args.utmSource ?? "website",
          referring_site: args.referringSite ?? "letmeteachyouai.com",
          // Segmentation tag for the prompt-pack funnel.
          tags: [SIGNUP_TAG],
          custom_fields: [
            { name: "Signup Source", value: SIGNUP_TAG },
            ...(args.firstName
              ? [{ name: "First Name", value: args.firstName }]
              : []),
          ],
        }),
      }
    );

    if (!res.ok) {
      logger.error("newsletter.upstream_error", { status: res.status });
      return { ok: false, reason: "upstream_error" };
    }

    const data = (await res.json()) as { data?: { status?: string } };
    const alreadySubscribed = data?.data?.status === "active";
    logger.info("newsletter.subscribed", { alreadySubscribed, tag: SIGNUP_TAG });
    return { ok: true, alreadySubscribed };
  } catch (err) {
    logger.error("newsletter.request_failed", {
      aborted: (err as Error)?.name === "AbortError",
    });
    return { ok: false, reason: "upstream_error" };
  } finally {
    clearTimeout(timeout);
  }
}
