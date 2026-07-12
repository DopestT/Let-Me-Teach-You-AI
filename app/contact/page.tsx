import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Let Me Teach You AI.",
};

export default function ContactPage() {
  return (
    <div className="container-editorial py-16 max-w-2xl">
      <h1 className="font-editorial text-4xl font-semibold text-[--color-navy]">
        Contact
      </h1>
      <p className="mt-3 text-[--color-navy-600]">
        Questions, feedback, or a topic you&apos;d like covered? Send a note —
        real replies, no bots.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
