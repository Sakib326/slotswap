"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRequest, useSwaps, useRoutine } from "@/lib/mock/api";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusTag } from "@/components/app/StatusTag";
import { SwapChain } from "@/components/app/SwapChain";
import { RoutineGrid } from "@/components/app/RoutineGrid";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { getCourseColor } from "@/lib/mock/colors";
import { formatRelativeTime } from "@/lib/mock/time";
import { ArrowRight, Sparkles, Clock, ArrowLeft } from "lucide-react";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { request, loading, cancelRequest, acceptSuggestion } = useRequest(id);
  const { swaps } = useSwaps();
  const { enrollments } = useRoutine();
  const { toast } = useToast();

  const [confirmCancelOpen, setConfirmCancelOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Request details" description="Loading request..." />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (!request) {
    return (
      <EmptyState
        title="Request not found"
        description="The requested swap post may have been removed or does not exist."
        action={
          <Link
            href="/requests"
            className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
          >
            Back to requests
          </Link>
        }
      />
    );
  }

  const holdColor = getCourseColor(request.heldSection.courseCode);
  const matchedSwap = swaps.find((s) => s.id === request.matchedSwapId);

  const handleAcceptSuggestion = () => {
    acceptSuggestion();
    toast("Added suggested section to request. Matching cycle found!");
  };

  const handleConfirmCancel = () => {
    cancelRequest();
    toast("Request cancelled");
    setConfirmCancelOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 text-xs text-[#16231F]/60 hover:text-[#1D5B4A] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to requests</span>
        </Link>
        <PageHeader
          title={`${request.heldSection.courseCode} Swap Request`}
          description={`Created ${formatRelativeTime(request.createdAt)} · Preference: ${request.preferredTimeRange.toLowerCase()} hours.`}
          action={
            <div className="flex items-center gap-2">
              <StatusTag status={request.status} />
              {(request.status === "OPEN" || request.status === "MATCHED") && (
                <button
                  type="button"
                  onClick={() => setConfirmCancelOpen(true)}
                  className="px-3 py-1.5 rounded-[8px] border border-[#D9381E]/30 text-[#D9381E] hover:bg-[#F2C4C4]/20 text-xs font-semibold"
                >
                  Cancel request
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* Sections Overview Card */}
      <div className="p-5 rounded-[12px] bg-white border border-[#16231F]/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider block mb-1">
            Section you give
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-[4px] border ${holdColor.bg} ${holdColor.border} font-heading font-extrabold text-sm text-[#16231F] tabular-nums`}
            >
              {request.heldSection.courseCode} · Sec {request.heldSection.sectionNumber}
            </span>
            <span className="text-xs text-[#16231F]/70">
              {request.heldSection.faculty} · Room {request.heldSection.room}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider block mb-1">
            Sections you would accept ({request.wantedSections.length})
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {request.wantedSections.map((sec) => (
              <span
                key={sec.id}
                className="px-2 py-0.5 rounded-[4px] bg-[#F4F6F3] border border-[#16231F]/15 text-xs font-semibold text-[#16231F] tabular-nums"
              >
                Sec {sec.sectionNumber} ({sec.faculty})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestion Panel (Match-Unlock Suggestion) */}
      {request.suggestion && request.status === "OPEN" && (
        <div className="p-5 rounded-[12px] bg-white border-2 border-[#1D5B4A] space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1D5B4A]" />
            <h2 className="font-heading font-bold text-sm text-[#16231F]">
              Match suggestion available
            </h2>
          </div>
          <p className="text-xs text-[#16231F]/80">
            {request.suggestion.reason}. Adding this section unlocks a clash-free cycle with{" "}
            {request.suggestion.matchesInstantlyWithCount} other students right now.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleAcceptSuggestion}
              className="px-3.5 py-1.5 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
            >
              Accept suggestion
            </button>
            <span className="text-[11px] text-[#16231F]/60">
              Proposed section: Sec {request.suggestion.section.sectionNumber} (
              {request.suggestion.section.faculty})
            </span>
          </div>
        </div>
      )}

      {/* Matched Chain Preview if available */}
      {matchedSwap && (
        <div className="p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#16231F]/10">
            <div>
              <h2 className="font-heading font-bold text-base text-[#16231F]">
                Matched {matchedSwap.type === "THREE_WAY" ? "3-way" : "2-way"} chain
              </h2>
              <p className="text-xs text-[#16231F]/60">
                Cycle resolution is verified clash-free for all participants.
              </p>
            </div>
            <Link
              href={`/swaps/${matchedSwap.id}`}
              className="px-3 py-1.5 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
            >
              Review swap
            </Link>
          </div>
          <SwapChain participants={matchedSwap.participants} />
        </div>
      )}

      {/* Activity Timeline */}
      <div className="p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-3">
        <h2 className="font-heading font-bold text-sm text-[#16231F]">Activity timeline</h2>
        <div className="space-y-3 pl-2 border-l border-[#16231F]/15 text-xs">
          {request.timeline.map((item, idx) => (
            <div key={idx} className="relative pl-4 space-y-0.5">
              <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#1D5B4A]" />
              <p className="font-semibold text-[#16231F]">{item.event}</p>
              <p className="text-[10px] text-[#16231F]/60 font-mono">
                {formatRelativeTime(item.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel this request?"
        description="Are you sure you want to cancel this request? Any in-flight matching will cease and your current section will remain untouched."
        confirmLabel="Cancel request"
        isDestructive={true}
      />
    </div>
  );
}
