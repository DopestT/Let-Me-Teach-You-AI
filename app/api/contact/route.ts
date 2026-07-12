import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`, { max: 5, windowMs: 300_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Please check your message.",
      },
      { status: 400 }
    );
  }

  if (parsed.data.company) {
    logger.warn("contact.honeypot");
    return NextResponse.json({ ok: true, message: "Thanks — message received." });
  }

  // Log receipt without persisting message content to third parties.
  // Wire up your inbox / Beehiiv reply-to / email provider here as needed.
  logger.info("contact.received", {
    to: process.env.CONTACT_TO_EMAIL ?? "unset",
  });

  return NextResponse.json({
    ok: true,
    message: "Thanks for reaching out — we'll get back to you soon.",
  });
}
