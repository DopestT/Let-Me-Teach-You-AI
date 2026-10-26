"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { SignupForm } from "@/components/signup-form";

const subscribed = () => { try { return localStorage.getItem("lmtyai_subscribed") === "1"; } catch { return false; } };

/** Saves ?ref=CODE from shared links so the signup is credited to the referrer. */
export function RefCapture() {
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref && /^[a-z0-9]{4,16}$/.test(ref)) { try { localStorage.setItem("lmtyai_ref", ref); } catch {} }
  }, []);
  return null;
}

/** Live subscriber count. Hidden until the list is big enough to be persuasive. */
export function SubscriberCount({ min = 50, className = "" }: { min?: number; className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/subscriber-count").then((r) => r.json()).then((d) => setCount(d.count ?? null)).catch(() => {});
  }, []);
  if (count === null || count < min) return null;
  return <p className={`text-sm font-semibold ${className}`}>Join {count.toLocaleString()}+ beginners learning AI by building.</p>;
}

/** Exit-intent (desktop) / 35s timer (mobile) popup. Once per 7 days, never for subscribers. */
export function ExitPopup() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => {
    if (path?.startsWith("/thank-you") || path?.startsWith("/ai-work-kit") || subscribed()) return;
    try {
      const last = Number(localStorage.getItem("lmtyai_popup_seen") ?? 0);
      if (Date.now() - last < 7 * 864e5) return;
    } catch {}
    const show = () => {
      setOpen(true);
      try { localStorage.setItem("lmtyai_popup_seen", String(Date.now())); } catch {}
      cleanup();
    };
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) show(); };
    const timer = window.matchMedia("(pointer: coarse)").matches ? window.setTimeout(show, 35000) : undefined;
    const root = document.documentElement;
    root.addEventListener("mouseleave", onLeave, { passive: true });
    const cleanup = () => { root.removeEventListener("mouseleave", onLeave); if (timer) clearTimeout(timer); };
    return cleanup;
  }, [path]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07152f]/70 p-4" role="dialog" aria-modal="true" aria-labelledby="popup-title" onClick={() => setOpen(false)}>
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full p-2 text-[#526078] hover:bg-[#f1f4fa]" aria-label="Close"><X className="h-5 w-5" /></button>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[#2457ff]">Before you go</p>
        <h2 id="popup-title" className="mt-2 font-editorial text-3xl font-semibold leading-tight text-[#0f1e3d]">Take the free AI Work Kit with you.</h2>
        <p className="mt-3 text-[#526078]">25 practical prompts, 5 plug-and-play workflows, and a 10-minute quick start. Free.</p>
        <div className="mt-5"><SignupForm compact source="exit-popup" buttonLabel="Send it" onSuccess={() => setOpen(false)} /></div>
      </div>
    </div>
  );
}

/** Dark inline signup block for the end of lessons, builds, and guides. */
export function InlineSignup({ source, eyebrow = "Free AI Work Kit", title, body }: { source: string; eyebrow?: string; title: string; body: string }) {
  return (
    <section className="mt-12 rounded-[2rem] border border-[#20345f] bg-[#07152f] p-7 text-white sm:p-9">
      <p className="text-sm font-bold uppercase tracking-[.14em] text-[#8fb0ff]">{eyebrow}</p>
      <h2 className="mt-3 font-editorial text-3xl font-semibold leading-tight">{title}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-[#c8d5ea]">{body}</p>
      <SubscriberCount className="mt-3 text-[#8fb0ff]" />
      <div className="mt-6 [&_input]:!bg-white [&_input]:!text-[#0f1e3d] [&_p]:!text-[#aebdd5] [&_a]:!text-white">
        <SignupForm compact source={source} />
      </div>
    </section>
  );
}
