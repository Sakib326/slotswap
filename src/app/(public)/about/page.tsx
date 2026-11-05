import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";
import { Section } from "@/components/public/Section";
import {
  Users,
  GraduationCap,
  Building2,
  Code2,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SlotSwap, a university student project built for CSE 327: Software Engineering to automate section swapping.",
};

// Easy-to-edit team members array
const teamMembers = [
  { name: "S. M. Sakib", role: "Full Stack Engineer & Algorithm Lead" },
  { name: "Team Member 2", role: "Frontend & UI/UX Specialist" },
  { name: "Team Member 3", role: "Backend & Database Architect" },
  { name: "Team Member 4", role: "QA Engineer & Systems Tester" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Header */}
      <section className="bg-bg border-b border-border py-16 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              About SlotSwap
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-text tracking-tight mb-6">
              Simplifying the chaos of university course advising.
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              SlotSwap was born out of a recurring headache: students spending hours
              scrolling through chaotic social media threads trying to trade course sections,
              only to end up with schedule conflicts or unfulfilled promises.
            </p>
          </div>
        </Container>
      </section>

      {/* Course Project Banner */}
      <section className="bg-primary-soft/60 border-b border-border/80 py-6">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Code2 className="w-6 h-6 text-primary shrink-0" />
              <p className="text-sm text-text font-medium">
                <span className="font-bold">Academic Project Notice:</span> SlotSwap
                is a student project built for{" "}
                <span className="text-primary font-semibold">CSE 327: Software Engineering</span>.
              </p>
            </div>
            <Link
              href="/how-it-works"
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 shrink-0"
            >
              Explore Architecture <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Story & What Makes It Different */}
      <Section variant="white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold font-heading text-text mb-4">
                Why SlotSwap Exists
              </h2>
              <p className="text-text-muted text-base leading-relaxed mb-4">
                During semester advising, section availability is unpredictable.
                When a student misses their preferred time slot, their only alternative
                has historically been posting on Facebook student groups: <em>&quot;Holding CSE327 Sec 5, need Sec 2.&quot;</em>
              </p>
              <p className="text-text-muted text-base leading-relaxed">
                This manual process fails at scale. It cannot detect multi-party trades
                (A wants B, B wants C, C wants A), doesn&apos;t check whether swapped sections
                conflict with existing routines, and offers zero accountability. SlotSwap
                replaces manual frustration with a dependable, automated platform.
              </p>
            </div>

            <div className="bg-bg-muted p-6 md:p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold font-heading text-text mb-4">
                What Makes It Different
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text">Graph-Based Multi-Way Matching</h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      Finds 2-way trades and complex 3-way cycles that no human could discover manually.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text">Clash-Safe Verification</h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      Automatically inspects class hours and exam time slots to ensure neither student ends up with overlapping commitments.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text">Atomic All-or-Nothing Confirmation</h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      Swaps execute only if everyone in the chain confirms. If one drops out, everyone else is safely re-matched.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Built For Section */}
      <Section variant="muted">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold font-heading text-text mb-3">
              Built For Campus Stakeholders
            </h2>
            <p className="text-text-muted text-sm">
              Designed to serve both the student body and administrative staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-text mb-3">
                For Students
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Get the section that matches your work or commuting routine without spending days checking social forums. Safe, verified, and transparent matching during rush periods.
              </p>
              <ul className="text-xs text-text-muted space-y-2">
                <li>• Instant match suggestions and notifications</li>
                <li>• Zero risk of double booking class hours</li>
                <li>• Transparent confirmation countdowns</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-text mb-3">
                For Admins & Departments
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Eliminates student queues at departmental desks for manual section changes. Provides visibility into high-demand sections and potential capacity bottlenecks.
              </p>
              <ul className="text-xs text-text-muted space-y-2">
                <li>• Complete audit trail of swaps</li>
                <li>• Section demand analytics</li>
                <li>• Policy enforcement with verified institutional emails</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Team Section */}
      <Section variant="white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-muted text-text-subtle text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              Course Development Team
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-text mb-3">
              The Team Behind SlotSwap
            </h2>
            <p className="text-text-muted text-sm">
              Computer Science students collaborating to solve real campus problems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-bg-muted/70 p-6 rounded-2xl border border-border text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-heading font-bold text-base text-text">
                  {member.name}
                </h3>
                <p className="text-xs text-text-subtle mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
