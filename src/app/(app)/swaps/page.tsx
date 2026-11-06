"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSwaps } from "@/lib/mock/api";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusTag } from "@/components/app/StatusTag";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { getCourseColor } from "@/lib/mock/colors";
import { formatTimeRemaining, formatRelativeTime } from "@/lib/mock/time";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";

export default function SwapsListPage() {
  const { swaps, loading, error } = useSwaps();
  const [tab, setTab] = useState<"ACTION" | "IN_PROGRESS" | "HISTORY">("ACTION");

  // Filter groups
  const needsActionSwaps = swaps.filter(
    (s) =>
      s.status === "AWAITING_CONFIRMATION" &&
      s.participants.some((p) => p.isYou && p.status === "WAITING")
  );

  const inProgressSwaps = swaps.filter(
    (s) =>
      s.status === "AWAITING_CONFIRMATION" &&
      s.participants.some((p) => p.isYou && p.status === "CONFIRMED")
  );

  const historySwaps = swaps.filter(
    (s) => s.status === "COMPLETED" || s.status === "CANCELLED" || s.status === "EXPIRED"
  );

  const currentList =
    tab === "ACTION"
      ? needsActionSwaps
      : tab === "IN_PROGRESS"
      ? inProgressSwaps
      : historySwaps;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My swaps"
          description="Review active swap proposals, confirm match cycles, and inspect previous history."
        />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My swaps"
          description="Review active swap proposals, confirm match cycles, and inspect previous history."
        />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="My swaps"
        description="Review active swap proposals, confirm match cycles, and inspect previous completed swaps."
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#16231F]/15 pb-2">
        <button
          type="button"
          onClick={() => setTab("ACTION")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            tab === "ACTION"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          <span>Needs action</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
              tab === "ACTION"
                ? "bg-white text-[#1D5B4A]"
                : "bg-[#16231F]/10 text-[#16231F]"
            }`}
          >
            {needsActionSwaps.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("IN_PROGRESS")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            tab === "IN_PROGRESS"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          <span>In progress</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
              tab === "IN_PROGRESS"
                ? "bg-white text-[#1D5B4A]"
                : "bg-[#16231F]/10 text-[#16231F]"
            }`}
          >
            {inProgressSwaps.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("HISTORY")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            tab === "HISTORY"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          <span>History</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
              tab === "HISTORY"
                ? "bg-white text-[#1D5B4A]"
                : "bg-[#16231F]/10 text-[#16231F]"
            }`}
          >
            {historySwaps.length}
          </span>
        </button>
      </div>

      {/* List Content */}
      {currentList.length === 0 ? (
        <EmptyState
          title={`No swaps in ${tab.toLowerCase().replace("_", " ")}`}
          description={
            tab === "ACTION"
              ? "You have no proposals waiting for your confirmation."
              : "No swaps currently in this state."
          }
        />
      ) : (
        <div className="space-y-3">
          {currentList.map((swap) => {
            const you = swap.participants.find((p) => p.isYou);
            const giveColor = you ? getCourseColor(you.givingSection.courseCode) : null;
            const getColor = you ? getCourseColor(you.gettingSection.courseCode) : null;
            const timeInfo = formatTimeRemaining(swap.expiresAt);

            return (
              <div
                key={swap.id}
                className="p-4 rounded-[12px] bg-white border border-[#16231F]/15 hover:border-[#1D5B4A]/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-extrabold text-sm text-[#16231F]">
                      {swap.courseCode} Swap
                    </span>
                    <span className="text-xs text-[#16231F]/40 font-mono">
                      ({swap.type === "THREE_WAY" ? "3-way chain" : "2-way direct"})
                    </span>
                  </div>

                  {you && (
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className="text-[#16231F]/60">You give:</span>
                      <span
                        className={`px-2 py-0.5 rounded-[4px] border ${giveColor?.bg} ${giveColor?.border} font-bold text-[#16231F] tabular-nums`}
                      >
                        Sec {you.givingSection.sectionNumber}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#16231F]/40" />
                      <span className="text-[#16231F]/60">You get:</span>
                      <span
                        className={`px-2 py-0.5 rounded-[4px] border ${getColor?.bg} ${getColor?.border} font-bold text-[#16231F] tabular-nums`}
                      >
                        Sec {you.gettingSection.sectionNumber}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-[#16231F]/60">
                    {swap.status === "AWAITING_CONFIRMATION" && (
                      <span className="tabular-nums font-semibold text-[#1D5B4A]">
                        Window expires in {timeInfo.text}
                      </span>
                    )}
                    {swap.status !== "AWAITING_CONFIRMATION" && (
                      <span>Created {formatRelativeTime(swap.createdAt)}</span>
                    )}
                    {swap.declinedByName && (
                      <span className="text-[#D9381E]">
                        · Declined by {swap.declinedByName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#16231F]/10">
                  <StatusTag status={swap.status} />

                  <Link
                    href={`/swaps/${swap.id}`}
                    className={`px-3.5 py-2 rounded-[8px] text-xs font-semibold transition ${
                      tab === "ACTION"
                        ? "bg-[#1D5B4A] hover:bg-[#164639] text-white"
                        : "bg-white border border-[#16231F]/20 text-[#16231F] hover:bg-[#16231F]/5"
                    }`}
                  >
                    {tab === "ACTION" ? "Review swap" : "View details"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
