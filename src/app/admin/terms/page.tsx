"use client";

import React, { Suspense, useState } from "react";
import { useAdminTerms } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { Drawer } from "@/components/app/Drawer";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { ErrorState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { Term } from "@/types/admin";
import { Plus, Check, Calendar, Power } from "lucide-react";

export default function AdminTermsPage() {
  const { terms, loading, error, toggleSwapWindow, setActiveTerm, createTerm } =
    useAdminTerms();
  const { toast } = useToast();

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [termName, setTermName] = useState("");
  const [startDate, setStartDate] = useState("2027-01-10");
  const [endDate, setEndDate] = useState("2027-04-28");

  const [toggleTarget, setToggleTarget] = useState<Term | null>(null);
  const [activateTarget, setActivateTarget] = useState<Term | null>(null);

  const activeTerm = terms.find((t) => t.status === "ACTIVE") || terms[0];

  const handleCreateTermSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termName || termName.length < 3) {
      toast("Term name required (e.g. Spring 2027)", "error");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast("End date must be after start date", "error");
      return;
    }

    createTerm({
      name: termName,
      startDate,
      endDate,
      swapWindowOpensAt: `${startDate}T08:00:00.000Z`,
      swapWindowClosesAt: `${endDate}T18:00:00.000Z`,
    });
    toast(`Created term ${termName}`);
    setCreateDrawerOpen(false);
    setTermName("");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Terms & Swap Window" description="Loading academic terms..." />
        <TableSkeleton rows={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Terms & Swap Window" description="Academic calendar." />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Terms & Swap Window Control"
        description="Configure academic semesters, switch active advising terms, and open/close student section swap windows."
        action={
          <button
            type="button"
            onClick={() => setCreateDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create term</span>
          </button>
        }
      />

      {/* Active Term Swap Window Controller Card */}
      {activeTerm && (
        <div className="p-6 rounded-[12px] bg-white border-2 border-[#1D5B4A] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D5B4A]">
                Currently Active Term
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-[#16231F] mt-0.5">
                {activeTerm.name}
              </h2>
              <p className="text-xs text-[#16231F]/60 mt-1">
                Semester dates: {activeTerm.startDate} to {activeTerm.endDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-[6px] text-xs font-bold ${
                  activeTerm.swapWindowOpen
                    ? "bg-[#C2E4CE] text-[#1D5B4A]"
                    : "bg-[#F2C4C4] text-[#D9381E]"
                }`}
              >
                {activeTerm.swapWindowOpen ? "SWAP WINDOW OPEN" : "SWAP WINDOW CLOSED"}
              </span>

              <button
                type="button"
                onClick={() => setToggleTarget(activeTerm)}
                className={`px-4 py-2 rounded-[8px] text-xs font-semibold transition ${
                  activeTerm.swapWindowOpen
                    ? "bg-[#D9381E] hover:bg-[#B32B14] text-white"
                    : "bg-[#1D5B4A] hover:bg-[#164639] text-white"
                }`}
              >
                {activeTerm.swapWindowOpen ? "Close window now" : "Open window now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Term List Table */}
      <div className="border border-[#16231F]/15 rounded-[12px] bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-4">Term</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Dates</th>
              <th className="py-2.5 px-4">Swap Window</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16231F]/10">
            {terms.map((t) => (
              <tr key={t.id} className="hover:bg-[#F4F6F3]/50">
                <td className="py-3 px-4 font-heading font-extrabold text-sm text-[#16231F]">
                  {t.name}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-[4px] font-bold text-[10px] ${
                      t.status === "ACTIVE"
                        ? "bg-[#1D5B4A] text-white"
                        : "bg-[#F4F6F3] border border-[#16231F]/20 text-[#16231F]/70"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="py-3 px-4 font-mono text-[11px]">
                  {t.startDate} → {t.endDate}
                </td>

                <td className="py-3 px-4">
                  <span className="font-semibold">
                    {t.swapWindowOpen ? "Open" : "Closed"}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  {t.status !== "ACTIVE" && (
                    <button
                      type="button"
                      onClick={() => setActivateTarget(t)}
                      className="text-[#1D5B4A] hover:underline font-semibold"
                    >
                      Set as active
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toggle Window Confirmation */}
      {toggleTarget && (
        <ConfirmDialog
          open={Boolean(toggleTarget)}
          onClose={() => setToggleTarget(null)}
          onConfirm={() => {
            toggleSwapWindow(toggleTarget.id, !toggleTarget.swapWindowOpen);
            toast(
              `Swap window ${!toggleTarget.swapWindowOpen ? "opened" : "closed"} for ${
                toggleTarget.name
              }`
            );
            setToggleTarget(null);
          }}
          title={
            toggleTarget.swapWindowOpen
              ? "Close advising swap window?"
              : "Open advising swap window?"
          }
          description={
            toggleTarget.swapWindowOpen
              ? "Closing the window prevents students from submitting new swap requests or confirming active proposals."
              : "Opening the window activates real-time cycle matching and allows students to confirm proposed exchanges."
          }
          confirmLabel={
            toggleTarget.swapWindowOpen ? "Close swap window" : "Open swap window"
          }
          isDestructive={toggleTarget.swapWindowOpen}
        />
      )}

      {/* Set Active Term Confirmation */}
      {activateTarget && (
        <ConfirmDialog
          open={Boolean(activateTarget)}
          onClose={() => setActivateTarget(null)}
          onConfirm={() => {
            setActiveTerm(activateTarget.id);
            toast(`Activated term ${activateTarget.name}`);
            setActivateTarget(null);
          }}
          title={`Switch active term to ${activateTarget.name}?`}
          description="Students visiting SlotSwap will immediately see courses, routines, and sections for this term."
          confirmLabel="Set as active"
        />
      )}

      {/* Create Term Drawer */}
      <Drawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        title="Create Academic Term"
      >
        <form onSubmit={handleCreateTermSubmit} className="space-y-4 text-xs text-left">
          <div>
            <label className="block font-semibold text-[#16231F] mb-1">
              Term Name (e.g. Spring 2027)
            </label>
            <input
              type="text"
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
              placeholder="Spring 2027"
              className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#16231F] mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#16231F] mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreateDrawerOpen(false)}
              className="px-3.5 py-2 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold"
            >
              Create term
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
