import { Metadata } from "next";
import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Learn how SlotSwap collects, protects, and handles student routine and identity data.",
};

const sections = [
  { id: "collection", title: "1. Information we collect" },
  { id: "purpose", title: "2. Why we collect it" },
  { id: "sharing", title: "3. Who can see your information" },
  { id: "protection", title: "4. How we protect it" },
  { id: "cookies", title: "5. Cookies" },
  { id: "retention", title: "6. Data retention and deletion" },
  { id: "policy-changes", title: "7. Changes to this policy" },
  { id: "contact-privacy", title: "8. Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy policy"
      lastUpdated="November 2026"
      sections={sections}
    >
      <div className="space-y-8 text-sm sm:text-base text-ink/80 leading-relaxed">
        <section id="collection" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            1. Information we collect
          </h2>
          <p>
            We collect the student name, university email, student ID, department, batch, and current course section registrations. We also log standard request metadata like IP address and browser headers for security.
          </p>
        </section>

        <section id="purpose" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            2. Why we collect it
          </h2>
          <p>
            Information is collected strictly to authenticate enrolled student status, run cycle matching algorithms, verify routine clash compatibility, and deliver swap alerts.
          </p>
        </section>

        <section id="sharing" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            3. Who can see your information
          </h2>
          <p>
            Swap requests are anonymized in public queues. Your contact details are only shared with matching chain partners after all participants explicitly confirm the swap.
          </p>
        </section>

        <section id="protection" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            4. How we protect it
          </h2>
          <p>
            Passwords are encrypted with bcrypt hashing. Sessions are maintained via secure, httpOnly cookies over encrypted connections. Direct database access is limited to system maintainers.
          </p>
        </section>

        <section id="cookies" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            5. Cookies
          </h2>
          <p>
            We use a single essential session cookie to manage your authentication state. We do not use third-party analytics or tracking cookies.
          </p>
        </section>

        <section id="retention" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            6. Data retention and deletion
          </h2>
          <p>
            Swap listings are maintained through advising periods. Students may request complete account deletion at any time by emailing support@slotswap.example.
          </p>
        </section>

        <section id="policy-changes" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            7. Changes to this policy
          </h2>
          <p>
            Any modifications to privacy practices will be posted on this page with an updated timestamp.
          </p>
        </section>

        <section id="contact-privacy" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            8. Contact
          </h2>
          <p>
            For privacy inquiries or deletion requests, contact support@slotswap.example.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
