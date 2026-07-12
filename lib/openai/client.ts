import "server-only";
import OpenAI from "openai";
import { openaiConfig, isOpenAiConfigured } from "@/lib/openai/config";
import { logAiUsage } from "@/lib/logger";

/**
 * Secure, server-only OpenAI client.
 *
 * `import "server-only"` guarantees this module can never be bundled into
 * client code — so the API key is never exposed to the browser. The client is
 * lazily created so the app boots even when the key isn't set yet.
 */

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: openaiConfig.orgId,
      project: openaiConfig.projectId,
      timeout: openaiConfig.timeoutMs,
      maxRetries: openaiConfig.maxRetries,
    });
  }
  return client;
}

export type GenerateResult =
  | { ok: true; text: string }
  | {
      ok: false;
      status: "unavailable" | "timeout" | "error";
      /** User-safe fallback message. */
      message: string;
    };

const FALLBACK_UNAVAILABLE =
  "Our AI helper is taking a break right now. Please try again in a little while.";

/**
 * Run a single text generation with timeout + error handling and privacy-safe
 * usage logging. Returns a discriminated result — callers never see raw errors.
 */
export async function generateText(opts: {
  route: string;
  system: string;
  input: string;
  maxOutputTokens?: number;
}): Promise<GenerateResult> {
  if (!isOpenAiConfigured()) {
    logAiUsage({ route: opts.route, model: openaiConfig.model, status: "unavailable" });
    return { ok: false, status: "unavailable", message: FALLBACK_UNAVAILABLE };
  }

  const startedAt = Date.now();
  try {
    const response = await getClient().responses.create({
      model: openaiConfig.model,
      max_output_tokens: opts.maxOutputTokens ?? openaiConfig.maxOutputTokens,
      instructions: opts.system,
      input: opts.input,
    });

    const text = (response.output_text ?? "").trim();

    logAiUsage({
      route: opts.route,
      model: openaiConfig.model,
      status: "ok",
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      latencyMs: Date.now() - startedAt,
    });

    if (!text) {
      return {
        ok: false,
        status: "error",
        message:
          "We couldn't generate a response this time. Please try rephrasing.",
      };
    }
    return { ok: true, text };
  } catch (err) {
    const aborted =
      (err as { name?: string })?.name === "APIConnectionTimeoutError" ||
      (err as { name?: string })?.name === "AbortError";
    logAiUsage({
      route: opts.route,
      model: openaiConfig.model,
      status: aborted ? "timeout" : "error",
      latencyMs: Date.now() - startedAt,
    });
    return {
      ok: false,
      status: aborted ? "timeout" : "error",
      message: aborted
        ? "That took longer than expected. Please try again."
        : FALLBACK_UNAVAILABLE,
    };
  }
}
