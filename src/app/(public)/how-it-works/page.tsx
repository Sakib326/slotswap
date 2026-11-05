import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "A step-by-step breakdown of how SlotSwap matches course section requests, checks timetable clashes, and finalizes trades.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      num: 1,
      title: "Create an account with your university email",
      desc: "Register using your verified student address. This restricts access to currently enrolled students and keeps the matching pool authentic.",
      fragment: (
        <div className="border border-ink/15 rounded-[4px] p-2.5 bg-paper text-xs font-medium text-ink/75 max-w-xs">
          <span className="font-semibold text-ink">Verified domain:</span> @northsouth.edu
        </div>
      ),
    },
    {
      num: 2,
      title: "Add the sections you currently hold",
      desc: "Input your registered course codes and sections from your official advising slip. This routine mapping establishes the baseline for clash calculations.",
      fragment: (
        <div className="flex gap-2 max-w-xs">
          <span className="px-2 py-1 rounded-[4px] bg-marker-yellow text-ink border border-ink/15 text-xs font-semibold">
            MAT216 · Sec 3
          </span>
          <span className="px-2 py-1 rounded-[4px] bg-marker-pink text-ink border border-ink/15 text-xs font-semibold">
            CSE327 · Sec 5
          </span>
        </div>
      ),
    },
    {
      num: 3,
      title: "Post a swap request",
      desc: "Specify the section you want to give away, then check off all alternative sections you would happily take. The wider your acceptance list, the quicker an algorithm matches you.",
      fragment: (
        <div className="border border-ink/15 rounded-[4px] p-2 bg-paper text-xs flex items-center gap-2 max-w-xs">
          <span className="font-semibold text-signal">Give: Sec 5</span>
          <span className="text-ink/40">→</span>
          <span className="font-semibold text-pine">Take: Sec 2, Sec 4, Sec 7</span>
        </div>
      ),
    },
    {
      num: 4,
      title: "Automated matching and clash verification",
      desc: "SlotSwap models requests as directed graph edges to find 2-way pairings and 3-way cycles. It automatically checks lecture and exam hours against your other classes. If no direct swap is available, it points out which backup section unlocks a match.",
      fragment: (
        <div className="border border-ink/15 rounded-[4px] p-2.5 bg-paper text-xs space-y-1.5 max-w-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">Cycle detection</span>
            <span className="text-[11px] text-pine font-bold">Valid 3-way</span>
          </div>
          <div className="text-[11px] text-ink/70">
            Exam slot: 09:00–11:00 (No conflict)
          </div>
        </div>
      ),
    },
    {
      num: 5,
      title: "All participants confirm within the countdown window",
      desc: "Once a valid chain is identified, every student receives an alert and a time-limited window to confirm. If everyone confirms, contact info is released to perform the portal change. If anyone declines or times out, the chain dissolves and remaining students re-enter matching automatically.",
      fragment: (
        <div className="border border-ink/15 rounded-[4px] p-2.5 bg-paper text-xs flex items-center justify-between max-w-xs">
          <span className="font-medium text-ink">Confirmation timer</span>
          <span className="tabular-nums font-bold text-signal">01:45:20 remaining</span>
        </div>
      ),
    },
  ];

  return (
    <div className="py-12 md:py-20 text-left">
      <Container>
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-ink leading-tight mb-4">
            How a swap works
          </h1>
          <p className="text-base sm:text-lg text-ink/80 leading-relaxed">
            SlotSwap runs on graph cycle detection rather than random comment threads. Here is the five-step sequence from request to confirmation.
          </p>
        </div>

        {/* Step-by-step sequence */}
        <div className="max-w-3xl divide-y divide-ink/15 border-t border-b border-ink/15">
          {steps.map((st) => (
            <div key={st.num} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Large tabular numeral */}
              <div className="md:col-span-2">
                <span className="font-heading font-extrabold text-4xl sm:text-5xl text-ink/30 tabular-nums">
                  0{st.num}
                </span>
              </div>

              {/* Title & Description */}
              <div className="md:col-span-6 space-y-2">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink">
                  {st.title}
                </h2>
                <p className="text-sm text-ink/75 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              {/* Routine grid fragment / small illustration */}
              <div className="md:col-span-4">
                {st.fragment}
              </div>
            </div>
          ))}
        </div>

        {/* Official registration notice box with Signal border */}
        <div className="max-w-3xl mt-12 p-5 border-l-4 border-signal bg-white/60 rounded-[8px] border border-ink/10">
          <p className="font-heading font-bold text-sm text-ink mb-1">
            Official university registration reminder
          </p>
          <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
            A swap on SlotSwap coordinates student agreement and verifies compatibility. It does not alter your university&apos;s registrar records directly. You and your matched partners must execute the official section change in the university portal during your designated advising slot.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10">
          <Link
            href="/register"
            className="inline-block rounded-[8px] bg-pine hover:bg-pine-hover text-paper text-sm font-semibold px-6 py-3 transition"
          >
            Create account
          </Link>
        </div>
      </Container>
    </div>
  );
}
