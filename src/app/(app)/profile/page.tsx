"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProfile } from "@/lib/mock/api";
import { PageHeader } from "@/components/app/PageHeader";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { useToast } from "@/components/app/Toast";
import { DayOfWeek, TimeRange, ContactVisibility } from "@/types/domain";
import { formatRelativeTime } from "@/lib/mock/time";
import {
  User,
  Sliders,
  Shield,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const {
    student,
    sessions,
    updateProfile,
    revokeSession,
    revokeAllOtherSessions,
  } = useProfile();
  const { toast } = useToast();

  // Tab State
  const setTab = (tab: string) => {
    router.replace(`/profile?tab=${tab}`);
  };

  // Form State for Profile
  const [name, setName] = useState(student.name);
  const [department, setDepartment] = useState(student.department);
  const [batch, setBatch] = useState(student.batch);
  const [phone, setPhone] = useState(student.phone);
  const [contactVisibility, setContactVisibility] = useState<ContactVisibility>(
    student.contactVisibility
  );

  // Form State for Preferences
  const [preferredDays, setPreferredDays] = useState<DayOfWeek[]>(student.preferredDays);
  const [preferredTimeRange, setPreferredTimeRange] = useState<TimeRange>(
    student.preferredTimeRange
  );
  const [allowMultiWaySwaps, setAllowMultiWaySwaps] = useState(
    student.allowMultiWaySwaps
  );
  const [notifyByEmail, setNotifyByEmail] = useState(student.notifyByEmail);
  const [notifyInApp, setNotifyInApp] = useState(student.notifyInApp);

  // Form State for Security Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Dialog states
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);

  // Dirty check
  const isProfileDirty =
    name !== student.name ||
    department !== student.department ||
    batch !== student.batch ||
    phone !== student.phone ||
    contactVisibility !== student.contactVisibility;

  const isPreferencesDirty =
    JSON.stringify(preferredDays) !== JSON.stringify(student.preferredDays) ||
    preferredTimeRange !== student.preferredTimeRange ||
    allowMultiWaySwaps !== student.allowMultiWaySwaps ||
    notifyByEmail !== student.notifyByEmail ||
    notifyInApp !== student.notifyInApp;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || name.length > 80) {
      toast("Name must be between 2 and 80 characters", "error");
      return;
    }
    if (phone && !/^\+?[0-9]{10,15}$/.test(phone)) {
      toast("Phone number must be 10-15 digits", "error");
      return;
    }

    updateProfile({
      name,
      department,
      batch,
      phone,
      contactVisibility,
    });
    toast("Profile updated successfully");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      preferredDays,
      preferredTimeRange,
      allowMultiWaySwaps,
      notifyByEmail,
      notifyInApp,
    });
    toast("Preferences saved successfully");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast("Enter your current password", "error");
      return;
    }
    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      toast("New password must be at least 8 characters with a letter and a number", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("New passwords do not match", "error");
      return;
    }

    toast("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleRevokeSingle = () => {
    if (sessionToRevoke) {
      revokeSession(sessionToRevoke);
      toast("Device session revoked");
      setSessionToRevoke(null);
    }
  };

  const handleRevokeAll = () => {
    revokeAllOtherSessions();
    toast("Logged out of all other devices");
    setRevokeAllOpen(false);
  };

  const toggleDay = (d: DayOfWeek) => {
    setPreferredDays((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Profile & Settings"
        description="Manage your student account identity, swap matching preferences, and active devices."
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#16231F]/15 pb-2">
        <button
          type="button"
          onClick={() => setTab("profile")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            activeTab === "profile"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("preferences")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            activeTab === "preferences"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Preferences</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("security")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            activeTab === "security"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security</span>
        </button>
      </div>

      {/* TAB 1: Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              Student identity
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#16231F] font-semibold mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs focus:ring-2 focus:ring-[#1D5B4A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#16231F] font-semibold mb-1">
                  Email address
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={student.email}
                    disabled
                    className="w-full p-2.5 rounded-[8px] border border-[#16231F]/15 bg-[#F4F6F3] text-xs opacity-80"
                  />
                  <span className="px-2 py-1 rounded-[4px] bg-[#C2E4CE] text-[#1D5B4A] font-bold text-[10px] shrink-0">
                    Verified
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#16231F] font-semibold mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={student.studentId}
                    disabled
                    className="w-full p-2.5 rounded-[8px] border border-[#16231F]/15 bg-[#F4F6F3] font-mono text-xs opacity-80"
                  />
                  <p className="text-[10px] text-[#16231F]/50 mt-1">
                    Ask an admin to change this
                  </p>
                </div>

                <div>
                  <label className="block text-[#16231F] font-semibold mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="BBA">BBA</option>
                    <option value="ENG">ENG</option>
                    <option value="MAT">MAT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#16231F] font-semibold mb-1">
                    Batch
                  </label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#16231F] font-semibold mb-1">
                    Phone number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+88017..."
                    className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
                  />
                </div>
              </div>

              {/* Contact Visibility */}
              <div className="pt-2">
                <label className="block text-[#16231F] font-semibold mb-1.5">
                  Show my phone number to swap partners
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setContactVisibility("AFTER_CONFIRMATION")}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
                      contactVisibility === "AFTER_CONFIRMATION"
                        ? "bg-[#1D5B4A] text-white"
                        : "bg-[#F4F6F3] border border-[#16231F]/20 text-[#16231F]"
                    }`}
                  >
                    After the swap is confirmed
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactVisibility("HIDDEN")}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
                      contactVisibility === "HIDDEN"
                        ? "bg-[#1D5B4A] text-white"
                        : "bg-[#F4F6F3] border border-[#16231F]/20 text-[#16231F]"
                    }`}
                  >
                    Never
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reliability Summary Box */}
          <div className="p-4 rounded-[12px] bg-white border border-[#16231F]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#16231F]">
                Reliability score
              </span>
              <span className="font-heading font-extrabold text-base text-[#1D5B4A] tabular-nums">
                {student.reliability}%
              </span>
            </div>
            <p className="text-xs text-[#16231F]/70">
              {student.swapsCompleted} swaps completed, {student.swapsCancelled} cancelled.
            </p>
            <p className="text-[11px] text-[#16231F]/50">
              Completing confirmed swap proposals preserves your score, while backing out after matches are verified reduces your matching priority.
            </p>
          </div>

          {/* Sticky Save Bar */}
          {isProfileDirty && (
            <div className="sticky bottom-16 lg:bottom-4 p-3 rounded-[10px] bg-[#16231F] text-white flex items-center justify-between shadow-xl animate-in slide-in-from-bottom-2">
              <span className="text-xs font-medium">Unsaved changes</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setName(student.name);
                    setDepartment(student.department);
                    setBatch(student.batch);
                    setPhone(student.phone);
                    setContactVisibility(student.contactVisibility);
                  }}
                  className="px-3 py-1 rounded-[6px] text-xs font-semibold text-white/80 hover:text-white"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[6px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold"
                >
                  Save changes
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* TAB 2: Preferences */}
      {activeTab === "preferences" && (
        <form onSubmit={handleSavePreferences} className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-5">
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              Matching preferences
            </h2>

            {/* Preferred Days Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#16231F]">
                Preferred routine days
              </label>
              <div className="flex gap-2">
                {(["SUN", "MON", "TUE", "WED", "THU"] as DayOfWeek[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
                      preferredDays.includes(d)
                        ? "bg-[#1D5B4A] text-white"
                        : "bg-[#F4F6F3] border border-[#16231F]/20 text-[#16231F]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Time Range */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#16231F]">
                Preferred time range
              </label>
              <div className="flex gap-2">
                {[
                  { id: "MORNING", label: "Morning" },
                  { id: "AFTERNOON", label: "Afternoon" },
                  { id: "ANY", label: "Any" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPreferredTimeRange(t.id as TimeRange)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
                      preferredTimeRange === t.id
                        ? "bg-[#1D5B4A] text-white"
                        : "bg-[#F4F6F3] border border-[#16231F]/20 text-[#16231F]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-2 border-t border-[#16231F]/10">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-[#16231F]">
                    Allow multi-way swaps
                  </p>
                  <p className="text-[11px] text-[#16231F]/60">
                    Include 3-way triangular chains when looking for matches.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allowMultiWaySwaps}
                  onChange={(e) => setAllowMultiWaySwaps(e.target.checked)}
                  className="w-4 h-4 accent-[#1D5B4A] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-[#16231F]">
                    Notify by email
                  </p>
                  <p className="text-[11px] text-[#16231F]/60">
                    Receive email alerts when a match or confirmation is waiting.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyByEmail}
                  onChange={(e) => setNotifyByEmail(e.target.checked)}
                  className="w-4 h-4 accent-[#1D5B4A] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-[#16231F]">
                    In-app notifications
                  </p>
                  <p className="text-[11px] text-[#16231F]/60">
                    Display badge and alert alerts inside the top bar.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyInApp}
                  onChange={(e) => setNotifyInApp(e.target.checked)}
                  className="w-4 h-4 accent-[#1D5B4A] rounded"
                />
              </label>
            </div>
          </div>

          {/* Sticky Save Bar */}
          {isPreferencesDirty && (
            <div className="sticky bottom-16 lg:bottom-4 p-3 rounded-[10px] bg-[#16231F] text-white flex items-center justify-between shadow-xl animate-in slide-in-from-bottom-2">
              <span className="text-xs font-medium">Unsaved changes</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreferredDays(student.preferredDays);
                    setPreferredTimeRange(student.preferredTimeRange);
                    setAllowMultiWaySwaps(student.allowMultiWaySwaps);
                    setNotifyByEmail(student.notifyByEmail);
                    setNotifyInApp(student.notifyInApp);
                  }}
                  className="px-3 py-1 rounded-[6px] text-xs font-semibold text-white/80 hover:text-white"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[6px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold"
                >
                  Save changes
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* TAB 3: Security */}
      {activeTab === "security" && (
        <div className="space-y-6 max-w-2xl">
          {/* Change Password */}
          <form
            onSubmit={handleChangePassword}
            className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4"
          >
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              Change password
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#16231F] font-semibold mb-1">
                  Current password
                </label>
                <input
                  type={showPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#16231F] font-semibold mb-1">
                  New password
                </label>
                <input
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
                />
                <p className="text-[10px] text-[#16231F]/50 mt-1">
                  Minimum 8 characters with at least one letter and one number
                </p>
              </div>

              <div>
                <label className="block text-[#16231F] font-semibold mb-1">
                  Confirm new password
                </label>
                <input
                  type={showPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="text-[11px] text-[#16231F]/60 flex items-center gap-1 hover:text-[#16231F]"
              >
                {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPw ? "Hide passwords" : "Show passwords"}</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold"
              >
                Update password
              </button>
            </div>
          </form>

          {/* Active Sessions */}
          <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#16231F]/10">
              <div>
                <h2 className="font-heading font-bold text-base text-[#16231F]">
                  Active devices
                </h2>
                <p className="text-xs text-[#16231F]/60 mt-0.5">
                  Devices signed in with your university account credentials.
                </p>
              </div>

              {sessions.filter((s) => !s.isCurrent).length > 0 && (
                <button
                  type="button"
                  onClick={() => setRevokeAllOpen(true)}
                  className="px-3 py-1.5 rounded-[6px] border border-[#D9381E]/30 text-[#D9381E] hover:bg-[#F2C4C4]/20 text-xs font-semibold"
                >
                  Log out all other devices
                </button>
              )}
            </div>

            <div className="space-y-2">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3 rounded-[8px] bg-[#F4F6F3] border border-[#16231F]/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-[#16231F]/60 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#16231F]">
                          {sess.device}
                        </span>
                        {sess.isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-[#C2E4CE] text-[#1D5B4A] font-bold text-[9px]">
                            This device
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#16231F]/60 font-mono mt-0.5">
                        {sess.ip} · Active {formatRelativeTime(sess.lastActiveAt)}
                      </p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      type="button"
                      onClick={() => setSessionToRevoke(sess.id)}
                      className="text-xs text-[#D9381E] hover:underline font-semibold"
                    >
                      Log out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revoke Single Session Dialog */}
      <ConfirmDialog
        open={Boolean(sessionToRevoke)}
        onClose={() => setSessionToRevoke(null)}
        onConfirm={handleRevokeSingle}
        title="Log out of this device?"
        description="This will end the active session on this device. You will need to sign in again from that device."
        confirmLabel="Log out device"
        isDestructive={true}
      />

      {/* Revoke All Other Sessions Dialog */}
      <ConfirmDialog
        open={revokeAllOpen}
        onClose={() => setRevokeAllOpen(false)}
        onConfirm={handleRevokeAll}
        title="Log out all other devices?"
        description={`This will immediately invalidate ${
          sessions.filter((s) => !s.isCurrent).length
        } other active device sessions. Only your current browser session will remain signed in.`}
        confirmLabel="Log out all devices"
        isDestructive={true}
      />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
