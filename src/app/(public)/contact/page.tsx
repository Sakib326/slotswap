import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the SlotSwap student team for questions, feedback, or support regarding course section swaps.",
};

const SUPPORT_EMAIL = "support@slotswap.example";
const RESPONSE_TIME = "Within 2 working days";

export default function ContactPage() {
  return (
    <div className="py-12 md:py-20 text-left">
      <Container>
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-ink leading-tight mb-4">
            Contact
          </h1>
          <p className="text-base sm:text-lg text-ink/80 leading-relaxed">
            Have questions about section matching, spot a potential clash error, or want to share feedback? Let us know.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Plain Text Meta */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
                Support email
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-base font-medium text-pine hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
                Response time
              </p>
              <p className="text-sm text-ink/80">
                {RESPONSE_TIME}
              </p>
            </div>

            <div className="pt-4 border-t border-ink/15">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
                Before you write
              </p>
              <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
                Many questions regarding 3-way cycles, clash calculations, and official registration are answered on our{" "}
                <Link href="/faq" className="text-pine font-medium hover:underline">
                  FAQ page
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Right Column: The Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
