import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AiHelper } from "@/components/ai-helper";

export const metadata: Metadata = {
  title: "AI Helper",
  description:
    "Turn a rough question or idea into a clear next step with a free, beginner-friendly AI helper.",
};

export default function PlaygroundPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_50%_0%,rgba(29,78,216,0.13),transparent_62%)]"
      />

      <div className="container-editorial max-w-6xl py-10 sm:py-14 lg:py-16">
        <nav
          aria-label="AI Helper navigation"
          className="mb-10 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold"
        >
          <Link
            href="/#lab"
            className="inline-flex items-center gap-2 text-[--color-brand] transition-colors hover:text-[--color-brand-dark]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to AI Lab
          </Link>
          <Link
            href="/build/ai-workflow-from-plain-english"
            className="inline-flex items-center gap-2 text-[--color-navy-600] transition-colors hover:text-[--color-brand]"
          >
            See a build guide
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </nav>

        <header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[--color-line] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[--color-brand] shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden />
            Free AI workspace
          </div>
          <h1 className="mt-6 font-editorial text-4xl font-semibold leading-[1.05] text-[--color-navy] sm:text-5xl lg:text-6xl">
            Start with a rough idea.
            <span className="block text-[--color-brand]">Make it useful.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[--color-navy-600] sm:text-lg">
            Write it the way you would say it to a person. The helper can answer
            a question, strengthen a prompt, summarize text, or teach a topic
            one clear step at a time.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-[--color-slate]">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[--color-brand]" aria-hidden />
              No account required
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[--color-brand]" aria-hidden />
              Prompts are not saved
            </span>
          </div>
        </header>

        <div className="mt-10 sm:mt-12">
          <AiHelper />
        </div>

        <section className="mt-8 flex flex-col gap-5 rounded-3xl border border-[--color-line] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[--color-gold]">
              Keep the momentum
            </p>
            <h2 className="mt-2 font-editorial text-2xl font-semibold text-[--color-navy]">
              Get practical AI lessons you can use the same day.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[--color-slate]">
              Join free for the 25-Prompt Starter Pack and plain-language lessons
              from projects that actually ship.
            </p>
          </div>
          <Link
            href="/#join"
            className="primary-cta inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold shadow-sm"
          >
            Get the free prompts
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </div>
    </main>
  );
}
