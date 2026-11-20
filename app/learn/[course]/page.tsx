import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Download, CheckCircle2 } from "lucide-react";
import { additionalCourses, getAdditionalCourse } from "@/lib/additional-courses";

export function generateStaticParams() {
  return additionalCourses.map((course) => ({ course: course.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ course: string }> }): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getAdditionalCourse(slug);
  if (!course) return {};
  return { title: course.title, description: course.description };
}

export default async function AdditionalCoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params;
  const course = getAdditionalCourse(slug);
  if (!course) notFound();

  return (
    <main className="bg-[#fbfaf7]">
      <header className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-12 sm:py-20">
          <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-bold text-[#3158b5]">
            <ArrowLeft className="h-4 w-4" /> All courses
          </Link>
          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Practical course · {course.level}</p>
            <h1 className="mt-4 font-editorial text-5xl font-semibold tracking-[-.035em] text-[#0c1d3f] sm:text-6xl">{course.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[#536177]">{course.description}</p>
            <p className="mt-5 rounded-2xl border border-[#d9e3f5] bg-white p-5 leading-8 text-[#33456e]"><strong>By the end:</strong> {course.outcome}</p>
          </div>
        </div>
      </header>

      <section className="container-editorial py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">Course roadmap</p>
              <h2 className="mt-2 font-editorial text-3xl font-semibold text-[#0f1e3d]">{course.lessons.length} lessons · About {course.estimatedMinutes} minutes</h2>
            </div>
            <a href={`/course-resources/${course.slug}-workbook.pdf`} download className="inline-flex items-center gap-2 rounded-xl border border-[#b7c8ed] bg-white px-4 py-3 text-sm font-bold text-[#2457ff]">
              <Download className="h-4 w-4" /> Download workbook
            </a>
          </div>
          <ol className="space-y-4">
            {course.lessons.map((lesson, i) => (
              <li key={lesson.slug}>
                <Link href={`/learn/${course.slug}/${lesson.slug}`} className="group flex items-start gap-4 rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm transition hover:border-[#a9bdf7] hover:shadow-lg">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf0ff] font-black text-[#2457ff]">{i+1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="font-editorial text-2xl font-semibold text-[#0f1e3d]">{lesson.title}</span>
                    <span className="mt-2 block leading-7 text-[#59677c]">{lesson.objective}</span>
                  </span>
                  <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-[#2457ff]" />
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-3xl border border-[#dfe6f0] bg-[#f4f7fc] p-6 text-[#33456e] sm:p-8">
            <div className="flex items-center gap-2 font-bold text-[#2457ff]"><BookOpen className="h-5 w-5" /> How to complete the course</div>
            <ul className="mt-5 space-y-3">
              <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#2457ff]" /> Try every demo with fictional or permissioned information.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#2457ff]" /> Save your own answers in the downloadable workbook.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#2457ff]" /> Compare quiz answers and verify factual claims before reuse.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
