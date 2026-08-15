import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Let Me Teach You AI collects, uses, stores, and protects information.",
};

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Let Me Teach You AI";

export default function PrivacyPage() {
  return (
    <article className="container-editorial py-16 max-w-2xl leading-relaxed text-[--color-navy-600]">
      <h1 className="font-editorial text-4xl font-semibold text-[--color-navy]">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[--color-slate]">Effective date: August 15, 2026</p>

      <p className="mt-6">
        {SITE_NAME} (&ldquo;LMTYAI,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy.
        This Privacy Policy explains how information may be collected, used, stored, and shared when you visit
        letmeteachyouai.com, subscribe to our content, use our tools or services, or otherwise interact with {SITE_NAME}.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Information we collect</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>Information you voluntarily provide, such as your name, email address, account information, messages, or form submissions.</li>
        <li>Newsletter subscription and communication preferences.</li>
        <li>Technical information such as browser type, device type, IP address, operating system, referral source, and general usage information.</li>
        <li>Analytics information about how visitors interact with our website and content.</li>
        <li>Information necessary to operate integrations or services that you explicitly connect or authorize.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Google and YouTube integrations</h2>
      <p className="mt-3">
        {SITE_NAME} may use Google APIs, including YouTube API Services, to provide features such as authorized content management or publishing.
        When you authorize a Google or YouTube integration, we may receive access tokens and information necessary to perform the specific actions you authorize.
      </p>
      <p className="mt-3">
        We do not use Google authorization to access information beyond the permissions granted by the user. You can revoke Google account access at any time through your Google Account security settings.
      </p>
      <p className="mt-3">
        Our use and transfer of information received from Google APIs will comply with the Google API Services User Data Policy, including applicable Limited Use requirements.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">How we use information</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>Operate and improve {SITE_NAME}.</li>
        <li>Deliver newsletters, educational content, tools, and services.</li>
        <li>Authenticate users and maintain accounts.</li>
        <li>Operate user-authorized integrations and publishing workflows.</li>
        <li>Analyze website and product performance.</li>
        <li>Detect abuse, fraud, security threats, or technical problems.</li>
        <li>Respond to support requests and comply with legal obligations.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">AI and automation</h2>
      <p className="mt-3">
        Some services may use automated systems or third-party AI providers to process information, generate content, organize workflows, or perform actions requested by users. We aim to limit information supplied to these systems to what is reasonably necessary for the applicable feature.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Newsletter provider</h2>
      <p className="mt-3">
        We use Beehiiv to manage subscriptions and send emails. Your email address and optional profile information may be stored with Beehiiv for this purpose. You can unsubscribe using the link in any newsletter email.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Cookies and analytics</h2>
      <p className="mt-3">
        Our website may use cookies and similar technologies to operate the service, remember preferences, understand usage, measure performance, and improve the user experience. Browser settings may allow you to restrict or delete cookies.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Third-party services</h2>
      <p className="mt-3">
        We may use third-party providers for infrastructure, analytics, email delivery, publishing, authentication, payments, automation, artificial intelligence, and other operational services. Those providers may process information according to their own privacy policies and the agreements governing our use of their services.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Sharing of information</h2>
      <p className="mt-3">
        We do not sell personal information. We may share information with service providers when reasonably necessary to operate our services, fulfill a user request, protect our systems or users, or comply with applicable law.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Data security</h2>
      <p className="mt-3">
        We use reasonable administrative and technical safeguards designed to protect information under our control. No internet-based service can guarantee absolute security.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Data retention and deletion</h2>
      <p className="mt-3">
        We retain information for as long as reasonably necessary to provide our services, maintain legitimate business records, resolve disputes, enforce agreements, and comply with applicable legal obligations. Users may request access to or deletion of personal information by contacting us. Users who have authorized Google access may also revoke that authorization through their Google Account.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Children&apos;s privacy</h2>
      <p className="mt-3">
        {SITE_NAME} is not intended to knowingly collect personal information from children under 13. If we learn that such information has been collected improperly, we will take reasonable steps to remove it.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Changes to this policy</h2>
      <p className="mt-3">
        We may update this Privacy Policy as our products, technology, or legal obligations change. The effective date at the top of this page identifies the latest version.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[--color-navy]">Contact</h2>
      <p className="mt-3">
        Questions or privacy requests may be submitted through the{" "}
        <a href="/contact" className="text-[--color-brand] underline">contact page</a>.
      </p>
    </article>
  );
}
