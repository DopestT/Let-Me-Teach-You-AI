import "server-only";
import OpenAI from "openai";
import {
  openaiConfig,
  isOpenAiConfigured,
  resolvedOpenAiModel,
  usesAiGateway,
} from "@/lib/openai/config";
import { logAiUsage } from "@/lib/logger";

/**
 * Secure, server-only AI client.
 *
 * Direct OpenAI is used when OPENAI_API_KEY exists. Otherwise Vercel deployments
 * can use AI Gateway with AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN. Secrets stay
 * server-side and never enter the browser bundle.
 */

let staticClient: OpenAI | null = null;

function createClient(): OpenAI {
  const gateway = usesAiGateway();
  const gatewayCredential =
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;

  return new OpenAI({
    apiKey: gateway ? gatewayCredential : process.env.OPENAI_API_KEY,
    baseURL: gateway ? "https://ai-gateway.vercel.sh/v1" : undefined,
    organization: gateway ? undefined : openaiConfig.orgId,
    project: gateway ? undefined : openaiConfig.projectId,
    timeout: openaiConfig.timeoutMs,
    maxRetries: openaiConfig.maxRetries,
  });
}

function getClient(): OpenAI {
  // OIDC credentials are short-lived. Avoid pinning one in a module-level
  // singleton so a warm function can pick up Vercel's refreshed token.
  const oidcOnly =
    usesAiGateway() &&
    !process.env.AI_GATEWAY_API_KEY &&
    Boolean(process.env.VERCEL_OIDC_TOKEN);

  if (oidcOnly) return createClient();
  if (!staticClient) staticClient = createClient();
  return staticClient;
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
  /** Aborts the upstream call when the client disconnects or a timeout fires. */
  signal?: AbortSignal;
}): Promise<GenerateResult> {
  const model = resolvedOpenAiModel();

  if (!isOpenAiConfigured()) {
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
    const response = await getClient().responses.create(
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
