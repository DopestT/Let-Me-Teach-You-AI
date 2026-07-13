import type { Metadata } from "next";
import Link from "next/link";
import { AiHelper } from "@/components/ai-helper";

export const metadata: Metadata = {
  title: "AI Helper",
  description:
    "A free, beginner-friendly AI helper — ask a question, improve a prompt, summarize text, or get a quick lesson.",
};

export default function PlaygroundPage() {
  return (
    <div className="container-editorial py-16 max-w-3xl">
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
      <p className="mt-6 text-sm leading-relaxed text-[--color-slate]">
        Like this? The{" "}
        <Link href="/#join" className="underline hover:text-[--color-brand]">
          free newsletter
        </Link>{" "}
        goes deeper — plain-language lessons and prompts you can use the same
        day. No hype, no get-rich-quick promises.
      </p>
    </div>
  );
}
