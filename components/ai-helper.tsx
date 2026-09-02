"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  ArrowUp,
  Check,
  CornerUpLeft,
  Lightbulb,
  Loader2,
  MessageCircleQuestion,
  RotateCw,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";

/** Task presets — mirror the server's SYSTEM_PROMPTS in app/api/openai/route.ts. */
type Task = "general" | "prompt-help" | "summarize" | "lesson";

type Starter = {
  label: string;
  prompt: string;
};

const TASKS: {
  id: Task;
  label: string;
  description: string;
  icon: typeof Sparkles;
  inputLabel: string;
  placeholder: string;
  hint: string;
  starters: Starter[];
}[] = [
  {
    id: "general",
    label: "Ask anything",
    description: "Get a clear answer",
    icon: MessageCircleQuestion,
    inputLabel: "What are you trying to understand?",
    placeholder:
      "Ask in your own words — for example, “What is an AI agent, and what could it do for my business?”",
    hint: "A plain-language answer without unnecessary jargon.",
    starters: [
      {
        label: "Chatbot vs. AI agent",
        prompt:
          "What is the difference between an AI chatbot and an AI agent? Explain it with a simple real-life example.",
      },
      {
        label: "Choose the right AI tool",
        prompt:
          "Help me choose the right kind of AI tool for a repetitive task. Ask me only the questions you need first.",
      },
      {
        label: "Turn an idea into steps",
        prompt:
          "I have a rough idea but I am not sure where to start. Help me turn it into a small, practical first project.",
      },
    ],
  },
  {
    id: "prompt-help",
    label: "Improve a prompt",
    description: "Make your request stronger",
    icon: Wand2,
    inputLabel: "What prompt should we improve?",
    placeholder:
      "Paste your prompt here. Add what you want the answer to accomplish if you know it.",
    hint: "Get a clearer prompt plus a quick explanation of what changed.",
    starters: [
      {
        label: "Rewrite my prompt",
        prompt:
          "Improve this prompt so it gives me a specific, useful answer:\n\n[Paste your prompt here]\n\nThe result should help me: [describe your goal].",
      },
      {
        label: "Build a reusable template",
        prompt:
          "Turn this rough request into a reusable prompt template with blanks I can fill in:\n\n[Paste your request here]",
      },
      {
        label: "Make the output clearer",
        prompt:
          "Rewrite this prompt so the answer is concise, practical, and returned as a step-by-step plan:\n\n[Paste your prompt here]",
      },
    ],
  },
  {
    id: "summarize",
    label: "Summarize text",
    description: "Find the important point",
    icon: ScrollText,
    inputLabel: "What should we simplify?",
    placeholder:
      "Paste the article, notes, email, or other text you want summarized.",
    hint: "A faithful summary that separates the main point from the details.",
    starters: [
      {
        label: "Five useful bullets",
        prompt:
          "Summarize the text below in five useful bullets, then give me the single most important takeaway:\n\n[Paste text here]",
      },
      {
        label: "Explain it simply",
        prompt:
          "Explain this text in plain language for someone who knows nothing about the topic. Do not add facts that are not in the source:\n\n[Paste text here]",
      },
      {
        label: "Turn notes into actions",
        prompt:
          "Summarize these notes, separate decisions from open questions, and list the next actions:\n\n[Paste notes here]",
      },
    ],
  },
  {
    id: "lesson",
    label: "Teach me a topic",
    description: "Learn it step by step",
    icon: Lightbulb,
    inputLabel: "What do you want to learn?",
    placeholder:
      "Name a topic — for example, “Teach me how AI image generators work.”",
    hint: "A short lesson, a simple example, and one next step to try.",
    starters: [
      {
        label: "How AI agents work",
        prompt:
          "Teach me how AI agents work using one simple real-life example. Assume I am a complete beginner.",
      },
      {
        label: "Automation basics",
        prompt:
          "Teach me the difference between a trigger, an action, and an approval step in an automation.",
      },
      {
        label: "Better AI instructions",
        prompt:
          "Teach me the five parts of a strong AI request. Show a weak example and a better version.",
      },
    ],
  },
];

