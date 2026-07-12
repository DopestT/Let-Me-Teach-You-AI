import { NextResponse, type NextRequest } from "next/server";

/**
 * Permanent (301) redirect from the secondary domain to the primary domain.
 *
 * LetMeTeachYouAI.net  ->  LetMeTeachYouAI.com  (path + query preserved)
 *
 * Host-based so it applies no matter which domain Vercel routes to this app.
 * The primary/canonical host is derived from NEXT_PUBLIC_SITE_URL.
 *
 * (Next.js 16 renamed the `middleware` convention to `proxy`.)
 */

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
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];

  if (!host) return NextResponse.next();

  // Redirect to the canonical apex host whenever the request arrives on:
  //   - the secondary .net domain (apex or www), or
  //   - any www.* variant (e.g. www.letmeteachyouai.com -> letmeteachyouai.com)
  const isNet = host.endsWith("letmeteachyouai.net");
  const isWww = host.startsWith("www.");
  const isCanonical = host === PRIMARY_HOST;

  if (!isCanonical && (isNet || isWww)) {
    const url = req.nextUrl.clone();
    url.host = PRIMARY_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|lead-magnet).*)"],
};
