"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuditLogs } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { DiffList } from "@/components/admin/AdminCommon";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { formatRelativeTime } from "@/lib/mock/time";
import { AuditEntry } from "@/types/admin";
import { Search, ChevronDown, ChevronUp, ScrollText } from "lucide-react";

function AuditLogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logs, loading, error } = useAdminAuditLogs();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const actionFilter = searchParams.get("action") || "ALL";
  const q = searchParams.get("q") || "";

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (actionFilter !== "ALL" && l.action !== actionFilter) return false;
      if (q.trim()) {
        const query = q.toLowerCase();
        const mTarget = l.targetLabel.toLowerCase().includes(query);
        const mActor = l.actorName.toLowerCase().includes(query);
        const mAction = l.action.toLowerCase().includes(query);
        if (!mTarget && !mActor && !mAction) return false;
      }
      return true;
    });
  }, [logs, actionFilter, q]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Log" description="Loading administrative history..." />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Log" description="Administrative audit trail." />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Administrative Audit Trail"
        description="Immutable record of user role modifications, account suspensions, forced cancellations, and schedule imports."
      />

      {/* Toolbar */}
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
              router.replace(`/admin/audit-logs?${p.toString()}`);
            }}
            placeholder="Search by target or actor..."
            className="w-full pl-9 pr-3 py-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white focus:ring-2 focus:ring-[#1D5B4A] focus:outline-none"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => {
            const p = new URLSearchParams(searchParams.toString());
            if (e.target.value !== "ALL") p.set("action", e.target.value);
            else p.delete("action");
            router.replace(`/admin/audit-logs?${p.toString()}`);
          }}
          className="p-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
        >
          <option value="ALL">All Action Types</option>
          <option value="USER_ROLE_CHANGED">User Role Changed</option>
          <option value="USER_SUSPENDED">User Suspended</option>
          <option value="USER_REACTIVATED">User Reactivated</option>
          <option value="USER_DELETED">User Deleted</option>
          <option value="SWAP_FORCE_CANCELLED">Swap Force Cancelled</option>
          <option value="SECTIONS_IMPORTED">Sections Imported</option>
          <option value="SETTINGS_CHANGED">Settings Changed</option>
          <option value="SWAP_WINDOW_OPENED">Window Opened</option>
          <option value="SWAP_WINDOW_CLOSED">Window Closed</option>
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState title="No audit entries" description="No events match your current filter." />
      ) : (
        <div className="border border-[#16231F]/15 rounded-[12px] bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4 w-40">Timestamp</th>
                <th className="py-2.5 px-4">Actor</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Target Entity</th>
                <th className="py-2.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16231F]/10">
              {filteredLogs.map((entry) => {
                const isExpanded = expandedId === entry.id;
                const hasDetails = entry.details && entry.details.length > 0;

                return (
                  <React.Fragment key={entry.id}>
                    <tr
                      onClick={() => hasDetails && setExpandedId(isExpanded ? null : entry.id)}
                      className={`hover:bg-[#F4F6F3]/50 ${
                        hasDetails ? "cursor-pointer" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-[#16231F]/70 whitespace-nowrap">
                        {formatRelativeTime(entry.timestamp)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#16231F]">
                          {entry.actorName}
                        </span>
                        <span className="text-[10px] text-[#16231F]/50 block">
                          {entry.actorRole}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#F4F6F3] border border-[#16231F]/15 font-semibold text-[10px]">
                          {entry.action.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-[#16231F]">
                        {entry.targetLabel}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {hasDetails && (
                          <button
                            type="button"
                            className="text-[#1D5B4A] font-semibold text-xs inline-flex items-center gap-1"
                          >
                            <span>{isExpanded ? "Hide" : "Inspect"}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>

                    {isExpanded && entry.details && (
                      <tr className="bg-[#F4F6F3]/40">
                        <td colSpan={5} className="p-4 border-t border-[#16231F]/10">
                          <DiffList diffs={entry.details} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminAuditLogsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <AuditLogContent />
    </Suspense>
  );
}
