import { NextResponse, type NextRequest } from "next/server";

const PRIMARY_HOST = "www.letmeteachyouai.com";

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "")
    .toLowerCase()
    .split(":")[0];

  if (!host) return NextResponse.next();

  const shouldRedirect =
    host === "letmeteachyouai.com" ||
    host === "letmeteachyouai.net" ||
    host === "www.letmeteachyouai.net";

  if (shouldRedirect) {
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
