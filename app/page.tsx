import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Sparkles, Workflow, Globe2, Bot } from "lucide-react";
import { SignupForm } from "@/components/signup-form";
import { BuildChooser } from "@/components/build-chooser";

const packBullets = [
  "Written for total beginners",
  "Works with ChatGPT, Gemini, or any chat AI",
  "No fluff, no hype",
];

const projects = [
  {
    icon: Workflow,
    label: "AUTOMATION",
    title: "Build an AI workflow from plain English",
    body: "Turn a repeated process into a trigger, actions, approval points, and a test plan.",
  },
  {
    icon: Globe2,
    label: "BUILD",
    title: "Launch an AI-made landing page",
    body: "Generate the first version, audit it, test it on mobile, and put it online.",
  },
  {
    icon: Bot,
    label: "AGENTS",
    title: "Design an AI agent that stays under control",
    body: "Define the job, tools, limits, and human checkpoints before giving it access.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#dbe3ef] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_76%)]">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(29,78,216,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(29,78,216,.05)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="container-editorial relative grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d4def8] bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[.13em] text-[#3158b5] shadow-sm">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Learn AI by building real things
            </span>
            <h1 className="mt-6 max-w-3xl font-editorial text-5xl font-semibold leading-[.98] tracking-[-.035em] text-[#0a1937] sm:text-6xl lg:text-7xl">
              What do you want AI to help you <span className="text-[#2457ff]">build?</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4f5f79] sm:text-xl">
              Skip the jargon. Pick a real outcome, learn the workflow, and build something useful with AI today.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#lab" className="primary-cta inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold shadow-[0_12px_30px_rgba(29,78,216,.22)]">
                Open the AI Lab <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#join" className="inline-flex items-center rounded-xl border border-[#ccd7ea] bg-white px-6 py-3.5 font-bold text-[#10213f] shadow-sm transition hover:border-[#9db2df] hover:shadow-md">
                Get 25 Free AI Prompts
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_right,rgba(78,112,255,.22),transparent_55%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[#20345f] bg-[#07152f] p-5 shadow-[0_32px_90px_rgba(7,21,47,.28)] sm:p-7">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white"><Sparkles className="h-4 w-4 text-[#7da2ff]" /> LMTYAI Lab</div>
                <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]"/><span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]"/><span className="h-2.5 w-2.5 rounded-full bg-[#50d890]"/></div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#7fa5ff]">You say</div>
                  <p className="mt-2 text-sm leading-6 text-white/90">“I want to automate the follow-up after someone fills out my website form.”</p>
                </div>
                <div className="ml-6 rounded-2xl border border-[#355ac0]/50 bg-[#10255b] p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#9bb7ff]">AI maps it</div>
                  <div className="mt-3 space-y-2 text-sm text-white/85">
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#6ea0ff]"/> Form submitted</div>
                    <div className="ml-1 h-4 border-l border-dashed border-white/20"/>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#6ea0ff]"/> Validate lead</div>
                    <div className="ml-1 h-4 border-l border-dashed border-white/20"/>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ffd166]"/> Human approval</div>
                    <div className="ml-1 h-4 border-l border-dashed border-white/20"/>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#50d890]"/> Send + log result</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/55">Plain English → clear workflow → safe first test</div>
            </div>
          </div>
        </div>
      </section>

      <section id="lab" className="border-b border-[#dfe6f0] bg-[#f4f7fc] py-16 sm:py-20">
        <div className="container-editorial">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Interactive AI Lab</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight text-[#0c1d3f] sm:text-5xl">Start with what you want to accomplish.</h2>
            <p className="mt-4 text-lg leading-8 text-[#56647a]">Pick a goal. The site shows you the kind of workflow to build and gives you a direct starting point.</p>
          </div>
          <BuildChooser />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-editorial">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Build in public</p>
              <h2 className="mt-3 font-editorial text-4xl font-semibold text-[#0c1d3f]">Learn from projects that actually ship.</h2>
            </div>
            <p className="max-w-md text-[#5a687c]">Real workflows, real sites, real agents — broken down so a beginner can understand what happened.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {projects.map(({icon: Icon,label,title,body}) => (
              <article key={title} className="group rounded-3xl border border-[#dfe6f0] bg-[#fbfcff] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between"><span className="text-[11px] font-bold tracking-[.15em] text-[#6a7da3]">{label}</span><Icon className="h-5 w-5 text-[#2457ff]"/></div>
                <h3 className="mt-8 font-editorial text-2xl font-semibold leading-tight text-[#0f1e3d]">{title}</h3>
                <p className="mt-3 leading-7 text-[#59677c]">{body}</p>
                <div className="mt-8 text-sm font-bold text-[#2457ff]">Read the build →</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="border-y border-[#20345f] bg-[#07152f] py-16 text-white sm:py-20">
        <div className="container-editorial grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]">Free when you join</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight sm:text-5xl">Get the 25-Prompt Starter Pack.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#c8d5ea]">Twenty-five prompts you can use today for writing, planning, research, learning, and getting better answers from AI.</p>
            <ul className="mt-7 space-y-3 text-[#dce5f5]">
              {packBullets.map((bullet) => <li key={bullet} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-[#7fa5ff]"/>{bullet}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[.06] p-6 shadow-2xl sm:p-8 [&_label]:!text-[#e4ecfa] [&_input]:!border-white/15 [&_input]:!bg-white [&_input]:!text-[#0f1e3d] [&_p]:!text-[#aebdd5] [&_a]:!text-white">
            <SignupForm />
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf7] py-16 sm:py-20">
        <div className="container-editorial grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Why this exists</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight text-[#0f1e3d]">AI moved fast. Most explanations didn’t help normal people catch up.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[#536177]">
            <p>I wasn’t going to sit on the sidelines, so I started learning, testing, building, failing, and figuring out what actually works.</p>
            <p>Let Me Teach You AI is where I turn that work into practical lessons you can use without pretending you need to become a programmer first.</p>
            <p className="font-semibold text-[#0f1e3d]">No fake guru act. No overnight-rich promises. Build something useful and learn from it.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#dfe6f0] bg-white py-16">
        <div className="container-editorial text-center">
          <h2 className="font-editorial text-4xl font-semibold text-[#0f1e3d]">Start with one useful thing.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#59677c]">Pick a goal in the AI Lab or join free and get the 25 prompts.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="#lab" className="primary-cta rounded-xl px-6 py-3.5 font-bold">Open the AI Lab</Link>
            <Link href="#join" className="rounded-xl border border-[#ccd7ea] bg-white px-6 py-3.5 font-bold text-[#10213f]">Get the prompts</Link>
          </div>
        </div>
      </section>
    </>
  );
}
