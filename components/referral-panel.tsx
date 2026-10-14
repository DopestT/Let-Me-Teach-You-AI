"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Gift } from "lucide-react";

const GOAL = 3;

export function ReferralPanel() {
  const [code, setCode] = useState("");
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("r") ?? "";
    if (!/^[a-z0-9]{4,16}$/.test(r)) return;
    setCode(r);
    try { localStorage.setItem("lmtyai_my_code", r); } catch {}
    fetch(`/api/referral-stats?r=${r}`).then((x) => x.json()).then((d) => setCount(d.referrals ?? 0)).catch(() => {});
  }, []);
  if (!code) return null;
  const link = `https://letmeteachyouai.com/?ref=${code}`;
  const share = encodeURIComponent(`I'm learning to build useful things with AI — no coding. Free AI Work Kit here: ${link}`);
  return (
    <div className="mt-12 rounded-2xl border-2 border-[#2457ff] bg-white p-6 text-left shadow-sm sm:p-8">
      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]"><Gift className="h-4 w-4" /> Unlock the bonus workflows</div>
      <h2 className="mt-2 font-editorial text-2xl font-semibold text-[#0f1e3d]">Share with {GOAL} friends, get 5 advanced AI workflows free.</h2>
      <p className="mt-2 text-[#526078]">When {GOAL} people join using your link, the Bonus Workflow Pack unlocks.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input readOnly value={link} className="flex-1 rounded-lg border border-[#d4def8] bg-[#f7f9ff] px-3 py-2.5 text-sm text-[#0f1e3d]" aria-label="Your referral link" />
        <button type="button" onClick={() => { navigator.clipboard.writeText(link); setCopied(true); }} className="primary-cta inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold"><Copy className="h-4 w-4" />{copied ? "Copied" : "Copy link"}</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-[#2457ff]">
        <a href={`https://twitter.com/intent/tweet?text=${share}`} target="_blank" rel="noopener">Share on X</a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`} target="_blank" rel="noopener">Share on LinkedIn</a>
        <a href={`https://wa.me/?text=${share}`} target="_blank" rel="noopener">WhatsApp</a>
        <a href={`mailto:?subject=${encodeURIComponent("Free AI Work Kit")}&body=${share}`}>Email</a>
      </div>
      <div className="mt-5 h-2.5 rounded-full bg-[#edf2ff]"><div className="h-2.5 rounded-full bg-[#2457ff]" style={{ width: `${Math.min(100, (count / GOAL) * 100)}%` }} /></div>
      <p className="mt-2 text-sm text-[#526078]">{Math.min(count, GOAL)} of {GOAL} friends joined.{" "}
        {count >= GOAL && <Link href={`/bonus?r=${code}`} className="font-bold text-[#2457ff] underline">Open your bonus pack →</Link>}
      </p>
    </div>
  );
}
