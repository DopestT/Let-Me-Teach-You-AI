import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Download, FlaskConical, SearchCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "A simple path from your free AI Work Kit to using AI on a real task, learning the workflow, and getting help when you need it.",
};

const steps = [
  {
    number: "01",
    title: "Download the Work Kit",
    body: "Keep the 25 prompts close. You do not need to read all of them first — pick one that matches something you actually need to do.",
    href: "/api/prompt-pack",
    label: "Download the kit",
    icon: Download,
  },
  {
    number: "02",
    title: "Use one prompt on a real task",
    body: "Try it on an email, a plan, research, content, or a project. The goal is not to study AI. The goal is to get one useful result.",
    href: "/#lab",
    label: "Open the AI Lab",
    icon: FlaskConical,
  },
  {
    number: "03",
    title: "Learn the workflow behind it",
    body: "Once you have a useful result, go deeper with the free flagship course. Build the idea, site, content engine, automation, and revenue test in order.",
    href: "/learn/build-an-ai-business-from-scratch",
    label: "Open the free course",
    icon: BookOpen,
  },
  {
    number: "04",
    title: "Get a second set of eyes",
    body: "If you have something real but are unsure what to fix next, the AI Build Review is the first paid step: one focused review and a prioritized action list.",
    href: "/build-review",
    label: "See the $29 Build Review",
    icon: SearchCheck,
  },
];

export default function StartHerePage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-16 sm:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Start here</p>
            <h1 className="mt-4 font-editorial text-5xl font-semibold leading-[1] tracking-[-.035em] text-[#0c1d3f] sm:text-6xl lg:text-7xl">
              You have the prompts. Now make one useful thing happen.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#536177] sm:text-xl">
              Do not turn AI into another subject you mean to study someday. Use one prompt, get one result, then learn the workflow behind it.
            </p>
          </div>
        </div>
      </section>

      <section className="container-editorial py-14 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="grid gap-5 rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf0ff] text-[#2457ff]">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[.16em] text-[#6a7da3]">Step {step.number}</p>
                  <h2 className="mt-2 font-editorial text-2xl font-semibold text-[#0f1e3d] sm:text-3xl">{step.title}</h2>
                  <p className="mt-2 max-w-2xl leading-7 text-[#59677c]">{step.body}</p>
                </div>
                <Link href={step.href} className="inline-flex items-center gap-2 font-bold text-[#2457ff]">
                  {step.label} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#20345f] bg-[#07152f] py-14 text-white">
        <div className="container-editorial flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]">Keep it simple</p>
            <h2 className="mt-2 font-editorial text-3xl font-semibold sm:text-4xl">Free first. Pay when hands-on help is worth it.</h2>
            <p className="mt-3 leading-7 text-[#c8d5ea]">The prompts, AI Lab, guides, workshop, and flagship course stay useful on their own. The paid step is for people who want a focused review of what they are actually building.</p>
          </div>
          <Link href="/pricing" className="primary-cta inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3.5 font-bold">
            See the options <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
