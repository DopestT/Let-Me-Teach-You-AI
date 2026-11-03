import { NextResponse } from "next/server";
import { isNewsletterConfigured } from "@/lib/newsletter";

export const runtime = "nodejs";

export async function GET() {
  const configured = isNewsletterConfigured();

  return NextResponse.json(
    {
      ok: configured,
      provider: "brevo",
      deliveryMode: "transactional-on-signup",
      welcomeDelivery: configured
        ? "The site adds the contact to the configured Brevo list and sends the AI Work Kit welcome email through Brevo transactional email in the same signup path."
        : "Brevo newsletter credentials or the numeric list ID are not fully configured.",
      nurtureSequence: "The follow-up 5-email sequence is maintained separately from the immediate transactional Work Kit delivery.",
    },
    {
      status: configured ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
