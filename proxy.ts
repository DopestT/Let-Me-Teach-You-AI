import { NextResponse, type NextRequest } from "next/server";

const PRIMARY_HOST = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://letmeteachyouai.com"
    ).host;
  } catch {
    return "letmeteachyouai.com";
  }
})();

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "")
    .toLowerCase()
    .split(":")[0];

  if (!host) return NextResponse.next();

  // Only redirect the secondary .net domain.
  // Vercel controls the www/apex production-domain behavior.
  const isSecondaryDomain =
    host === "letmeteachyouai.net" ||
    host === "www.letmeteachyouai.net";

  if (isSecondaryDomain) {
    const url = req.nextUrl.clone();
    url.host = PRIMARY_HOST;
    url.protocol = "https:";
    url.port = "";

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|lead-magnet).*)"],
};
