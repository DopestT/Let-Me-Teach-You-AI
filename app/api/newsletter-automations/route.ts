import { NextResponse } from "next/server";
import { isValidBrevoListId } from "@/lib/newsletter";

export const runtime = "nodejs";

export async function GET() {
  const apiKeyConfigured = Boolean(process.env.NEWSLETTER_API_KEY?.trim());
  const listIdConfigured = isValidBrevoListId(
    process.env.NEWSLETTER_AUDIENCE_ID
  );

  if (!apiKeyConfigured || !listIdConfigured) {
    return NextResponse.json(
      {
        ok: false,
        provider: "brevo",
        message: "Brevo newsletter provider is not fully configured.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      provider: "brevo",
      automationMode: "list-triggered",
      note: "Welcome automation is managed in Brevo and should trigger when a contact enters the dedicated LMTYAI list.",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
