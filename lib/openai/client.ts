import "server-only";
import OpenAI from "openai";
import { openaiConfig, resolvedOpenAiModel } from "@/lib/openai/config";
import { logAiUsage } from "@/lib/logger";

/**
 * Secure, server-only AI client.
 *
 * Direct OpenAI is used when OPENAI_API_KEY exists. Otherwise Vercel deployments
 * use AI Gateway with a persistent gateway key or the short-lived OIDC token
 * injected into the current function request. Credentials stay server-side.
 */

type AiAuth =
  | { apiKey: string; gateway: false }
  | { apiKey: string; gateway: true }
  | null;

function resolveAuth(runtimeOidcToken?: string): AiAuth {
  if (process.env.OPENAI_API_KEY) {
    return { apiKey: process.env.OPENAI_API_KEY, gateway: false };
  }

  const gatewayCredential =
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_AI_GATEWAY_API_KEY ||
    process.env.VERCEL_OIDC_TOKEN ||
    runtimeOidcToken;

  if (!gatewayCredential) return null;
  return { apiKey: gatewayCredential, gateway: true };
}

function createClient(auth: Exclude<AiAuth, null>): OpenAI {
  return new OpenAI({
    apiKey: auth.apiKey,
    baseURL: auth.gateway ? "https://ai-gateway.vercel.sh/v1" : undefined,
    organization: auth.gateway ? undefined : openaiConfig.orgId,
    project: auth.gateway ? undefined : openaiConfig.projectId,
    timeout: openaiConfig.timeoutMs,
    maxRetries: openaiConfig.maxRetries,
  });
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
  /** Correlates this call with the API request in logs. */
  requestId?: string;
  /** Vercel runtime OIDC token from the current server request, if present. */
  vercelOidcToken?: string;
  /** Aborts the upstream call when the client disconnects or a timeout fires. */
  signal?: AbortSignal;
}): Promise<GenerateResult> {
  const auth = resolveAuth(opts.vercelOidcToken);
  const model = resolvedOpenAiModel(Boolean(auth?.gateway));

  if (!auth) {
    logAiUsage({
      route: opts.route,
      model,
      status: "unavailable",
      requestId: opts.requestId,
    });
    return { ok: false, status: "unavailable", message: FALLBACK_UNAVAILABLE };
  }

  const startedAt = Date.now();
  try {
    const response = await createClient(auth).responses.create(
      {
        model,
        max_output_tokens: opts.maxOutputTokens ?? openaiConfig.maxOutputTokens,
        instructions: opts.system,
        input: opts.input,
      },
      // Pass the caller's signal so a client disconnect aborts the upstream call.
      { signal: opts.signal }
    );

    const text = (response.output_text ?? "").trim();

    logAiUsage({
      route: opts.route,
      model,
      status: "ok",
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      latencyMs: Date.now() - startedAt,
      requestId: opts.requestId,
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
      model,
      status: aborted ? "timeout" : "error",
      latencyMs: Date.now() - startedAt,
      requestId: opts.requestId,
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
