import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import { seoGuides } from "@/lib/seo-guides";

const SITE_URL = "https://www.letmeteachyouai.com/guides";

export const metadata: Metadata = {
  title: "Practical AI Guides for Beginners",
  description: "Practical AI guides for beginners covering AI automation, workflows, agents, ChatGPT for business, n8n, Make, and small AI business ideas.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Practical AI Guides for Beginners · Let Me Teach You AI",
    description: "Learn AI by building useful things: workflows, automations, agents, and small business systems.",
  },
};

export default function GuidesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Let Me Teach You AI beginner guides",
    itemListElement: seoGuides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.letmeteachyouai.com/guides/${guide.slug}`,
      name: guide.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <header className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-14 sm:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ccd8f2] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#3158b5]">
              <Sparkles className="h-3.5 w-3.5" /> Practical AI guides
            </div>
            <h1 className="mt-5 font-editorial text-5xl font-semibold leading-[1.02] tracking-[-.04em] text-[#0c1d3f] sm:text-7xl">
              Learn AI by building things that actually work.
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[#536177]">
              No giant theory dump. Start with a useful outcome, follow the workflow, and leave with something you can test in the real world.
            </p>
          </div>
        </div>
      </header>

      <main className="bg-[#fbfaf7]">
        <section className="container-editorial py-12 sm:py-16">
          <div className="grid gap-4 lg:grid-cols-2">
            {seoGuides.map((guide, index) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-3xl border border-[#dfe6f0] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9fb5ef] hover:shadow-md sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#edf2ff] text-sm font-bold text-[#2457ff]">{index + 1}</span>
                    <span className="text-xs font-bold uppercase tracking-[.12em] text-[#6a7da3]">{guide.eyebrow}</span>
                  </div>
                  <BookOpen className="h-5 w-5 text-[#8aa0c5]" />
                </div>
                <h2 className="mt-5 font-editorial text-2xl font-semibold leading-tight text-[#10234a] group-hover:text-[#2457ff] sm:text-3xl">
                  {guide.title}
                </h2>
                <p className="mt-3 leading-7 text-[#5a6980]">{guide.description}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6a7da3]">
                    <Search className="h-3.5 w-3.5" /> {guide.primaryKeyword}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-[#3158b5]">Read guide <ArrowRight className="h-4 w-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-[#dfe6f0] bg-[#f5f7fc]">
          <div className="container-editorial py-12 sm:py-16">
            <div className="rounded-[2rem] border border-[#20345f] bg-[#07152f] p-8 text-white shadow-[0_26px_70px_rgba(7,21,47,.12)] sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8fb0ff]">From reading to building</p>
              <h2 className="mt-3 max-w-3xl font-editorial text-3xl font-semibold sm:text-4xl">Use the free lessons when you are ready to build a complete project.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#c8d5ea]">The guides answer one search question at a time. The learning paths connect those skills into an actual build.</p>
              <Link href="/learn" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#0c1d3f] hover:bg-[#eef3ff]">
                Browse free lessons <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
