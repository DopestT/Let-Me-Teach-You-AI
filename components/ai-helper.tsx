"use client";

import { useEffect, useRef, useState } from "react";
import {
  Lightbulb,
  Loader2,
  MessageCircleQuestion,
  ScrollText,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";

/** Task presets — mirror the server's SYSTEM_PROMPTS in app/api/openai/route.ts. */
type Task = "general" | "prompt-help" | "summarize" | "lesson";

const TASKS: {
  id: Task;
  label: string;
  icon: typeof Sparkles;
  placeholder: string;
  hint: string;
}[] = [
  {
    id: "general",
    label: "Ask anything",
    icon: MessageCircleQuestion,
    placeholder: "Ask a beginner AI question — e.g. “What is a large language model?”",
    hint: "A plain-language answer to any AI question.",
  },
  {
    id: "prompt-help",
    label: "Improve a prompt",
    icon: Wand2,
    placeholder: "Paste a prompt you're working on and I'll help you sharpen it.",
    hint: "Get a clearer, more effective version of your prompt.",
  },
  {
    id: "summarize",
    label: "Summarize text",
    icon: ScrollText,
    placeholder: "Paste some text and I'll summarize it simply.",
    hint: "A faithful, beginner-friendly summary of what you paste.",
  },
  {
    id: "lesson",
    label: "Teach me a topic",
    icon: Lightbulb,
    placeholder: "Name a topic — e.g. “How do AI image generators work?”",
    hint: "A short, structured mini-lesson with a next step to try.",
  },
];

type Turn = {
  id: number;
  task: Task;
  prompt: string;
  /** null while the answer is loading. */
  answer: string | null;
  error?: string;
};

/** Max prompt length — mirrors aiGenerateSchema in lib/validation.ts. */
const MAX_PROMPT = 4000;

export function AiHelper() {
  const [task, setTask] = useState<Task>("general");
  const [prompt, setPrompt] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const idRef = useRef(0);
  const threadRef = useRef<HTMLDivElement>(null);

  const active = TASKS.find((t) => t.id === task) ?? TASKS[0];

  // Keep the newest turn in view as answers arrive.
  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    const id = ++idRef.current;
    const submittedTask = task;
    setTurns((prev) => [
      ...prev,
      { id, task: submittedTask, prompt: trimmed, answer: null },
    ]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, task: submittedTask }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        text?: string;
        message?: string;
      };

      if (!res.ok || !data.ok || !data.text) {
        updateTurn(id, {
          error:
            data.message ??
            "Something went wrong. Please try again in a moment.",
        });
        return;
      }
      updateTurn(id, { answer: data.text });
    } catch {
      updateTurn(id, {
        error:
          "We couldn't reach the server. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function updateTurn(id: number, patch: Partial<Turn>) {
    setTurns((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  }

  return (
    <div className="rounded-[--radius] border border-[--color-line] bg-[--color-paper] shadow-sm">
      {/* Task presets */}
      <div
        role="tablist"
        aria-label="Choose what you'd like help with"
        className="flex flex-wrap gap-2 border-b border-[--color-line] p-4"
      >
        {TASKS.map(({ id, label, icon: Icon }) => {
          const selected = id === task;
          return (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setTask(id)}
              className={
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                (selected
                  ? "bg-[--color-brand] text-white"
                  : "bg-[--color-cream] text-[--color-navy-600] hover:bg-[--color-brand-soft]")
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      {/* Conversation thread */}
      <div
        ref={threadRef}
        className="max-h-[26rem] min-h-[10rem] space-y-6 overflow-y-auto p-5"
        aria-live="polite"
      >
        {turns.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[--color-gold-soft]">
              <Sparkles className="h-6 w-6 text-[--color-gold]" aria-hidden />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[--color-slate]">
              {active.hint} Pick an option above, type below, and try it out —
              no account needed.
            </p>
          </div>
        ) : (
          turns.map((turn) => (
            <div key={turn.id} className="space-y-3">
              {/* User prompt */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-[--radius] rounded-br-sm bg-[--color-brand] px-4 py-3 text-sm leading-relaxed text-white whitespace-pre-wrap">
                  {turn.prompt}
                </div>
              </div>
              {/* Assistant answer */}
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-[--radius] rounded-bl-sm border border-[--color-line] bg-[--color-cream] px-4 py-3 text-sm leading-relaxed text-[--color-navy] whitespace-pre-wrap">
                  {turn.answer !== null ? (
                    turn.answer
                  ) : turn.error ? (
                    <span className="text-[--color-brand-dark]">
                      {turn.error}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-[--color-slate]">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Thinking…
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-[--color-line] p-4"
      >
        <label htmlFor="ai-prompt" className="sr-only">
          Your message
        </label>
        <textarea
          id="ai-prompt"
          value={prompt}
          maxLength={MAX_PROMPT}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit(e);
            }
          }}
          rows={3}
          placeholder={active.placeholder}
          className="w-full resize-y rounded-[--radius] border border-[--color-line] bg-[--color-paper] px-4 py-3 text-[--color-navy] placeholder:text-[--color-slate]"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs text-[--color-slate]">
            Each question is answered on its own — this helper doesn&apos;t
            remember previous messages. Press{" "}
            <kbd className="rounded border border-[--color-line] bg-[--color-cream] px-1.5 py-0.5 font-sans text-[0.7rem]">
              ⌘/Ctrl + Enter
            </kbd>{" "}
            to send.
          </p>
          <button
            type="submit"
            disabled={loading || prompt.trim().length === 0}
            className="inline-flex shrink-0 items-center gap-2 rounded-[--radius] bg-[--color-brand] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[--color-brand-dark] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden />
                Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
