import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, Workflow } from "lucide-react";

export const metadata: Metadata = {
  title: "Build an AI Workflow From Plain English",
  description:
    "A beginner-friendly guide to turning a repeated task into a real AI workflow with triggers, actions, approval points, testing, and automation tools like n8n or Make.",
};

const workflowSteps = [
  {
    step: "1",
    title: "Trigger",
    body: "Something happens that starts the workflow — for example, a person submits your website form.",
  },
  {
    step: "2",
    title: "Validate the input",
    body: "Check that the information you need is actually there before spending AI tokens or sending anything.",
  },
  {
    step: "3",
    title: "Let AI do one clear job",
    body: "Summarize, classify, extract, rewrite, or decide between a small set of options. Keep the job narrow and measurable.",
  },
  {
    step: "4",
    title: "Add a human checkpoint",
    body: "If the workflow can email customers, publish content, spend money, or change important data, require approval while you are learning.",
  },
  {
    step: "5",
    title: "Take action",
    body: "Send the email, create the task, update the record, publish the draft, or hand the result to the next tool.",
  },
  {
    step: "6",
    title: "Log the result",
    body: "Save what happened so you can debug failures and improve the workflow instead of guessing.",
  },
];

const testCases = [
  "A normal submission with every field filled in",
  "A submission with a missing email address",
  "A duplicate submission",
  "A weird or unclear message",
  "A case the AI should not handle automatically",
];

