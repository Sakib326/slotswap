import React from "react";

export function HeroRoutineGrid() {
  return (
    <div className="w-full overflow-x-auto pb-3">
      <div className="min-w-[480px] bg-[#F4F6F3] border border-[#16231F]/15 rounded-[12px] p-4 text-[#16231F] select-none">
        {/* Header meta bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#16231F]/10 text-xs">
          <span className="font-semibold text-[#16231F]/80">
            Class routine · Spring 2026
          </span>
          <span className="text-[11px] font-semibold bg-[#C2E4CE] text-[#16231F] border border-[#16231F]/20 px-2 py-0.5 rounded-[4px] shadow-sm">
            Swap found: 3 students, no clashes
          </span>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-6 gap-2 text-center text-[11px] font-semibold text-[#16231F]/70 pb-1.5">
          <div className="text-left text-[#16231F]/40">Time</div>
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
        </div>

        {/* Routine Slots */}
        <div className="space-y-2 text-xs">
          {/* 08:30 */}
          <div className="grid grid-cols-6 gap-2 items-center">
            <div className="text-[11px] font-medium text-[#16231F]/50 tabular-nums">08:30</div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-[#F5E39B] text-[#16231F] rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-[#16231F]/15 leading-tight">
              <span className="font-bold text-[11px]">MAT216</span>
              <span className="text-[10px] text-[#16231F]/75 tabular-nums">Sec 3</span>
            </div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-[#F5E39B] text-[#16231F] rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-[#16231F]/15 leading-tight">
              <span className="font-bold text-[11px]">MAT216</span>
              <span className="text-[10px] text-[#16231F]/75 tabular-nums">Sec 3</span>
            </div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
          </div>

          {/* 10:00 - Swapped Course Row */}
          <div className="grid grid-cols-6 gap-2 items-center">
            <div className="text-[11px] font-medium text-[#16231F]/50 tabular-nums">10:00</div>
            {/* Target Section 2 matched */}
            <div className="bg-[#C2E4CE] text-[#16231F] rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-[#1D5B4A]/60 leading-tight">
              <span className="font-bold text-[11px]">CSE327</span>
              <span className="text-[10px] text-[#16231F]/80 tabular-nums font-semibold">Sec 2 (New)</span>
            </div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            {/* Previous Section 5 successfully given away */}
            <div className="bg-[#F2C4C4]/60 text-[#16231F] rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-dashed border-[#D9381E]/60 leading-tight">
              <span className="font-bold text-[11px] line-through text-[#16231F]/60">CSE327</span>
              <span className="text-[10px] text-[#D9381E] tabular-nums font-semibold">Sec 5 (Swapped)</span>
            </div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-[#BCD7F2] text-[#16231F] rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-[#16231F]/15 leading-tight">
              <span className="font-bold text-[11px]">ENG201</span>
              <span className="text-[10px] text-[#16231F]/75 tabular-nums">Sec 1</span>
            </div>
          </div>

          {/* 11:30 */}
          <div className="grid grid-cols-6 gap-2 items-center">
            <div className="text-[11px] font-medium text-[#16231F]/50 tabular-nums">11:30</div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-[#BCD7F2] text-[#16231F] rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-[#16231F]/15 leading-tight">
              <span className="font-bold text-[11px]">ENG201</span>
              <span className="text-[10px] text-[#16231F]/75 tabular-nums">Sec 1</span>
            </div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
          </div>

          {/* 13:00 */}
          <div className="grid grid-cols-6 gap-2 items-center">
            <div className="text-[11px] font-medium text-[#16231F]/50 tabular-nums">13:00</div>
            <div className="bg-[#F5E39B] text-[#16231F] rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-[#16231F]/15 leading-tight">
              <span className="font-bold text-[11px]">PHY107</span>
              <span className="text-[10px] text-[#16231F]/75 tabular-nums">Sec 4</span>
            </div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-[#F5E39B] text-[#16231F] rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-[#16231F]/15 leading-tight">
              <span className="font-bold text-[11px]">PHY107</span>
              <span className="text-[10px] text-[#16231F]/75 tabular-nums">Sec 4</span>
            </div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
          </div>

          {/* 14:30 */}
          <div className="grid grid-cols-6 gap-2 items-center">
            <div className="text-[11px] font-medium text-[#16231F]/50 tabular-nums">14:30</div>
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-[#16231F]/10 rounded-[4px] h-10" />
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#16231F]/10 flex items-center justify-between text-[11px] text-[#16231F]/60">
          <span>Highlight colors match enrolled courses</span>
          <span className="tabular-nums">5 days · 15 cr</span>
        </div>
      </div>
    </div>
  );
}
