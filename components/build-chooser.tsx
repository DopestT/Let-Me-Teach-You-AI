"use client";

import { useState } from "react";
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
    icon: Workflow,
    title: "Automate a task",
    text: "Turn one repeated task into a clear trigger → action → approval workflow.",
    cta: "Build an automation",
  },
  {
    id: "website",
    icon: Globe2,
    title: "Build a website",
    text: "Plan, generate, test, and launch a useful site without starting from a blank screen.",
    cta: "Plan a website",
  },
  {
    id: "content",
    icon: PenTool,
    title: "Create content",
    text: "Turn one idea into a repeatable content system instead of one-off posts.",
    cta: "Build a content system",
  },
  {
    id: "research",
    icon: Search,
    title: "Research anything",
    text: "Ask better questions, verify claims, compare sources, and turn findings into decisions.",
    cta: "Start a research workflow",
  },
  {
    id: "income",
    icon: Sparkles,
    title: "Make money with AI",
    text: "Start with a real problem people pay to solve, then use AI to deliver it faster.",
    cta: "Find a practical idea",
  },
  {
    id: "agent",
    icon: Bot,
    title: "Build an AI agent",
    text: "Map the job, tools, limits, and approval points before giving an agent real access.",
    cta: "Design an agent",
  },
];

export function BuildChooser() {
  const [activeId, setActiveId] = useState("automate");
  const active = options.find((item) => item.id === activeId) ?? options[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(({ id, icon: Icon, title, text }) => {
          const selected = id === activeId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveId(id)}
              className={`group rounded-2xl border p-5 text-left transition-all ${
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

      <div className="sticky top-24 rounded-3xl border border-[#20345f] bg-[#07152f] p-6 text-white shadow-[0_28px_80px_rgba(7,21,47,.22)] sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[.16em] text-[#8bb0ff]">AI Lab</span>
          <span className="flex items-center gap-2 text-xs text-white/55"><span className="h-2 w-2 rounded-full bg-emerald-400" /> interactive</span>
        </div>
        <h3 className="font-editorial text-3xl font-semibold leading-tight">{active.title}</h3>
        <p className="mt-3 leading-7 text-[#c7d3ea]">{active.text}</p>
        <div className="my-6 rounded-2xl border border-white/10 bg-white/[.05] p-4">
          <div className="text-xs font-bold uppercase tracking-[.15em] text-[#7fa5ff]">Starter instruction</div>
          <p className="mt-3 text-sm leading-6 text-white/85">
            “Help me turn this into one small project. Ask only for the details you need, show me the plan first, and keep the first version simple enough to test today.”
          </p>
        </div>
        <Link href="/playground" className="primary-cta inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 font-bold">
          {active.cta} →
        </Link>
        <p className="mt-3 text-center text-xs text-white/45">No setup. No coding required to start.</p>
      </div>
    </div>
  );
}
