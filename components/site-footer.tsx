import Link from "next/link";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Let Me Teach You AI";

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="border-t border-[--color-line] bg-[--color-cream-soft]">
      <div className="container-editorial py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-editorial text-base font-semibold text-[--color-navy]">
            {SITE_NAME}
          </p>
          <p className="mt-1 text-sm text-[--color-slate] max-w-md">
            Practical AI, taught plainly. No hype, no get-rich-quick promises —
            just what actually works.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[--color-navy-600]">
          <Link href="/#join" className="hover:text-[--color-brand]">
            Join
          </Link>
          <Link href="/contact" className="hover:text-[--color-brand]">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-[--color-brand]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[--color-brand]">
            Terms
          </Link>
        </nav>
      </div>
      <div className="container-editorial pb-8 text-xs text-[--color-slate]">
        © {year} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
