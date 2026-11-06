import React from "react";
import { Section } from "@/types/domain";
import { getCourseColor } from "@/lib/mock/colors";
import { AlertCircle, Check } from "lucide-react";

interface SectionRowProps {
  section: Section;
  isSelected: boolean;
  onToggle: () => void;
  clashExplanation?: string;
  disabled?: boolean;
}

export function SectionRow({
  section,
  isSelected,
  onToggle,
  clashExplanation,
  disabled = false,
}: SectionRowProps) {
  const isFull = section.seatsLeft === 0;
  const isRowDisabled = disabled || isFull;
  const color = getCourseColor(section.courseCode);

  return (
    <div
      onClick={() => {
        if (!isRowDisabled) onToggle();
      }}
      className={`p-3.5 rounded-[10px] border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left ${
        isRowDisabled
          ? "bg-[#F4F6F3]/60 border-[#16231F]/10 opacity-60 cursor-not-allowed"
          : isSelected
          ? "bg-white border-2 border-[#1D5B4A] shadow-xs cursor-pointer"
          : "bg-white border-[#16231F]/15 hover:border-[#1D5B4A]/50 cursor-pointer"
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {/* Section badge */}
          <span
            className={`px-2 py-0.5 rounded-[4px] border ${color.bg} ${color.border} font-heading font-extrabold text-xs text-[#16231F] tabular-nums`}
          >
            Sec {section.sectionNumber}
          </span>
          <span className="text-xs text-[#16231F]/70 font-semibold">
            Faculty: {section.faculty}
          </span>
          <span className="text-xs text-[#16231F]/50">·</span>
          <span className="text-xs text-[#16231F]/70">Room {section.room}</span>
        </div>

        {/* Schedule Slots */}
        <p className="text-xs text-[#16231F]/80 tabular-nums">
          {section.schedule.map((s) => `${s.day} ${s.slot}`).join(" · ")}
        </p>

        {/* Clash Indicator */}
        {clashExplanation && (
          <div className="flex items-center gap-1.5 text-xs text-[#D9381E] font-semibold mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{clashExplanation}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        {/* Seats left */}
        <div className="text-right">
          {isFull ? (
            <span className="px-2 py-0.5 rounded-[4px] bg-[#F2C4C4]/50 border border-[#D9381E]/30 text-[11px] font-bold text-[#D9381E]">
              Full (0 seats)
            </span>
          ) : (
            <span className="text-xs text-[#16231F]/60 tabular-nums">
              <strong className="text-[#16231F] font-semibold">{section.seatsLeft}</strong> /{" "}
              {section.totalSeats} seats
            </span>
          )}
        </div>

        {/* Checkbox button */}
        <div
          className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition ${
            isSelected
              ? "bg-[#1D5B4A] border-[#1D5B4A] text-white"
              : "border-[#16231F]/30 bg-white"
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>
    </div>
  );
}
