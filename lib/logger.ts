/**
 * Minimal structured logger.
 *
 * Privacy rule: we log operational metadata (event, model, token counts,
 * latency, outcome) — NOT raw prompt text, subscriber personal data, or
 * generated content. Callers must pass only non-sensitive fields.
 */

type Level = "info" | "warn" | "error";

type LogFields = Record<string, string | number | boolean | null | undefined>;

function emit(level: Level, event: string, fields: LogFields = {}): void {
  const record = {
    level,
    event,
    // Timestamp added by the platform log pipeline; kept out here to stay
    // deterministic and dependency-free.
    ...fields,
  };
  const line = JSON.stringify(record);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (event: string, fields?: LogFields) => emit("info", event, fields),
  warn: (event: string, fields?: LogFields) => emit("warn", event, fields),
  error: (event: string, fields?: LogFields) => emit("error", event, fields),
};

/**
 * Record OpenAI usage without persisting prompt content. Only counts and
 * outcome are logged, satisfying "usage logging without storing sensitive
 * prompt content".
 */
export function logAiUsage(fields: {
  route: string;
  model: string;
  status: "ok" | "error" | "timeout" | "unavailable";
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
}): void {
  logger.info("openai.usage", fields);
}
