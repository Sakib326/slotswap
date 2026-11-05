import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";
import { Section } from "@/components/public/Section";
import { FeatureCard } from "@/components/public/FeatureCard";
import { StepCard } from "@/components/public/StepCard";
import { SwapCycleIllustration } from "@/components/public/SwapCycleIllustration";
import {
  Network,
  CalendarCheck2,
  ClockAlert,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SlotSwap - University Course Section Swapping Platform",
  description:
    "Swap course sections in minutes, not Facebook posts. Multi-way matching, schedule clash validation, and atomic confirmation for university students.",
};

export default function HomePage() {
  const steps = [
    {
      number: "1",
      title: "List what you hold & want",
      description:
        "Select the section you currently hold and pick the alternate sections that fit your routine.",
    },
    {
      number: "2",
      title: "We find optimal matches",
      description:
        "Our graph matching engine detects 2-way and complex 3-way swap cycles with zero manual searching.",
    },
    {
      number: "3",
      title: "Confirm and finalize safely",
      description:
        "Every student in the swap chain confirms within a countdown window. Once confirmed, the swap is locked.",
    },
  ];

  const features = [
    {
      icon: <Network className="w-6 h-6" />,
      title: "Multi-Way Swap Matching",
      description:
        "Requests are modeled as a graph. Cycle detection finds 2-way and 3-way swaps (A→B→C→A) that nobody could spot manually.",
    },
    {
      icon: <CalendarCheck2 className="w-6 h-6" />,
      title: "Schedule Clash Validation",
      description:
        "A swap is proposed only if the new section doesn't overlap with either student's registered classes or exam slots.",
    },
    {
      icon: <ClockAlert className="w-6 h-6" />,
      title: "Atomic Confirmation with Auto-Expiry",
      description:
        "All students in a chain must confirm within a time window. If anyone declines or times out, the chain cancels and remaining students are re-matched.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Match-Unlock Suggestion Engine",
      description:
        "When no direct swap exists, the system recommends the smallest adjustment (e.g. accepting Sec 3 unlocks an instant match).",
    },
  ];

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-bg pt-12 pb-16 md:py-24 border-b border-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                University Advising Made Simple
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-text tracking-tight leading-[1.1] mb-6">
                Swap class sections in minutes, not{" "}
                <span className="text-primary underline decoration-primary/30 underline-offset-4">
                  Facebook posts
                </span>
                .
              </h1>

              <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8 max-w-xl">
                SlotSwap automatically finds 2-way and 3-way section swaps,
                checks your schedule for clashes, and confirms everything
                safely before advising ends.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/register"
                  className="rounded-xl bg-primary hover:bg-primary-hover text-white px-7 py-3.5 font-semibold text-center transition shadow-sm hover:shadow flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-xl border border-border bg-white hover:bg-bg-muted text-text px-6 py-3.5 font-semibold text-center transition"
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Right Column: Signature 3-way Visual */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <SwapCycleIllustration />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. PROBLEM STRIP */}
      <section className="bg-bg-muted border-b border-border py-12 md:py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              The Advising Dilemma
            </h2>
            <p className="text-lg md:text-xl font-medium text-text leading-relaxed">
              Every semester, thousands of university students flood social media
              groups begging for section swaps. Most requests get lost in the noise,
              agreed swaps fall through due to forgotten class clashes, and complex
              3-person chains are completely impossible to coordinate manually.
            </p>
          </div>
        </Container>
      </section>

      {/* 3. HOW IT WORKS (3 Step Cards) */}
      <Section variant="white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-text mb-4">
              How SlotSwap Works
            </h2>
            <p className="text-text-muted text-base">
              A hassle-free 3-step process designed to get you the routine you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Read complete step-by-step breakdown <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </Section>

      {/* 4. CORE FEATURES (4 Feature Cards) */}
      <Section variant="muted">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-text mb-4">
              Engineered for Fairness & Accuracy
            </h2>
            <p className="text-text-muted text-base">
              Powered by graph theory algorithms to ensure reliable swaps with zero timetable conflicts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. FINAL CTA BAND */}
      <section className="bg-primary text-white py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-4 text-white">
              Ready to fix your university routine?
            </h2>
            <p className="text-primary-soft text-base md:text-lg mb-8 max-w-xl">
              Join your fellow students on SlotSwap. Stop refreshing social media
              and let automated cycle matching find your ideal schedule.
            </p>
            <Link
              href="/register"
              className="rounded-xl bg-white text-primary hover:bg-primary-soft px-8 py-3.5 font-bold transition shadow-md hover:shadow-lg"
            >
              Create your account
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
