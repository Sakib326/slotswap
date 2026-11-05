import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { Mail, Clock, HelpCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the SlotSwap team for questions, feedback, or support regarding course section swaps.",
};

const SUPPORT_EMAIL = "support@slotswap.example";
const RESPONSE_TIME = "Within 2 working days";

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-bg border-b border-border py-16 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Support & Inquiries
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-text tracking-tight mb-4">
              Get in touch with SlotSwap
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              Have questions about section matching, encounter an issue, or want
              to offer feedback on our algorithms? We are here to help.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-bg-muted">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Contact info & FAQ pointer */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-xl font-bold font-heading text-text mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-subtle font-semibold">
                        Support Email
                      </p>
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="text-base font-medium text-primary hover:underline"
                      >
                        {SUPPORT_EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-subtle font-semibold">
                        Expected Response Time
                      </p>
                      <p className="text-sm font-medium text-text">
                        {RESPONSE_TIME}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Before you write card */}
              <div className="bg-primary-soft/60 p-6 md:p-8 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-2 text-primary font-bold font-heading text-base mb-2">
                  <HelpCircle className="w-5 h-5" />
                  Before you write to us
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-4">
                  Check out our FAQ page. Common questions regarding 3-way cycles,
                  expiry windows, and official university registration are answered in detail.
                </p>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover"
                >
                  Visit the FAQ Section <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
