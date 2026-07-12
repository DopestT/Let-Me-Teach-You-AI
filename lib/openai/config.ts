/**
 * Single source of truth for OpenAI configuration.
 *
 * The model and all limits are read from environment variables so nothing is
 * hard-coded across the app. Change the model by setting OPENAI_MODEL — no code
 * changes required.
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

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}
