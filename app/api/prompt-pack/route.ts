import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SOURCE_URL =
  "https://raw.githubusercontent.com/DopestT/Let-Me-Teach-You-AI/main/public/lead-magnet/Start_Using_AI_Today_25_Beginner_Prompts.pdf";

export async function GET() {
  const res = await fetch(SOURCE_URL, { cache: "no-store" });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, message: "Prompt pack is temporarily unavailable." },
      { status: 502 }
    );
  }

  const bytes = await res.arrayBuffer();

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="Start_Using_AI_Today_25_Beginner_Prompts.pdf"',
      "Cache-Control": "public, max-age=300",
    },
  });
}
