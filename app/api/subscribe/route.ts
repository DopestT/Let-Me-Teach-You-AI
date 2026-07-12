import { NextResponse } from "next/server";
import { subscribeSchema } from "@/lib/validation";
import { subscribe } from "@/lib/newsletter";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const REDIRECT_TO = "/thank-you";
const DOWNLOAD_URL =
  "/lead-magnet/Start_Using_AI_Today_25_Beginner_Prompts.pdf";

export async function POST(req: Request) {
  // --- Rate limit (per IP): 5 attempts / minute ---
  const limit = rateLimit(`subscribe:${clientIp(req)}`, {
    max: 5,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Please wait a minute." },
      { status: 429 }
    );
  }

  // --- Parse JSON body ---
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    );
  }

  // --- Validate ---
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message:
          parsed.error.issues[0]?.message ?? "Please check your details.",
      },
      { status: 400 }
    );
  }

  // --- Honeypot: bots fill `company`. Return a benign success so we don't
  // reveal the rejection. No subscription is attempted. ---
  if (parsed.data.company) {
    logger.warn("subscribe.honeypot");
    return NextResponse.json({
      ok: true,
      message: "You're in!",
      redirectTo: REDIRECT_TO,
      downloadUrl: DOWNLOAD_URL,
    });
  }

  const { email, firstName } = parsed.data;

  const result = await subscribe({
    email,
    firstName,
    referringSite: "letmeteachyouai.com",
  });

  // --- Upstream (provider) failure ---
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "We couldn't complete your signup right now. Please try again shortly.",
      },
      { status: 502 }
    );
  }

  // --- Local-dev fallback: honestly state no real email/subscription happened.
  if (result.devFallback) {
    return NextResponse.json({
      ok: true,
      devFallback: true,
      message:
        "Local dev: signup captured, but the newsletter provider isn't configured yet, so no email was sent.",
      redirectTo: REDIRECT_TO,
      downloadUrl: DOWNLOAD_URL,
    });
  }

  // --- Real subscription ---
  return NextResponse.json({
    ok: true,
    message: result.alreadySubscribed
      ? "You're already on the list — here's your prompt pack again."
      : "You're in! Your 25-prompt starter pack is on its way to your inbox.",
    redirectTo: REDIRECT_TO,
    downloadUrl: DOWNLOAD_URL,
  });
}
