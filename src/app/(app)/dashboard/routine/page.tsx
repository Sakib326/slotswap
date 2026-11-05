import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";

export const metadata: Metadata = {
  title: "My Routine",
  description: "View and manage your enrolled university class routine.",
};

export default function RoutinePage() {
  return (
    <div className="space-y-6 max-w-7xl text-left">
      <div className="pb-4 border-b border-[#16231F]/15">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#16231F]">
          Enrolled Class Routine
        </h1>
        <p className="text-xs sm:text-sm text-[#16231F]/70 mt-1">
          Spring 2026 registered timetable · 15.0 Credits · 5 Sections
        </p>
      </div>

      <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-[#16231F]/10 text-[#16231F]/60 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Sunday</th>
                <th className="py-3 px-3">Monday</th>
                <th className="py-3 px-3">Tuesday</th>
                <th className="py-3 px-3">Wednesday</th>
                <th className="py-3 px-3">Thursday</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16231F]/5">
              <tr>
                <td className="py-4 px-3 font-mono text-[#16231F]/60 font-semibold">08:30 - 10:00</td>
                <td className="px-3">-</td>
                <td className="px-3">
                  <span className="px-2.5 py-1.5 rounded-[4px] bg-[#F5E39B] border border-[#16231F]/15 block font-semibold">
                    MAT216 · Sec 3
                  </span>
                </td>
                <td className="px-3">-</td>
                <td className="px-3">
                  <span className="px-2.5 py-1.5 rounded-[4px] bg-[#F5E39B] border border-[#16231F]/15 block font-semibold">
                    MAT216 · Sec 3
                  </span>
                </td>
                <td className="px-3">-</td>
              </tr>
              <tr>
                <td className="py-4 px-3 font-mono text-[#16231F]/60 font-semibold">10:00 - 11:30</td>
                <td className="px-3">
                  <span className="px-2.5 py-1.5 rounded-[4px] bg-[#F2C4C4] border border-[#D9381E]/40 block font-semibold text-[#D9381E]">
                    CSE327 · Sec 5 (Pending Swap)
                  </span>
                </td>
                <td className="px-3">-</td>
                <td className="px-3">
                  <span className="px-2.5 py-1.5 rounded-[4px] bg-[#C2E4CE] border border-[#1D5B4A]/30 block font-semibold text-[#16231F]">
                    CSE327 · Sec 2 (Target Slot)
                  </span>
                </td>
                <td className="px-3">-</td>
                <td className="px-3">-</td>
              </tr>
              <tr>
                <td className="py-4 px-3 font-mono text-[#16231F]/60 font-semibold">11:30 - 13:00</td>
                <td className="px-3">-</td>
                <td className="px-3">
                  <span className="px-2.5 py-1.5 rounded-[4px] bg-[#BCD7F2] border border-[#16231F]/15 block font-semibold">
                    ENG201 · Sec 1
                  </span>
                </td>
                <td className="px-3">-</td>
                <td className="px-3">
                  <span className="px-2.5 py-1.5 rounded-[4px] bg-[#BCD7F2] border border-[#16231F]/15 block font-semibold">
                    ENG201 · Sec 1
                  </span>
                </td>
                <td className="px-3">-</td>
              </tr>
              <tr>
                <td className="py-4 px-3 font-mono text-[#16231F]/60 font-semibold">13:00 - 14:30</td>
                <td className="px-3">
                  <span className="px-2.5 py-1.5 rounded-[4px] bg-[#F5E39B] border border-[#16231F]/15 block font-semibold">
                    PHY107 · Sec 4
                  </span>
                </td>
                <td className="px-3">-</td>
                <td className="px-3">
                  <span className="px-2.5 py-1.5 rounded-[4px] bg-[#F5E39B] border border-[#16231F]/15 block font-semibold">
                    PHY107 · Sec 4
                  </span>
                </td>
                <td className="px-3">-</td>
                <td className="px-3">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
