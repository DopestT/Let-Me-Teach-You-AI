import { NextResponse } from "next/server";
import { isValidBrevoListId } from "@/lib/newsletter";

export const runtime = "nodejs";

export async function GET() {
  const apiKeyConfigured = Boolean(process.env.NEWSLETTER_API_KEY?.trim());
  const listIdConfigured = isValidBrevoListId(
    process.env.NEWSLETTER_AUDIENCE_ID
  );
  const configured = apiKeyConfigured && listIdConfigured;

  return NextResponse.json(
    {
      ok: configured,
      newsletter: {
        provider: "brevo",
        apiKeyConfigured,
        listIdConfigured,
        signupStore: "supabase",
        welcomeDelivery: "brevo-list-automation",
      },
    },
    {
      status: configured ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
