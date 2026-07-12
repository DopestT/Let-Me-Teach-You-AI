import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FlaskConical,
  Hammer,
  ListChecks,
  Sparkles,
  UserRound,
} from "lucide-react";
import { SignupForm } from "@/components/signup-form";

const learn = [
  {
    icon: Compass,
    title: "Start from zero",
    body: "What AI actually is, which tools matter, and how to try them without feeling lost.",
  },
  {
    icon: ListChecks,
    title: "Prompts that work",
    body: "Copy-and-paste prompts for writing, planning, research, and everyday tasks.",
  },
  {
    icon: FlaskConical,
    title: "Test before you trust",
    body: "How to check AI output, spot mistakes, and use it responsibly.",
  },
  {
    icon: Hammer,
    title: "Build small things",
    body: "Simple, useful projects you can finish — no coding background required.",
  },
];

const packBullets = [
  "Written for total beginners",
  "Works with ChatGPT, Gemini, or any chat AI",
  "No fluff, no hype",
];

const audience = [
  {
    icon: Compass,
    title: "Total beginners",
    body: "You feel a step behind on AI — and you just want a clear place to start.",
  },
  {
    icon: Clock,
    title: "Busy people",
    body: "You don't have hours to spare. You want practical wins you can use today.",
  },
  {
    icon: UserRound,
    title: "Curious, non-technical folks",
    body: "No coding, no jargon. Just plain-language lessons that make sense.",
  },
  {
    icon: Sparkles,
    title: "Anyone tired of hype",
    body: "You want honest guidance from a real person, not another loud pitch.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="container-editorial pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[--color-gold-soft] px-3 py-1 text-xs font-semibold text-[--color-gold]">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            A beginner-friendly AI newsletter
          </span>
          <h1 className="mt-5 font-editorial text-4xl font-semibold leading-tight text-[--color-navy] sm:text-5xl">
            Learn AI, one clear step at a time.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[--color-navy-600]">
            We all got hit with AI at the same time. I decided I wasn&apos;t
            going to get left behind — so I started learning, testing, building,
            failing, and figuring out what actually works.{" "}
            <strong className="text-[--color-navy]">
              Now I want to teach you what I know.
            </strong>
          </p>
          <div className="mt-8">
            <Link
              href="#join"
              className="inline-flex items-center rounded-full bg-[--color-brand] px-6 py-3 font-semibold text-white transition-colors hover:bg-[--color-brand-dark]"
            >
              Get 25 Free AI Prompts
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Prompt-pack signup (primary conversion) */}
      <section id="join" className="scroll-mt-24 border-y border-[--color-line] bg-[--color-paper]">
        <div className="container-editorial py-14 sm:py-16">
          <div className="mx-auto max-w-2xl rounded-[--radius] border border-[--color-line] bg-[--color-cream] p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-[--color-brand]">
              Free when you join
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-semibold text-[--color-navy]">
              The 25-Prompt Starter Pack
            </h2>
            <p className="mt-4 leading-relaxed text-[--color-navy-600]">
              Twenty-five prompts you can actually use today — for writing
              clearer emails, planning your week, learning faster, and getting
              real answers instead of vague ones.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-[--color-navy-600]">
              {packBullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2">
                  <CheckCircle2
                    className="h-4 w-4 text-[--color-gold]"
                    aria-hidden
                  />
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <SignupForm />
            </div>
          </div>
        </div>
      </section>

      {/* 3. What readers will learn */}
      <section id="lessons" className="container-editorial py-16 scroll-mt-24">
        <div className="max-w-2xl">
          <h2 className="font-editorial text-3xl font-semibold text-[--color-navy]">
            What you&apos;ll learn
          </h2>
          <p className="mt-3 text-[--color-navy-600]">
            Short, practical lessons in plain language. Read one in a coffee
            break, use it the same day.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {learn.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-[--radius] border border-[--color-line] bg-[--color-paper] p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[--color-brand-soft]">
                <Icon className="h-5 w-5 text-[--color-brand]" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[--color-navy]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[--color-navy-600]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Founder story */}
      <section className="border-t border-[--color-line] bg-[--color-cream-soft]">
        <div className="container-editorial py-16">
          <div className="max-w-2xl">
            <h2 className="font-editorial text-3xl font-semibold text-[--color-navy]">
              Why I&apos;m doing this
            </h2>
            <p className="mt-5 leading-relaxed text-[--color-navy-600]">
              We all got hit with AI at the same time. I wasn&apos;t an expert,
              and I definitely didn&apos;t have it all figured out — but I
              decided I wasn&apos;t going to get left behind. So I started
              learning, testing, building, failing, and slowly figuring out what
              actually works.
            </p>
            <p className="mt-4 leading-relaxed text-[--color-navy-600]">
              Along the way I saw how much noise there is out there — hype,
              jargon, and people promising the world. That&apos;s not me. I want
              to teach you what I know in plain language, one clear step at a
              time, so you can use these tools with confidence too.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Who this is for */}
      <section className="container-editorial py-16">
        <div className="max-w-2xl">
          <h2 className="font-editorial text-3xl font-semibold text-[--color-navy]">
            Who this is for
          </h2>
          <p className="mt-3 text-[--color-navy-600]">
            If any of these sound like you, you&apos;ll feel right at home.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {audience.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-[--radius] border border-[--color-line] bg-[--color-paper] p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[--color-gold-soft]">
                <Icon className="h-5 w-5 text-[--color-gold]" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[--color-navy]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[--color-navy-600]">
                {body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-[--color-slate]">
          Who it&apos;s <strong className="text-[--color-navy-600]">not</strong>{" "}
          for: anyone looking for get-rich-quick schemes or overnight shortcuts.
          This is about learning real, practical skills — not chasing hype.
        </p>
      </section>

      {/* 6. Brand promise */}
      <section className="border-t border-[--color-line] bg-[--color-cream-soft]">
        <div className="container-editorial py-16 text-center">
          <blockquote className="mx-auto max-w-2xl font-editorial text-2xl leading-snug text-[--color-navy]">
            &ldquo;No fake gurus. No get-rich-quick promises. Just a real person
            figuring out AI and sharing what works.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* 7. Final signup call to action */}
      <section className="border-t border-[--color-line] bg-[--color-brand-soft]">
        <div className="container-editorial py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-editorial text-3xl font-semibold text-[--color-navy]">
              Get your 25 free prompts
            </h2>
            <p className="mt-3 text-[--color-navy-600]">
              Join the newsletter and start using AI with confidence today.
            </p>
            <div className="mt-6 text-left">
              <SignupForm compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
