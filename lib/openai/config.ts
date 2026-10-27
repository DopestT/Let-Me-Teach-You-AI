/**
 * Single source of truth for AI model configuration.
 *
 * Direct OpenAI remains the first choice when OPENAI_API_KEY is configured.
 * On Vercel, the helper can fall back to AI Gateway using a persistent gateway
 * key or the short-lived OIDC token Vercel injects into each function request.
 */

export const openaiConfig = {
  /** Current model — configurable. Default is a fast, cost-effective option. */
  model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
  /** Sensible output ceiling to control cost + latency. */
  maxOutputTokens: Number(process.env.OPENAI_MAX_OUTPUT_TOKENS ?? 800),
  /** Hard timeout so a hung upstream never hangs a request. */
  timeoutMs: Number(process.env.OPENAI_TIMEOUT_MS ?? 30_000),
  maxRetries: Number(process.env.OPENAI_MAX_RETRIES ?? 1),
  orgId: process.env.OPENAI_ORG_ID || undefined,
  projectId: process.env.OPENAI_PROJECT_ID || undefined,
} as const;

export function resolvedOpenAiModel(usingGateway: boolean): string {
  if (!usingGateway) return openaiConfig.model;
  return openaiConfig.model.includes("/")
    ? openaiConfig.model
    : `openai/${openaiConfig.model}`;
}
