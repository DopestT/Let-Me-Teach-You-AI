/**
 * Newsletter integration (server-side only). Provider: Brevo.
 *
 * Brevo is the permanent marketing-email/CRM provider. Supabase remains the
 * independent durable signup ledger, so a temporary provider outage does not
 * have to lose a lead.
 *
 * Provider-agnostic env names keep callers stable:
 *   NEWSLETTER_API_KEY      -> Brevo API key (server only)
 *   NEWSLETTER_AUDIENCE_ID  -> Brevo contact list ID
 *
 * Source/referral attribution is persisted in Supabase. Brevo receives only
 * the minimum contact data needed for list enrollment: email + optional first
 * name.
 */

import { logger } from "@/lib/logger";

const CONTACTS_API = "https://api.brevo.com/v3/contacts";
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

export function isValidBrevoListId(raw: string | undefined): boolean {
  const normalized = raw?.trim();
  if (!normalized || !/^[1-9]\d*$/.test(normalized)) return false;
  const id = Number(normalized);
  return Number.isSafeInteger(id) && id > 0;
}

function configuredListId(): number | null {
  const raw = process.env.NEWSLETTER_AUDIENCE_ID?.trim();
  if (!isValidBrevoListId(raw)) return null;
  return Number(raw);
}

export function isNewsletterConfigured(): boolean {
  return Boolean(process.env.NEWSLETTER_API_KEY?.trim() && configuredListId());
}

export async function subscribe(
  args: SubscribeArgs
): Promise<SubscribeOutcome> {
  const listId = configuredListId();
  const apiKey = process.env.NEWSLETTER_API_KEY?.trim();

  // Local-dev fallback: clearly labeled, never pretends to be a real
  // production subscription.
  if (!apiKey || !listId) {
    logger.warn("newsletter.dev_fallback", {
      note: "Brevo NEWSLETTER_API_KEY / numeric NEWSLETTER_AUDIENCE_ID not set",
    });
    return { ok: true, alreadySubscribed: false, devFallback: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(CONTACTS_API, {
      method: "POST",
      headers: {
        "api-key": apiKey,
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

    // Brevo returns 201 for a new contact and 204 when updateEnabled updates
    // an existing contact. Either case ensures membership in the LMTYAI list.
    const alreadySubscribed = res.status === 204;
    logger.info("newsletter.subscribed", {
      provider: "brevo",
      alreadySubscribed,
      signupSource: args.utmSource ?? SIGNUP_TAG,
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
