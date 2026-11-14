"use client";

import { useEffect, useState } from "react";
import { SignupForm } from "@/components/signup-form";
import Link from "next/link";
import {
  Bot,
  Globe2,
  PenTool,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";

const options = [
  {
    id: "automate",
    starter: "I keep repeating [task]. Help me make a checklist with a clear trigger, three steps, one human approval point, and a safe test I can try without connecting any tools.",
    icon: Workflow,
    title: "Automate a task",
    text: "Turn one repeated task into a clear trigger → action → approval workflow.",
    cta: "Build an automation",
  },
  {
    id: "website",
    starter: "I want a simple website for [idea]. Ask me two questions, then outline a mobile-friendly homepage with a headline, who it helps, three sections, and one clear next action. Do not claim anything is published.",
    icon: Globe2,
    title: "Build a website",
    text: "Plan, generate, test, and launch a useful site without starting from a blank screen.",
    cta: "Plan a website",
  },
  {
    id: "content",
    starter: "I want to explain [topic] to [audience]. Give me three original short-video concepts with a hook, a useful takeaway, and one fact I should verify before posting. Avoid copying other creators.",
    icon: PenTool,
    title: "Create content",
    text: "Turn one idea into a repeatable content system instead of one-off posts.",
    cta: "Build a content system",
  },
  {
    id: "research",
    starter: "I need to understand [question]. Make a research plan with search terms, the best types of original sources, what would contradict my first guess, and a checklist for verifying dates. Do not invent sources.",
    icon: Search,
    title: "Research anything",
    text: "Ask better questions, verify claims, compare sources, and turn findings into decisions.",
    cta: "Start a research workflow",
  },
  {
    id: "income",
    starter: "I know how to [skill]. Suggest three small services I could test with little or no upfront cost. Show who benefits, a sample offer, what to validate, and realistic limitations. Do not promise earnings.",
    icon: Sparkles,
    title: "Make money with AI",
    text: "Start with a real problem people pay to solve, then use AI to deliver it faster.",
    cta: "Find a practical idea",
  },
  {
    id: "agent",
    starter: "Help me plan a small AI assistant for [task]. Define what it can read, what it must never do, when to ask permission, and how a person verifies the result. Keep all actions in proposal mode.",
    icon: Bot,
    title: "Build an AI agent",
    text: "Map the job, tools, limits, and approval points before giving an agent real access.",
    cta: "Design an agent",
  },
];

export function BuildChooser() {
  const [activeId, setActiveId] = useState("automate");
  const active = options.find((item) => item.id === activeId) ?? options[0];
  const [unlocked, setUnlocked] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const copyStarter = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(active.starter);
      setCopyStatus("Prompt copied. Paste it into your AI chat to try it.");
    } catch {
      setCopyStatus("Copy is unavailable here. Select and copy the prompt above instead.");
    }
  };
  useEffect(() => { try { setUnlocked(localStorage.getItem("lmtyai_subscribed") === "1"); } catch {} }, []);

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map(({ id, icon: Icon, title, text }) => {
          const selected = id === activeId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => { setActiveId(id); setCopyStatus(""); }}
              aria-pressed={selected}
              className={`group h-full rounded-2xl border p-5 text-left transition-all sm:p-6 ${
                selected
                  ? "border-[#2457ff] bg-white shadow-[0_18px_50px_rgba(29,78,216,.16)]"
                  : "border-[#dfe6f2] bg-white/80 hover:-translate-y-0.5 hover:border-[#a9bdf7] hover:shadow-lg"
              }`}
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${selected ? "bg-[#2457ff] text-white" : "bg-[#edf2ff] text-[#2457ff]"}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="text-base font-bold text-[#0f1e3d]">{title}</div>
              <p className="mt-2 text-sm leading-6 text-[#526078]">{text}</p>
            </button>
          );
        })}
      </div>

      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-[#20345f] bg-[#07152f] p-6 text-white shadow-[0_24px_70px_rgba(7,21,47,.2)] sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[.16em] text-[#8bb0ff]">AI Lab</span>
          <span className="flex items-center gap-2 text-xs text-white/55"><span className="h-2 w-2 rounded-full bg-emerald-400" /> interactive</span>
        </div>
        <h3 className="font-editorial text-3xl font-semibold leading-tight">{active.title}</h3>
        <p className="mt-3 leading-7 text-[#c7d3ea]">{active.text}</p>
        <div className="my-6 rounded-2xl border border-white/10 bg-white/[.05] p-4">
          <div className="text-xs font-bold uppercase tracking-[.15em] text-[#7fa5ff]">Free starter prompt · no account needed</div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/85">{active.starter}</p>
          <button type="button" onClick={copyStarter} className="mt-4 rounded-lg border border-white/30 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Copy this prompt
          </button>
          <p className="mt-2 min-h-5 text-xs text-white/75" role="status" aria-live="polite">{copyStatus}</p>
          <p className="mt-2 text-xs leading-5 text-white/60">Paste this into an AI chat you already use. Never paste passwords, private records, or someone else&apos;s personal information.</p>
        </div>
        {unlocked ? (
          <>
            <Link href="/playground" className="primary-cta inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 font-bold">
              {active.cta} →
            </Link>
            <p className="mt-3 text-center text-xs text-white/45">No setup. No coding required to start.</p>
          </>
        ) : (
          <div className="[&_input]:!bg-white [&_input]:!text-[#0f1e3d] [&_p]:!text-[#aebdd5] [&_a]:!text-white">
            <p className="mb-3 text-sm font-semibold text-white">Enter your email to unlock the full workflow builder — plus the free AI Work Kit.</p>
            <SignupForm compact stay source={`lab:${active.id}`} buttonLabel="Unlock the AI Lab" onSuccess={() => setUnlocked(true)} />
          </div>
        )}
      </div>
    </div>
  );
}
