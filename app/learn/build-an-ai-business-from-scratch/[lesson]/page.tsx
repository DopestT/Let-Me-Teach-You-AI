import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import { aiBusinessCourse, getAiBusinessLesson } from "@/lib/courses";
import { IdeaScorecard } from "@/components/course/idea-scorecard";

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

const validationQuestions = [
  "Walk me through the last time this problem happened.",
  "What do you do today to solve or work around it?",
  "What is the most frustrating or expensive part of the current process?",
  "How often does this happen in a normal month?",
  "Have you ever paid for a tool, service, or person to help with it?",
  "If a solution reliably produced the result we described, what would make it worth trying?",
];

const completionChecks = [
  "I can name one specific customer — not ‘everyone.’",
  "I have evidence the problem actually happens, not just a guess.",
  "I can describe the result in one sentence without mentioning AI.",
  "I have spoken to at least five relevant people or have five equivalent pieces of real customer evidence.",
  "I know what I still need to validate before spending serious time or money.",
];

export default async function CourseLessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: slug } = await params;
  const lesson = getAiBusinessLesson(slug);
  if (!lesson) notFound();

  const index = aiBusinessCourse.lessons.findIndex((item) => item.slug === lesson.slug);
  const previous = index > 0 ? aiBusinessCourse.lessons[index - 1] : null;
  const next = index < aiBusinessCourse.lessons.length - 1 ? aiBusinessCourse.lessons[index + 1] : null;
  const isIdeaLesson = lesson.slug === "choose-the-idea";

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

          {isIdeaLesson && (
            <>
              <section className="mt-14 overflow-hidden rounded-[2rem] border border-[#20345f] bg-[#07152f] text-white shadow-[0_26px_70px_rgba(7,21,47,.16)]">
                <div className="p-7 sm:p-9">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]"><Lightbulb className="h-4 w-4" /> Worked example</div>
                  <h2 className="mt-4 font-editorial text-4xl font-semibold">From vague idea to something testable.</h2>
                  <p className="mt-5 text-lg leading-8 text-[#c8d5ea]">Suppose the starting idea is: <strong className="text-white">“I want to build an AI tool for contractors.”</strong> That is too broad to build intelligently.</p>
                </div>

                <div className="grid border-t border-white/10 md:grid-cols-2">
                  <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r sm:p-7">
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8fb0ff]">What we observe</p>
                    <p className="mt-3 leading-7 text-[#d8e4f5]">Small home-service contractors often lose leads because inquiries arrive while they are driving, on a job, or after hours. Following up consistently is a real operational problem.</p>
                  </div>
                  <div className="p-6 sm:p-7">
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8fb0ff]">Narrowed concept</p>
                    <p className="mt-3 leading-7 text-[#d8e4f5]">“We help small home-service contractors respond to new website leads faster by drafting a ready-to-approve follow-up and logging what happened.”</p>
                  </div>
                </div>

                <div className="grid border-t border-white/10 sm:grid-cols-3">
                  <div className="p-5 sm:p-6">
                    <Target className="h-5 w-5 text-[#8fb0ff]" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[.1em] text-white/55">Customer</p>
                    <p className="mt-2 font-semibold">Small home-service contractors</p>
                  </div>
                  <div className="border-y border-white/10 p-5 sm:border-x sm:border-y-0 sm:p-6">
                    <Users className="h-5 w-5 text-[#8fb0ff]" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[.1em] text-white/55">Problem</p>
                    <p className="mt-2 font-semibold">Slow or inconsistent lead follow-up</p>
                  </div>
                  <div className="p-5 sm:p-6">
                    <ClipboardCheck className="h-5 w-5 text-[#8fb0ff]" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[.1em] text-white/55">Test</p>
                    <p className="mt-2 font-semibold">Interview five contractors before building</p>
                  </div>
                </div>
              </section>

              <section className="mt-12">
                <IdeaScorecard />
              </section>

              <section className="mt-12 rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]"><Users className="h-4 w-4" /> Customer validation</div>
                <h2 className="mt-3 font-editorial text-3xl font-semibold text-[#0f1e3d] sm:text-4xl">Ask these questions. Do not pitch yet.</h2>
                <p className="mt-4 text-lg leading-8 text-[#536177]">Your job is to learn how the problem works in real life. Avoid leading questions like “Would you use my AI app?” People are polite. Past behavior is better evidence than compliments.</p>
                <ol className="mt-7 space-y-3">
                  {validationQuestions.map((question, i) => (
                    <li key={question} className="flex gap-4 rounded-2xl bg-[#f7f9ff] px-4 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf0ff] text-xs font-black text-[#2457ff]">{i + 1}</span>
                      <span className="leading-7 text-[#4f5f79]">{question}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mt-12 rounded-3xl border border-[#cfdcf6] bg-[linear-gradient(135deg,#eef3ff_0%,#ffffff_72%)] p-6 shadow-sm sm:p-8">
                <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Your assignment</p>
                <h2 className="mt-3 font-editorial text-3xl font-semibold text-[#0f1e3d] sm:text-4xl">Leave the lesson with evidence, not excitement.</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-[#6a7da3]">01 · Score</p>
                    <p className="mt-2 font-semibold leading-7 text-[#33456e]">Score three candidate ideas above and pick one to investigate.</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-[#6a7da3]">02 · Interview</p>
                    <p className="mt-2 font-semibold leading-7 text-[#33456e]">Use the six questions with five people who actually fit the customer profile.</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-[#6a7da3]">03 · Decide</p>
                    <p className="mt-2 font-semibold leading-7 text-[#33456e]">Write: “We help [person] get [result] without [pain]” and list what remains unproven.</p>
                  </div>
                </div>
              </section>
            </>
          )}

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

          {isIdeaLesson && (
            <section className="mt-10 rounded-3xl border-2 border-[#2457ff] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]"><ClipboardCheck className="h-4 w-4" /> Completion checkpoint</div>
              <h2 className="mt-3 font-editorial text-3xl font-semibold text-[#0f1e3d]">Do not move to branding until these are true.</h2>
              <div className="mt-6 space-y-3">
                {completionChecks.map((check) => (
                  <div key={check} className="flex items-start gap-3 rounded-2xl bg-[#f7f9ff] px-4 py-3.5">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-[#9bb1e8] bg-white" aria-hidden />
                    <span className="leading-7 text-[#4f5f79]">{check}</span>
                  </div>
                ))}
              </div>
              {next && (
                <div className="mt-7 border-t border-[#dfe6f0] pt-7">
                  <p className="font-semibold text-[#33456e]">If you can check all five, you have enough clarity to give the idea a name, a promise, and a home on the internet.</p>
                  <Link href={`/learn/${aiBusinessCourse.slug}/${next.slug}`} className="primary-cta mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold">
                    Continue to Part 2: {next.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>
          )}

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
