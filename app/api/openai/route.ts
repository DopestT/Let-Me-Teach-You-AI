import { generateText } from "@/lib/openai/client";
import { aiGenerateSchema } from "@/lib/validation";
import { enforceTiers, clientIp } from "@/lib/rate-limit";

/**
 * Secure, server-side OpenAI endpoint.
 *
 * Wired to the /playground AI helper. All secrets stay server-side (the client
 * module enforces `server-only` and reads OPENAI_API_KEY). Prompts are never
 * stored, and we never log or echo raw prompt content beyond the privacy-safe
 * usage logging that `generateText` performs.
 *
 * Hardening: requires application/json, caps body size before parsing, strictly
 * validates + allowlists input, rate-limits per IP, aborts the upstream call on
 * client disconnect, and returns machine-readable error codes with `no-store`
 * caching and a correlating request ID on every response.
 */

export const runtime = "nodejs";

/** Reject bodies larger than this before parsing (prompt is capped at 4000 chars). */
const MAX_BODY_BYTES = 16 * 1024;

/** Anonymous session id, combined with IP so limits aren't purely IP-based. */
function getSession(req: Request): { sess: string; isNew: boolean } {
  const m = (req.headers.get("cookie") ?? "").match(
    /(?:^|;\s*)ai_sess=([A-Za-z0-9_-]+)/
  );
  if (m) return { sess: m[1]!, isNew: false };
  return { sess: crypto.randomUUID(), isNew: true };
}

const TEACHER_VOICE =
  "You are a friendly, honest, beginner-friendly AI teacher. Explain things " +
  "in plain language, assume no prior knowledge, and be encouraging without " +
  "being condescending. Be accurate and admit when something is uncertain or " +
  "when you don't know. You must NEVER make get-rich-quick promises, hype, or " +
  "exaggerated claims about results, income, or outcomes. Keep expectations " +
  "realistic and grounded.";

const SYSTEM_PROMPTS: Record<
  "prompt-help" | "summarize" | "lesson" | "general",
  string
> = {
  "prompt-help":
    `${TEACHER_VOICE} Your job here is to help the learner write a clearer, ` +
    "more effective prompt. Suggest concrete improvements, explain why they " +
    "help, and offer a revised prompt they can copy.",
  summarize:
    `${TEACHER_VOICE} Your job here is to summarize the provided text simply ` +
    "and faithfully. Capture the key points in a way a beginner can follow, " +
    "and do not add claims that aren't supported by the source.",
  lesson:
    `${TEACHER_VOICE} Your job here is to teach the requested topic as a short, ` +
    "structured lesson. Start with the core idea, use a simple example, and " +
    "end with one small next step the learner can try.",
  general:
    `${TEACHER_VOICE} Answer the learner's question helpfully and honestly, ` +
    "keeping things approachable for a beginner.",
};

type ErrorCode =
  | "unsupported_media_type"
  | "payload_too_large"
  | "invalid_json"
  | "invalid_request"
  | "rate_limited"
  | "upstream_unavailable"
  | "upstream_timeout"
  | "upstream_error";

/** Build a JSON response with no-store caching and a correlating request id. */
function json(
  body: Record<string, unknown>,
  status: number,
  requestId: string,
  extraHeaders?: Record<string, string>
): Response {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "x-request-id": requestId,
    ...extraHeaders,
  });
  return Response.json(body, { status, headers });
}

function fail(
  code: ErrorCode,
  message: string,
  status: number,
  requestId: string,
  extraHeaders?: Record<string, string>
): Response {
  return json({ ok: false, code, message, requestId }, status, requestId, extraHeaders);
}

export async function POST(req: Request): Promise<Response> {
  const requestId = crypto.randomUUID();

  // Persist an anonymous session so limits combine IP + session, not IP alone.
  const { sess, isNew } = getSession(req);
  const cookieHeader = isNew
    ? {
        "Set-Cookie": `ai_sess=${sess}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax`,
      }
    : undefined;
  const j = (body: Record<string, unknown>, status: number, extra?: Record<string, string>) =>
    json(body, status, requestId, { ...cookieHeader, ...extra });
  const f = (code: ErrorCode, message: string, status: number, extra?: Record<string, string>) =>
    fail(code, message, status, requestId, { ...cookieHeader, ...extra });

  // Enforce JSON so we never parse an unexpected content type.
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return f("unsupported_media_type", "Requests must be sent as application/json.", 415);
  }

  // Reject oversized bodies up front (declared length, then actual).
  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return f("payload_too_large", "Your request is too large.", 413);
  }

  // Tiered abuse ceilings (per-minute / hour / day), durable when configured.
  const limit = await enforceTiers(`${clientIp(req)}:${sess}`);
  if (!limit.allowed) {
    return f(
      "rate_limited",
      "You're going a bit fast. Please wait a moment and try again.",
      429,
      { "Retry-After": String(limit.retryAfterSec) }
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return f("payload_too_large", "Your request is too large.", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return f("invalid_json", "Invalid JSON in request body.", 400);
  }

  const parsed = aiGenerateSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request.";
    return f("invalid_request", message, 400);
  }

  const { prompt, task } = parsed.data;
  const system = SYSTEM_PROMPTS[task] ?? SYSTEM_PROMPTS.general;

  const result = await generateText({
    route: "/api/openai",
    system,
    input: prompt,
    requestId,
    // Abort the upstream OpenAI call if the client disconnects.
    signal: req.signal,
  });

  if (!result.ok) {
    if (result.status === "unavailable") return f("upstream_unavailable", result.message, 503);
    if (result.status === "timeout") return f("upstream_timeout", result.message, 504);
    return f("upstream_error", result.message, 502);
  }

  return j({ ok: true, text: result.text, requestId }, 200);
}
