import { NextResponse } from "next/server";
import { subscriberCount } from "@/lib/subscribers";

export const revalidate = 600;

export async function GET() {
  const count = await subscriberCount();
  return NextResponse.json({ count }, { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } });
}
