"use client";

import React, { use, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminSwap } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { Breadcrumbs, DiffList } from "@/components/admin/AdminCommon";
import { StatusTag } from "@/components/app/StatusTag";
import { SwapChain } from "@/components/app/SwapChain";
import { CountdownBar } from "@/components/app/CountdownBar";
import { TypeToConfirmDialog } from "@/components/admin/TypeToConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { formatRelativeTime } from "@/lib/mock/time";
import { ShieldAlert, CheckCircle2, User, Phone } from "lucide-react";

function SwapDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { swap, loading, forceCancelSwap } = useAdminSwap(id);
  const { toast } = useToast();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Swap details" description="Loading swap chain..." />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (!swap) {
    return (
      <EmptyState
        title="Swap not found"
        description="The requested swap cycle does not exist."
        action={
          <Link
            href="/admin/swaps"
            className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
          >
            Back to swaps
          </Link>
        }
      />
    );
  }

  const isCancelable =
    swap.status === "AWAITING_CONFIRMATION" || swap.status === "CONFIRMED";

  return (
    <div className="space-y-6 text-left">
      <div>
        <Breadcrumbs
          items={[
            { label: "Swaps", href: "/admin/swaps" },
            { label: `${swap.courseCode} (${swap.id})` },
          ]}
        />
        <PageHeader
          title={`${swap.courseCode} ${swap.type === "THREE_WAY" ? "3-Way Chain" : "2-Way Direct"} Swap`}
          description={`Created ${formatRelativeTime(swap.createdAt)} · ${swap.participants.length} students participating in this cycle.`}
          action={
            <div className="flex items-center gap-3">
              <StatusTag status={swap.status} />
              {isCancelable && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="px-3 py-1.5 rounded-[8px] bg-[#D9381E] hover:bg-[#B32B14] text-white text-xs font-semibold transition"
                >
                  Force cancel swap
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* Countdown if awaiting */}
      {swap.status === "AWAITING_CONFIRMATION" && (
        <CountdownBar expiresAt={swap.expiresAt} />
      )}

      {/* Cycle illustration */}
      <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
        <h2 className="font-heading font-bold text-base text-[#16231F]">
          Closed-loop chain illustration
        </h2>
        <SwapChain participants={swap.participants} />
      </div>

      {/* Per-participant details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {swap.participants.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-[12px] bg-white border border-[#16231F]/15 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#16231F]/50" />
                <span className="font-bold text-xs text-[#16231F]">{p.name}</span>
              </div>
              <span className="text-[11px] font-semibold text-[#16231F]/60">
                {p.department}
              </span>
            </div>

            <div className="text-xs space-y-1 bg-[#F4F6F3] p-2.5 rounded-[8px]">
              <div className="flex justify-between">
                <span className="text-[#16231F]/60">Gives:</span>
                <span className="font-bold font-mono">
                  {p.givingSection.courseCode} Sec {p.givingSection.sectionNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#16231F]/60">Gets:</span>
                <span className="font-bold font-mono text-[#1D5B4A]">
                  {p.gettingSection.courseCode} Sec {p.gettingSection.sectionNumber}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#16231F]/70 flex items-center justify-between">
              <span>Reliability: {p.reliability}%</span>
              {p.phone && (
                <span className="font-mono text-[#1D5B4A]">{p.phone}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Force Cancel Dialog */}
      {cancelModalOpen && (
        <TypeToConfirmDialog
          open={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={() => {
            forceCancelSwap(cancelReason);
            toast("Force cancelled swap and appended audit log entry");
            router.push("/admin/swaps");
          }}
          title="Force-cancel this swap chain?"
          description="This action terminates the cycle for all students. Their original sections remain intact."
          expectedText="CANCEL"
          reasonRequired={true}
          onReasonChange={setCancelReason}
          confirmLabel="Force cancel"
        />
      )}
    </div>
  );
}

export default function AdminSwapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <SwapDetailContent id={id} />
    </Suspense>
  );
}
