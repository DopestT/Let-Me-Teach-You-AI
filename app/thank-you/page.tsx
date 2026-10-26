import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Download, SearchCheck } from "lucide-react";
import { ReferralPanel } from "@/components/referral-panel";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "You're on the list. Download your free AI Work Kit and choose the next practical step.",
  robots: {
    index: false,
    follow: false,
  },
};

const DOWNLOAD_URL = "/api/prompt-pack";

export default function ThankYouPage() {
  return (
    <section className="container-editorial py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-editorial text-4xl font-semibold leading-tight text-[--color-navy] sm:text-5xl">
            You&apos;re in. Start with one useful thing.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[--color-navy-600]">
            Your free <strong className="text-[--color-navy]">AI Work Kit</strong>{" "}
            is on its way to your inbox. You can also download it immediately below.
          </p>

          <div className="mt-8">
            <a
              href={DOWNLOAD_URL}
              className="primary-cta inline-flex items-center justify-center gap-2 rounded-[--radius] px-7 py-3.5 font-semibold shadow-sm transition-colors"
            >
              <Download className="h-5 w-5" aria-hidden />
              Download the AI Work Kit
            </a>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-[--color-slate]">
            Don&apos;t see the email in a few minutes? Check your spam or promotions folder. The download button above works independently of email delivery.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Link href="/start-here" className="group rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#a9bdf7] hover:shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#2457ff]">
              <ArrowRight className="h-5 w-5" aria-hidden />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">Best next step</p>
            <h2 className="mt-2 font-editorial text-2xl font-semibold text-[#0f1e3d]">Follow Start Here</h2>
            <p className="mt-3 text-sm leading-6 text-[#59677c]">Use one prompt, get one result, then move into the right free learning path.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2457ff]">Start here <ArrowRight className="h-4 w-4" aria-hidden /></span>
          </Link>

          <Link href="/learn/build-an-ai-business-from-scratch" className="group rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#a9bdf7] hover:shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#2457ff]">
              <BookOpen className="h-5 w-5" aria-hidden />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">Free course</p>
            <h2 className="mt-2 font-editorial text-2xl font-semibold text-[#0f1e3d]">Build an AI business</h2>
            <p className="mt-3 text-sm leading-6 text-[#59677c]">Work through the five-part flagship course and leave with a real system to test.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2457ff]">Open the course <ArrowRight className="h-4 w-4" aria-hidden /></span>
          </Link>

          <Link href="/build-review" className="group rounded-3xl border border-[#20345f] bg-[#07152f] p-6 text-white shadow-[0_18px_55px_rgba(7,21,47,.16)] transition hover:-translate-y-0.5 hover:shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#8fb0ff]">
              <SearchCheck className="h-5 w-5" aria-hidden />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-[#8fb0ff]">Hands-on help · $29</p>
            <h2 className="mt-2 font-editorial text-2xl font-semibold">Get an AI Build Review</h2>
            <p className="mt-3 text-sm leading-6 text-[#c8d5ea]">Bring one real idea, page, workflow, automation, or project and get a prioritized path forward.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">See the review <ArrowRight className="h-4 w-4" aria-hidden /></span>
          </Link>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <ReferralPanel />
        </div>
      </div>
    </section>
  );
}
