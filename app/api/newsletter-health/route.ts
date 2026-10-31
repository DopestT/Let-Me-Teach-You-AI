import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const rawListId = process.env.NEWSLETTER_AUDIENCE_ID?.trim();
  const parsedListId = rawListId ? Number(rawListId) : NaN;
  const apiKeyConfigured = Boolean(process.env.NEWSLETTER_API_KEY);
  const listIdConfigured = Number.isInteger(parsedListId) && parsedListId > 0;

  return NextResponse.json(
    {
      ok: true,
      newsletter: {
        provider: "brevo",
        ready: apiKeyConfigured && listIdConfigured,
        apiKeyConfigured,
        listIdConfigured,
        signupTagConfigured: Boolean(process.env.NEWSLETTER_SIGNUP_TAG),
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
