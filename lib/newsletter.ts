/**
 * Newsletter integration (server-side only). Provider: Brevo.
 *
 * A successful signup does two things in one server-side path:
 * 1. Adds/updates the contact in the configured LMTYAI Brevo list.
 * 2. Sends the AI Work Kit welcome email through Brevo transactional email.
 *
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
const WELCOME_SENDER = {
  name: "Let Me Teach You AI",
  email: "hello@letmeteachyouai.com",
};
const WORK_KIT_URL = "https://letmeteachyouai.com/api/prompt-pack";
const COURSE_URL =
  "https://letmeteachyouai.com/learn/build-an-ai-business-from-scratch";

type SubscribeArgs = {
  email: string;
  firstName?: string;
  referringSite?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
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

async function sendWelcomeEmail(
  email: string,
  signal: AbortSignal
): Promise<boolean> {
  const res = await fetch(`${API_BASE}/smtp/email`, {
    method: "POST",
    headers: {
      "api-key": process.env.NEWSLETTER_API_KEY!,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify({
      sender: WELCOME_SENDER,
      to: [{ email }],
      subject: "Your AI Work Kit is here",
      textContent: [
        "You're in.",
        "",
        `Get your AI Work Kit: ${WORK_KIT_URL}`,
        `Start Course 1: ${COURSE_URL}`,
        "",
        "Let Me Teach You AI",
      ].join("\n"),
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;line-height:1.6;color:#111827">
          <h1 style="font-size:28px;margin-bottom:12px">Your AI Work Kit is here</h1>
          <p>You're in. Here are the two links you need:</p>
          <p><a href="${WORK_KIT_URL}"><strong>Download the AI Work Kit</strong></a></p>
          <p><a href="${COURSE_URL}"><strong>Start Course 1</strong></a></p>
          <p>Use the prompts, make something real, then keep going with the course.</p>
          <p>— Let Me Teach You AI</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    logger.error("newsletter.welcome_email_failed", {
      provider: "brevo",
      status: res.status,
    });
    return false;
  }

  logger.info("newsletter.welcome_email_sent", { provider: "brevo" });
  return true;
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
    // existing contact is updated. Repeated signups intentionally resend the
    // Work Kit so the "here's your AI Work Kit again" experience is truthful.
    const alreadySubscribed = res.status === 204;

    const welcomeSent = await sendWelcomeEmail(args.email, controller.signal);
    if (!welcomeSent) {
      return { ok: false, reason: "upstream_error" };
    }

    logger.info("newsletter.subscribed", {
      provider: "brevo",
      alreadySubscribed,
      signupSource: SIGNUP_TAG,
      utmSource: args.utmSource ?? null,
      utmMedium: args.utmMedium ?? null,
      utmCampaign: args.utmCampaign ?? null,
      utmContent: args.utmContent ?? null,
      utmTerm: args.utmTerm ?? null,
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