const TASK_BY_ID = Object.fromEntries(TASKS.map((item) => [item.id, item])) as Record<
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

// Newest turn first. Each action only touches its matching turn, so a later
// failure never erases an earlier answer.
function reducer(state: Turn[], action: Action): Turn[] {
  switch (action.kind) {
    case "add":
      return [action.turn, ...state];
    case "resolve":
      return state.map((turn) =>
        turn.id === action.id
          ? { ...turn, status: "success", text: action.text }
          : turn
      );
    case "fail":
      return state.map((turn) =>
        turn.id === action.id
          ? { ...turn, status: "error", error: action.error }
          : turn
      );
    case "cancel":
      return state.map((turn) =>
        turn.id === action.id ? { ...turn, status: "cancelled" } : turn
      );
  }
}

/** Map an HTTP response to a typed, user-safe error. */
function errorForStatus(
  status: number,
  serverMessage?: string,
  retryAfterSeconds?: number
): TurnError {
  if (status === 400 || status === 413 || status === 415) {
    return {
      type: "validation",
      message: serverMessage ?? "Please check your input and try again.",
    };
  }
  if (status === 429) {
    const wait =
      retryAfterSeconds && retryAfterSeconds > 0
        ? " Please wait " +
          retryAfterSeconds +
          " second" +
          (retryAfterSeconds === 1 ? "" : "s") +
          " and try again."
        : " Please wait a moment and try again.";
    return {
      type: "rate-limit",
      message: (serverMessage ?? "You're going a bit fast.") + wait,
    };
  }
  if (status === 504) {
    return {
      type: "timeout",
      message:
        serverMessage ?? "That took longer than expected. Please try again.",
    };
  }
  if (status === 502 || status === 503) {
    return {
      type: "service",
      message:
        serverMessage ??
        "Our AI helper is taking a break right now. Please try again in a little while.",
    };
  }
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
  const controllers = useRef<Map<string, AbortController>>(new Map());
  const inFlight = useRef(false);

  const active = TASK_BY_ID[task];
  const isPending = turns.some((turn) => turn.status === "pending");
  const latest = turns[0];
  const liveMessage =
    latest?.status === "pending"
      ? "Generating your answer…"
      : latest?.status === "success"
        ? "Answer ready."
        : "";

  useEffect(() => {
    const map = controllers.current;
    return () => map.forEach((controller) => controller.abort());
  }, []);

  function focusComposer() {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });
  }

  function chooseStarter(starter: Starter) {
    setPrompt(starter.prompt.slice(0, MAX_PROMPT));
    focusComposer();
  }

  /** Restore a prompt only if the user has not already started another one. */
  function restorePrompt(text: string) {
    setPrompt((current) => (current.trim() === "" ? text : current));
  }

  async function submit(rawPrompt: string, submittedTask: Task) {
    const trimmed = rawPrompt.trim();
    if (!trimmed || inFlight.current) return;
    inFlight.current = true;

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now() + "-" + turns.length;
    const controller = new AbortController();
    controllers.current.set(id, controller);

    dispatch({
      kind: "add",
      turn: { id, prompt: trimmed, task: submittedTask, status: "pending" },
    });

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, task: submittedTask }),
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        text?: string;
        message?: string;
      };

      if (controller.signal.aborted) return;

      if (!response.ok || !data.ok || !data.text) {
        const retryAfter = Number(response.headers.get("Retry-After") ?? "");
        dispatch({
          kind: "fail",
          id,
          error: errorForStatus(
            response.status,
            data.message,
            Number.isFinite(retryAfter) ? retryAfter : undefined
          ),
        });
        restorePrompt(trimmed);
        return;
      }
      dispatch({ kind: "resolve", id, text: data.text });
    } catch {
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
      // A replacement request may have started just after this one was
      // cancelled. Keep the guard active while any controller remains.
      inFlight.current = controllers.current.size > 0;
    }
  }

  function sendCurrentPrompt() {
    if (inFlight.current || prompt.trim().length === 0) return;
    const current = prompt;
    setPrompt("");
    void submit(current, task);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendCurrentPrompt();
  }

  function cancel(id: string) {
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    inFlight.current = controllers.current.size > 0;
    dispatch({ kind: "cancel", id });
  }

  /** Put an earlier answer into the composer as context for a new request. */
  function useAnswer(text: string) {
    const context = [
      "Here is an earlier answer for reference:",
      "\"\"\"",
      text,
      "\"\"\"",
      "",
      "My follow-up: ",
    ].join("\n");
    setPrompt(context.slice(0, MAX_PROMPT));
    focusComposer();
  }

  return (
    <section className="ai-workspace overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_28px_80px_rgba(15,30,61,0.24)]">
      <div className="relative z-10">
        <p role="status" aria-live="polite" className="sr-only">
          {liveMessage}
        </p>

        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-white sm:px-7">
          <div className="flex items-center gap-3">
            <div className="ai-signal flex h-10 w-10 items-center justify-center rounded-2xl">
              <Sparkles className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div>
              <p className="font-editorial text-lg font-semibold">LMTYAI Helper</p>
              <p className="text-xs text-blue-100/70">Plain-language AI guidance</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.95)]" />
            Ready when you are
          </div>
        </header>

        <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-7 sm:py-8">
          <fieldset>
            <legend className="text-sm font-semibold text-blue-100">
              Choose the kind of help you want
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
              {TASKS.map(({ id, label, description, icon: Icon }) => {
                const selected = id === task;
                return (
                  <label
                    key={id}
                    className={
                      "group cursor-pointer rounded-2xl border p-3 text-left transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white sm:p-4 " +
                      (selected
                        ? "border-white bg-white text-[--color-navy] shadow-lg shadow-blue-950/20"
                        : "border-white/15 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/[0.1]")
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
                    <span
                      className={
                        "flex h-9 w-9 items-center justify-center rounded-xl " +
                        (selected
                          ? "bg-[--color-brand-soft] text-[--color-brand]"
                          : "bg-white/10 text-blue-100")
                      }
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="mt-3 block text-sm font-bold">{label}</span>
                    <span
                      className={
                        "mt-1 hidden text-xs leading-relaxed sm:block " +
                        (selected ? "text-[--color-slate]" : "text-blue-100/65")
                      }
                    >
                      {description}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5 rounded-3xl bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-3">
            <label
              htmlFor="ai-prompt"
              className="block px-3 pt-2 text-xs font-bold uppercase tracking-[0.13em] text-[--color-brand]"
            >
              {active.inputLabel}
            </label>
            <textarea
              id="ai-prompt"
              ref={textareaRef}
              value={prompt}
              maxLength={MAX_PROMPT}
              aria-describedby="ai-help ai-count"
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  sendCurrentPrompt();
                }
              }}
              rows={5}
              placeholder={active.placeholder}
              className="min-h-40 w-full resize-y border-0 bg-transparent px-3 py-4 text-base leading-relaxed text-[--color-navy] outline-none placeholder:text-[--color-slate]/70 focus-visible:outline-none sm:text-lg"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[--color-line] px-2 pt-3 sm:px-3">
              <div className="flex items-center gap-2 text-xs text-[--color-slate]">
                <ShieldCheck className="h-4 w-4 text-[--color-brand]" aria-hidden />
                <span id="ai-help">{active.hint}</span>
              </div>
              <div className="flex items-center gap-3">
                <span id="ai-count" className="text-xs tabular-nums text-[--color-slate]">
                  {prompt.length}/{MAX_PROMPT}
                </span>
                <button
                  type="submit"
                  disabled={isPending || prompt.trim().length === 0}
                  className="primary-cta inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 py-2.5 font-semibold shadow-lg shadow-blue-900/20 transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden />
                      Thinking…
                    </>
                  ) : (
                    <>
                      Help me
                      <ArrowUp className="h-4 w-4" aria-hidden />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {prompt.length === 0 ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100/60">
                Or start with an example
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {active.starters.map((starter) => (
                  <button
                    key={starter.label}
                    type="button"
                    onClick={() => chooseStarter(starter)}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-left text-xs font-medium text-blue-50 transition-colors hover:border-white/30 hover:bg-white/[0.12] sm:text-sm"
                  >
                    {starter.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <p className="mt-5 text-center text-xs text-blue-100/55">
            No account. No saved prompt history. Press ⌘/Ctrl + Enter to send.
          </p>
        </form>

        {turns.length === 0 ? (
          <div className="border-t border-white/10 bg-[#07152f]/70 px-5 py-7 text-center text-blue-50 sm:px-7">
            <p className="font-editorial text-xl font-semibold">
              It does not have to be a perfect prompt.
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-blue-100/65">
              Begin with what you know. The helper will give you a useful answer
              without assuming you already speak “AI.”
            </p>
          </div>
        ) : (
          <section
            aria-label="Results from this session"
            className="max-h-[44rem] space-y-5 overflow-y-auto border-t border-white/10 bg-[--color-cream-soft] p-5 sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-editorial text-xl font-semibold text-[--color-navy]">
                Your workspace
              </h2>
              <span className="text-xs font-medium text-[--color-slate]">
                Newest answer first
              </span>
            </div>
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
    </section>
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
    <article className="overflow-hidden rounded-3xl border border-[--color-line] bg-white shadow-sm">
      <div className="bg-[--color-navy] px-4 py-4 text-white sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-100">
            <Icon className="h-4 w-4" aria-hidden />
            {preset.label}
          </span>
          {turn.status === "success" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-200">
              <Check className="h-3.5 w-3.5" aria-hidden />
              Answer ready
            </span>
          ) : null}
          {turn.status === "cancelled" ? (
            <span className="text-xs font-medium text-blue-100/70">Cancelled</span>
          ) : null}
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/90">
          {turn.prompt}
        </p>
      </div>

      <div className="p-4 sm:p-5">
        {turn.status === "pending" ? (
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-3 text-sm font-medium text-[--color-slate]">
              <span className="ai-signal flex h-9 w-9 items-center justify-center rounded-xl">
                <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden />
              </span>
              Working through your request…
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 rounded-full border border-[--color-line] px-3 py-1.5 text-xs font-semibold text-[--color-navy-600] transition-colors hover:bg-[--color-cream]"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Cancel
            </button>
          </div>
        ) : null}

        {turn.status === "success" ? (
          <>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[--color-brand]">
              <Sparkles className="h-4 w-4" aria-hidden />
              LMTYAI answer
            </div>
            <p className="mt-3 whitespace-pre-wrap text-[0.95rem] leading-7 text-[--color-navy]">
              {turn.text}
            </p>
            <button
              type="button"
              onClick={onUseAnswer}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[--color-line] px-4 py-2 text-xs font-semibold text-[--color-brand] transition-colors hover:bg-[--color-brand-soft]"
            >
              <CornerUpLeft className="h-3.5 w-3.5" aria-hidden />
              Ask a follow-up with this answer
            </button>
          </>
        ) : null}

        {turn.status === "error" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p role="alert" className="text-sm text-[--color-brand-dark]">
              {turn.error?.message}
            </p>
            <button
              type="button"
              onClick={onRetry}
              disabled={retryDisabled}
              className="inline-flex items-center gap-1.5 rounded-full border border-[--color-line] px-3 py-1.5 text-xs font-semibold text-[--color-navy-600] transition-colors hover:bg-[--color-cream] disabled:opacity-60"
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden />
              Try again
            </button>
          </div>
        ) : null}

        {turn.status === "cancelled" ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[--color-slate]">You cancelled this request.</p>
            <button
              type="button"
              onClick={onRetry}
              disabled={retryDisabled}
              className="inline-flex items-center gap-1.5 rounded-full border border-[--color-line] px-3 py-1.5 text-xs font-semibold text-[--color-navy-600] transition-colors hover:bg-[--color-cream] disabled:opacity-60"
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden />
              Try again
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
