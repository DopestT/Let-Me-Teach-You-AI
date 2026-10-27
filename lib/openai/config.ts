/**
 * Single source of truth for AI model configuration.
 *
 * Direct OpenAI remains the first choice when OPENAI_API_KEY is configured.
 * On Vercel, the helper can fall back to AI Gateway using either a persistent
 * AI_GATEWAY_API_KEY or Vercel's short-lived VERCEL_OIDC_TOKEN. This keeps the
 * site functional without putting a provider secret in browser code.
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

export function usesAiGateway(): boolean {
  return Boolean(
    !process.env.OPENAI_API_KEY &&
      (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
  );
}

export function resolvedOpenAiModel(): string {
  if (!usesAiGateway()) return openaiConfig.model;
  return openaiConfig.model.includes("/")
    ? openaiConfig.model
    : `openai/${openaiConfig.model}`;
}

export function isOpenAiConfigured(): boolean {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN
  );
}
