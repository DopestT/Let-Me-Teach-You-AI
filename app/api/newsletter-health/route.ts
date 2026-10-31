import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const apiKeyConfigured = Boolean(process.env.NEWSLETTER_API_KEY);
  const listIdConfigured = Boolean(process.env.NEWSLETTER_AUDIENCE_ID);

  return NextResponse.json(
    {
      ok: apiKeyConfigured && listIdConfigured,
      newsletter: {
        provider: "brevo",
        apiKeyConfigured,
        listIdConfigured,
        signupStore: "supabase",
        welcomeDelivery: "brevo-list-automation",
      },
    },
    {
      status: apiKeyConfigured && listIdConfigured ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
