import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLUG = "stop-using-ai-like-a-chatbot-start-using-it-like-a-coworker";
const TITLE = "Stop Using AI Like a Chatbot—Start Using It Like a Coworker";
const PREVIEW = "The biggest productivity upgrade in AI isn't a better prompt. It's giving AI an entire project instead of a single question.";
const HTML_URL = "https://raw.githubusercontent.com/DopestT/Let-Me-Teach-You-AI/main/automation/approved/2026-08-31-stop-using-ai-like-a-chatbot-start-using-it-like-a-coworker.html";

function headers(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

export async function GET(request: Request) {
  const apiKey = process.env.NEWSLETTER_API_KEY;
  const publicationId = process.env.NEWSLETTER_AUDIENCE_ID;

  if (!apiKey || !publicationId) {
    return NextResponse.json(
      { ok: false, stage: "configuration", message: "Beehiiv is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const requestUrl = new URL(request.url);
    const postId = requestUrl.searchParams.get("post_id");

    // Read-only verification mode. Never creates a post.
    if (postId) {
      if (!/^post_[0-9a-fA-F-]+$/.test(postId)) {
        return NextResponse.json(
          { ok: false, stage: "post_status", message: "Invalid post_id." },
          { status: 400, headers: { "Cache-Control": "no-store" } }
        );
      }

      const verify = await fetch(
        `https://api.beehiiv.com/v2/publications/${publicationId}/posts/${postId}`,
        {
          headers: headers(apiKey),
          cache: "no-store",
        }
      );

      const text = await verify.text();
      let payload: unknown = text;
      try {
        payload = JSON.parse(text);
      } catch {
        // Keep raw upstream text for diagnostics.
      }

      if (verify.status === 202) {
        return NextResponse.json(
          { ok: false, processing: true, stage: "post_status", post_id: postId, payload },
          { status: 202, headers: { "Cache-Control": "no-store" } }
        );
      }

      if (!verify.ok) {
        return NextResponse.json(
          { ok: false, stage: "post_status", upstreamStatus: verify.status, post_id: postId, payload },
          { status: 502, headers: { "Cache-Control": "no-store" } }
        );
      }

      return NextResponse.json(
        { ok: true, verificationOnly: true, post: (payload as { data?: unknown })?.data ?? payload },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // Idempotency gate: if this exact slug already exists, never create another copy.
    const lookupUrl = new URL(`https://api.beehiiv.com/v2/publications/${publicationId}/posts`);
    lookupUrl.searchParams.append("slugs[]", SLUG);
    lookupUrl.searchParams.set("limit", "1");

    const lookup = await fetch(lookupUrl, {
      headers: headers(apiKey),
      cache: "no-store",
    });

    if (!lookup.ok) {
      const detail = await lookup.text();
      return NextResponse.json(
        { ok: false, stage: "dedupe_lookup", upstreamStatus: lookup.status, detail },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const lookupBody = (await lookup.json()) as {
      data?: Array<{
        id?: string;
        status?: string;
        slug?: string;
        web_url?: string;
        subject_line?: string;
        preview_text?: string;
      }>;
    };

    const existing = lookupBody.data?.[0];
    if (existing?.id) {
      return NextResponse.json(
        { ok: true, alreadyExists: true, post: existing },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const htmlRes = await fetch(HTML_URL, { cache: "no-store" });
    if (!htmlRes.ok) {
      return NextResponse.json(
        { ok: false, stage: "html_fetch", upstreamStatus: htmlRes.status },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const fullHtml = await htmlRes.text();
    const bodyContent = fullHtml
      .replace(/^[\s\S]*?<body[^>]*>/i, "")
      .replace(/<\/body>[\s\S]*$/i, "")
      .trim();

    if (!bodyContent) {
      return NextResponse.json(
        { ok: false, stage: "html_parse", message: "Approved HTML body is empty." },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    const create = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts`,
      {
        method: "POST",
        headers: headers(apiKey),
        body: JSON.stringify({
          title: TITLE,
          subtitle: PREVIEW,
          body_content: bodyContent,
          status: "confirmed",
          email_capture_type_override: "none",
          social_share: "none",
          email_settings: {
            email_subject_line: TITLE,
            email_preview_text: PREVIEW,
          },
          web_settings: {
            slug: SLUG,
            display_title_on_web: true,
            display_subtitle_on_web: true,
            hide_from_feed: false,
          },
          content_tags: ["AI Workflows", "AI Ledger"],
        }),
        cache: "no-store",
      }
    );

    const text = await create.text();
    let payload: unknown = text;
    try {
      payload = JSON.parse(text);
    } catch {
      // Keep raw upstream text for diagnostics.
    }

    if (!create.ok) {
      return NextResponse.json(
        { ok: false, stage: "beehiiv_create", upstreamStatus: create.status, payload },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { ok: true, alreadyExists: false, created: payload },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "exception",
        message: error instanceof Error ? error.message : "Unknown send error",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
