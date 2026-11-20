import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Download, ShieldCheck } from "lucide-react";
import { additionalCourses, getAdditionalCourse, getAdditionalLesson } from "@/lib/additional-courses";

export function generateStaticParams() {
  return additionalCourses.flatMap((course) => course.lessons.map((lesson) => ({ course: course.slug, lesson: lesson.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ course: string; lesson: string }> }): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const lesson = getAdditionalLesson(courseSlug, lessonSlug);
  const course = getAdditionalCourse(courseSlug);
  if (!lesson || !course) return {};
  return { title: `${lesson.title} · ${course.title}`, description: lesson.objective };
}

export default async function AdditionalLessonPage({ params }: { params: Promise<{ course: string; lesson: string }> }) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const course = getAdditionalCourse(courseSlug);
  const lesson = getAdditionalLesson(courseSlug, lessonSlug);
  if (!course || !lesson) notFound();
  const index = course.lessons.findIndex((part) => part.slug === lesson.slug);
  const next = course.lessons[index+1];
  const previous = course.lessons[index-1];

  return (
    <main className="bg-[#fbfaf7]">
      <header className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-12 sm:py-16">
          <Link href={`/learn/${course.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#3158b5]"><ArrowLeft className="h-4 w-4" /> {course.title}</Link>
          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Part {index+1} of {course.lessons.length}</p>
            <h1 className="mt-4 font-editorial text-5xl font-semibold tracking-[-.035em] text-[#0c1d3f] sm:text-6xl">{lesson.title}</h1>
            <p className="mt-5 max-w-3xl text-xl leading-9 text-[#536177]">{lesson.objective}</p>
          </div>
        </div>
      </header>

      <article className="container-editorial py-12 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-10">
          {lesson.concepts.map((concept) => (
            <section key={concept.heading}>
              <h2 className="font-editorial text-3xl font-semibold text-[#0f1e3d]">{concept.heading}</h2>
              <p className="mt-4 text-lg leading-8 text-[#536177]">{concept.body}</p>
            </section>
          ))}

          <section className="overflow-hidden rounded-3xl border border-[#20345f] bg-[#07152f] text-white">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]"><BookOpen className="h-4 w-4" /> Worked example</div>
              <h2 className="mt-3 font-editorial text-3xl font-semibold">See the difference</h2>
              <div className="mt-6 space-y-6">
                <div><p className="text-xs font-bold uppercase tracking-wide text-[#8fb0ff]">Less useful starting point</p><p className="mt-2 leading-8 text-[#dce5f5]">{lesson.demo.before}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wide text-[#8fb0ff]">Improved, bounded version</p><p className="mt-2 leading-8 text-white">{lesson.demo.after}</p></div>
                <div className="border-t border-white/15 pt-5"><p className="text-xs font-bold uppercase tracking-wide text-[#8fb0ff]">How to check it</p><p className="mt-2 leading-8 text-[#dce5f5]">{lesson.demo.verify}</p></div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-editorial text-3xl font-semibold text-[#0f1e3d]">Your assignment</h2>
            <ol className="mt-6 space-y-3">
              {lesson.exercise.map((step, i) => <li key={step} className="flex gap-4 rounded-2xl bg-[#f7f9ff] px-4 py-4 leading-7 text-[#4f5f79]"><span className="font-black text-[#2457ff]">{i+1}.</span> {step}</li>)}
            </ol>
            <a href={`/course-resources/${course.slug}-workbook.pdf`} download className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#b7c8ed] px-4 py-3 font-bold text-[#2457ff]"><Download className="h-4 w-4" /> Download workbook</a>
          </section>

          <section className="rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-[#2457ff]">Knowledge check</p>
            <h2 className="mt-3 font-editorial text-2xl font-semibold text-[#0f1e3d]">{lesson.quiz.question}</h2>
            <ol className="mt-5 space-y-2">
              {lesson.quiz.options.map((option,i) => <li key={option} className="rounded-xl bg-[#f7f9ff] px-4 py-3 leading-7 text-[#4f5f79]">{String.fromCharCode(65+i)}. {option}</li>)}
            </ol>
            <details className="mt-5 rounded-2xl border border-[#d9e3f5] bg-[#f4f7fc] p-4 text-[#33456e]">
              <summary className="cursor-pointer font-bold text-[#2457ff]">Reveal answer and explanation</summary>
              <p className="mt-3 leading-7"><strong>Correct answer: {String.fromCharCode(65+lesson.quiz.answer)}.</strong> {lesson.quiz.explanation}</p>
            </details>
          </section>

          <aside className="flex gap-3 rounded-3xl border border-[#d9e3f5] bg-[#eef3ff] p-6 leading-7 text-[#33456e]">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#2457ff]" />
            <p><strong>Keep control of the outcome.</strong> Use fictional or permissioned data, check dates and claims in source material, and require human approval for sending, spending, publishing, or changing production records.</p>
          </aside>

          <nav className="grid gap-4 sm:grid-cols-2" aria-label="Lesson navigation">
            <Link href={previous ? `/learn/${course.slug}/${previous.slug}` : `/learn/${course.slug}`} className="rounded-2xl border border-[#dfe6f0] bg-white p-5 font-bold text-[#2457ff]">← {previous?.title ?? "Course overview"}</Link>
            <Link href={next ? `/learn/${course.slug}/${next.slug}` : "/learn"} className="rounded-2xl border border-[#dfe6f0] bg-white p-5 text-right font-bold text-[#2457ff]">{next?.title ?? "All courses"} <ArrowRight className="inline h-4 w-4" /></Link>
          </nav>
        </div>
      </article>
    </main>
  );
}
