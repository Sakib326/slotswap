import React from "react";
import { ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";

export function SwapCycleIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto p-6 bg-gradient-to-br from-white to-bg-muted rounded-3xl border border-border shadow-sm">
      {/* Badge header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-subtle">
            3-Way Cycle Detected
          </span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success-soft text-success flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Clash-Free
        </span>
      </div>

      {/* Cycle Cards */}
      <div className="flex flex-col gap-3 relative">
        {/* Card 1: Rafi */}
        <div className="bg-white p-3.5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm text-text">Rafi</span>
              <span className="text-xs text-text-subtle">· CSE327</span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-danger font-medium bg-danger-soft px-1.5 py-0.5 rounded">
                Holds Sec 5
              </span>
              <ArrowRight className="w-3 h-3 text-text-subtle" />
              <span className="text-accent font-semibold bg-accent-soft px-1.5 py-0.5 rounded">
                Wants Sec 2
              </span>
            </div>
          </div>
          <span className="text-xs font-medium text-primary bg-primary-soft px-2 py-1 rounded-lg">
            Matched
          </span>
        </div>

        {/* Transition Arrow 1 */}
        <div className="flex justify-center -my-1 text-accent">
          <RefreshCw className="w-4 h-4 text-accent/70 rotate-90" />
        </div>

        {/* Card 2: Nila */}
        <div className="bg-white p-3.5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm text-text">Nila</span>
              <span className="text-xs text-text-subtle">· CSE327</span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-danger font-medium bg-danger-soft px-1.5 py-0.5 rounded">
                Holds Sec 2
              </span>
              <ArrowRight className="w-3 h-3 text-text-subtle" />
              <span className="text-accent font-semibold bg-accent-soft px-1.5 py-0.5 rounded">
                Wants Sec 7
              </span>
            </div>
          </div>
          <span className="text-xs font-medium text-primary bg-primary-soft px-2 py-1 rounded-lg">
            Matched
          </span>
        </div>

        {/* Transition Arrow 2 */}
        <div className="flex justify-center -my-1 text-accent">
          <RefreshCw className="w-4 h-4 text-accent/70 rotate-90" />
        </div>

        {/* Card 3: Tanvir */}
        <div className="bg-white p-3.5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm text-text">Tanvir</span>
              <span className="text-xs text-text-subtle">· CSE327</span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-danger font-medium bg-danger-soft px-1.5 py-0.5 rounded">
                Holds Sec 7
              </span>
              <ArrowRight className="w-3 h-3 text-text-subtle" />
              <span className="text-accent font-semibold bg-accent-soft px-1.5 py-0.5 rounded">
                Wants Sec 5
              </span>
            </div>
          </div>
          <span className="text-xs font-medium text-primary bg-primary-soft px-2 py-1 rounded-lg">
            Matched
          </span>
        </div>
      </div>

      {/* Cycle Completed Note */}
      <div className="mt-5 pt-3 border-t border-border/80 text-center">
        <p className="text-xs font-medium text-text-muted">
          Loop completed: <span className="text-primary font-semibold">Sec 5 → Sec 2 → Sec 7 → Sec 5</span>
        </p>
      </div>
    </div>
  );
}
