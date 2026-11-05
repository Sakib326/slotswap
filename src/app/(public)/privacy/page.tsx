import { Metadata } from "next";
import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how SlotSwap collects, protects, and handles student data in compliance with campus privacy standards.",
};

const sections = [
  { id: "information-collected", title: "1. Information We Collect" },
  { id: "purpose-of-use", title: "2. Why We Collect It" },
  { id: "information-sharing", title: "3. Who Can See Your Information" },
  { id: "security-measures", title: "4. How We Protect It" },
  { id: "cookies", title: "5. Cookies & Tracking" },
  { id: "retention-deletion", title: "6. Data Retention & Deletion" },
  { id: "policy-changes", title: "7. Changes to This Policy" },
  { id: "contact-privacy", title: "8. Contact Us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="November 2026"
      sections={sections}
    >
      <div className="space-y-10 text-text-muted text-base leading-relaxed">
        {/* Section 1 */}
        <section id="information-collected" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            1. Information We Collect
          </h2>
          <p>
            We collect the minimum student information required for reliable matching:
            full name, institutional university email address, student ID number, department,
            batch, enrolled course section codes, and optional contact phone numbers. We also
            collect standard system logs including IP addresses and device browser headers.
          </p>
        </section>

        {/* Section 2 */}
        <section id="purpose-of-use" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            2. Why We Collect It
          </h2>
          <p>
            Your information is processed strictly to authenticate student status, execute
            algorithmic graph matching, verify class schedule clash compatibility, and deliver
            transactional notifications when a cycle match is confirmed. We never sell or monetize
            student information.
          </p>
        </section>

        {/* Section 3 */}
        <section id="information-sharing" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            3. Who Can See Your Information
          </h2>
          <p>
            Your section requests are displayed anonymously in public matching queues. Only once
            a swap cycle is fully confirmed by every participant are contact details shared with
            the relevant swap partners to facilitate official portal coordination, and only in
            accordance with your account privacy settings.
          </p>
        </section>

        {/* Section 4 */}
        <section id="security-measures" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            4. How We Protect It
          </h2>
          <p>
            All passwords are encrypted with industry-standard bcrypt hashing. Sessions are
            secured with cryptographically signed httpOnly, Secure cookies over TLS encryption.
            Direct database access is restricted to system administrators.
          </p>
        </section>

        {/* Section 5 */}
        <section id="cookies" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            5. Cookies & Tracking
          </h2>
          <p>
            SlotSwap uses a single essential session cookie strictly to keep you authenticated.
            We do not load third-party analytics trackers, advertising cookies, or cross-site
            fingerprinting scripts.
          </p>
        </section>

        {/* Section 6 */}
        <section id="retention-deletion" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            6. Data Retention & Deletion
          </h2>
          <p>
            Historical swap records are archived for the duration of the advising semester to
            maintain system reliability scores and auditability. Students may request immediate
            and irreversible account and data deletion by sending a request from their registered
            university email to support.
          </p>
        </section>

        {/* Section 7 */}
        <section id="policy-changes" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            7. Changes to This Policy
          </h2>
          <p>
            Any modifications to our privacy practices will be documented on this page with an
            updated timestamp. Material changes impacting data disclosure will be notified through
            registered student emails.
          </p>
        </section>

        {/* Section 8 */}
        <section id="contact-privacy" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            8. Contact Us
          </h2>
          <p>
            If you have questions regarding data privacy or wish to request data deletion, contact
            our data protection team at <a href="mailto:support@slotswap.example" className="text-primary hover:underline">support@slotswap.example</a>.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
