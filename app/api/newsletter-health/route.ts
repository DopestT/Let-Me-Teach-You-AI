import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      newsletter: {
        apiKeyConfigured: Boolean(process.env.NEWSLETTER_API_KEY),
        audienceIdConfigured: Boolean(process.env.NEWSLETTER_AUDIENCE_ID),
        welcomeAutomationConfigured: Boolean(
          process.env.NEWSLETTER_WELCOME_AUTOMATION_ID
        ),
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
