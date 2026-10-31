/**
 * Newsletter integration (server-side only). Provider: Brevo.
 *
 * Brevo owns the dedicated LMTYAI subscriber list and the welcome automation.
 * The automation should trigger when a contact joins that dedicated list.
 * We send only the minimum personal data required to subscribe: email +
 * optional first name.
 *
 * Provider-agnostic env names keep callers stable:
 *   NEWSLETTER_API_KEY     -> Brevo API key
 *   NEWSLETTER_AUDIENCE_ID -> numeric Brevo List ID
 */

import { logger } from "@/lib/logger";

const API_BASE = "https://api.brevo.com/v3";
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

function getBrevoListId(): number | null {
  const raw = process.env.NEWSLETTER_AUDIENCE_ID?.trim();
  if (!raw) return null;

  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function isNewsletterConfigured(): boolean {
  return Boolean(process.env.NEWSLETTER_API_KEY && getBrevoListId());
}

export async function subscribe(
  args: SubscribeArgs
): Promise<SubscribeOutcome> {
  // Local-dev fallback: clearly labeled, never pretends to be a real
  // production subscription.
  if (!isNewsletterConfigured()) {
    logger.warn("newsletter.dev_fallback", {
      note: "Brevo NEWSLETTER_API_KEY / numeric NEWSLETTER_AUDIENCE_ID not set",
    });
    return { ok: true, alreadySubscribed: false, devFallback: true };
  }

  const listId = getBrevoListId()!;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: "POST",
      headers: {
        "api-key": process.env.NEWSLETTER_API_KEY!,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        email: args.email,
        listIds: [listId],
        updateEnabled: true,
        ...(args.firstName
          ? { attributes: { FIRSTNAME: args.firstName } }
          : {}),
      }),
    });

    if (!res.ok) {
      logger.error("newsletter.upstream_error", {
        provider: "brevo",
        status: res.status,
      });
      return { ok: false, reason: "upstream_error" };
    }

    // Brevo returns 201 for a newly created contact and commonly 204 when an
    // existing contact is updated. Either outcome is safe because updateEnabled
    // keeps repeat signups idempotent while list membership triggers automation.
    const alreadySubscribed = res.status === 204;

    logger.info("newsletter.subscribed", {
      provider: "brevo",
      alreadySubscribed,
      signupSource: SIGNUP_TAG,
      utmSource: args.utmSource ?? "website",
      referringSite: args.referringSite ?? "letmeteachyouai.com",
    });

    return { ok: true, alreadySubscribed };
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
