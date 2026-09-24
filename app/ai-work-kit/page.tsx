import type { Metadata } from "next";
import { CheckCircle2, Clock3, Workflow, Wrench, Zap } from "lucide-react";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Free AI Work Kit",
  description:
    "Get 25 practical AI prompts, 5 plug-and-play workflows, an AI tool cheat sheet, and a 10-minute quick start.",
  alternates: { canonical: "/ai-work-kit" },
};

const benefits = [
  "25 ready-to-use prompts grouped by outcome",
  "5 plug-and-play workflows for real work",
  "One-page “which AI tool for what” cheat sheet",
  "10-minute quick-start guide",
];

const outcomes = [
  "Research and learn faster",
  "Write and communicate clearly",
  "Build and grow a business",
  "Create content",
  "Plan and prioritize",
  "Automate repetitive work",
];

export default function AIWorkKitPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#dbe3ef] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_76%)]">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(29,78,216,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(29,78,216,.05)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="container-editorial relative grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d4def8] bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[.13em] text-[#3158b5] shadow-sm">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              Free AI Work Kit
            </span>
            <h1 className="mt-6 max-w-3xl font-editorial text-5xl font-semibold leading-[.98] tracking-[-.035em] text-[#0a1937] sm:text-6xl lg:text-7xl">
              Stop collecting AI prompts. <span className="text-[#2457ff]">Start using AI like a coworker.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4f5f79] sm:text-xl">
              Get 25 practical prompts + 5 plug-and-play workflows designed to help you save time and get real work done with AI.
            </p>

            <div className="mt-8 rounded-2xl border border-[#d7e0ef] bg-white p-5 shadow-[0_16px_50px_rgba(20,42,90,.10)] sm:p-6">
              <SignupForm />
            </div>

            <p className="mt-4 text-sm text-[#6d7a91]">
              Free. Practical. No giant prompt library you&apos;ll never use.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_right,rgba(78,112,255,.22),transparent_55%)] blur-2xl" />
            <div className="relative rounded-[2rem] border border-[#20345f] bg-[#07152f] p-6 text-white shadow-[0_32px_90px_rgba(7,21,47,.28)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="rounded-xl bg-[#2457ff] p-2.5"><Wrench className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[.14em] text-[#8fb0ff]">Let Me Teach You AI</div>
                  <div className="mt-1 text-xl font-bold">The AI Work Kit</div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[.055] p-3.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#7fa5ff]" />
                    <span className="text-sm leading-6 text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-white/55">
                <Clock3 className="h-4 w-4" /> Start using it in about 10 minutes.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-editorial">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">What you&apos;ll actually use</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight text-[#0c1d3f] sm:text-5xl">
              Built around outcomes, not prompt collecting.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#56647a]">
              Copy a prompt when you need a quick win. Use a workflow when you want AI to help carry a task from start to finish.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((outcome) => (
              <div key={outcome} className="rounded-2xl border border-[#dfe6f0] bg-[#fbfcff] p-5 text-center font-semibold text-[#17305f] shadow-sm">
                {outcome}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#20345f] bg-[#07152f] py-14 text-white">
        <div className="container-editorial grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]">
              <Workflow className="h-4 w-4" /> Five complete workflows
            </div>
            <h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight">
              One prompt is useful. A workflow gets the job done.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#c8d5ea]">
              The kit shows you how to move from an idea to research, a first draft, a review, and a finished output instead of starting over with a blank chat every time.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[.055] p-5 sm:p-6 [&_label]:!text-[#e4ecfa] [&_input]:!border-white/15 [&_input]:!bg-white [&_input]:!text-[#0f1e3d] [&_p]:!text-[#aebdd5] [&_a]:!text-white">
            <p className="mb-4 text-sm font-bold uppercase tracking-[.13em] text-[#8fb0ff]">Get it free</p>
            <SignupForm />
          </div>
        </div>
      </section>
    </>
  );
}
