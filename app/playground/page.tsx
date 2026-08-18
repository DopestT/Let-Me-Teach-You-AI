import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AiHelper } from "@/components/ai-helper";

export const metadata: Metadata = {
  title: "AI Helper",
  description:
    "A free, beginner-friendly AI helper — ask a question, improve a prompt, summarize text, or get a quick lesson.",
};

export default function PlaygroundPage() {
  return (
    <div className="container-editorial py-16 max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
        <Link href="/#lab" className="inline-flex items-center gap-2 text-[--color-brand] hover:text-[--color-brand-dark]">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to AI Lab
        </Link>
        <Link href="/build/ai-workflow-from-plain-english" className="inline-flex items-center gap-2 text-[--color-navy-600] hover:text-[--color-brand]">
          See a build guide
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <h1 className="font-editorial text-4xl font-semibold text-[--color-navy]">
        Try the AI helper
      </h1>
      <p className="mt-3 leading-relaxed text-[--color-navy-600]">
        A friendly, honest AI teacher you can try right here — no account, no
        sign-up. Ask a beginner question, sharpen a prompt, summarize something
        you paste, or get a short lesson on a topic.
      </p>
      <div className="mt-8">
        <AiHelper />
      </div>
      <div className="mt-8 rounded-2xl border border-[--color-line] bg-[--color-cream-soft] p-5 text-sm leading-relaxed text-[--color-slate]">
        Like this? The{" "}
        <Link href="/#join" className="font-semibold underline hover:text-[--color-brand]">
          free newsletter
        </Link>{" "}
        goes deeper — plain-language lessons and prompts you can use the same
        day. Or go back to the{" "}
        <Link href="/#lab" className="font-semibold underline hover:text-[--color-brand]">
          AI Lab
        </Link>{" "}
        to choose another project.
      </div>
    </div>
  );
}
