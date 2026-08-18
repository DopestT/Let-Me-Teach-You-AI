import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { aiBusinessCourse, getAiBusinessLesson } from "@/lib/courses";

export function generateStaticParams() {
  return aiBusinessCourse.lessons.map((lesson) => ({ lesson: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }): Promise<Metadata> {
  const { lesson: slug } = await params;
  const lesson = getAiBusinessLesson(slug);
  if (!lesson) return {};
  return {
    title: `${lesson.title} · ${aiBusinessCourse.title}`,
    description: lesson.summary,
  };
}

export default async function CourseLessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: slug } = await params;
  const lesson = getAiBusinessLesson(slug);
  if (!lesson) notFound();

  const index = aiBusinessCourse.lessons.findIndex((item) => item.slug === lesson.slug);
  const previous = index > 0 ? aiBusinessCourse.lessons[index - 1] : null;
  const next = index < aiBusinessCourse.lessons.length - 1 ? aiBusinessCourse.lessons[index + 1] : null;

  return (
    <main className="bg-[#fbfaf7]">
      <header className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-12 sm:py-16">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#3158b5]">
            <Link href="/learn" className="inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Learn</Link>
            <Link href={`/learn/${aiBusinessCourse.slug}`}>Course home</Link>
          </div>

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Part {lesson.number} of {aiBusinessCourse.lessons.length}</p>
            <h1 className="mt-4 font-editorial text-5xl font-semibold leading-[1.02] tracking-[-.035em] text-[#0c1d3f] sm:text-6xl">{lesson.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[#536177]">{lesson.summary}</p>
          </div>
        </div>
      </header>

      <article className="container-editorial py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-3xl border border-[#d9e3f5] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">Your outcome for this part</p>
            <p className="mt-3 text-lg leading-8 text-[#33456e]">{lesson.outcome}</p>
          </section>

          <div className="mt-12 space-y-12">
            {lesson.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-editorial text-3xl font-semibold text-[#0f1e3d] sm:text-4xl">{section.heading}</h2>
                <p className="mt-4 text-lg leading-8 text-[#536177]">{section.body}</p>
              </section>
            ))}
          </div>

          <section className="mt-14 rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Do this before moving on</p>
            <ul className="mt-5 space-y-3">
              {lesson.actions.map((action) => (
                <li key={action} className="flex items-start gap-3 rounded-2xl bg-[#f7f9ff] px-4 py-3.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2457ff]" />
                  <span className="leading-7 text-[#4f5f79]">{action}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-[2rem] border border-[#20345f] bg-[#07152f] p-7 text-white sm:p-9">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]"><Copy className="h-4 w-4" /> Use this AI prompt</div>
            <p className="mt-5 text-lg leading-8 text-[#e5ecfa]">“{lesson.prompt}”</p>
            <Link href="/playground" className="primary-cta mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold">
              Open AI Helper <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <nav className="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Course lesson navigation">
            {previous ? (
              <Link href={`/learn/${aiBusinessCourse.slug}/${previous.slug}`} className="rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm transition hover:border-[#a9bdf7]">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">Previous</p>
                <p className="mt-2 font-editorial text-2xl font-semibold text-[#0f1e3d]">← {previous.title}</p>
              </Link>
            ) : (
              <Link href={`/learn/${aiBusinessCourse.slug}`} className="rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm transition hover:border-[#a9bdf7]">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">Course</p>
                <p className="mt-2 font-editorial text-2xl font-semibold text-[#0f1e3d]">← Course overview</p>
              </Link>
            )}

            {next ? (
              <Link href={`/learn/${aiBusinessCourse.slug}/${next.slug}`} className="rounded-3xl border border-[#dfe6f0] bg-white p-6 text-right shadow-sm transition hover:border-[#a9bdf7]">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">Next</p>
                <p className="mt-2 font-editorial text-2xl font-semibold text-[#0f1e3d]">{next.title} →</p>
              </Link>
            ) : (
              <Link href="/#join" className="rounded-3xl border border-[#dfe6f0] bg-white p-6 text-right shadow-sm transition hover:border-[#a9bdf7]">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#6a7da3]">Course complete</p>
                <p className="mt-2 font-editorial text-2xl font-semibold text-[#0f1e3d]">Get the free prompt pack →</p>
              </Link>
            )}
          </nav>
        </div>
      </article>
    </main>
  );
}
