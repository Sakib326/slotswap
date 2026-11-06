"use client";

import React, { useState } from "react";
import { useAdminSettings } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { useToast } from "@/components/app/Toast";
import { SystemSettingsState } from "@/types/admin";
import { Sliders, Shield, Bell, RotateCcw } from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, loading, updateSettings, resetToDefaults } = useAdminSettings();
  const { toast } = useToast();

  const [form, setForm] = useState<SystemSettingsState>(settings);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Sync if settings load or update
  React.useEffect(() => {
    setForm(settings);
  }, [settings]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    toast("System settings updated & logged to audit trail");
  };

  const handleReset = () => {
    resetToDefaults();
    toast("Settings reset to defaults");
    setResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <PageHeader
        title="System Settings"
        description="Configure institutional cycle matching rules, student reliability penalties, and security policies."
        action={
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold hover:bg-[#16231F]/5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to defaults</span>
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Swapping Rules */}
        <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1D5B4A]" />
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              Cycle Matching Rules
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Confirmation Window Time Limit (Hours: 1 - 72)
              </label>
              <input
                type="number"
                min={1}
                max={72}
                value={form.confirmationTimeLimitHours}
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmationTimeLimitHours: parseInt(e.target.value, 10) || 1,
                  })
                }
                className="w-full max-w-xs p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
              />
              <p className="text-[11px] text-[#16231F]/60 mt-1">
                Hours all participants have to confirm once a closed cycle is verified.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Maximum Chain Length
              </label>
              <div className="flex gap-2">
                {[2, 3].map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() =>
                      setForm({ ...form, maxChainLength: len as 2 | 3 })
                    }
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
                      form.maxChainLength === len
                        ? "bg-[#1D5B4A] text-white"
                        : "bg-[#F4F6F3] border border-[#16231F]/20 text-[#16231F]"
                    }`}
                  >
                    {len === 2 ? "2-Way Direct Only" : "Up to 3-Way Chains (A→B→C→A)"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Maximum Open Requests Per Student
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.maxOpenRequestsPerStudent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxOpenRequestsPerStudent: parseInt(e.target.value, 10) || 1,
                  })
                }
                className="w-full max-w-xs p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Reliability Penalties */}
        <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
          <h2 className="font-heading font-bold text-base text-[#16231F]">
            Reliability & Scoring
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Penalty for Cancel After Confirm (points)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={form.pointsLostOnCancelAfterConfirm}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pointsLostOnCancelAfterConfirm: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Penalty for Decline (points)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={form.pointsLostOnDecline}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pointsLostOnDecline: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Accounts & Security */}
        <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#1D5B4A]" />
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              Account & Session Policies
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Allowed University Email Domains
              </label>
              <input
                type="text"
                value={form.allowedEmailDomains.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    allowedEmailDomains: e.target.value
                      .split(",")
                      .map((d) => d.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
              />
              <p className="text-[11px] text-[#16231F]/60 mt-1">
                Comma-separated list (e.g. northsouth.edu, alumni.northsouth.edu)
              </p>
            </div>

            <label className="flex items-center justify-between cursor-pointer pt-2">
              <div>
                <p className="font-semibold text-[#16231F]">
                  Require Verified Email to Login
                </p>
                <p className="text-[11px] text-[#16231F]/60">
                  Mandatory security policy. Enforced by university server.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.requireVerifiedEmail}
                disabled
                className="w-4 h-4 accent-[#1D5B4A] rounded opacity-70"
              />
            </label>
          </div>
        </div>

        {/* Sticky Save Bar */}
        {isDirty && (
          <div className="sticky bottom-4 p-3 rounded-[10px] bg-[#16231F] text-white flex items-center justify-between shadow-xl animate-in slide-in-from-bottom-2">
            <span className="text-xs font-medium">Unsaved configuration changes</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm(settings)}
                className="px-3 py-1 rounded-[6px] text-xs font-semibold text-white/80 hover:text-white"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-[6px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold"
              >
                Save settings
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Reset Confirmation */}
      <ConfirmDialog
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleReset}
        title="Reset system settings to defaults?"
        description="This will restore all cycle matching thresholds and reliability scoring to their factory default values."
        confirmLabel="Reset to defaults"
        isDestructive={true}
      />
    </div>
  );
}