export default function AIWorkflowBuildPage() {
  return (
    <article className="bg-[#fbfaf7] text-[#0f1e3d]">
      <header className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-12 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#3158b5] transition hover:text-[#163b9a]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Let Me Teach You AI
          </Link>

          <div className="mt-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4def8] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.13em] text-[#3158b5] shadow-sm">
              <Workflow className="h-3.5 w-3.5" /> Build #1 · Automation
            </div>
            <h1 className="mt-6 font-editorial text-5xl font-semibold leading-[1.02] tracking-[-.035em] sm:text-6xl">
              Build an AI workflow from plain English
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[#536177]">
              You do not need to start with code. Start by describing what happens now, what should happen next, where AI helps, and where a human should stay in control.
            </p>
          </div>
        </div>
      </header>

      <div className="container-editorial py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-3xl border border-[#d9e3f5] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">The workflow we are building</p>
            <p className="mt-4 text-lg leading-8 text-[#536177]">
              Imagine someone fills out a form on your website asking for information. Instead of manually reading every submission, deciding what it means, writing a reply, and recording what happened, we will map that repeated process into a safe automation.
            </p>
            <div className="mt-6 rounded-2xl bg-[#07152f] p-5 text-white sm:p-6">
              <p className="font-mono text-sm leading-7 text-[#d8e4ff]">
                Form submitted → validate → AI summarizes + classifies → human approval → send follow-up → log result
              </p>
            </div>
          </section>

          <section className="mt-14">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Step zero</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold">Say the job in normal language.</h2>
            <p className="mt-5 text-lg leading-8 text-[#536177]">
              Before opening an automation tool, write one sentence describing the result you want. Avoid tool names at first. Describe the business process.
            </p>

            <div className="mt-6 rounded-3xl border border-[#dfe6f0] bg-white p-6 sm:p-8">
              <p className="text-sm font-bold text-[#6a7da3]">TRY THIS PROMPT</p>
              <p className="mt-4 text-lg leading-8">
                “When someone submits my contact form, check that their email and message are present, summarize what they want, label the request as sales, support, partnership, or other, show me the proposed reply for approval, then send it and record the result.”
              </p>
            </div>

            <p className="mt-6 text-lg leading-8 text-[#536177]">
              That single paragraph already contains most of a workflow: a trigger, validation rules, an AI task, decision logic, a human checkpoint, an action, and a record of what happened.
            </p>
          </section>

          <section className="mt-14">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Break it into pieces</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold">Turn the sentence into six blocks.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {workflowSteps.map((item) => (
                <div key={item.step} className="rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf0ff] text-sm font-black text-[#2457ff]">
                    {item.step}
                  </div>
                  <h3 className="mt-5 font-editorial text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[#59677c]">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Choose a builder</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold">Use AI to help build the automation itself.</h2>
            <p className="mt-5 text-lg leading-8 text-[#536177]">
              Modern automation platforms can now take natural-language instructions and help turn them into workflows. Two strong options are n8n and Make. The important part is not picking a “winner” yet — it is learning how to describe the process clearly enough that the tool can help you build it.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-[#dfe6f0] bg-white p-6 sm:p-8">
                <h3 className="font-editorial text-2xl font-semibold">n8n</h3>
                <p className="mt-3 leading-7 text-[#59677c]">
                  n8n&apos;s AI Workflow Builder can create, refine, and debug workflows from natural-language descriptions. Paste in the workflow sentence above, inspect what it creates, then refine one section at a time.
                </p>
                <a
                  href="https://docs.n8n.io/build/ways-of-building-workflows/ai-workflow-builder/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 font-bold text-[#2457ff]"
                >
                  Read the n8n guide <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="rounded-3xl border border-[#dfe6f0] bg-white p-6 sm:p-8">
                <h3 className="font-editorial text-2xl font-semibold">Make</h3>
                <p className="mt-3 leading-7 text-[#59677c]">
                  Make&apos;s Maia builder is designed around creating automations through natural-language conversation. Describe the outcome, review the proposed scenario, and keep refining until the flow matches the real process.
                </p>
                <a
                  href="https://www.make.com/en/blog/natural-language-automation"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 font-bold text-[#2457ff]"
                >
                  Read Make&apos;s overview <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-[#f0dca9] bg-[#fffaf0] p-6 sm:p-8">
            <div className="flex gap-4">
              <CircleAlert className="mt-1 h-6 w-6 shrink-0 text-[#9a6500]" />
              <div>
                <h2 className="font-editorial text-3xl font-semibold">Do not automate the risky part first.</h2>
                <p className="mt-4 text-lg leading-8 text-[#685b43]">
                  If a mistake can send the wrong message, spend money, delete data, publish publicly, or affect a customer, keep a human approval step while you test. Automation should remove repetitive work without removing your ability to stop a bad outcome.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Test before turning it loose</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold">Run boring tests on purpose.</h2>
            <p className="mt-5 text-lg leading-8 text-[#536177]">
              A workflow is not finished when the happy path works once. Test the cases that usually create trouble.
            </p>
            <ul className="mt-7 space-y-3">
              {testCases.map((test) => (
                <li key={test} className="flex items-start gap-3 rounded-2xl border border-[#dfe6f0] bg-white px-5 py-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2457ff]" />
                  <span className="leading-7 text-[#4f5f79]">{test}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">The lesson</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold">Plain English is the blueprint, not the magic.</h2>
            <p className="mt-5 text-lg leading-8 text-[#536177]">
              AI can help turn your description into nodes, modules, mappings, and logic. You still own the important part: deciding what the process should do, what counts as a good result, where mistakes matter, and when a person needs to approve the next step.
            </p>
            <p className="mt-5 text-lg leading-8 text-[#536177]">
              Once you can describe a repeated process as <strong>trigger → inputs → AI job → rules → approval → action → log</strong>, you can automate a surprising amount of real work without starting as a programmer.
            </p>
          </section>

          <section className="mt-14 rounded-[2rem] border border-[#20345f] bg-[#07152f] p-7 text-white sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]">Your turn</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold">Pick one repetitive task you did this week.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#c8d5ea]">
              Write it in one paragraph, break it into the seven-part blueprint, and build the smallest safe version first.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/#lab" className="primary-cta inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold">
                Open the AI Lab <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/#join" className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold text-white">
                Get 25 Free AI Prompts
              </Link>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
