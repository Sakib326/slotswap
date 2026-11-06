"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRequests, useRoutine, useSwaps } from "@/lib/mock/api";
import { PageHeader } from "@/components/app/PageHeader";
import { RoutineGrid } from "@/components/app/RoutineGrid";
import { SwapChain } from "@/components/app/SwapChain";
import { CountdownBar } from "@/components/app/CountdownBar";
import { StatusTag } from "@/components/app/StatusTag";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { getCourseColor } from "@/lib/mock/colors";
import {
  ArrowRightLeft,
  ArrowRight,
  Info,
  X,
  Plus,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { enrollments, loading: routineLoading, error: routineError } = useRoutine();
  const { requests, loading: requestsLoading } = useRequests();
  const { swaps, loading: swapsLoading } = useSwaps();

  const [dismissNotice, setDismissNotice] = useState(false);

  // Find priority swap awaiting confirmation
  const urgentSwap = swaps.find(
    (s) =>
      s.status === "AWAITING_CONFIRMATION" &&
      s.participants.some((p) => p.isYou && p.status === "WAITING")
  );

  const openRequestsCount = requests.filter((r) => r.status === "OPEN").length;
  const awaitingSwapsCount = swaps.filter((s) => s.status === "AWAITING_CONFIRMATION").length;
  const completedSwapsCount = swaps.filter((s) => s.status === "COMPLETED").length;

  if (routineLoading || requestsLoading || swapsLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of your routine, swap requests, and active cycles."
        />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (routineError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of your routine, swap requests, and active cycles."
        />
        <ErrorState message={routineError} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Page Header with plain sentence-case summary */}
      <PageHeader
        title="Dashboard"
        description={`${openRequestsCount} open requests, ${awaitingSwapsCount} swap waiting for you, ${completedSwapsCount} swaps completed.`}
        action={
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>New request</span>
          </Link>
        }
      />

      {/* Dismissible 3-Day Window Notice */}
      {!dismissNotice && (
        <div className="p-3.5 rounded-[10px] bg-white border border-[#16231F]/15 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#16231F]">
            <Info className="w-4 h-4 text-[#1D5B4A] shrink-0" />
            <span>
              <strong>Advising window active:</strong> Swap window closes in 3 days. Make sure all requests have backup sections selected for faster matching.
            </span>
          </div>
          <button
            onClick={() => setDismissNotice(true)}
            className="p-1 rounded text-[#16231F]/40 hover:text-[#16231F]"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Priority Block: Waiting for your confirmation */}
      {urgentSwap ? (
        <div className="p-6 rounded-[12px] bg-white border-2 border-[#1D5B4A] space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#16231F]/10">
            <div>
              <h2 className="font-heading font-extrabold text-lg text-[#16231F]">
                Waiting for your confirmation
              </h2>
              <p className="text-xs text-[#16231F]/70 mt-0.5">
                A clash-free {urgentSwap.type === "THREE_WAY" ? "3-way" : "2-way"} cycle was found for {urgentSwap.courseCode}.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CountdownBar expiresAt={urgentSwap.expiresAt} />
              <Link
                href={`/swaps/${urgentSwap.id}`}
                className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
              >
                Review swap
              </Link>
            </div>
          </div>

          <SwapChain participants={urgentSwap.participants} />
        </div>
      ) : (
        <div className="p-4 rounded-[10px] bg-white border border-[#16231F]/15 flex items-center justify-between text-xs text-[#16231F]/70">
          <span>Nothing waiting for you right now. We notify you the moment a cycle is verified.</span>
          <Link href="/requests" className="text-[#1D5B4A] font-semibold underline">
            View requests
          </Link>
        </div>
      )}

      {/* Asymmetric Split: Compact Routine (8/12) + Requests List (4/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Compact Routine (8/12) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              My routine
            </h2>
            <Link
              href="/routine"
              className="text-xs text-[#1D5B4A] hover:underline font-semibold"
            >
              Open full routine
            </Link>
          </div>

          <RoutineGrid enrollments={enrollments} compact={true} />
        </div>

        {/* Requests List (4/12) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              Active requests
            </h2>
            <Link
              href="/requests"
              className="text-xs text-[#1D5B4A] hover:underline font-semibold"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {requests.slice(0, 3).map((req) => {
              const holdColor = getCourseColor(req.heldSection.courseCode);

              return (
                <Link
                  key={req.id}
                  href={`/requests/${req.id}`}
                  className="p-3.5 rounded-[10px] bg-white border border-[#16231F]/15 hover:border-[#1D5B4A] transition block space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-[4px] border ${holdColor.bg} ${holdColor.border} font-bold text-xs text-[#16231F] tabular-nums`}
                    >
                      {req.heldSection.courseCode} Sec {req.heldSection.sectionNumber}
                    </span>
                    <StatusTag status={req.status} />
                  </div>

                  <div className="text-xs text-[#16231F]/70 flex items-center gap-1.5 flex-wrap">
                    <span>Wants:</span>
                    {req.wantedSections.map((sec) => (
                      <span
                        key={sec.id}
                        className="px-1.5 py-0.2 rounded bg-[#F4F6F3] border border-[#16231F]/15 font-semibold text-[#16231F] text-[11px] tabular-nums"
                      >
                        Sec {sec.sectionNumber}
                      </span>
                    ))}
                  </div>

                  {req.suggestion && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#1D5B4A] font-semibold">
                      <Sparkles className="w-3 h-3 shrink-0" />
                      <span>Match suggestion available</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
