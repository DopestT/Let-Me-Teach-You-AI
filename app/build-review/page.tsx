import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleDollarSign, SearchCheck } from "lucide-react";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "AI Build Review",
  description:
    "Get a focused $29 written review of one AI idea, page, workflow, automation, or project with three prioritized next actions.",
};

const CHECKOUT_URL = process.env.NEXT_PUBLIC_BUILD_REVIEW_CHECKOUT_URL?.trim();

const included = [
  "Review of one idea, landing page, workflow, automation, or AI project",
  "What is clear, what is weak, and what is most likely to block progress",
  "Three prioritized next actions instead of a giant generic checklist",
  "Suggested prompts, tools, or workflow changes where they materially help",
  "One follow-up question after you receive the review",
];

const notIncluded = [
  "A full website, application, automation, or campaign build",
  "Unlimited consulting or ongoing project management",
  "Legal, medical, financial, or other regulated professional advice",
  "Guaranteed business, income, traffic, or audience results",
];

export default function BuildReviewPage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-14 sm:py-20">
          <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-bold text-[#3158b5]">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to pricing
          </Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4def8] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#3158b5] shadow-sm">
                <SearchCheck className="h-3.5 w-3.5" aria-hidden /> AI Build Review
              </div>
              <h1 className="mt-5 max-w-3xl font-editorial text-5xl font-semibold leading-[1] tracking-[-.035em] text-[#0c1d3f] sm:text-6xl">
                Stop guessing what to fix next.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#536177]">
                Send one thing you are building. Get a focused written review that tells you what matters now, what can wait, and the next three moves I would make.
              </p>
            </div>

            <aside className="rounded-[2rem] border border-[#20345f] bg-[#07152f] p-7 text-white shadow-[0_28px_80px_rgba(7,21,47,.22)] sm:p-9">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]">
                <CircleDollarSign className="h-5 w-5" aria-hidden /> Founding offer
              </div>
              <div className="mt-5 flex items-end gap-2">
                <span className="font-editorial text-6xl font-semibold">$29</span>
                <span className="pb-2 text-sm font-semibold text-white/60">one time</span>
              </div>
              <p className="mt-4 leading-7 text-[#c8d5ea]">One project. One written review. One prioritized path forward.</p>

              {CHECKOUT_URL ? (
                <>
                  <a href={CHECKOUT_URL} className="primary-cta mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold">
                    Get my Build Review <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                  <p className="mt-4 text-xs leading-5 text-white/55">
                    After checkout, send your project link, goal, and biggest question to <a className="underline" href="mailto:hello@letmeteachyouai.com?subject=AI%20Build%20Review%20Intake">hello@letmeteachyouai.com</a>.
                  </p>
                </>
              ) : (
                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[.055] p-5 [&_label]:!text-[#e4ecfa] [&_input]:!border-white/15 [&_input]:!bg-white [&_input]:!text-[#0f1e3d] [&_p]:!text-[#aebdd5] [&_a]:!text-white">
                  <p className="mb-4 text-sm font-semibold text-white">Checkout is being connected. Join the first-access list and I’ll send the purchase link when it opens.</p>
                  <SignupForm
                    compact
                    stay
                    source="build-review-interest"
                    buttonLabel="Join first access"
                    successMessage="You're on the Build Review first-access list."
                  />
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="container-editorial py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <article className="rounded-3xl border border-[#dfe6f0] bg-white p-7 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#2457ff]">What you get</p>
            <h2 className="mt-3 font-editorial text-3xl font-semibold text-[#0f1e3d]">A decision tool, not a pile of feedback.</h2>
            <ul className="mt-6 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#42516a]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2457ff]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-[#dfe6f0] bg-[#f4f7fc] p-7 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#6a7da3]">What it is not</p>
            <h2 className="mt-3 font-editorial text-3xl font-semibold text-[#0f1e3d]">Keep the scope tight so the answer is useful.</h2>
            <ul className="mt-6 space-y-4">
              {notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#59677c]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b97aa]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="border-y border-[#20345f] bg-[#07152f] py-14 text-white">
        <div className="container-editorial max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]">Before you pay</p>
          <h2 className="mt-3 max-w-3xl font-editorial text-4xl font-semibold">Use the free material first if you can answer your own question.</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#c8d5ea]">The Build Review is for the moment when you have a real artifact or decision and another focused perspective is worth more than another hour of searching.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/start-here" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-bold text-white">Use the free path</Link>
            <Link href="/learn/build-an-ai-business-from-scratch" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-bold text-white">Open the free course</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
