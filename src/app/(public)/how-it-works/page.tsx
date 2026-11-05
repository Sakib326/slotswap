import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";
import { Section } from "@/components/public/Section";
import {
  UserCheck,
  BookOpen,
  Send,
  Cpu,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how SlotSwap matches course sections in 5 easy steps, validates schedules for clashes, and ensures atomic swap confirmation.",
};

export default function HowItWorksPage() {
  const timelineSteps = [
    {
      step: 1,
      icon: <UserCheck className="w-5 h-5 text-primary" />,
      title: "Create an account with your university email",
      description:
        "Sign up using your official institutional email (e.g. @university.edu). This ensures only currently enrolled students participate in section swaps and keeps the platform spam-free.",
    },
    {
      step: 2,
      icon: <BookOpen className="w-5 h-5 text-accent" />,
      title: "Add the sections you currently hold",
      description:
        "Import or select the course sections currently assigned to your routine. SlotSwap maps your schedule to check for overlap before proposing any trades.",
    },
    {
      step: 3,
      icon: <Send className="w-5 h-5 text-primary" />,
      title: "Post a swap request",
      description:
        "Specify the section you want to give up and select all alternative sections you would be happy to accept. The more flexible your criteria, the faster our algorithm pairs you.",
    },
    {
      step: 4,
      icon: <Cpu className="w-5 h-5 text-accent" />,
      title: "Automated matching & clash verification",
      description:
        "Our engine models requests as a directed graph to discover direct 2-way swaps or 3-way cycles (A gives to B, B gives to C, C gives to A). Before proposing a match, it verifies class times and exam schedules. If no exact match is found, our suggestion engine tells you which backup section unlocks a match immediately.",
    },
    {
      step: 5,
      icon: <CheckCircle className="w-5 h-5 text-success" />,
      title: "Atomic confirmation & execution",
      description:
        "When a complete cycle is found, all students in the chain are notified and receive a countdown window (e.g., 2 hours) to confirm. If every student confirms, the swap completes. If any student declines or allows their timer to expire, the entire chain cleanly cancels and all other participants return to the matching pool automatically.",
    },
  ];

  return (
    <>
      {/* Page Header */}
      <section className="bg-bg border-b border-border py-16 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Step-by-Step Guide
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-text tracking-tight mb-6">
              How SlotSwap Works From Start to Finish
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              We replaced guesswork and endless social messaging with a reliable,
              automated 5-step cycle. Here is how your swap request travels through the system.
            </p>
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <Section variant="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12">
              {timelineSteps.map((item) => (
                <div key={item.step} className="relative group">
                  {/* Step Marker Dot */}
                  <div className="absolute -left-[35px] md:-left-[51px] top-0 flex items-center justify-center w-9 h-9 rounded-full bg-white border-2 border-primary shadow-sm text-xs font-bold text-primary group-hover:scale-110 transition">
                    {item.step}
                  </div>

                  {/* Card Content */}
                  <div className="bg-bg-muted p-6 md:p-8 rounded-2xl border border-border shadow-sm group-hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-white border border-border">
                        {item.icon}
                      </div>
                      <h2 className="text-xl font-bold font-heading text-text">
                        {item.title}
                      </h2>
                    </div>
                    <p className="text-sm md:text-base text-text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Disclaimer Notice Box */}
            <div className="mt-16 p-6 md:p-8 rounded-2xl bg-warning-soft/60 border border-warning/40 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-0.5" />
              <div>
                <h3 className="font-heading font-bold text-base text-text mb-1">
                  Important Registration Notice
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  A confirmed match on SlotSwap coordinates student agreement, but does
                  not automatically replace the official university advising portal or registrar system.
                  Always ensure that you and your swap partners finalize the official section change
                  in your university’s portal during authorized advising windows.
                </p>
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-12 text-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-8 py-3.5 font-bold transition shadow-sm hover:shadow"
              >
                Start Your Swap Request Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
