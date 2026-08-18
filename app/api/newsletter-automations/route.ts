import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.NEWSLETTER_API_KEY;
  const publicationId = process.env.NEWSLETTER_AUDIENCE_ID;

  if (!apiKey || !publicationId) {
    return NextResponse.json(
      { ok: false, message: "Newsletter provider is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/automations?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, upstreamStatus: res.status },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const body = (await res.json()) as {
      data?: Array<{
        id?: string;
        name?: string;
        status?: string;
        trigger_events?: string[];
        description?: string | null;
      }>;
    };

    return NextResponse.json(
      {
        ok: true,
        automations: (body.data ?? []).map((automation) => ({
          id: automation.id ?? null,
          name: automation.name ?? null,
          status: automation.status ?? null,
          triggerEvents: automation.trigger_events ?? [],
          description: automation.description ?? null,
        })),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Automation lookup failed." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
