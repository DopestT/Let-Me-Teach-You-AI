import "server-only";

/**
 * Minimal Upstash Redis REST client (no SDK dependency).
 *
 * Configured via UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN. When those
 * are absent the durable store is considered unconfigured and callers fall back
 * to their in-memory path — so the app runs locally with zero setup.
 */

const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export function isDurableStoreConfigured(): boolean {
  return Boolean(URL && TOKEN);
}

/** Run a Redis command pipeline; returns the ordered array of results. */
export async function pipeline(
  commands: (string | number)[][]
): Promise<unknown[]> {
  const res = await fetch(`${URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string }[];
  return data.map((d) => {
    if (d.error) throw new Error(d.error);
    return d.result;
  });
}
