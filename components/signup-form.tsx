"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "error";

export function SignupForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, company }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        downloadUrl?: string;
        devFallback?: boolean;
        redirectTo?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(
          data.message ?? "Something went wrong. Please try again in a moment."
        );
        return;
      }

      router.push(data.redirectTo ?? "/thank-you");
    } catch {
      setStatus("error");
      setMessage(
        "We couldn't reach the server. Please check your connection and try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div
        className={
          compact ? "flex flex-col gap-3 sm:flex-row" : "flex flex-col gap-3"
        }
      >
        {!compact && (
          <label className="text-sm font-medium text-[--color-navy-600]">
            First name (optional)
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full rounded-[--radius] border border-[--color-line] bg-[--color-paper] px-4 py-3 text-[--color-navy] placeholder:text-[--color-slate]"
              placeholder="Alex"
            />
          </label>
        )}
        <label className="flex-1 text-sm font-medium text-[--color-navy-600]">
          {!compact && "Email address"}
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-[--radius] border border-[--color-line] bg-[--color-paper] px-4 py-3 text-[--color-navy] placeholder:text-[--color-slate]"
            placeholder="you@example.com"
            aria-label="Email address"
          />
        </label>

        {/* Honeypot — hidden from real users, catches bots */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company">
            Company
            <input
              id="company"
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-[--radius] bg-[--color-brand] px-6 py-3 font-semibold text-white transition-colors hover:bg-[--color-brand-dark] disabled:opacity-60 sm:self-end"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Joining…
            </>
          ) : (
            <>
              Get 25 Free AI Prompts
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-3 text-sm text-[--color-brand-dark]">
          {message}
        </p>
      )}

      <p className="mt-3 text-xs text-[--color-slate]">
        No spam. Unsubscribe anytime. See our{" "}
        <a href="/privacy" className="underline hover:text-[--color-brand]">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
