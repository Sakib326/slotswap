import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";
import { HeroRoutineGrid } from "@/components/public/HeroRoutineGrid";

export const metadata: Metadata = {
  title: "SlotSwap - University course section swapping",
  description:
    "Post the section you hold and the ones you'd take. SlotSwap finds the match, even when it takes three students, and checks every clash before anyone confirms.",
};

export default function HomePage() {
  const steps = [
    {
      num: "1",
      title: "List your held section and acceptable targets",
      desc: "Pick the section currently in your advising slip and select all alternatives that work with your routine.",
    },
    {
      num: "2",
      title: "Matching engine identifies a valid cycle",
      desc: "Our graph detector searches for 2-way pairs and 3-way cycles, verifying exam and class time clashes.",
    },
    {
      num: "3",
      title: "All participants confirm before window expires",
      desc: "Everyone gets a countdown timer to confirm. Once locked, you head to the university portal to trade.",
    },
  ];

  return (
    <>
      {/* 1. HERO */}
      <section className="pt-12 pb-16 md:py-20 border-b border-ink/15 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column (Left-aligned, asymmetric) */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-ink leading-[1.05] tracking-tight mb-5">
                Got Sec 5. Need Sec 2.
              </h1>

              <p className="text-base sm:text-lg text-ink/80 leading-relaxed mb-8 max-w-lg">
                Post the section you hold and the ones you&apos;d take. SlotSwap finds the
                match, even when it takes three students, and checks every clash
                before anyone confirms.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="rounded-[8px] bg-pine hover:bg-pine-hover text-paper px-6 py-3 font-semibold text-sm transition"
                >
                  Create account
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-[8px] border border-ink/20 bg-paper hover:bg-ink/5 text-ink px-5 py-3 font-semibold text-sm transition"
                >
                  See how a swap works
                </Link>
              </div>
            </div>

            {/* Right Column: Routine Sheet Grid */}
            <div className="lg:col-span-6 w-full lg:-mr-8">
              <HeroRoutineGrid />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. THE FOUR FEATURES: HIERARCHY INSTEAD OF 4 EQUAL CARDS */}
      <section className="py-16 md:py-20 border-b border-ink/15 bg-paper">
        <Container>
          <div className="mb-10 max-w-2xl text-left">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink mb-2">
              Built for how course swaps actually happen
            </h2>
            <p className="text-sm sm:text-base text-ink/75">
              Facebook posts only work for simple direct trades. Real advising routines need graph cycles and schedule validation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Lead Feature: Multi-Way Matching (Large Block) */}
            <div className="lg:col-span-7 border border-ink/15 rounded-[12px] p-6 sm:p-8 bg-white/50 text-left">
              <div className="inline-block px-2 py-0.5 rounded-[4px] bg-marker-blue text-ink text-xs font-semibold mb-3">
                Primary matching engine
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-ink mb-3">
                Multi-way swap matching
              </h3>
              <p className="text-sm sm:text-base text-ink/80 leading-relaxed mb-6 max-w-xl">
                When student A has section 5 and wants 2, student B has 2 and wants 7, and student C has 7 and wants 5, no two students can trade directly. SlotSwap models all student requests as a directed graph to discover 3-way cycles that resolve everyone&apos;s schedule simultaneously.
              </p>

              {/* Diagram: Three routine blocks connected in a loop */}
              <div className="border border-ink/15 rounded-[8px] p-4 bg-paper max-w-md">
                <p className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider mb-2">
                  Cycle topology example
                </p>
                <div className="flex items-center justify-between text-xs font-semibold gap-2">
                  <div className="p-2 rounded-[4px] bg-marker-pink border border-ink/15 text-center flex-1">
                    <div>Rafi</div>
                    <div className="text-[10px] text-ink/70 tabular-nums">Sec 5 → 2</div>
                  </div>
                  <span className="text-ink/40 font-bold">⇄</span>
                  <div className="p-2 rounded-[4px] bg-marker-yellow border border-ink/15 text-center flex-1">
                    <div>Nila</div>
                    <div className="text-[10px] text-ink/70 tabular-nums">Sec 2 → 7</div>
                  </div>
                  <span className="text-ink/40 font-bold">⇄</span>
                  <div className="p-2 rounded-[4px] bg-marker-mint border border-ink/15 text-center flex-1">
                    <div>Tanvir</div>
                    <div className="text-[10px] text-ink/70 tabular-nums">Sec 7 → 5</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other 3 Features: Plain structured list with different visual weights */}
            <div className="lg:col-span-5 flex flex-col divide-y divide-ink/15 border-t border-b lg:border-t-0 lg:border-b-0 border-ink/15">
              <div className="py-5 first:pt-0">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded-[4px] bg-marker-mint text-ink text-xs font-bold shrink-0 mt-0.5">
                    Clash
                  </span>
                  <div>
                    <h4 className="font-heading font-bold text-base text-ink mb-1">
                      Schedule clash validation
                    </h4>
                    <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
                      A swap is proposed only if the target section does not overlap with any of your registered theory classes, lab slots, or midterm exam periods.
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-5">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded-[4px] bg-marker-pink text-ink text-xs font-bold shrink-0 mt-0.5">
                    Atomic
                  </span>
                  <div>
                    <h4 className="font-heading font-bold text-base text-ink mb-1">
                      Atomic confirmation with auto-expiry
                    </h4>
                    <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
                      Every student in a swap chain must confirm within a strict countdown window. If one student cancels or times out, the swap cancels safely for everyone and re-enters the pool.
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-5 last:pb-0">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded-[4px] bg-marker-yellow text-ink text-xs font-bold shrink-0 mt-0.5">
                    Unlock
                  </span>
                  <div>
                    <h4 className="font-heading font-bold text-base text-ink mb-1">
                      Match-unlock suggestion engine
                    </h4>
                    <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
                      If your exact choice has no trade partner, SlotSwap calculates the smallest compromise (such as adding Section 3 to your list) that unlocks a match right away.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. HOW IT WORKS PREVIEW: HORIZONTAL STRIP OF REAL SEQUENCE */}
      <section className="py-16 md:py-20 border-b border-ink/15 bg-paper">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink mb-2">
                Three steps to a balanced routine
              </h2>
              <p className="text-sm text-ink/75">
                No endless comment refreshes. Clear verification at every step.
              </p>
            </div>
            <Link
              href="/how-it-works"
              className="text-xs sm:text-sm font-semibold text-pine hover:underline shrink-0"
            >
              See complete 5-step walkthrough
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st) => (
              <div
                key={st.num}
                className="border-t-2 border-pine pt-4 flex flex-col text-left"
              >
                <span className="font-heading font-extrabold text-2xl text-pine mb-1 tabular-nums">
                  0{st.num}
                </span>
                <h3 className="font-heading font-bold text-base text-ink mb-2">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. CLOSING CTA: PLAIN PINE BAND, LEFT-ALIGNED */}
      <section className="bg-pine text-paper py-16 md:py-20">
        <Container>
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-paper mb-4 leading-tight">
              Ready to fix your advising routine?
            </h2>
            <p className="text-paper/80 text-sm sm:text-base leading-relaxed mb-6">
              Create an account with your university email. List your current section, choose where you want to go, and let the cycle matching handle the rest.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-[8px] bg-paper hover:bg-white text-ink font-semibold text-sm px-6 py-3 transition"
            >
              Create account
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
