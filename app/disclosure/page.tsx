import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate & Advertising Disclosure",
  description: "How Let Me Teach You AI discloses affiliate links, sponsorships, and advertising relationships.",
};

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Let Me Teach You AI";

export default function DisclosurePage() {
  return (
    <article className="container-editorial py-16 max-w-2xl leading-relaxed text-[--color-navy-600]">
      <h1 className="font-editorial text-4xl font-semibold text-[--color-navy]">Affiliate & Advertising Disclosure</h1>
      <p className="mt-2 text-sm text-[--color-slate]">Effective date: August 18, 2026</p>

      <p className="mt-6">
        {SITE_NAME} publishes educational content about AI tools, software, services, and online business. Some links on this site or in our newsletter may be affiliate links. If you purchase through one of those links, we may earn a commission at no additional cost to you.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Affiliate links</h2>
      <p className="mt-3">
        We may participate in affiliate or referral programs offered by software companies, service providers, marketplaces, and other businesses. When a link may financially benefit us, we aim to disclose that relationship clearly near the relevant recommendation or content.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Sponsored content and advertising</h2>
      <p className="mt-3">
        We may accept sponsorships, paid placements, or advertising. Sponsored or paid content will be identified as such. Compensation does not guarantee a positive review or recommendation.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Editorial independence</h2>
      <p className="mt-3">
        Our goal is to recommend tools and strategies because we believe they are useful to the audience. Affiliate relationships may influence which products we are able to monetize, but they do not change our commitment to explain material limitations, tradeoffs, or concerns when they matter.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">No guarantee of results</h2>
      <p className="mt-3">
        Examples involving AI, automation, business, revenue, or online income are educational and illustrative. Results vary, and no tool, strategy, or recommendation is a guarantee of earnings or other outcomes.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Questions</h2>
      <p className="mt-3">
        Questions about a commercial relationship or disclosure may be submitted through the{" "}
        <a href="/contact" className="text-[--color-brand] underline">contact page</a>.
      </p>
    </article>
  );
}
