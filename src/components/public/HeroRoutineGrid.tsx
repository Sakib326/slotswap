import React from "react";

export function HeroRoutineGrid() {
  return (
    <div className="w-full overflow-x-auto pb-3">
      <div className="min-w-[480px] bg-paper border border-ink/15 rounded-[12px] p-4 text-ink select-none relative">
        {/* Header meta bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink/10 text-xs">
          <span className="font-semibold text-ink/75">
            Class routine · Spring 2026
          </span>
          {/* Animated floating chip */}
          <span className="animate-chip text-[11px] font-semibold bg-marker-mint text-ink border border-ink/20 px-2 py-0.5 rounded-[4px] shadow-sm">
            Swap found: 3 students, no clashes
          </span>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-6 gap-1.5 text-center text-[11px] font-semibold text-ink/70 pb-1.5">
          <div className="text-left text-ink/40">Time</div>
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
        </div>

        {/* Routine Slots */}
        <div className="space-y-1.5 text-xs">
          {/* 08:30 */}
          <div className="grid grid-cols-6 gap-1.5 items-center">
            <div className="text-[11px] font-medium text-ink/50 tabular-nums">08:30</div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-marker-yellow text-ink font-semibold rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-ink/15 leading-tight">
              <span className="font-bold text-[11px]">MAT216</span>
              <span className="text-[10px] text-ink/75 tabular-nums">Sec 3</span>
            </div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-marker-yellow text-ink font-semibold rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-ink/15 leading-tight">
              <span className="font-bold text-[11px]">MAT216</span>
              <span className="text-[10px] text-ink/75 tabular-nums">Sec 3</span>
            </div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
          </div>

          {/* 10:00 - Swap Row */}
          <div className="grid grid-cols-6 gap-1.5 items-center relative">
            <div className="text-[11px] font-medium text-ink/50 tabular-nums">10:00</div>
            {/* Block A: CSE327 Sec 5 (swapping out) */}
            <div className="animate-swap-a bg-marker-pink text-ink rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-signal/80 leading-tight z-10">
              <span className="font-bold text-[11px]">CSE327</span>
              <span className="text-[10px] text-ink/80 tabular-nums">Sec 5 → 2</span>
            </div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            {/* Block B: Target Sec 2 swapping in */}
            <div className="animate-swap-b bg-marker-mint text-ink rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-pine/60 leading-tight z-10">
              <span className="font-bold text-[11px]">CSE327</span>
              <span className="text-[10px] text-ink/80 tabular-nums">Sec 2</span>
            </div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-marker-blue text-ink rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-ink/15 leading-tight">
              <span className="font-bold text-[11px]">ENG201</span>
              <span className="text-[10px] text-ink/75 tabular-nums">Sec 1</span>
            </div>
          </div>

          {/* 11:30 */}
          <div className="grid grid-cols-6 gap-1.5 items-center">
            <div className="text-[11px] font-medium text-ink/50 tabular-nums">11:30</div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-marker-blue text-ink rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-ink/15 leading-tight">
              <span className="font-bold text-[11px]">ENG201</span>
              <span className="text-[10px] text-ink/75 tabular-nums">Sec 1</span>
            </div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
          </div>

          {/* 13:00 */}
          <div className="grid grid-cols-6 gap-1.5 items-center">
            <div className="text-[11px] font-medium text-ink/50 tabular-nums">13:00</div>
            <div className="bg-marker-yellow text-ink rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-ink/15 leading-tight">
              <span className="font-bold text-[11px]">PHY107</span>
              <span className="text-[10px] text-ink/75 tabular-nums">Sec 4</span>
            </div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-marker-yellow text-ink rounded-[4px] h-10 flex flex-col justify-center px-1.5 border border-ink/15 leading-tight">
              <span className="font-bold text-[11px]">PHY107</span>
              <span className="text-[10px] text-ink/75 tabular-nums">Sec 4</span>
            </div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
          </div>

          {/* 14:30 */}
          <div className="grid grid-cols-6 gap-1.5 items-center">
            <div className="text-[11px] font-medium text-ink/50 tabular-nums">14:30</div>
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
            <div className="bg-white/60 border border-dashed border-ink/10 rounded-[4px] h-10" />
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-ink/10 flex items-center justify-between text-[11px] text-ink/60">
          <span>Highlight colors match enrolled courses</span>
          <span className="tabular-nums">5 days · 15 cr</span>
        </div>
      </div>
    </div>
  );
}
