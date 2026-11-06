"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/mock/admin-store";
import { PageHeader } from "@/components/app/PageHeader";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { StatLine } from "@/components/admin/AdminCommon";
import { useToast } from "@/components/app/Toast";
import { formatTimeRemaining, formatRelativeTime } from "@/lib/mock/time";
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { state, dispatch } = useAdminStore();
  const { toast } = useToast();

  const [windowConfirmOpen, setWindowConfirmOpen] = useState(false);

  const activeTerm = state.terms.find((t) => t.status === "ACTIVE") || state.terms[0];

  // Needs Attention Items (computed live)
  const expiringSwaps = state.swaps.filter((s) => {
    if (s.status !== "AWAITING_CONFIRMATION") return false;
    const rem = formatTimeRemaining(s.expiresAt);
    return !rem.isExpired;
  });

  const fullSectionsWithRequests = state.sections.filter((s) => s.seatsLeft === 0);
  const unverifiedUsers = state.users.filter((u) => !u.isEmailVerified);

  const handleToggleSwapWindow = () => {
    dispatch({
      type: "TOGGLE_SWAP_WINDOW",
      payload: { termId: activeTerm.id, isOpen: !activeTerm.swapWindowOpen },
    });
    toast(
      `Swap window ${!activeTerm.swapWindowOpen ? "opened" : "closed"} for ${activeTerm.name}`
    );
    setWindowConfirmOpen(false);
  };

  return (
    <div className="space-y-8 text-left">
      <PageHeader
        title="Admin Portal Overview"
        description="Institutional health overview, advising window control, and priority items requiring attention."
        action={
          <button
            type="button"
            onClick={() => setWindowConfirmOpen(true)}
            className={`px-4 py-2 rounded-[8px] text-xs font-semibold transition ${
              activeTerm.swapWindowOpen
                ? "bg-[#D9381E] hover:bg-[#B32B14] text-white"
                : "bg-[#1D5B4A] hover:bg-[#164639] text-white"
            }`}
          >
            {activeTerm.swapWindowOpen ? "Close swap window" : "Open swap window"}
          </button>
        }
      />

      {/* Needs Attention Block */}
      <div className="p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#D9381E]" />
          <h2 className="font-heading font-bold text-sm text-[#16231F]">
            Needs attention
          </h2>
        </div>

        <div className="divide-y divide-[#16231F]/10 text-xs">
          {expiringSwaps.length > 0 && (
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#16231F]">
                  {expiringSwaps.length} swap proposals awaiting confirmation
                </span>
                <p className="text-[11px] text-[#16231F]/60">
                  Multiple students must lock in before the time window elapses.
                </p>
              </div>
              <Link
                href="/admin/swaps?status=AWAITING_CONFIRMATION"
                className="px-3 py-1 rounded-[6px] border border-[#16231F]/20 text-xs font-semibold hover:bg-[#16231F]/5"
              >
                View
              </Link>
            </div>
          )}

          {fullSectionsWithRequests.length > 0 && (
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#16231F]">
                  {fullSectionsWithRequests.length} sections are full (0 seats) with active student demand
                </span>
                <p className="text-[11px] text-[#16231F]/60">
                  High demand bottleneck courses: consider section capacity expansion.
                </p>
              </div>
              <Link
                href="/admin/courses"
                className="px-3 py-1 rounded-[6px] border border-[#16231F]/20 text-xs font-semibold hover:bg-[#16231F]/5"
              >
                View
              </Link>
            </div>
          )}

          {unverifiedUsers.length > 0 && (
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#16231F]">
                  {unverifiedUsers.length} student accounts remain unverified
                </span>
                <p className="text-[11px] text-[#16231F]/60">
                  Students have not confirmed their university email inbox.
                </p>
              </div>
              <Link
                href="/admin/users"
                className="px-3 py-1 rounded-[6px] border border-[#16231F]/20 text-xs font-semibold hover:bg-[#16231F]/5"
              >
                View
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Figures (4-Stat Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatLine
          label="Registered Users"
          value={state.users.length}
          subtext={`${state.users.filter((u) => u.status === "ACTIVE").length} active accounts`}
        />
        <StatLine
          label="Active Term"
          value={activeTerm.name}
          subtext={activeTerm.swapWindowOpen ? "Window is open" : "Window closed"}
        />
        <StatLine
          label="Swap Cycles"
          value={state.swaps.length}
          subtext="2-way and 3-way chains"
        />
        <StatLine
          label="Active Sections"
          value={state.sections.length}
          subtext="Across 6 departments"
        />
      </div>

      {/* Two Column Layout: Recent Audit Activity + Quick Jump Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Audit Log Activity (7/12) */}
        <div className="lg:col-span-7 p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#16231F]/10">
            <h2 className="font-heading font-bold text-sm text-[#16231F]">
              Recent Audit Activity
            </h2>
            <Link
              href="/admin/audit-logs"
              className="text-xs text-[#1D5B4A] hover:underline font-semibold"
            >
              View full audit log
            </Link>
          </div>

          <div className="divide-y divide-[#16231F]/10 text-xs">
            {state.auditLogs.slice(0, 6).map((item) => (
              <div key={item.id} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-[#16231F]">
                    {item.action.replace(/_/g, " ")}
                  </span>
                  <p className="text-[11px] text-[#16231F]/70">{item.targetLabel}</p>
                </div>
                <span className="text-[10px] text-[#16231F]/50 font-mono whitespace-nowrap">
                  {formatRelativeTime(item.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Master Catalog Links (5/12) */}
        <div className="lg:col-span-5 p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-3">
          <h2 className="font-heading font-bold text-sm text-[#16231F]">
            Master Management Portals
          </h2>

          <div className="space-y-2 text-xs">
            <Link
              href="/admin/users"
              className="p-3 rounded-[8px] bg-[#F4F6F3] hover:bg-[#1D5B4A]/10 border border-[#16231F]/10 flex items-center justify-between transition block"
            >
              <div>
                <p className="font-bold text-[#16231F]">User Management</p>
                <p className="text-[11px] text-[#16231F]/60">
                  Search, verify, and moderate student and admin accounts.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#16231F]/40" />
            </Link>

            <Link
              href="/admin/courses"
              className="p-3 rounded-[8px] bg-[#F4F6F3] hover:bg-[#1D5B4A]/10 border border-[#16231F]/10 flex items-center justify-between transition block"
            >
              <div>
                <p className="font-bold text-[#16231F]">Course & Section Catalog</p>
                <p className="text-[11px] text-[#16231F]/60">
                  Manage sections, faculties, and weekly slot schedules.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#16231F]/40" />
            </Link>

            <Link
              href="/admin/sections/import"
              className="p-3 rounded-[8px] bg-[#F4F6F3] hover:bg-[#1D5B4A]/10 border border-[#16231F]/10 flex items-center justify-between transition block"
            >
              <div>
                <p className="font-bold text-[#16231F]">Batch CSV Import</p>
                <p className="text-[11px] text-[#16231F]/60">
                  Import registrar sections file with live client validation.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#16231F]/40" />
            </Link>

            <Link
              href="/admin/analytics"
              className="p-3 rounded-[8px] bg-[#F4F6F3] hover:bg-[#1D5B4A]/10 border border-[#16231F]/10 flex items-center justify-between transition block"
            >
              <div>
                <p className="font-bold text-[#16231F]">Cycle Analytics</p>
                <p className="text-[11px] text-[#16231F]/60">
                  Inspect swap resolution trends and bottleneck courses.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#16231F]/40" />
            </Link>
          </div>
        </div>
      </div>

      {/* Swap Window Confirm Dialog */}
      <ConfirmDialog
        open={windowConfirmOpen}
        onClose={() => setWindowConfirmOpen(false)}
        onConfirm={handleToggleSwapWindow}
        title={
          activeTerm.swapWindowOpen
            ? "Close advising swap window?"
            : "Open advising swap window?"
        }
        description={
          activeTerm.swapWindowOpen
            ? "Students will no longer be able to post swap requests or confirm active cycle chains."
            : "Opening the window allows all students to submit requests and confirm matching cycles."
        }
        confirmLabel={activeTerm.swapWindowOpen ? "Close window" : "Open window"}
        isDestructive={activeTerm.swapWindowOpen}
      />
    </div>
  );
}
