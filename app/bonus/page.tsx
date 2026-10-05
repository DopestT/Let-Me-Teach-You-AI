"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const workflows = [
  { title: "Inbox triage assistant", steps: "Trigger: new email. AI labels it urgent / reply / FYI, drafts replies for 'reply', and sends you one morning summary. Human checkpoint: you approve every draft before it sends.", prompt: "You are my inbox assistant. For each email below, label it URGENT, REPLY, or FYI, give a one-line reason, and draft a short reply for REPLY items in my voice: friendly, direct, no fluff." },
  { title: "Meeting-to-action-plan", steps: "Trigger: meeting transcript saved. AI extracts decisions, owners, deadlines, and open questions, then drafts the follow-up email.", prompt: "From this transcript, list: decisions made, action items (owner + deadline), open questions, and a 5-sentence follow-up email I can send to attendees." },
  { title: "Content repurposing engine", steps: "Trigger: you publish one long post or video. AI turns it into 5 short posts, 1 newsletter section, and 3 video hooks.", prompt: "Turn this piece into: 5 social posts under 220 characters, one 150-word newsletter section, and 3 first-sentence hooks for short videos. Keep my examples and voice." },
  { title: "Customer FAQ responder", steps: "Trigger: a new customer question. AI matches it to your FAQ doc, drafts an answer, and flags anything it can't answer for you.", prompt: "Using only the FAQ below, answer the customer's question. If the FAQ doesn't cover it, reply exactly: NEEDS HUMAN — and say what's missing." },
  { title: "Weekly research brief", steps: "Trigger: every Monday. AI gathers news on 3 topics you pick, verifies with 2+ sources, and writes a 1-page brief with links.", prompt: "Research the past 7 days on [topics]. Only include items confirmed by two sources. Output: 5 bullet headlines, why each matters to me, and source links." },
];

export default function BonusPage() {
  const [state, setState] = useState<"loading" | "locked" | "open">("loading");
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("r") ?? "";
    fetch(`/api/referral-stats?r=${r}`).then((x) => x.json()).then((d) => setState((d.referrals ?? 0) >= 3 ? "open" : "locked")).catch(() => setState("locked"));
  }, []);
  return (
    <section className="container-editorial max-w-3xl py-16 sm:py-24">
      <h1 className="font-editorial text-4xl font-semibold text-[#0f1e3d] sm:text-5xl">Bonus Workflow Pack</h1>
      {state === "loading" && <p className="mt-6 text-[#526078]">Checking your referrals…</p>}
      {state === "locked" && <p className="mt-6 text-lg text-[#526078]">This pack unlocks when 3 friends join with your referral link. Find your link on your <Link className="font-bold text-[#2457ff] underline" href="/ai-work-kit">signup confirmation page</Link>.</p>}
      {state === "open" && (
        <div className="mt-8 space-y-6">
          <p className="text-lg text-[#526078]">Thank you for sharing. Here are your 5 advanced workflows.</p>
          {workflows.map((w, i) => (
            <div key={w.title} className="rounded-2xl border border-[#dfe6f0] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#2457ff]">Workflow {i + 1}</p>
              <h2 className="mt-1 text-xl font-bold text-[#0f1e3d]">{w.title}</h2>
              <p className="mt-2 leading-7 text-[#4f5f79]">{w.steps}</p>
              <p className="mt-3 rounded-xl bg-[#f7f9ff] p-4 text-sm leading-6 text-[#33456e]">“{w.prompt}”</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
