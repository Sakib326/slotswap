import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why SlotSwap exists, who it serves, and the student team behind this CSE 327 course project.",
};

const teamMembers = [
  { name: "S. M. Sakib", role: "Full Stack Engineer & Algorithm Lead", marker: "bg-marker-mint" },
  { name: "Team Member 2", role: "Frontend & UI Design", marker: "bg-marker-yellow" },
  { name: "Team Member 3", role: "Backend & Database", marker: "bg-marker-blue" },
  { name: "Team Member 4", role: "QA & Integration Testing", marker: "bg-marker-pink" },
];

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Story Column */}
          <div className="lg:col-span-8 max-w-2xl text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-ink leading-tight mb-6">
              About SlotSwap
            </h1>

            <div className="space-y-6 text-sm sm:text-base text-ink/80 leading-relaxed">
              <p>
                Every semester during course advising, students with clashing classes or inconvenient commute hours scramble to trade course sections. For years, the only channel has been posting in unstructured Facebook groups: <em>&quot;Holding CSE327 Sec 5, need Sec 2.&quot;</em>
              </p>
              <p>
                This manual approach breaks down rapidly. Hundreds of posts bury legitimate trades, direct two-person matches rarely line up neatly, and nobody can manually detect three-way cycles (where Rafi gives to Nila, Nila gives to Tanvir, and Tanvir gives to Rafi). Even when students agree on a swap in comments, they frequently discover too late that the new section clashes with another class or an exam slot.
              </p>
              <p>
                SlotSwap replaces that chaos with graph-based cycle detection, automated timetable clash verification, and atomic time-limited confirmations.
              </p>
            </div>

            {/* Academic note */}
            <div className="my-10 p-5 border border-ink/15 rounded-[12px] bg-white/60">
              <p className="font-heading font-bold text-base text-ink mb-1">
                Course project context
              </p>
              <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
                SlotSwap is a student project built for <strong>CSE 327: Software Engineering</strong>. It is designed around the real constraints and workflows of university advising weeks.
              </p>
            </div>

            {/* Team Members List */}
            <div className="mt-12 pt-8 border-t border-ink/15">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink mb-4">
                Project team
              </h2>
              <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
                {teamMembers.map((member) => (
                  <div key={member.name} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-[4px] ${member.marker} border border-ink/15 flex items-center justify-center font-bold text-xs text-ink`}
                      >
                        {member.name.charAt(0)}
                      </span>
                      <span className="font-medium text-sm text-ink">{member.name}</span>
                    </div>
                    <span className="text-xs text-ink/60">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar on Desktop */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 border border-ink/15 rounded-[12px] p-6 bg-white/70 space-y-6 text-left">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                  What it does
                </h3>
                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                  Automated course section swaps via graph cycle matching, schedule clash prevention, and time-bounded confirmation.
                </p>
              </div>

              <div className="border-t border-ink/10 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                  Who it&apos;s for
                </h3>
                <ul className="text-xs sm:text-sm text-ink/80 space-y-2">
                  <li>• Enrolled university students with advising holds</li>
                  <li>• Academic departments monitoring section demand</li>
                </ul>
              </div>

              <div className="border-t border-ink/10 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                  Key principle
                </h3>
                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                  All or nothing. If any student in a swap cycle fails to confirm, nobody loses their existing seat.
                </p>
              </div>

              <div className="border-t border-ink/10 pt-4">
                <Link
                  href="/register"
                  className="block w-full text-center rounded-[8px] bg-pine hover:bg-pine-hover text-paper text-xs font-semibold py-2.5 transition"
                >
                  Create account
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
