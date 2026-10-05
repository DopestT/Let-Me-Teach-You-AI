import { NextResponse } from "next/server";
import { referralStats } from "@/lib/subscribers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("r") ?? "";
  if (!/^[a-z0-9]{4,16}$/.test(code)) return NextResponse.json({ referrals: 0 });
  const stats = await referralStats(code);
  return NextResponse.json({ referrals: stats?.referrals ?? 0 });
}
