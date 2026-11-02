import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const rawListId = process.env.NEWSLETTER_AUDIENCE_ID?.trim();
  const parsedListId = rawListId ? Number(rawListId) : NaN;
  const apiKey = process.env.NEWSLETTER_API_KEY?.trim();
  const apiKeyConfigured = Boolean(apiKey);
  const listIdConfigured = Number.isInteger(parsedListId) && parsedListId > 0;

  let upstreamStatus: number | null = null;
  let upstreamReachable = false;

  if (apiKeyConfigured && listIdConfigured) {
    try {
      const res = await fetch(`https://api.brevo.com/v3/contacts/lists/${parsedListId}`, {
        method: "GET",
        headers: {
          "api-key": apiKey!,
          Accept: "application/json",
        },
        cache: "no-store",
      });
      upstreamStatus = res.status;
      upstreamReachable = res.ok;
    } catch {
      upstreamStatus = 0;
    }
  }

  return NextResponse.json(
    {
      ok: true,
      newsletter: {
        provider: "brevo",
        ready: apiKeyConfigured && listIdConfigured && upstreamReachable,
        apiKeyConfigured,
        listIdConfigured,
        upstreamReachable,
        upstreamStatus,
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
