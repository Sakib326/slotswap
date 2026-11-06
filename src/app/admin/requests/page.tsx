"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminRequests } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusTag } from "@/components/app/StatusTag";
import { Drawer } from "@/components/app/Drawer";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { SwapRequest } from "@/types/domain";
import { getCourseColor } from "@/lib/mock/colors";
import { formatRelativeTime } from "@/lib/mock/time";
import { Search, ArrowRight, User } from "lucide-react";

function RequestsTableContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requests, loading, error } = useAdminRequests();

  const [activeRequest, setActiveRequest] = useState<SwapRequest | null>(null);

  const statusFilter = searchParams.get("status") || "ALL";
  const q = searchParams.get("q") || "";

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (q.trim()) {
        const query = q.toLowerCase();
        const mCourse = r.heldSection.courseCode.toLowerCase().includes(query);
        if (!mCourse) return false;
      }
      return true;
    });
  }, [requests, statusFilter, q]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Swap requests" description="Loading student requests..." />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Swap requests" description="Read-only student requests." />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Student Swap Requests"
        description="Read-only inspection of student requests, desired target sections, and match suggestions."
      />

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
              router.replace(`/admin/requests?${p.toString()}`);
            }}
            placeholder="Filter by course code..."
            className="w-full pl-9 pr-3 py-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white focus:ring-2 focus:ring-[#1D5B4A] focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            const p = new URLSearchParams(searchParams.toString());
            if (e.target.value !== "ALL") p.set("status", e.target.value);
            else p.delete("status");
            router.replace(`/admin/requests?${p.toString()}`);
          }}
          className="p-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="MATCHED">Matched</option>
          <option value="AWAITING_CONFIRMATION">Awaiting Confirmation</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState title="No requests found" description="No requests match your current filters." />
      ) : (
        <div className="border border-[#16231F]/15 rounded-[12px] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Course / Held</th>
                  <th className="py-2.5 px-3">Wanted Sections</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16231F]/10">
                {filteredRequests.map((r) => {
                  const color = getCourseColor(r.heldSection.courseCode);

                  return (
                    <tr
                      key={r.id}
                      onClick={() => setActiveRequest(r)}
                      className="hover:bg-[#F4F6F3]/50 cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-semibold text-[#16231F]">
                        Tanvir Hasan
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] border ${color.bg} ${color.border} font-bold text-xs tabular-nums`}
                        >
                          {r.heldSection.courseCode} · Sec {r.heldSection.sectionNumber}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {r.wantedSections.map((w) => (
                            <span
                              key={w.id}
                              className="px-1.5 py-0.2 rounded bg-[#F4F6F3] border border-[#16231F]/10 text-[11px] tabular-nums"
                            >
                              Sec {w.sectionNumber}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <StatusTag status={r.status} />
                      </td>

                      <td className="py-2.5 px-3 text-[#16231F]/60">
                        {formatRelativeTime(r.createdAt)}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[#1D5B4A] hover:underline font-semibold">
                          Inspect
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Request Drawer */}
      <Drawer
        open={Boolean(activeRequest)}
        onClose={() => setActiveRequest(null)}
        title={
          activeRequest
            ? `${activeRequest.heldSection.courseCode} Request Details`
            : ""
        }
      >
        {activeRequest && (
          <div className="space-y-6 text-xs text-left">
            <div className="p-3.5 rounded-[8px] bg-[#F4F6F3] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#16231F]/60">Held Section:</span>
                <span className="font-bold">
                  {activeRequest.heldSection.courseCode} Sec {activeRequest.heldSection.sectionNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#16231F]/60">Status:</span>
                <StatusTag status={activeRequest.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-[#16231F]/60">Created:</span>
                <span>{formatRelativeTime(activeRequest.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#16231F]/60">Allow 3-Way Chains:</span>
                <span>{activeRequest.allowMultiWaySwaps ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-[#16231F]">Candidate Target Sections:</h3>
              <div className="space-y-1.5">
                {activeRequest.wantedSections.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-[6px] border border-[#16231F]/15 flex items-center justify-between"
                  >
                    <span>
                      Sec {s.sectionNumber} · {s.faculty} · Room {s.room}
                    </span>
                    <span className="font-mono text-[#16231F]/60">
                      {s.schedule.map((slot) => `${slot.day} ${slot.slot}`).join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <RequestsTableContent />
    </Suspense>
  );
}
