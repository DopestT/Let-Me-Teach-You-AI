import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "You're on the list. Download your free AI Work Kit, then start Course 1.",
  robots: {
    index: false,
    follow: false,
  },
};

const DOWNLOAD_URL = "/api/prompt-pack";
const COURSE_URL = "/learn/build-an-ai-business-from-scratch";

export default function ThankYouPage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="container-editorial py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf0ff] text-[#2457ff]">
              <CheckCircle2 className="h-6 w-6" aria-hidden />
            </div>
            <p className="mt-5 text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">
              You&apos;re in
            </p>
            <h1 className="mt-3 font-editorial text-4xl font-semibold leading-tight text-[#0f1e3d] sm:text-5xl">
              Your next move is simple.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#536177]">
              Download the AI Work Kit, use one prompt on something real, then start Course 1. No hunting around. No complicated setup.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <section className="rounded-3xl border border-[#dfe6f0] bg-white p-7 shadow-sm sm:p-8">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#6a7da3]">Step 1</p>
              <h2 className="mt-3 font-editorial text-3xl font-semibold text-[#0f1e3d]">
                Get the AI Work Kit
              </h2>
              <p className="mt-3 leading-7 text-[#59677c]">
                Keep the 25 prompts and workflows close. Pick one prompt that matches something you actually need to do today.
              </p>
              <a
                href={DOWNLOAD_URL}
                className="mt-6 inline-flex items-center gap-2 font-bold text-[#2457ff]"
              >
                <Download className="h-4 w-4" aria-hidden />
                Download the kit
              </a>
            </section>

            <section className="rounded-3xl border border-[#20345f] bg-[#07152f] p-7 text-white shadow-[0_20px_60px_rgba(7,21,47,.16)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#8fb0ff]">Step 2 · Free</p>
              <h2 className="mt-3 font-editorial text-3xl font-semibold">
                Start Course 1
              </h2>
              <p className="mt-3 leading-7 text-[#c8d5ea]">
                Turn that first useful result into a repeatable workflow. The course takes you from idea to something real, one part at a time.
              </p>
              <Link
                href={COURSE_URL}
                className="primary-cta mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold"
              >
                Start Course 1 <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </section>
          </div>

          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[#dfe6f0] bg-[#f4f7fc] px-5 py-4 text-center text-sm leading-6 text-[#59677c]">
            Your kit is also being sent to your inbox. If the email is delayed, the download above works immediately.
          </div>
        </div>
      </section>
    </main>
  );
}
