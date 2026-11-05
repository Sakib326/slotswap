import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";
import { Section } from "@/components/public/Section";
import { FaqItem } from "@/components/public/FaqItem";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about SlotSwap section swapping, 3-way cycles, schedule clash checks, and safety rules.",
};

const faqData = [
  {
    question: "Who can use SlotSwap?",
    answer:
      "Any currently enrolled university student with an active institutional email address can register, browse, and create section swap requests.",
  },
  {
    question: "Is a swap on SlotSwap official with the university?",
    answer:
      "No. SlotSwap coordinates matched student pairs or chains so everyone agrees to switch at the same time. You must still execute the actual section drop/add in your official university advising portal.",
  },
  {
    question: "What is a 3-way swap?",
    answer:
      "A 3-way swap is a circular cycle between three students (Student A gives to B, B gives to C, and C gives to A). This unlocks trades that are impossible with simple 1-to-1 matching.",
  },
  {
    question: "What happens if someone in the chain doesn't confirm?",
    answer:
      "Our atomic confirmation rule ensures complete safety. If any participant declines or lets their timer run out, the entire swap chain is cleanly cancelled and the remaining students are returned to the matching queue.",
  },
  {
    question: "How does SlotSwap check for schedule clashes?",
    answer:
      "When evaluating a match, our algorithm cross-checks both class times and midterm/final exam slots against each student's existing schedule, preventing double booking.",
  },
  {
    question: "What if no match is found for my request?",
    answer:
      "Our Match-Unlock suggestion engine will review nearby possibilities and suggest small adjustments, such as accepting an extra backup section that would complete a match immediately.",
  },
  {
    question: "What is the reliability score?",
    answer:
      "Reliability score is a trust rating based on whether a student confirms matches on time. Students with high reliability receive priority in match queue pairing.",
  },
  {
    question: "Who can see my phone number or contact details?",
    answer:
      "Your contact details remain completely private until a swap chain is confirmed by all participants, and only if you opted in to share contact info with your match partners.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "You can request complete account deletion at any time by contacting support@slotswap.example or submitting a request via our Contact page.",
  },
];

export default function FaqPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-bg border-b border-border py-16 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              Help & Answers
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-text tracking-tight mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              Everything you need to know about automated cycle matching, clash detection,
              and swap confirmations.
            </p>
          </div>
        </Container>
      </section>

      {/* Accordion Section */}
      <Section variant="muted">
        <Container>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={index === 0}
              />
            ))}

            {/* Need More Help Card */}
            <div className="mt-12 p-8 rounded-2xl bg-white border border-border text-center flex flex-col items-center">
              <h3 className="text-xl font-bold font-heading text-text mb-2">
                Have a question not listed here?
              </h3>
              <p className="text-sm text-text-muted max-w-md mb-6">
                Our support team and student moderators are here to assist with any questions or routine issues.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-6 py-3 font-semibold text-sm transition shadow-sm"
              >
                Contact Support Team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
