"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { ArrowRight, Loader2 } from "lucide-react";

function readRef(): string {
  try { return localStorage.getItem("lmtyai_ref") ?? ""; } catch { return ""; }
}

type SignupAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const UTM_FIELDS = [
  { param: "utm_source", key: "utmSource" },
  { param: "utm_medium", key: "utmMedium" },
  { param: "utm_campaign", key: "utmCampaign" },
  { param: "utm_content", key: "utmContent" },
  { param: "utm_term", key: "utmTerm" },
] as const;

function captureUtm(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const attribution: SignupAttribution = {};
    for (const field of UTM_FIELDS) {
      const value = params.get(field.param)?.trim().slice(0, 160);
      if (value) Object.assign(attribution, { [field.key]: value });
    }
    if (Object.values(attribution).some(Boolean)) {
      sessionStorage.setItem("lmtyai_utm", JSON.stringify(attribution));
    }
  } catch {}
}

function readUtm(): SignupAttribution {
  try {
    const parsed = JSON.parse(sessionStorage.getItem("lmtyai_utm") ?? "{}") as Record<string, unknown>;
    return {
      utmSource: typeof parsed.utmSource === "string" ? parsed.utmSource : undefined,
      utmMedium: typeof parsed.utmMedium === "string" ? parsed.utmMedium : undefined,
      utmCampaign: typeof parsed.utmCampaign === "string" ? parsed.utmCampaign : undefined,
      utmContent: typeof parsed.utmContent === "string" ? parsed.utmContent : undefined,
      utmTerm: typeof parsed.utmTerm === "string" ? parsed.utmTerm : undefined,
    };
  } catch {
    return {};
  }
}

type Status = "idle" | "loading" | "error" | "success";

type SignupFormProps = {
  compact?: boolean;
  source?: string;
  buttonLabel?: string;
  onSuccess?: () => void;
  stay?: boolean;
  successMessage?: string;
};

export function SignupForm({
  compact = false,
  source = "website",
  buttonLabel = "Send Me the AI Work Kit",
  onSuccess,
  stay = false,
  successMessage = "You're in. Check your inbox for the next step.",
}: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    captureUtm();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      captureUtm();
      const attribution = readUtm();
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, company, source, ref: readRef(), ...attribution }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; redirectTo?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again in a moment.");
        return;
      }
      try { sessionStorage.setItem("lmtyai_subscriber_email", email); localStorage.setItem("lmtyai_subscribed", "1"); } catch {}
      onSuccess?.();
      track("newsletter_signup", {
        surface: compact ? "compact" : "standard",
        offer: "ai_work_kit",
        source,
        utm_source: attribution.utmSource ?? "none",
        utm_medium: attribution.utmMedium ?? "none",
        utm_campaign: attribution.utmCampaign ?? "none",
        utm_content: attribution.utmContent ?? "none",
      });
      if (!stay) {
        router.push(data.redirectTo ?? "/thank-you");
        return;
      }
      setStatus("success");
      setMessage(successMessage);
      setEmail("");
      setFirstName("");
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Please check your connection and try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className={compact ? "flex flex-col gap-3 sm:flex-row" : "flex flex-col gap-3"}>
        {!compact && (
          <label className="text-sm font-medium text-[--color-navy-600]">
            First name (optional)
            <input type="text" name="firstName" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 w-full rounded-[--radius] border border-[--color-line] bg-[--color-paper] px-4 py-3 text-[--color-navy] placeholder:text-[--color-slate]" placeholder="Alex" />
          </label>
        )}
        <label className="flex-1 text-sm font-medium text-[--color-navy-600]">
          {!compact && "Email address"}
          <input type="email" name="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-[--radius] border border-[--color-line] bg-[--color-paper] px-4 py-3 text-[--color-navy] placeholder:text-[--color-slate]" placeholder="you@example.com" aria-label="Email address" />
        </label>
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company">Company<input id="company" type="text" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} /></label>
        </div>
        <button type="submit" disabled={status === "loading"} className="primary-cta inline-flex items-center justify-center gap-2 rounded-[--radius] px-6 py-3 font-semibold shadow-sm transition-colors disabled:cursor-not-allowed sm:self-end">
          {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Joining…</> : <>{buttonLabel}<ArrowRight className="h-4 w-4" aria-hidden /></>}
        </button>
      </div>
      {status === "error" && <p role="alert" className="mt-3 text-sm text-[--color-brand-dark]">{message}</p>}
      {status === "success" && <p role="status" className="mt-3 text-sm font-semibold text-emerald-700">{message}</p>}
      <p className="mt-3 text-xs text-[--color-slate]">No spam. Unsubscribe anytime. See our <a href="/privacy" className="underline hover:text-[--color-brand]">Privacy Policy</a>.</p>
    </form>
  );
}
