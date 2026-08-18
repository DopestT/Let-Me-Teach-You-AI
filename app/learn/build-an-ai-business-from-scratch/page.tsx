import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { aiBusinessCourse } from "@/lib/courses";

export const metadata: Metadata = {
  title: aiBusinessCourse.title,
  description: aiBusinessCourse.description,
};

export default function CourseOverviewPage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-12 sm:py-18">
          <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-bold text-[#3158b5]">
            <ArrowLeft className="h-4 w-4" /> Back to Learn
          </Link>
          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">{aiBusinessCourse.eyebrow}</p>
            <h1 className="mt-4 font-editorial text-5xl font-semibold leading-[1.02] tracking-[-.035em] text-[#0c1d3f] sm:text-6xl">{aiBusinessCourse.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[#536177]">{aiBusinessCourse.description}</p>
            <div className="mt-8 rounded-3xl border border-[#d9e3f5] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">What you will leave with</p>
              <p className="mt-3 text-lg leading-8 text-[#33456e]">{aiBusinessCourse.promise}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-editorial py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Course roadmap</p>
            <h2 className="mt-2 font-editorial text-4xl font-semibold text-[#0f1e3d]">Five parts. One working system.</h2>
          </div>

          <div className="space-y-4">
            {aiBusinessCourse.lessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/learn/${aiBusinessCourse.slug}/${lesson.slug}`}
                className="group grid gap-5 rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#a9bdf7] hover:shadow-lg sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf0ff] font-black text-[#2457ff]">{lesson.number}</div>
                <div>
                  <h3 className="font-editorial text-2xl font-semibold text-[#0f1e3d]">{lesson.title}</h3>
                  <p className="mt-2 leading-7 text-[#59677c]">{lesson.summary}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#2457ff] transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>

          <section className="mt-12 rounded-[2rem] border border-[#20345f] bg-[#07152f] p-7 text-white sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]">Start small</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold">Do Part 1 before buying tools.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#c8d5ea]">A clear problem and customer are worth more than a complicated stack. Validate the idea first, then let the technology serve it.</p>
            <Link href={`/learn/${aiBusinessCourse.slug}/${aiBusinessCourse.lessons[0].slug}`} className="primary-cta mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold">
              Begin Part 1 <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link href="/playground" className="rounded-2xl border border-[#dfe6f0] bg-white p-5 font-bold text-[#2457ff] shadow-sm">Use the AI Helper while you build →</Link>
            <Link href="/#join" className="rounded-2xl border border-[#dfe6f0] bg-white p-5 font-bold text-[#2457ff] shadow-sm">Get the 25-Prompt Starter Pack →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
