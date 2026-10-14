import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { SignupForm } from "@/components/signup-form";
import { SubscriberCount } from "@/components/growth-widgets";

export const metadata: Metadata = {
  title: "Free Live Workshop: Build Your First AI Workflow in 30 Minutes",
  description: "A free, beginner-friendly live session. Pick one repeated task and leave with a working AI workflow. No coding required.",
};

const points = [
  "Pick one task you repeat every week",
  "Turn it into a trigger → action → approval workflow, live",
  "Test it with real examples before you trust it",
  "Leave with the template, the prompts, and the replay",
];

export default function WorkshopPage() {
  return (
    <section className="bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_76%)]">
      <div className="container-editorial grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">Free live workshop</p>
          <h1 className="mt-3 font-editorial text-5xl font-semibold leading-[1] tracking-[-.03em] text-[#0a1937] sm:text-6xl">Build your first AI workflow in 30 minutes.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#4f5f79]">A live, beginner-friendly session. No coding, no jargon. Bring one annoying task and leave with a working AI workflow.</p>
          <ul className="mt-8 space-y-3">
            {points.map((p) => <li key={p} className="flex items-start gap-3 text-[#33456e]"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2457ff]" />{p}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-[#d4def8] bg-white p-6 shadow-[0_18px_55px_rgba(29,78,216,.12)] sm:p-8">
          <h2 className="text-xl font-bold text-[#0f1e3d]">Save my free seat</h2>
          <p className="mt-2 text-sm text-[#526078]">We'll email the date, the join link, and the replay. You also get the AI Work Kit right away.</p>
          <SubscriberCount className="mt-2 text-[#3158b5]" />
          <div className="mt-5"><SignupForm source="workshop" buttonLabel="Save my seat" /></div>
        </div>
      </div>
    </section>
  );
}
