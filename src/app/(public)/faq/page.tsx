import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Common questions about SlotSwap section swapping, 3-way cycles, schedule clash checks, and safety rules.",
};

const faqData = [
  {
    question: "Who can use SlotSwap?",
    answer:
      "Any currently enrolled university student with an active institutional email address can register and trade sections.",
  },
  {
    question: "Is a swap on SlotSwap official with the university?",
    answer:
      "No. SlotSwap coordinates student agreement and checks clash compatibility. You must still execute the actual section drop and add in your university's official registration portal.",
  },
  {
    question: "What is a 3-way swap?",
    answer:
      "A 3-way swap is a circular cycle where Student A gives to B, B gives to C, and C gives to A. This creates matches when no two students want each other's sections directly.",
  },
  {
    question: "What happens if someone in the chain doesn't confirm?",
    answer:
      "Confirmation is all-or-nothing. If any participant declines or lets their countdown timer expire, the swap cancels safely for everyone and all other students return to the matching pool.",
  },
  {
    question: "How does SlotSwap check for schedule clashes?",
    answer:
      "Our system evaluates both lecture hours and exam periods against your existing classes before proposing a match, preventing double bookings.",
  },
  {
    question: "What if no match is found for my request?",
    answer:
      "The Match-Unlock engine analyzes nearby request chains and suggests backup sections you could add to unlock an instant trade.",
  },
  {
    question: "What is the reliability score?",
    answer:
      "Reliability score is a rating based on whether a student confirms matches on time. Students with higher reliability are prioritized in the matching queue.",
  },
  {
    question: "Who can see my phone number?",
    answer:
      "Your contact info is never shown publicly. It is only shared with verified partners in a confirmed swap cycle, and only if you choose to enable sharing.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "You can request complete account deletion at any time by sending an email from your university address to support@slotswap.example.",
  },
];

export default function FaqPage() {
  return (
    <div className="py-12 md:py-20 text-left">
      <Container>
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-ink leading-tight mb-4">
            Frequently asked questions
          </h1>
          <p className="text-base sm:text-lg text-ink/80 leading-relaxed">
            Common questions regarding cycle matching, clash prevention, and swap confirmations.
          </p>
        </div>

        {/* Plain list with details, single grid line between items, no cards */}
        <div className="max-w-3xl divide-y divide-ink/15 border-t border-b border-ink/15">
          {faqData.map((faq, index) => (
            <details
              key={index}
              className="group py-5 text-left"
              open={index === 0}
            >
              <summary className="font-heading font-bold text-base sm:text-lg text-ink cursor-pointer list-none flex items-center justify-between select-none">
                <span>{faq.question}</span>
                <span className="text-ink/40 font-mono text-sm group-open:rotate-45 transition-transform shrink-0 ml-4">
                  +
                </span>
              </summary>
              <div className="mt-3 text-sm text-ink/75 leading-relaxed pr-6">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Still stuck line at the end */}
        <div className="mt-12 text-sm text-ink/80">
          Still stuck?{" "}
          <Link href="/contact" className="text-pine font-medium underline">
            Write to us
          </Link>
          .
        </div>
      </Container>
    </div>
  );
}
