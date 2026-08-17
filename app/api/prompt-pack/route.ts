import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOWNLOAD_URL =
  "https://github.com/DopestT/Let-Me-Teach-You-AI/raw/refs/heads/main/public/lead-magnet/Start_Using_AI_Today_25_Beginner_Prompts.pdf";

export async function GET() {
  // Redirect the browser straight to the file instead of proxying it through
  // the Vercel function. The previous proxy could fail upstream and return a
  // JSON error file instead of the PDF.
  return NextResponse.redirect(DOWNLOAD_URL, 307);
}
