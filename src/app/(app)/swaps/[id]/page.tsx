"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSwap, useRoutine } from "@/lib/mock/api";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusTag } from "@/components/app/StatusTag";
import { SwapChain } from "@/components/app/SwapChain";
import { CountdownBar } from "@/components/app/CountdownBar";
import { RoutineGrid } from "@/components/app/RoutineGrid";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { getCourseColor } from "@/lib/mock/colors";
import { formatRelativeTime } from "@/lib/mock/time";
import { ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle, Phone } from "lucide-react";

export default function SwapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { swap, loading, confirmSwap, declineSwap } = useSwap(id);
  const { enrollments } = useRoutine();
  const { toast } = useToast();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Swap proposal" description="Loading swap..." />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (!swap) {
    return (
      <EmptyState
        title="Swap proposal not found"
        description="This swap proposal may have expired or was cancelled."
        action={
          <Link
            href="/swaps"
            className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
          >
            Back to swaps
          </Link>
        }
      />
    );
  }

  const you = swap.participants.find((p) => p.isYou);
  const isAwaitingYourAction =
    swap.status === "AWAITING_CONFIRMATION" && you && you.status === "WAITING";
  const hasYouConfirmed = you && you.status === "CONFIRMED";

  // Proposed ghost block preview for your target section
  const proposedGhostBlocks = you
    ? you.gettingSection.schedule.map((s) => ({
        day: s.day,
        slot: s.slot,
        courseCode: you.gettingSection.courseCode,
        sectionNumber: you.gettingSection.sectionNumber,
        room: you.gettingSection.room,
      }))
    : [];

  const handleConfirm = () => {
    confirmSwap();
    toast("Swap confirmed! Waiting for other participants to lock in.");
  };

  const handleDecline = () => {
    declineSwap();
    toast("Swap declined. All chain participants have been notified.", "error");
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <Link
          href="/swaps"
          className="inline-flex items-center gap-1.5 text-xs text-[#16231F]/60 hover:text-[#1D5B4A] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to swaps</span>
        </Link>
        <PageHeader
          title={`${swap.courseCode} Swap Proposal`}
          description={`${swap.type === "THREE_WAY" ? "3-Way closed chain" : "2-Way direct exchange"} · All-or-nothing confirmation rule applies.`}
          action={<StatusTag status={swap.status} />}
        />
      </div>

      {/* Countdown Bar if awaiting confirmation */}
      {swap.status === "AWAITING_CONFIRMATION" && (
        <CountdownBar expiresAt={swap.expiresAt} />
      )}

      {/* Main Grid: Swap Chain + Before/After Routine Comparison */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Chain Participants (7/12 on xl, full width on < xl) */}
        <div className="xl:col-span-7 space-y-6 min-w-0">
          <div className="p-4 sm:p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#16231F]/10">
              <h2 className="font-heading font-bold text-base text-[#16231F]">
                Cycle participants
              </h2>
              <span className="text-xs text-[#16231F]/60">
                {swap.participants.filter((p) => p.status === "CONFIRMED").length} of{" "}
                {swap.participants.length} confirmed
              </span>
            </div>

            <SwapChain participants={swap.participants} />
          </div>

          {/* Contact Details (Only visible when completed & visibility allows) */}
          {swap.status === "COMPLETED" && (
            <div className="p-5 rounded-[12px] bg-white border border-[#1D5B4A] space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1D5B4A]" />
                <h2 className="font-heading font-bold text-sm text-[#16231F]">
                  Exchange contact details (Swap completed)
                </h2>
              </div>
              <p className="text-xs text-[#16231F]/70">
                You can reach out to your swap partners for section advising paperwork or university registrar signature confirmations:
              </p>

              <div className="space-y-2 pt-2">
                {swap.participants
                  .filter((p) => !p.isYou)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-[8px] bg-[#F4F6F3] border border-[#16231F]/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#16231F]">{p.name}</span>
                        <span className="text-[#16231F]/60 ml-1.5 font-mono">
                          ({p.department})
                        </span>
                      </div>
                      {p.contactVisibility === "AFTER_CONFIRMATION" && p.phone ? (
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-[#1D5B4A]">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{p.phone}</span>
                        </div>
                      ) : (
                        <span className="text-[#16231F]/50 italic">Contact hidden</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Action Confirmation Buttons */}
          <div className="p-5 rounded-[12px] bg-white border border-[#16231F]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            {isAwaitingYourAction ? (
              <>
                <button
                  type="button"
                  onClick={() => setDeclineModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-[8px] border border-[#D9381E]/30 text-[#D9381E] hover:bg-[#F2C4C4]/20 text-xs font-semibold transition"
                >
                  Decline swap
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
                >
                  Confirm swap
                </button>
              </>
            ) : hasYouConfirmed && swap.status === "AWAITING_CONFIRMATION" ? (
              <div className="w-full text-center py-2 text-xs font-semibold text-[#1D5B4A] flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You confirmed. Waiting for remaining partners to confirm.</span>
              </div>
            ) : (
              <div className="w-full text-center py-1 text-xs text-[#16231F]/60">
                This proposal is closed ({swap.status.toLowerCase()}).
              </div>
            )}
          </div>
        </div>

        {/* Right: Your Change - Before vs After (5/12 on xl, full width on < xl) */}
        <div className="xl:col-span-5 space-y-4 min-w-0">
          <div className="p-4 sm:p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-3">
            <h2 className="font-heading font-bold text-sm text-[#16231F]">
              Your routine impact
            </h2>
            <div className="p-2.5 rounded-[6px] bg-[#C2E4CE]/40 border border-[#1D5B4A]/20 text-xs text-[#16231F] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D5B4A] shrink-0" />
              <span>
                <strong>0 Schedule clashes:</strong> Proposed Section {you?.gettingSection.sectionNumber} fits your remaining classes with no overlap.
              </span>
            </div>

            <p className="text-[11px] text-[#16231F]/60">
              Dashed block represents your prospective schedule once all participants lock in:
            </p>

            <RoutineGrid
              enrollments={enrollments}
              ghostBlocks={proposedGhostBlocks}
              compact={true}
            />
          </div>
        </div>
      </div>

      {/* Confirm Swap Dialog */}
      <ConfirmDialog
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm this section swap?"
        description={`By confirming, you agree to drop ${you?.givingSection.courseCode} Sec ${you?.givingSection.sectionNumber} and take Sec ${you?.gettingSection.sectionNumber}. Once all participants confirm, this swap takes effect immediately.`}
        confirmLabel="Confirm swap"
        isDestructive={false}
      />

      {/* Decline Swap Dialog */}
      <ConfirmDialog
        open={declineModalOpen}
        onClose={() => setDeclineModalOpen(false)}
        onConfirm={handleDecline}
        title="Decline this swap proposal?"
        description="Warning: Declining will cancel the entire cycle chain for all participants. Your original section enrollment will remain completely untouched."
        confirmLabel="Decline swap"
        isDestructive={true}
      />
    </div>
  );
}
