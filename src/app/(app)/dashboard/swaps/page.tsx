import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Swap Requests",
  description: "Manage your active and completed section swap requests.",
};

export default function SwapsPage() {
  return (
    <div className="space-y-6 max-w-7xl text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#16231F]/15 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#16231F]">
            Section Swap Requests
          </h1>
          <p className="text-xs sm:text-sm text-[#16231F]/70 mt-1">
            Track cycle progress, check schedule clash verifications, and post new requests.
          </p>
        </div>

        <button className="rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-[#F4F6F3] text-xs font-semibold px-4 py-2 transition shadow-sm w-fit">
          + Create Swap Request
        </button>
      </div>

      <div className="space-y-4">
        {/* Request 1: Matched */}
        <div className="bg-white border-2 border-[#1D5B4A] rounded-[12px] p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-heading font-extrabold text-lg text-[#16231F]">
                CSE327
              </span>
              <span className="text-xs text-[#16231F]/60">Software Engineering</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-[4px] bg-[#C2E4CE] text-[#16231F] font-bold text-xs uppercase tracking-wider w-fit">
              MATCHED (3-WAY CYCLE)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="px-2 py-1 rounded-[4px] bg-[#F2C4C4] border border-[#D9381E]/30 font-semibold">
              Holding: Section 5
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#16231F]/40" />
            <span className="px-2 py-1 rounded-[4px] bg-[#C2E4CE] border border-[#1D5B4A]/30 font-semibold">
              Accepting: Section 2, Section 7
            </span>
            <span className="text-[#1D5B4A] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 0 Schedule Clashes
            </span>
          </div>
        </div>

        {/* Request 2: Searching with Suggestion */}
        <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-heading font-extrabold text-lg text-[#16231F]">
                MAT216
              </span>
              <span className="text-xs text-[#16231F]/60">Linear Algebra & Complex Variables</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-[4px] bg-[#F5E39B] text-[#16231F] font-bold text-xs uppercase tracking-wider w-fit">
              SEARCHING CYCLES
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="px-2 py-1 rounded-[4px] bg-[#F4F6F3] border border-[#16231F]/15 font-semibold">
              Holding: Section 3
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#16231F]/40" />
            <span className="px-2 py-1 rounded-[4px] bg-[#F4F6F3] border border-[#16231F]/15 font-semibold">
              Accepting: Section 1
            </span>
          </div>

          {/* Engine unlock suggestion */}
          <div className="pt-2 border-t border-[#16231F]/10 flex items-start gap-2 text-xs text-[#1D5B4A]">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Match-Unlock Engine:</strong> 2 students are trading Section 4. If you accept Section 4 as a backup, a 3-way swap cycle will form immediately.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
