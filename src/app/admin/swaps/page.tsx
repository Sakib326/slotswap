"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminSwaps } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusTag } from "@/components/app/StatusTag";
import { TypeToConfirmDialog } from "@/components/admin/TypeToConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { formatTimeRemaining, formatRelativeTime } from "@/lib/mock/time";
import { SwapChain } from "@/types/domain";
import { Search, AlertTriangle, ArrowRight } from "lucide-react";

function SwapsTableContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { swaps, loading, error, forceCancelSwap } = useAdminSwaps();
  const { toast } = useToast();

  const statusFilter = searchParams.get("status") || "ALL";
  const typeFilter = searchParams.get("type") || "ALL";
  const q = searchParams.get("q") || "";

  const [cancelTarget, setCancelTarget] = useState<SwapChain | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const filteredSwaps = useMemo(() => {
    return swaps.filter((s) => {
      if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
      if (typeFilter !== "ALL" && s.type !== typeFilter) return false;
      if (q.trim()) {
        const query = q.toLowerCase();
        const mCourse = s.courseCode.toLowerCase().includes(query);
        const mPart = s.participants.some((p) => p.name.toLowerCase().includes(query));
        if (!mCourse && !mPart) return false;
      }
      return true;
    });
  }, [swaps, statusFilter, typeFilter, q]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Swaps" description="Loading swap cycles..." />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Swaps" description="Swap cycles overview." />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Swaps & Cycle Monitor"
        description="Inspect real-time 2-way and 3-way closed exchange chains, monitor expiry windows, and intervene if necessary."
      />

      {/* Filter toolbar */}
      <div className="p-3.5 rounded-[12px] bg-white border border-[#16231F]/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#16231F]/40" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams.toString());
              if (e.target.value) p.set("q", e.target.value);
              else p.delete("q");
              router.replace(`/admin/swaps?${p.toString()}`);
            }}
            placeholder="Search by course or student name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white focus:ring-2 focus:ring-[#1D5B4A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams.toString());
              if (e.target.value !== "ALL") p.set("status", e.target.value);
              else p.delete("status");
              router.replace(`/admin/swaps?${p.toString()}`);
            }}
            className="p-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="AWAITING_CONFIRMATION">Awaiting Confirmation</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams.toString());
              if (e.target.value !== "ALL") p.set("type", e.target.value);
              else p.delete("type");
              router.replace(`/admin/swaps?${p.toString()}`);
            }}
            className="p-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
          >
            <option value="ALL">All Chain Types</option>
            <option value="TWO_WAY">2-Way Direct</option>
            <option value="THREE_WAY">3-Way Chain</option>
          </select>
        </div>
      </div>

      {/* Swaps Table */}
      {filteredSwaps.length === 0 ? (
        <EmptyState
          title="No swaps match filters"
          description="Try selecting a different status or clear search."
        />
      ) : (
        <div className="border border-[#16231F]/15 rounded-[12px] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Swap ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Participants</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Window / Time</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16231F]/10">
                {filteredSwaps.map((s) => {
                  const timeInfo = formatTimeRemaining(s.expiresAt);
                  const isCancelable = s.status === "AWAITING_CONFIRMATION";

                  return (
                    <tr key={s.id} className="hover:bg-[#F4F6F3]/50">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#16231F]/70">
                        {s.id.replace("swap-", "")}
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-[#16231F]">
                          {s.type === "THREE_WAY" ? "3-Way Chain" : "2-Way Direct"}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-heading font-extrabold text-[#16231F]">
                        {s.courseCode}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {s.participants.map((p) => (
                            <span
                              key={p.id}
                              className="px-1.5 py-0.2 rounded bg-[#F4F6F3] border border-[#16231F]/10 text-[11px]"
                            >
                              {p.name.split(" ")[0]} ({p.givingSection.sectionNumber}→{p.gettingSection.sectionNumber})
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <StatusTag status={s.status} />
                      </td>

                      <td className="py-2.5 px-3 tabular-nums">
                        {s.status === "AWAITING_CONFIRMATION" ? (
                          <span
                            className={`font-semibold ${
                              timeInfo.isUrgent ? "text-[#D9381E]" : "text-[#1D5B4A]"
                            }`}
                          >
                            Expires in {timeInfo.text}
                          </span>
                        ) : (
                          <span className="text-[#16231F]/60">
                            {formatRelativeTime(s.createdAt)}
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right space-x-2">
                        <Link
                          href={`/admin/swaps/${s.id}`}
                          className="text-[#1D5B4A] hover:underline font-semibold"
                        >
                          Inspect
                        </Link>

                        {isCancelable && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(s)}
                            className="text-[#D9381E] hover:underline font-semibold"
                          >
                            Force cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Force Cancel Swap Dialog */}
      {cancelTarget && (
        <TypeToConfirmDialog
          open={Boolean(cancelTarget)}
          onClose={() => setCancelTarget(null)}
          onConfirm={() => {
            forceCancelSwap(cancelTarget.id, cancelReason);
            toast(`Force cancelled swap chain for ${cancelTarget.courseCode}`);
            setCancelTarget(null);
          }}
          title={`Force-cancel ${cancelTarget.courseCode} swap chain?`}
          description={`Cancelling this cycle will terminate the proposal for all ${cancelTarget.participants.length} students. An audit log record will be permanently generated.`}
          expectedText="CANCEL"
          reasonRequired={true}
          onReasonChange={setCancelReason}
          confirmLabel="Force cancel swap"
        />
      )}
    </div>
  );
}

export default function AdminSwapsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <SwapsTableContent />
    </Suspense>
  );
}
