"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "Thanks — we'll be in touch.");
    } catch {
      setStatus("error");
      setMessage("We couldn't send your message. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[--radius] border border-[--color-brand-soft] bg-[--color-brand-soft] p-6 text-[--color-navy]">
        {message}
      </div>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-[--radius] border border-[--color-line] bg-[--color-paper] px-4 py-3 text-[--color-navy] placeholder:text-[--color-slate]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <label className="block text-sm font-medium text-[--color-navy-600]">
        Name
        <input name="name" required className={inputClass} placeholder="Your name" />
      </label>
      <label className="block text-sm font-medium text-[--color-navy-600]">
        Email
        <input
          type="email"
          name="email"
          required
          className={inputClass}
          placeholder="you@example.com"
        />
      </label>
      <label className="block text-sm font-medium text-[--color-navy-600]">
        Message
        <textarea
          name="message"
          required
          rows={5}
          className={inputClass}
          placeholder="How can we help?"
        />
      </label>
      {status === "error" && (
        <p role="alert" className="text-sm text-[--color-brand-dark]">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-[--radius] bg-[--color-brand] px-6 py-3 font-semibold text-white transition-colors hover:bg-[--color-brand-dark] disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
