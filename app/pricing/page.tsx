import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start with free practical AI learning, then add a focused $29 AI Build Review when you want hands-on feedback on what you are building.",
};

const freeItems = [
  "25-prompt AI Work Kit",
  "Interactive AI Lab",
  "Beginner guides and build walkthroughs",
  "Free workshop",
  "Build an AI Business From Scratch course",
];

const reviewItems = [
  "One focused idea, page, workflow, automation, or AI project",
  "Written review of what is working and what is getting in the way",
  "Three highest-priority next actions",
  "Suggested prompts, tools, or workflow changes where useful",
  "One follow-up question after the review",
];

export default function PricingPage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-16 text-center sm:py-24">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Pricing</p>
          <h1 className="mx-auto mt-4 max-w-4xl font-editorial text-5xl font-semibold leading-[1] tracking-[-.035em] text-[#0c1d3f] sm:text-6xl">
            Learn for free. Pay when focused help saves you time.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#536177]">
            The core learning stays free. The first paid step is intentionally simple: one project, one review, one prioritized path forward.
          </p>
        </div>
      </section>

      <section className="container-editorial py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-[#dfe6f0] bg-white p-7 shadow-sm sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#6a7da3]">Learn + build</p>
            <div className="mt-5 flex items-end gap-2">
              <span className="font-editorial text-5xl font-semibold text-[#0f1e3d]">$0</span>
              <span className="pb-1 text-sm font-semibold text-[#6a7da3]">free</span>
            </div>
            <h2 className="mt-5 font-editorial text-3xl font-semibold text-[#0f1e3d]">Use the free system</h2>
            <p className="mt-3 leading-7 text-[#59677c]">Enough to start using AI, learn the fundamentals, and build something real before paying for anything.</p>
            <ul className="mt-7 space-y-3">
              {freeItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#42516a]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2457ff]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/start-here" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#ccd7ea] bg-white px-5 py-3 font-bold text-[#10213f] shadow-sm">
              Start free <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </article>

          <article className="rounded-[2rem] border border-[#20345f] bg-[#07152f] p-7 text-white shadow-[0_28px_80px_rgba(7,21,47,.2)] sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#8fb0ff]">Hands-on next step</p>
            <div className="mt-5 flex items-end gap-2">
              <span className="font-editorial text-5xl font-semibold">$29</span>
              <span className="pb-1 text-sm font-semibold text-white/60">one time</span>
            </div>
            <h2 className="mt-5 font-editorial text-3xl font-semibold">AI Build Review</h2>
            <p className="mt-3 leading-7 text-[#c8d5ea]">Bring one thing you are actually building. Get a focused written review and a short list of what to do next.</p>
            <ul className="mt-7 space-y-3">
              {reviewItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#dce5f5]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#7fa5ff]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/build-review" className="primary-cta mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold">
              See the Build Review <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </article>
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#dfe6f0] bg-[#f4f7fc] p-6 text-center text-sm leading-6 text-[#59677c]">
          No subscription is required for the free learning path. Additional paid products should only be added when they provide a distinct result that the free material does not already deliver.
        </div>
      </section>
    </main>
  );
}
