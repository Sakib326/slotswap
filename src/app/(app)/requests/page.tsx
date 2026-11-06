"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRequests } from "@/lib/mock/api";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusTag } from "@/components/app/StatusTag";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { getCourseColor } from "@/lib/mock/colors";
import { formatRelativeTime } from "@/lib/mock/time";
import { SwapRequest } from "@/types/domain";
import { Plus, Search, ArrowRight, X, Sparkles } from "lucide-react";

export default function RequestsListPage() {
  const { requests, loading, error, cancelRequest } = useRequests();
  const { toast } = useToast();

  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [requestToCancel, setRequestToCancel] = useState<SwapRequest | null>(null);

  const filteredRequests = requests.filter((r) => {
    if (filter === "OPEN" && r.status !== "OPEN") return false;
    if (filter === "MATCHED" && r.status !== "MATCHED") return false;
    if (filter === "AWAITING" && r.status !== "AWAITING_CONFIRMATION") return false;
    if (filter === "COMPLETED" && r.status !== "COMPLETED") return false;
    if (filter === "CLOSED" && r.status !== "CANCELLED") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const codeMatch = r.heldSection.courseCode.toLowerCase().includes(q);
      const titleMatch = r.heldSection.courseTitle.toLowerCase().includes(q);
      if (!codeMatch && !titleMatch) return false;
    }
    return true;
  });

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      cancelRequest(requestToCancel.id);
      toast(`Request for ${requestToCancel.heldSection.courseCode} cancelled`);
      setRequestToCancel(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Swap requests"
          description="Manage your active requests, view matched chains, and accept unlocked backup sections."
        />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Swap requests"
          description="Manage your active requests, view matched chains, and accept unlocked backup sections."
        />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Swap requests"
        description="Manage your active requests, track cycle matching, and accept unlocked suggestions."
        action={
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create request</span>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Segmented status filter */}
        <div className="flex gap-1 overflow-x-auto p-1 bg-white border border-[#16231F]/15 rounded-[8px]">
          {[
            { id: "ALL", label: "All" },
            { id: "OPEN", label: "Open" },
            { id: "MATCHED", label: "Matched" },
            { id: "AWAITING", label: "Awaiting confirmation" },
            { id: "COMPLETED", label: "Completed" },
            { id: "CLOSED", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold whitespace-nowrap transition ${
                filter === tab.id
                  ? "bg-[#1D5B4A] text-white"
                  : "text-[#16231F]/70 hover:text-[#16231F]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#16231F]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course code..."
            className="w-full pl-9 pr-3 py-2 rounded-[8px] border border-[#16231F]/20 bg-white text-xs text-[#16231F] focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
          />
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          title="No requests found"
          description={
            search || filter !== "ALL"
              ? "No requests match your current filters."
              : "You haven't posted any swap requests yet."
          }
          action={
            <Link
              href="/requests/new"
              className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
            >
              Post a request
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const holdColor = getCourseColor(req.heldSection.courseCode);
            const isCancellable = req.status === "OPEN" || req.status === "MATCHED";

            return (
              <div
                key={req.id}
                className="p-4 rounded-[12px] bg-white border border-[#16231F]/15 hover:border-[#1D5B4A]/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Held Section Chip */}
                    <span
                      className={`px-2.5 py-1 rounded-[4px] border ${holdColor.bg} ${holdColor.border} font-heading font-extrabold text-xs text-[#16231F] tabular-nums`}
                    >
                      {req.heldSection.courseCode} · Sec {req.heldSection.sectionNumber}
                    </span>

                    <span className="text-xs text-[#16231F]/40 font-bold">gives</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#16231F]/40" />
                    <span className="text-xs text-[#16231F]/40 font-bold">wants</span>

                    {/* Wanted Sections Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {req.wantedSections.map((sec) => (
                        <span
                          key={sec.id}
                          className="px-2 py-0.5 rounded-[4px] bg-[#F4F6F3] border border-[#16231F]/15 text-xs font-semibold text-[#16231F] tabular-nums"
                        >
                          Sec {sec.sectionNumber}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#16231F]/60">
                    <span>Created {formatRelativeTime(req.createdAt)}</span>
                    <span>·</span>
                    <span>
                      Schedule: {req.heldSection.schedule.map((s) => `${s.day} ${s.slot}`).join(", ")}
                    </span>
                  </div>

                  {/* Suggestion notice */}
                  {req.suggestion && req.status === "OPEN" && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#F5E39B]/50 border border-[#16231F]/15 text-xs text-[#16231F]">
                      <Sparkles className="w-3.5 h-3.5 text-[#1D5B4A] shrink-0" />
                      <span>{req.suggestion.reason}</span>
                    </div>
                  )}
                </div>

                {/* Right: Status Tag & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#16231F]/10">
                  <StatusTag status={req.status} />

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/requests/${req.id}`}
                      className="px-3 py-1.5 rounded-[8px] bg-white border border-[#16231F]/20 hover:bg-[#16231F]/5 text-xs font-semibold text-[#16231F] transition"
                    >
                      View
                    </Link>

                    {isCancellable && (
                      <button
                        type="button"
                        onClick={() => setRequestToCancel(req)}
                        className="px-3 py-1.5 rounded-[8px] text-xs font-semibold text-[#D9381E] hover:bg-[#F2C4C4]/20 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Request Dialog */}
      <ConfirmDialog
        open={Boolean(requestToCancel)}
        onClose={() => setRequestToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel swap request?"
        description={
          requestToCancel
            ? `Are you sure you want to cancel your swap request for ${requestToCancel.heldSection.courseCode} Sec ${requestToCancel.heldSection.sectionNumber}? Any active matching searches will stop immediately.`
            : ""
        }
        confirmLabel="Cancel request"
        isDestructive={true}
      />
    </div>
  );
}
