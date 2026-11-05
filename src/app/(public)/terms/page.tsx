import { Metadata } from "next";
import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "Review the terms and conditions for using SlotSwap course section swapping platform.",
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of terms" },
  { id: "eligibility", title: "2. Eligibility" },
  { id: "account-responsibilities", title: "3. Account responsibilities" },
  { id: "how-swaps-work", title: "4. How swaps work" },
  { id: "user-conduct", title: "5. User conduct and reliability" },
  { id: "termination", title: "6. Account suspension and termination" },
  { id: "disclaimer", title: "7. Disclaimer and limitation of liability" },
  { id: "changes", title: "8. Changes to terms" },
  { id: "contact", title: "9. Contact" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms and conditions"
      lastUpdated="November 2026"
      sections={sections}
    >
      <div className="space-y-8 text-sm sm:text-base text-ink/80 leading-relaxed">
        <section id="acceptance" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            1. Acceptance of terms
          </h2>
          <p>
            By accessing or using SlotSwap, you agree to be bound by these terms. If you do not agree, do not use the application. SlotSwap is developed as a course project for student advising coordination.
          </p>
        </section>

        <section id="eligibility" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            2. Eligibility
          </h2>
          <p>
            You must be an actively enrolled university student with a verified institutional email address. Accounts registered with unauthorized domains are deactivated upon detection.
          </p>
        </section>

        <section id="account-responsibilities" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            3. Account responsibilities
          </h2>
          <p>
            You agree to supply accurate routine and section hold data. One account is permitted per student. You remain fully responsible for protecting your account credentials.
          </p>
        </section>

        <section id="how-swaps-work" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            4. How swaps work
          </h2>
          <p>
            Matching is algorithmic and dependent on demand; SlotSwap does not guarantee every request will find a match. A swap confirmation on this platform does not officially alter university records; students must register their section trade directly in the university portal.
          </p>
        </section>

        <section id="user-conduct" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            5. User conduct and reliability
          </h2>
          <p>
            Users must not post fake requests or repeatedly accept and drop swap chains. Reliability scores track confirmation rates; repeated timeouts reduce priority in future matching queues.
          </p>
        </section>

        <section id="termination" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            6. Account suspension and termination
          </h2>
          <p>
            We reserve the right to suspend any account that attempts to trade sections for money, harasses other students, or disrupts system operations.
          </p>
        </section>

        <section id="disclaimer" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            7. Disclaimer and limitation of liability
          </h2>
          <p>
            SlotSwap is provided on an &quot;as is&quot; basis without warranties. The developers and academic supervisors are not liable for dropped courses, advising portal glitches, or missed deadlines resulting from tool usage.
          </p>
        </section>

        <section id="changes" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            8. Changes to terms
          </h2>
          <p>
            We may update these terms during development. Continued use after changes indicates agreement with the updated terms.
          </p>
        </section>

        <section id="contact" className="scroll-mt-24">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">
            9. Contact
          </h2>
          <p>
            Direct any inquiries regarding these terms to support@slotswap.example or via our Contact page.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
