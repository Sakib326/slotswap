import React from "react";
import { SwapChainParticipant } from "@/types/domain";
import { ArrowRight, User, Check, Clock, X } from "lucide-react";
import { getCourseColor } from "@/lib/mock/colors";

interface SwapChainProps {
  participants: SwapChainParticipant[];
  className?: string;
  isInteractive?: boolean;
}

export function SwapChain({
  participants,
  className = "",
}: SwapChainProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 min-w-0 sm:min-w-[560px]">
          {participants.map((p, idx) => {
            const giveColor = getCourseColor(p.givingSection.courseCode);
            const getColor = getCourseColor(p.gettingSection.courseCode);

            return (
              <React.Fragment key={p.id}>
                {/* Participant Node */}
                <div
                  className={`flex-1 min-w-[170px] p-3.5 rounded-[10px] border transition flex flex-col justify-between ${
                    p.isYou
                      ? "bg-white border-2 border-[#1D5B4A]"
                      : "bg-white border-[#16231F]/15"
                  }`}
                >
                  {/* Header: Name + Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <User className="w-3.5 h-3.5 text-[#16231F]/50 shrink-0" aria-hidden="true" />
                      <span className="font-semibold text-xs text-[#16231F] truncate">
                        {p.isYou ? `You (${p.name.split(" ")[0]})` : p.name}
                      </span>
                      {p.isYou && (
                        <span className="px-1.5 py-0.2 rounded bg-[#1D5B4A] text-white text-[10px] font-bold shrink-0">
                          You
                        </span>
                      )}
                    </div>

                    {/* Status Indicator */}
                    {p.status === "CONFIRMED" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D5B4A] shrink-0">
                        <Check className="w-3 h-3 text-[#1D5B4A]" />
                        <span>Confirmed</span>
                      </span>
                    )}
                    {p.status === "WAITING" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16231F]/60 shrink-0">
                        <Clock className="w-3 h-3 text-[#16231F]/50" />
                        <span>Waiting</span>
                      </span>
                    )}
                    {p.status === "DECLINED" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D9381E] shrink-0">
                        <X className="w-3 h-3 text-[#D9381E]" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>

                  {/* Exchange Visual: Gives -> Gets */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[#16231F]/60 text-[11px] shrink-0">Gives:</span>
                      <span
                        className={`px-2 py-0.5 rounded-[4px] border ${giveColor.bg} ${giveColor.border} font-semibold text-[#16231F] text-[11px] tabular-nums truncate`}
                      >
                        {p.givingSection.courseCode} Sec {p.givingSection.sectionNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[#16231F]/60 text-[11px] shrink-0">Gets:</span>
                      <span
                        className={`px-2 py-0.5 rounded-[4px] border ${getColor.bg} ${getColor.border} font-semibold text-[#16231F] text-[11px] tabular-nums truncate`}
                      >
                        {p.gettingSection.courseCode} Sec {p.gettingSection.sectionNumber}
                      </span>
                    </div>
                  </div>

                  {/* Reliability Score */}
                  <div className="mt-2.5 pt-2 border-t border-[#16231F]/10 flex items-center justify-between text-[11px] text-[#16231F]/60">
                    <span>Reliability</span>
                    <span className="font-semibold text-[#16231F] tabular-nums">
                      {p.reliability}%
                    </span>
                  </div>
                </div>

                {/* Arrow Connector between nodes */}
                {idx < participants.length - 1 && (
                  <div className="flex items-center justify-center py-1 sm:py-0 shrink-0">
                    <ArrowRight className="w-4 h-4 text-[#16231F]/40 rotate-90 sm:rotate-0" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Cycle Closed-Loop Arrow Label */}
      <div className="mt-3 py-1.5 px-3 rounded-[6px] bg-[#F4F6F3] border border-[#16231F]/10 flex items-center justify-center gap-2 text-xs text-[#16231F]/70">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1D5B4A]" />
        <span>
          Closed {participants.length}-way cycle: every student gives one section and receives their desired section simultaneously.
        </span>
      </div>
    </div>
  );
}
