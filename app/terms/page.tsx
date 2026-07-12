import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using Let Me Teach You AI.",
};

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Let Me Teach You AI";

export default function TermsPage() {
  return (
    <article className="container-editorial py-16 max-w-2xl leading-relaxed text-[--color-navy-600]">
      <h1 className="font-editorial text-4xl font-semibold text-[--color-navy]">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-[--color-slate]">
        Effective date: July 11, 2026
      </p>

      <p className="mt-6">
        Welcome to {SITE_NAME}. By using this site and subscribing to the
        newsletter, you agree to these terms.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Educational content only
      </h2>
      <p className="mt-3">
        Our content is for general education. It is provided &ldquo;as is&rdquo;
        without warranties of any kind. We make no income, earnings, or
        get-rich-quick promises. Results from learning and applying AI vary from
        person to person.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Use of AI tools
      </h2>
      <p className="mt-3">
        AI-generated output can be inaccurate or incomplete. Always review and
        verify AI output before relying on it. You are responsible for how you
        use anything you create with the tools referenced here.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Acceptable use
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>Don&apos;t misuse the site, its forms, or its AI features.</li>
        <li>
          Don&apos;t attempt to disrupt, overload, or gain unauthorized access
          to the service.
        </li>
        <li>Don&apos;t submit unlawful, harmful, or infringing content.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Intellectual property
      </h2>
      <p className="mt-3">
        The content, branding, and materials on this site belong to {SITE_NAME}{" "}
        unless otherwise noted. The free prompt pack is for your personal use.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Limitation of liability
      </h2>
      <p className="mt-3">
        To the fullest extent permitted by law, {SITE_NAME} is not liable for
        any damages arising from your use of the site, the content, or any AI
        tools.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Changes
      </h2>
      <p className="mt-3">
        We may update these terms. Continued use of the site means you accept
        the current version.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Contact
      </h2>
      <p className="mt-3">
        Questions? Reach us through the{" "}
        <a href="/contact" className="text-[--color-brand] underline">
          contact page
        </a>
        .
      </p>
    </article>
  );
}
