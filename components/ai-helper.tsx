"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  CornerUpLeft,
  Lightbulb,
  Loader2,
  MessageCircleQuestion,
  RotateCw,
  ScrollText,
  Send,
  Sparkles,
  Wand2,
  X,
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

const TASK_BY_ID = Object.fromEntries(TASKS.map((t) => [t.id, t])) as Record<
  Task,
  (typeof TASKS)[number]
>;

type TurnStatus = "pending" | "success" | "error" | "cancelled";

type TurnError = {
  type:
    | "validation"
    | "rate-limit"
    | "service"
    | "timeout"
    | "network"
    | "unknown";
  message: string;
};

type Turn = {
  id: string;
  prompt: string;
  task: Task;
  status: TurnStatus;
  text?: string;
  error?: TurnError;
};

/** Max prompt length — mirrors aiGenerateSchema in lib/validation.ts. */
const MAX_PROMPT = 4000;

type Action =
  | { kind: "add"; turn: Turn }
  | { kind: "resolve"; id: string; text: string }
  | { kind: "fail"; id: string; error: TurnError }
  | { kind: "cancel"; id: string };

// Newest turn first — the request form sits above this list. Each action only
// touches the matching turn, so a later failure never erases an earlier answer.
function reducer(state: Turn[], action: Action): Turn[] {
  switch (action.kind) {
    case "add":
      return [action.turn, ...state];
    case "resolve":
      return state.map((t) =>
        t.id === action.id ? { ...t, status: "success", text: action.text } : t
      );
    case "fail":
      return state.map((t) =>
        t.id === action.id ? { ...t, status: "error", error: action.error } : t
      );
    case "cancel":
      return state.map((t) =>
        t.id === action.id ? { ...t, status: "cancelled" } : t
      );
  }
}

/** Map an HTTP response to a typed, user-safe error. */
function errorForStatus(
  status: number,
  serverMessage?: string,
  retryAfterSeconds?: number
): TurnError {
  if (status === 400 || status === 413 || status === 415)
    return {
      type: "validation",
      message: serverMessage ?? "Please check your input and try again.",
    };
  if (status === 429) {
    const wait =
      retryAfterSeconds && retryAfterSeconds > 0
        ? ` Please wait ${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"} and try again.`
        : " Please wait a moment and try again.";
    return {
      type: "rate-limit",
      message: (serverMessage ?? "You're going a bit fast.") + wait,
    };
  }
  if (status === 504)
    return {
      type: "timeout",
      message:
        serverMessage ?? "That took longer than expected. Please try again.",
    };
  if (status === 502 || status === 503)
    return {
      type: "service",
      message:
        serverMessage ??
        "Our AI helper is taking a break right now. Please try again in a little while.",
    };
  return {
    type: "unknown",
    message: serverMessage ?? "Something went wrong. Please try again in a moment.",
  };
}

