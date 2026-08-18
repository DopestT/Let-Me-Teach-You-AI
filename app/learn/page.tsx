import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Workflow } from "lucide-react";
import { aiBusinessCourse } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Learn AI by Building Real Projects",
  description:
    "Practical, beginner-friendly AI courses built around real projects, workflows, websites, automation, content systems, and income experiments.",
};

export default function LearnPage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-16 sm:py-24">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d4def8] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#3158b5] shadow-sm">
              <BookOpen className="h-3.5 w-3.5" /> Learn
            </span>
            <h1 className="mt-6 font-editorial text-5xl font-semibold leading-[1] tracking-[-.035em] text-[#0c1d3f] sm:text-6xl lg:text-7xl">
              Learn AI by building things that actually work.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#536177] sm:text-xl">
              No giant theory dump. Pick a real outcome, build the smallest useful version, test it, and understand what happened along the way.
            </p>
          </div>
        </div>
      </section>

      <section className="container-editorial py-14 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-[2rem] border border-[#20345f] bg-[#07152f] p-7 text-white shadow-[0_28px_80px_rgba(7,21,47,.18)] sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[.16em] text-[#8fb0ff]">Flagship course</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">5 parts</span>
            </div>
            <h2 className="mt-6 font-editorial text-4xl font-semibold leading-tight sm:text-5xl">{aiBusinessCourse.title}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#c8d5ea]">{aiBusinessCourse.description}</p>
            <ul className="mt-7 space-y-3 text-sm text-[#dce5f5]">
              {aiBusinessCourse.lessons.map((lesson) => (
                <li key={lesson.slug} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#7fa5ff]" />
                  <span><strong>Part {lesson.number}:</strong> {lesson.title}</span>
                </li>
              ))}
            </ul>
            <Link href={`/learn/${aiBusinessCourse.slug}`} className="primary-cta mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold">
              Start the course <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <div className="space-y-6">
            <article className="rounded-3xl border border-[#dfe6f0] bg-white p-7 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#2457ff]">
                <Workflow className="h-5 w-5" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">Standalone build guide</p>
              <h2 className="mt-2 font-editorial text-3xl font-semibold text-[#0f1e3d]">Build an AI workflow from plain English</h2>
              <p className="mt-4 leading-7 text-[#59677c]">Turn one repeated task into a trigger, validation step, AI job, approval gate, action, and log.</p>
              <Link href="/build/ai-workflow-from-plain-english" className="mt-6 inline-flex items-center gap-2 font-bold text-[#2457ff]">
                Open the guide <ArrowRight className="h-4 w-4" />
              </Link>
            </article>

            <article className="rounded-3xl border border-[#dfe6f0] bg-[#f4f7fc] p-7">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#2457ff]">How to use this section</p>
              <h2 className="mt-3 font-editorial text-3xl font-semibold text-[#0f1e3d]">Build first. Add complexity later.</h2>
              <p className="mt-4 leading-7 text-[#59677c]">Every course should leave you with something visible: a page, a workflow, a content system, a working offer, or a test you can run with real people.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe6f0] bg-white py-14">
        <div className="container-editorial flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Need help while you build?</p>
            <h2 className="mt-2 font-editorial text-3xl font-semibold text-[#0f1e3d]">Use the AI Helper alongside the lessons.</h2>
          </div>
          <Link href="/playground" className="inline-flex items-center gap-2 rounded-xl border border-[#ccd7ea] bg-white px-5 py-3 font-bold text-[#10213f] shadow-sm">
            Open AI Helper <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
