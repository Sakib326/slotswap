import { Metadata } from "next";
import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Review the terms and conditions for using SlotSwap course section swapping platform.",
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "eligibility", title: "2. Eligibility" },
  { id: "account-responsibilities", title: "3. Account Responsibilities" },
  { id: "how-swaps-work", title: "4. How Swaps Work" },
  { id: "user-conduct", title: "5. User Conduct & Reliability" },
  { id: "termination", title: "6. Account Suspension & Termination" },
  { id: "disclaimer", title: "7. Disclaimer & Limitation of Liability" },
  { id: "changes", title: "8. Changes to Terms" },
  { id: "contact", title: "9. Contact Information" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms and Conditions"
      lastUpdated="November 2026"
      sections={sections}
    >
      <div className="space-y-10 text-text-muted text-base leading-relaxed">
        {/* Section 1 */}
        <section id="acceptance" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using SlotSwap, you agree to comply with and be bound by
            these Terms and Conditions. If you do not agree with any part of these
            terms, you may not use the service. SlotSwap is developed as a course
            project for educational and coordination purposes.
          </p>
        </section>

        {/* Section 2 */}
        <section id="eligibility" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            2. Eligibility
          </h2>
          <p>
            You must be an actively enrolled university student holding a valid,
            verifiable institutional email address to register an account. Accounts
            registered with unauthorized or non-student addresses are subject to immediate
            suspension.
          </p>
        </section>

        {/* Section 3 */}
        <section id="account-responsibilities" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            3. Account Responsibilities
          </h2>
          <p>
            You agree to provide true, accurate, and up-to-date information regarding
            your enrolled courses and section requests. Each student is restricted to a
            single active account. You remain fully responsible for maintaining the
            confidentiality of your login credentials.
          </p>
        </section>

        {/* Section 4 */}
        <section id="how-swaps-work" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            4. How Swaps Work
          </h2>
          <p>
            Matching is carried out via automated algorithms; SlotSwap does not guarantee
            that every request will produce a valid match. A confirmed trade on SlotSwap
            coordinates student agreement but does not officially alter university records.
            Participants must finalize their swaps through official university registration portals.
          </p>
        </section>

        {/* Section 5 */}
        <section id="user-conduct" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            5. User Conduct & Reliability
          </h2>
          <p>
            Users must not submit fraudulent section requests or repeatedly accept and then
            cancel match chains. SlotSwap tracks confirmation reliability scores; users who
            frequently allow timers to expire or decline confirmed agreements may experience
            deprioritized match placement.
          </p>
        </section>

        {/* Section 6 */}
        <section id="termination" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            6. Account Suspension & Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate university
            honor codes, engage in harassment, attempt to trade sections for money, or disrupt
            the stability of the matching service. Terminated users forfeit active swap listings.
          </p>
        </section>

        {/* Section 7 */}
        <section id="disclaimer" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            7. Disclaimer & Limitation of Liability
          </h2>
          <p>
            SlotSwap is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of
            any kind. In no event will the developers or academic mentors be liable for dropped
            sections, registration delays, or missed university deadlines resulting from the
            use of this tool.
          </p>
        </section>

        {/* Section 8 */}
        <section id="changes" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            8. Changes to These Terms
          </h2>
          <p>
            We may update these terms periodically to reflect software enhancements or university
            policy changes. Continued use of the website following published updates signifies your
            acceptance of the revised terms.
          </p>
        </section>

        {/* Section 9 */}
        <section id="contact" className="scroll-mt-28">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            9. Contact Information
          </h2>
          <p>
            If you have questions or concerns regarding these terms, please contact our team via
            email at <a href="mailto:support@slotswap.example" className="text-primary hover:underline">support@slotswap.example</a> or submit an inquiry through our Contact page.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
