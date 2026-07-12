import { generateText } from "@/lib/openai/client";
import { aiGenerateSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Secure, server-side OpenAI endpoint.
 *
 * This is hardened scaffolding for future interactive tools — there is no chat
 * UI wired to it yet. All secrets stay server-side (the client module enforces
 * `server-only` and reads OPENAI_API_KEY). Prompts are never stored, and we
 * never log or echo the raw prompt beyond the privacy-safe usage logging that
 * `generateText` already performs.
 */

export const runtime = "nodejs";

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

export async function POST(req: Request): Promise<Response> {
  const ip = clientIp(req);
  const limit = rateLimit(`openai:${ip}`, { max: 8, windowMs: 60_000 });
  if (!limit.allowed) {
    return Response.json(
      {
        ok: false,
        message:
          "You're going a bit fast. Please wait a moment and try again.",
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = aiGenerateSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid request.";
    return Response.json({ ok: false, message }, { status: 400 });
  }

  const { prompt, task } = parsed.data;
  const system = SYSTEM_PROMPTS[task] ?? SYSTEM_PROMPTS.general;

  const result = await generateText({
    route: "/api/openai",
    system,
    input: prompt,
  });

  if (!result.ok) {
    const status =
      result.status === "unavailable" || result.status === "timeout"
        ? 503
        : 502;
    return Response.json(
      { ok: false, message: result.message },
      { status }
    );
  }

  return Response.json({ ok: true, text: result.text });
}
