import { generateText } from "@/lib/openai/client";
import { aiGenerateSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

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

const RATE_LIMIT = { max: 8, windowMs: 60_000 };

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

  // Enforce JSON so we never parse an unexpected content type.
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return fail(
      "unsupported_media_type",
      "Requests must be sent as application/json.",
      415,
      requestId
    );
  }

  // Reject oversized bodies up front (declared length, then actual).
  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return fail("payload_too_large", "Your request is too large.", 413, requestId);
  }

  const ip = clientIp(req);
  const limit = rateLimit(`openai:${ip}`, RATE_LIMIT);
  if (!limit.allowed) {
    const retryAfterSec = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return fail(
      "rate_limited",
      "You're going a bit fast. Please wait a moment and try again.",
      429,
      requestId,
      { "Retry-After": String(retryAfterSec) }
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return fail("payload_too_large", "Your request is too large.", 413, requestId);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("invalid_json", "Invalid JSON in request body.", 400, requestId);
  }

  const parsed = aiGenerateSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request.";
    return fail("invalid_request", message, 400, requestId);
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
    if (result.status === "unavailable") {
      return fail("upstream_unavailable", result.message, 503, requestId);
    }
    if (result.status === "timeout") {
      return fail("upstream_timeout", result.message, 504, requestId);
    }
    return fail("upstream_error", result.message, 502, requestId);
  }

  return json({ ok: true, text: result.text, requestId }, 200, requestId);
}
