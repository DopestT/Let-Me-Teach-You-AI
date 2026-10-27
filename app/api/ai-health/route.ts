import { POST as openAiPost } from "@/app/api/openai/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Temporary preview verification probe. It exercises the same API route and
 * upstream model call as the browser helper, but never returns generated text.
 * Remove this route before promoting the fix to production.
 */
export async function GET(): Promise<Response> {
  const request = new Request("https://preview.invalid/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task: "general",
      prompt: "Reply briefly to confirm the AI helper can generate a response.",
    }),
  });

  const response = await openAiPost(request);
  const data = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    text?: string;
    code?: string;
    requestId?: string;
  };
  const passed = response.ok && data.ok === true && Boolean(data.text?.trim());

  return Response.json(
    {
      ok: passed,
      upstreamStatus: response.status,
      hasText: Boolean(data.text?.trim()),
      code: data.code ?? null,
      requestId: data.requestId ?? null,
    },
    {
      status: passed ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
