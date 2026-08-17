import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "You're on the list. Download your free 25-prompt starter pack and get ready for beginner-friendly AI lessons.",
};

const DOWNLOAD_URL = "/api/prompt-pack";

export default function ThankYouPage() {
  return (
    <section className="container-editorial py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-editorial text-4xl font-semibold leading-tight text-[--color-navy] sm:text-5xl">
          You&apos;re in! 🎉
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[--color-navy-600]">
          Your free <strong className="text-[--color-navy]">25-Prompt Starter Pack</strong>{" "}
          is on its way to your inbox. You can also download it immediately below.
        </p>

        <div className="mt-8">
          <a
            href={DOWNLOAD_URL}
            className="primary-cta inline-flex items-center justify-center gap-2 rounded-[--radius] px-7 py-3.5 font-semibold shadow-sm transition-colors"
          >
            <Download className="h-5 w-5" aria-hidden />
            Download your 25 prompts
          </a>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-[--color-slate]">
          Don&apos;t see the email in a few minutes? Check your spam or promotions folder. The download button above works independently of email delivery.
        </p>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[--color-brand] hover:text-[--color-brand-dark]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
