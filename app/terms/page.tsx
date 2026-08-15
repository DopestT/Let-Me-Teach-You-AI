import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of Let Me Teach You AI.",
};

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Let Me Teach You AI";

export default function TermsPage() {
  return (
    <article className="container-editorial py-16 max-w-2xl leading-relaxed text-[--color-navy-600]">
      <h1 className="font-editorial text-4xl font-semibold text-[--color-navy]">Terms of Service</h1>
      <p className="mt-2 text-sm text-[--color-slate]">Effective date: August 15, 2026</p>

      <p className="mt-6">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of {SITE_NAME}, including letmeteachyouai.com and related content, tools, educational materials, automations, and services. By using the service, you agree to these Terms.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Purpose of the service</h2>
      <p className="mt-3">
        {SITE_NAME} provides educational content, demonstrations, tools, resources, and practical projects involving artificial intelligence, automation, software, online business, and related technologies. Our content is primarily provided for educational and informational purposes.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Accounts and authorized integrations</h2>
      <p className="mt-3">
        Certain features may require an account or authorization to access third-party services. You are responsible for maintaining the security of your accounts and for activity performed through credentials or permissions you control.
      </p>
      <p className="mt-3">
        When you authorize an integration, you give {SITE_NAME} permission to perform the actions covered by the permissions you approve. You may revoke third-party authorization according to the applicable provider&apos;s procedures.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Google and YouTube services</h2>
      <p className="mt-3">
        Some features may integrate with Google or YouTube services. Your use of YouTube-related functionality is also subject to the YouTube Terms of Service and applicable Google policies. You remain responsible for content uploaded, published, modified, or otherwise managed through your authorized accounts.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">AI-generated content</h2>
      <p className="mt-3">
        Some features may use artificial intelligence to generate or transform text, images, audio, video, code, research, recommendations, or other material. AI systems can produce inaccurate, incomplete, or unexpected results. Users should review important outputs before relying upon or publishing them.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">User responsibilities</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>Do not violate applicable laws or regulations.</li>
        <li>Do not infringe intellectual-property or privacy rights.</li>
        <li>Do not gain unauthorized access to systems or accounts.</li>
        <li>Do not distribute malware or intentionally harmful software.</li>
        <li>Do not abuse, disrupt, or interfere with our services.</li>
        <li>Do not misrepresent automated or AI-generated activity when disclosure is legally required.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Intellectual property</h2>
      <p className="mt-3">
        Unless otherwise stated, original {SITE_NAME} branding, site design, educational materials, and proprietary content are owned by or licensed to the operator of {SITE_NAME}. Third-party names, trademarks, software, and services remain the property of their respective owners.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Educational information</h2>
      <p className="mt-3">
        Nothing provided through {SITE_NAME} constitutes guaranteed financial, legal, tax, investment, medical, or professional advice. Examples involving businesses, income opportunities, automation, or technology are educational examples. Results are not guaranteed.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Availability</h2>
      <p className="mt-3">
        We may modify, suspend, replace, or discontinue features as the platform develops. Third-party integrations may also become unavailable or change without our control.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Disclaimer of warranties</h2>
      <p className="mt-3">
        To the extent permitted by law, the service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of uninterrupted availability, error-free operation, or particular results.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Limitation of liability</h2>
      <p className="mt-3">
        To the extent permitted by applicable law, {SITE_NAME} and its operators will not be liable for indirect, incidental, consequential, special, or punitive damages arising from use of or inability to use the service.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Changes to these terms</h2>
      <p className="mt-3">
        We may update these Terms as the service evolves. Continued use following an update constitutes acceptance of the revised Terms to the extent permitted by law.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Contact</h2>
      <p className="mt-3">
        Questions about these Terms may be submitted through the{" "}
        <a href="/contact" className="text-[--color-brand] underline">contact page</a>.
      </p>
    </article>
  );
}
