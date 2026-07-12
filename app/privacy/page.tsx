import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Let Me Teach You AI collects, uses, and protects your data.",
};

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Let Me Teach You AI";

export default function PrivacyPage() {
  return (
    <article className="container-editorial py-16 max-w-2xl leading-relaxed text-[--color-navy-600]">
      <h1 className="font-editorial text-4xl font-semibold text-[--color-navy]">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-[--color-slate]">
        Effective date: July 11, 2026
      </p>

      <p className="mt-6">
        {SITE_NAME} (&ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your privacy.
        This policy explains what we collect and why. We keep it short and plain
        on purpose.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        What we collect
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>
          <strong>Email address</strong> and, optionally, your{" "}
          <strong>first name</strong> when you join the newsletter.
        </li>
        <li>
          <strong>Contact details</strong> you choose to send us through the
          contact form.
        </li>
        <li>
          <strong>Basic, anonymized usage analytics</strong> (e.g. page views)
          to understand what&apos;s helpful.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        How we use it
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>To send you the newsletter, lessons, and the free prompt pack.</li>
        <li>To respond to your messages.</li>
        <li>To improve the content and the site.</li>
      </ul>
      <p className="mt-3">
        We do <strong>not</strong> sell your personal information.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Email &amp; newsletter provider
      </h2>
      <p className="mt-3">
        We use Beehiiv to manage subscriptions and send emails. Your email and
        optional first name are stored with Beehiiv for this purpose. You can
        unsubscribe at any time using the link in any email.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        AI features and OpenAI
      </h2>
      <p className="mt-3">
        Some features are powered by OpenAI. When you use an interactive AI
        tool, the text you enter is sent to OpenAI to generate a response. We do{" "}
        <strong>
          not send your newsletter subscription details or personal contact
          information to OpenAI
        </strong>{" "}
        unless a specific feature requires it and we clearly tell you first.
        Please avoid entering sensitive personal information into AI tools.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Data retention &amp; your rights
      </h2>
      <p className="mt-3">
        We keep your email only for as long as you&apos;re subscribed. You can
        ask us to access or delete your data at any time by contacting us.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">
        Contact
      </h2>
      <p className="mt-3">
        Questions about privacy? Reach us through the{" "}
        <a href="/contact" className="text-[--color-brand] underline">
          contact page
        </a>
        .
      </p>
    </article>
  );
}
