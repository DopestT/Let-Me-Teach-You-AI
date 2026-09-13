import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Search, Sparkles } from "lucide-react";
import { getSeoGuide, seoGuides } from "@/lib/seo-guides";

const SITE_URL = "https://www.letmeteachyouai.com";

export function generateStaticParams() {
  return seoGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getSeoGuide(slug);
  if (!guide) return {};

  const url = `${SITE_URL}/guides/${guide.slug}`;
  return {
    title: guide.seoTitle,
    description: guide.description,
    keywords: [guide.primaryKeyword, "learn AI", "AI for beginners", "AI automation"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: guide.seoTitle,
      description: guide.description,
      siteName: "Let Me Teach You AI",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seoTitle,
      description: guide.description,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getSeoGuide(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((relatedSlug) => getSeoGuide(relatedSlug))
    .filter(Boolean);
  const canonicalUrl = `${SITE_URL}/guides/${guide.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    author: { "@type": "Organization", name: "Let Me Teach You AI" },
    publisher: { "@type": "Organization", name: "Let Me Teach You AI" },
    datePublished: "2026-09-13",
    dateModified: "2026-09-13",
    about: guide.primaryKeyword,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="border-b border-[#dfe6f0] bg-[linear-gradient(180deg,#f7f9ff_0%,#fbfaf7_100%)]">
        <div className="container-editorial py-12 sm:py-16">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#3158b5] hover:text-[#2457ff]"
          >
            <ArrowLeft className="h-4 w-4" /> All guides
          </Link>

          <div className="mt-9 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.14em] text-[#2457ff]">
              <span>{guide.eyebrow}</span>
              <span className="text-[#9aa9c1]">•</span>
              <span className="inline-flex items-center gap-1.5 text-[#6a7da3]"><Clock3 className="h-3.5 w-3.5" /> {guide.readTime}</span>
            </div>
            <h1 className="mt-4 font-editorial text-5xl font-semibold leading-[1.02] tracking-[-.035em] text-[#0c1d3f] sm:text-6xl">
              {guide.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[#536177]">{guide.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[#60708c]">
              <Search className="h-4 w-4 text-[#2457ff]" />
              <span className="font-semibold text-[#33456e]">Primary topic:</span>
              <span>{guide.primaryKeyword}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-[#fbfaf7]">
        <article className="container-editorial py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <section className="rounded-3xl border border-[#d9e3f5] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-[#2457ff]">
                <Sparkles className="h-4 w-4" /> What you will know by the end
              </div>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {guide.takeaways.map((takeaway) => (
                  <li key={takeaway} className="flex gap-3 text-[#425474]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2457ff]" />
                    <span className="leading-7">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-12 space-y-14">
              {guide.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-editorial text-3xl font-semibold tracking-[-.02em] text-[#0f1e3d] sm:text-4xl">
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-5 text-lg leading-8 text-[#536177]">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  {section.bullets && (
                    <ul className="mt-6 space-y-3 rounded-3xl border border-[#dfe6f0] bg-white p-6 sm:p-7">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-[#425474]">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4f76dd]" />
                          <span className="leading-7">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {guide.steps && (
              <section className="mt-14 overflow-hidden rounded-[2rem] border border-[#20345f] bg-[#07152f] text-white shadow-[0_26px_70px_rgba(7,21,47,.14)]">
                <div className="p-7 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8fb0ff]">Build it</p>
                  <h2 className="mt-3 font-editorial text-3xl font-semibold sm:text-4xl">Your next steps</h2>
                  <ol className="mt-7 space-y-4">
                    {guide.steps.map((step, index) => (
                      <li key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-4">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#2457ff] text-sm font-bold">{index + 1}</span>
                        <span className="pt-1 leading-7 text-[#d8e4f5]">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            <section className="mt-14">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#2457ff]">Common questions</p>
              <h2 className="mt-3 font-editorial text-3xl font-semibold text-[#0f1e3d] sm:text-4xl">FAQ</h2>
              <div className="mt-7 space-y-4">
                {guide.faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-2xl border border-[#dfe6f0] bg-white p-5 shadow-sm open:border-[#b9cafa]">
                    <summary className="cursor-pointer list-none font-semibold text-[#14294f]">{faq.question}</summary>
                    <p className="mt-3 leading-7 text-[#5a6980]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="mt-14 rounded-3xl border border-[#d9e3f5] bg-[#f4f7ff] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#2457ff]">Keep building</p>
              <h2 className="mt-3 font-editorial text-3xl font-semibold text-[#0f1e3d]">Related guides</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {related.map((item) => item && (
                  <Link key={item.slug} href={`/guides/${item.slug}`} className="group rounded-2xl border border-[#dce4f2] bg-white p-5 hover:border-[#9fb5ef] hover:shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-[#6a7da3]">{item.eyebrow}</p>
                    <h3 className="mt-2 font-semibold leading-6 text-[#14294f] group-hover:text-[#2457ff]">{item.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#3158b5]">Read guide <ArrowRight className="h-4 w-4" /></span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-14 border-t border-[#dfe6f0] pt-10 text-center">
              <p className="text-sm font-semibold text-[#6a7da3]">Want to build instead of just reading?</p>
              <Link href="/learn" className="primary-cta mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold shadow-sm">
                Start a free build lesson <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