export function AiHelper() {
  const [task, setTask] = useState<Task>("general");
  const [prompt, setPrompt] = useState("");
  const [turns, dispatch] = useReducer(reducer, []);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // In-flight request controllers, keyed by turn id, so a turn can be cancelled.
  const controllers = useRef<Map<string, AbortController>>(new Map());
  // Synchronous single-flight guard — closes the race window that a derived
  // `isPending` boolean leaves open between rapid submits.
  const inFlight = useRef(false);

  const active = TASK_BY_ID[task];
  const isPending = turns.some((t) => t.status === "pending");
  const latest = turns[0];
  const liveMessage =
    latest?.status === "pending"
      ? "Generating your answer…"
      : latest?.status === "success"
        ? "Answer ready."
        : "";

  // Abort any in-flight request if the component unmounts (e.g. navigation).
  useEffect(() => {
    const map = controllers.current;
    return () => map.forEach((c) => c.abort());
  }, []);

  /** Restore a prompt into the composer, but only if the user hasn't typed a new one. */
  function restorePrompt(text: string) {
    setPrompt((prev) => (prev.trim() === "" ? text : prev));
  }

  async function submit(rawPrompt: string, submittedTask: Task) {
    const trimmed = rawPrompt.trim();
    if (!trimmed || inFlight.current) return;
    inFlight.current = true;

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${turns.length}`;
    const controller = new AbortController();
    controllers.current.set(id, controller);

    dispatch({
      kind: "add",
      turn: { id, prompt: trimmed, task: submittedTask, status: "pending" },
    });

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, task: submittedTask }),
        signal: controller.signal,
      });
      // Parse defensively — a proxy or error page may return HTML, not JSON.
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        text?: string;
        message?: string;
      };

      // Ignore late responses from a request that was aborted meanwhile.
      if (controller.signal.aborted) return;

      if (!res.ok || !data.ok || !data.text) {
        const retryAfter = Number(res.headers.get("Retry-After") ?? "");
        const error = errorForStatus(
          res.status,
          data.message,
          Number.isFinite(retryAfter) ? retryAfter : undefined
        );
        dispatch({ kind: "fail", id, error });
        restorePrompt(trimmed);
        return;
      }
      dispatch({ kind: "resolve", id, text: data.text });
    } catch (err) {
      // A cancelled request already has its status set — don't overwrite it.
      if (controller.signal.aborted) return;
      dispatch({
        kind: "fail",
        id,
        error: {
          type: "network",
          message:
            "We couldn't reach the server. Please check your connection and try again.",
        },
      });
      restorePrompt(trimmed);
    } finally {
      controllers.current.delete(id);
      inFlight.current = false;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current || prompt.trim().length === 0) return;
    const current = prompt;
    setPrompt("");
    void submit(current, task);
  }

  function cancel(id: string) {
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    inFlight.current = false;
    dispatch({ kind: "cancel", id });
  }

  /** Copy an answer into the composer as reference for a brand-new question. */
  function useAnswer(text: string) {
    const context = `Here's an earlier answer for reference:\n"""\n${text}\n"""\n\nMy follow-up: `;
    setPrompt(context.slice(0, MAX_PROMPT));
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
      }
    });
  }

  return (
    <div className="rounded-[--radius] border border-[--color-line] bg-[--color-paper] shadow-sm">
      {/* Screen-reader status — announces pending/ready without reading whole answers. */}
      <p role="status" aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      {/* Request form (task presets + composer) */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5">
        <fieldset>
          <legend className="text-sm font-medium text-[--color-navy-600]">
            What would you like help with?
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TASKS.map(({ id, label, icon: Icon }) => {
              const selected = id === task;
              return (
                <label
                  key={id}
                  className={
                    "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[--color-brand] " +
                    (selected
                      ? "bg-[--color-brand] text-white"
                      : "bg-[--color-cream] text-[--color-navy-600] hover:bg-[--color-brand-soft]")
                  }
                >
                  <input
                    type="radio"
                    name="task"
                    value={id}
                    checked={selected}
                    onChange={() => setTask(id)}
                    className="sr-only"
                  />
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <label
          htmlFor="ai-prompt"
          className="mt-4 block text-sm font-medium text-[--color-navy-600]"
        >
          Your question
        </label>
        <textarea
          id="ai-prompt"
          ref={textareaRef}
          value={prompt}
          maxLength={MAX_PROMPT}
          aria-describedby="ai-help ai-count"
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit(e);
            }
          }}
          rows={3}
          placeholder={active.placeholder}
          className="mt-1 w-full resize-y rounded-[--radius] border border-[--color-line] bg-[--color-paper] px-4 py-3 text-[--color-navy] placeholder:text-[--color-slate]"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p id="ai-help" className="max-w-md text-xs text-[--color-slate]">
            {active.hint} Every question is answered independently — this helper
            doesn&apos;t remember earlier ones. Press{" "}
            <kbd className="rounded border border-[--color-line] bg-[--color-cream] px-1.5 py-0.5 font-sans text-[0.7rem]">
              ⌘/Ctrl + Enter
            </kbd>{" "}
            to send.
          </p>
          <div className="flex items-center gap-3">
            <span id="ai-count" className="text-xs tabular-nums text-[--color-slate]">
              {prompt.length}/{MAX_PROMPT}
            </span>
            <button
              type="submit"
              disabled={isPending || prompt.trim().length === 0}
              className="inline-flex shrink-0 items-center gap-2 rounded-[--radius] bg-[--color-brand] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[--color-brand-dark] disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden />
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
        </div>
      </form>

      {/* Results from this session */}
      {turns.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border-t border-[--color-line] px-5 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[--color-gold-soft]">
            <Sparkles className="h-6 w-6 text-[--color-gold]" aria-hidden />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[--color-slate]">
            Pick an option above, type a question, and try it out — no account
            needed. Your results from this session will appear here.
          </p>
        </div>
      ) : (
        <section
          aria-label="Results from this session"
          className="max-h-[30rem] space-y-4 overflow-y-auto border-t border-[--color-line] bg-[--color-cream] p-4 sm:p-5"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[--color-slate]">
            Results from this session
          </h3>
          {turns.map((turn) => (
            <ResultCard
              key={turn.id}
              turn={turn}
              onCancel={() => cancel(turn.id)}
              onRetry={() => submit(turn.prompt, turn.task)}
              onUseAnswer={() => turn.text && useAnswer(turn.text)}
              retryDisabled={isPending}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function ResultCard({
  turn,
  onCancel,
  onRetry,
  onUseAnswer,
  retryDisabled,
}: {
  turn: Turn;
  onCancel: () => void;
  onRetry: () => void;
  onUseAnswer: () => void;
  retryDisabled: boolean;
}) {
  const preset = TASK_BY_ID[turn.task];
  const Icon = preset.icon;

  return (
    <article className="rounded-[--radius] border border-[--color-line] bg-[--color-paper] p-4 shadow-sm">
      {/* Header: task badge + status label */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[--color-brand-soft] px-2.5 py-1 text-xs font-semibold text-[--color-brand-dark]">
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {preset.label}
        </span>
        {turn.status === "success" && (
          <span className="text-xs font-medium text-[--color-slate]">
            Independent answer
          </span>
        )}
        {turn.status === "cancelled" && (
          <span className="text-xs font-medium text-[--color-slate]">
            Cancelled
          </span>
        )}
      </div>

      {/* The question */}
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[--color-slate]">
          You asked
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[--color-navy-600] whitespace-pre-wrap">
          {turn.prompt}
        </p>
      </div>

      {/* The result */}
      <div className="mt-3 border-t border-[--color-line] pt-3">
        {turn.status === "pending" && (
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm text-[--color-slate]">
              <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden />
              Thinking…
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 rounded-[--radius] border border-[--color-line] px-3 py-1.5 text-xs font-medium text-[--color-navy-600] transition-colors hover:bg-[--color-cream]"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Cancel
            </button>
          </div>
        )}

        {turn.status === "success" && (
          <>
            <p className="text-sm leading-relaxed text-[--color-navy] whitespace-pre-wrap">
              {turn.text}
            </p>
            <button
              type="button"
              onClick={onUseAnswer}
              className="mt-3 inline-flex items-center gap-1.5 rounded-[--radius] border border-[--color-line] px-3 py-1.5 text-xs font-medium text-[--color-brand] transition-colors hover:bg-[--color-brand-soft]"
            >
              <CornerUpLeft className="h-3.5 w-3.5" aria-hidden />
              Use this answer in a new request
            </button>
          </>
        )}

        {turn.status === "error" && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p role="alert" className="text-sm text-[--color-brand-dark]">
              {turn.error?.message}
            </p>
            <button
              type="button"
              onClick={onRetry}
              disabled={retryDisabled}
              className="inline-flex items-center gap-1.5 rounded-[--radius] border border-[--color-line] px-3 py-1.5 text-xs font-medium text-[--color-navy-600] transition-colors hover:bg-[--color-cream] disabled:opacity-60"
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden />
              Try again
            </button>
          </div>
        )}

        {turn.status === "cancelled" && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[--color-slate]">
              You cancelled this request.
            </p>
            <button
              type="button"
              onClick={onRetry}
              disabled={retryDisabled}
              className="inline-flex items-center gap-1.5 rounded-[--radius] border border-[--color-line] px-3 py-1.5 text-xs font-medium text-[--color-navy-600] transition-colors hover:bg-[--color-cream] disabled:opacity-60"
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden />
              Try again
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
