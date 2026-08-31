import { readFile } from "node:fs/promises";

const SLUG = "stop-using-ai-like-a-chatbot-start-using-it-like-a-coworker";
const TITLE = "Stop Using AI Like a Chatbot—Start Using It Like a Coworker";
const PREVIEW = "The biggest productivity upgrade in AI isn't a better prompt. It's giving AI an entire project instead of a single question.";
const HTML_PATH = "automation/approved/2026-08-31-stop-using-ai-like-a-chatbot-start-using-it-like-a-coworker.html";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function beehiivHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function responsePayload(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function getPost(apiKey, publicationId, postId) {
  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/posts/${postId}`,
    { headers: beehiivHeaders(apiKey) }
  );
  const payload = await responsePayload(response);
  return { response, payload };
}

async function waitForConfirmed(apiKey, publicationId, postId) {
  for (let attempt = 1; attempt <= 18; attempt += 1) {
    const { response, payload } = await getPost(apiKey, publicationId, postId);

    if (response.status === 202) {
      console.log(`Beehiiv is still processing ${postId} (attempt ${attempt}).`);
      await sleep(2500);
      continue;
    }

    if (!response.ok) {
      throw new Error(
        `Beehiiv post verification failed (${response.status}): ${JSON.stringify(payload)}`
      );
    }

    const post = payload?.data;
    console.log(
      `Beehiiv verification: id=${post?.id ?? postId} status=${post?.status ?? "unknown"}`
    );

    if (post?.status === "confirmed") {
      return post;
    }

    if (post?.status === "draft") {
      const confirm = await fetch(
        `https://api.beehiiv.com/v2/publications/${publicationId}/posts/${postId}`,
        {
          method: "PATCH",
          headers: beehiivHeaders(apiKey),
          body: JSON.stringify({ status: "confirmed" }),
        }
      );
      const confirmPayload = await responsePayload(confirm);
      if (!confirm.ok && confirm.status !== 202) {
        throw new Error(
          `Beehiiv draft confirmation failed (${confirm.status}): ${JSON.stringify(confirmPayload)}`
        );
      }
    }

    await sleep(2500);
  }

  throw new Error(`Beehiiv post ${postId} did not reach confirmed status.`);
}

async function main() {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    console.log(`Skipping one-time AI Ledger send in VERCEL_ENV=${process.env.VERCEL_ENV}.`);
    return;
  }

  const apiKey = process.env.NEWSLETTER_API_KEY;
  const publicationId = process.env.NEWSLETTER_AUDIENCE_ID;

  if (!apiKey || !publicationId) {
    throw new Error(
      "One-time AI Ledger send cannot run: NEWSLETTER_API_KEY or NEWSLETTER_AUDIENCE_ID is missing."
    );
  }

  const lookupUrl = new URL(
    `https://api.beehiiv.com/v2/publications/${publicationId}/posts`
  );
  lookupUrl.searchParams.append("slugs[]", SLUG);
  lookupUrl.searchParams.set("limit", "1");

  const lookup = await fetch(lookupUrl, { headers: beehiivHeaders(apiKey) });
  const lookupPayload = await responsePayload(lookup);
  if (!lookup.ok) {
    throw new Error(
      `Beehiiv dedupe lookup failed (${lookup.status}): ${JSON.stringify(lookupPayload)}`
    );
  }

  let post = lookupPayload?.data?.[0];

  if (post?.id) {
    console.log(
      `Existing Beehiiv issue found: id=${post.id} status=${post.status ?? "unknown"}. No duplicate will be created.`
    );
    post = await waitForConfirmed(apiKey, publicationId, post.id);
  } else {
    const fullHtml = await readFile(HTML_PATH, "utf8");
    const bodyContent = fullHtml
      .replace(/^[\s\S]*?<body[^>]*>/i, "")
      .replace(/<\/body>[\s\S]*$/i, "")
      .trim();

    if (!bodyContent) {
      throw new Error("Approved branded newsletter HTML body is empty.");
    }

    const create = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts`,
      {
        method: "POST",
        headers: beehiivHeaders(apiKey),
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
      }
    );

    const createPayload = await responsePayload(create);
    if (!create.ok) {
      throw new Error(
        `Beehiiv create/send failed (${create.status}): ${JSON.stringify(createPayload)}`
      );
    }

    const postId = createPayload?.data?.id;
    if (!postId) {
      throw new Error(
        `Beehiiv accepted creation but returned no post ID: ${JSON.stringify(createPayload)}`
      );
    }

    console.log(`Beehiiv accepted approved issue: id=${postId}.`);
    post = await waitForConfirmed(apiKey, publicationId, postId);
  }

  if (post?.status !== "confirmed") {
    throw new Error(
      `Approved issue was not confirmed by Beehiiv. Final status=${post?.status ?? "unknown"}.`
    );
  }

  console.log(`AI_LEDGER_SEND_VERIFIED=true`);
  console.log(`AI_LEDGER_BEEHIIV_POST_ID=${post.id}`);
  console.log(`AI_LEDGER_BEEHIIV_STATUS=${post.status}`);
  console.log(`AI_LEDGER_BEEHIIV_WEB_URL=${post.web_url ?? ""}`);
}

main().catch((error) => {
  console.error("AI_LEDGER_SEND_VERIFIED=false");
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
