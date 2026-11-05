"use client";

import React, { useState } from "react";
import { useAuth } from "../../layout";

export default function SettingsPage() {
  const { user, sessions, refreshData } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [preferredTimeRange, setPreferredTimeRange] = useState(user?.preferredTimeRange || "ANY");
  const [allowMultiWaySwaps, setAllowMultiWaySwaps] = useState(user?.allowMultiWaySwaps ?? true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phone || null,
          preferredTimeRange,
          allowMultiWaySwaps,
        }),
      });
      if (res.ok) {
        setProfileMsg("Profile updated successfully.");
        refreshData();
      }
    } catch {
      setProfileMsg("Failed to update profile.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg("");
    setPwError("");
    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error?.message || "Failed to update password.");
      } else {
        setPwMsg("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        refreshData();
      }
    } catch {
      setPwError("An error occurred.");
    }
  };

  const handleRevokeSession = async (id: string) => {
    const res = await fetch(`/api/auth/sessions/${id}`, { method: "DELETE" });
    if (res.ok) {
      refreshData();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl text-left">
      <div className="pb-4 border-b border-[#16231F]/15">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#16231F]">
          Account & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#16231F]/70 mt-1">
          Manage your personal details, advising preferences, password, and active login sessions.
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 shadow-sm">
        <h2 className="text-lg font-heading font-bold text-[#16231F] mb-4 pb-2 border-b border-[#16231F]/10">
          Personal Information
        </h2>

        {profileMsg && <p className="text-xs text-[#1D5B4A] font-semibold mb-4">{profileMsg}</p>}

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 rounded-[8px] border border-[#16231F]/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+8801700000000"
              className="w-full h-10 rounded-[8px] border border-[#16231F]/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1">
              Preferred Time Range
            </label>
            <select
              value={preferredTimeRange}
              onChange={(e) => setPreferredTimeRange(e.target.value)}
              className="w-full h-10 rounded-[8px] border border-[#16231F]/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
            >
              <option value="ANY">Any Time</option>
              <option value="MORNING">Morning (08:30 - 11:30)</option>
              <option value="AFTERNOON">Afternoon (11:30 - 14:30)</option>
              <option value="EVENING">Evening (14:30+)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="multiway"
              checked={allowMultiWaySwaps}
              onChange={(e) => setAllowMultiWaySwaps(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="multiway" className="text-xs text-[#16231F]/80">
              Enable 3-way cycle matching
            </label>
          </div>

          <button
            type="submit"
            className="rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-[#F4F6F3] px-5 py-2.5 text-xs font-semibold shadow-sm transition"
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Security & Password */}
      <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 shadow-sm">
        <h2 className="text-lg font-heading font-bold text-[#16231F] mb-4 pb-2 border-b border-[#16231F]/10">
          Security & Password
        </h2>

        {pwMsg && <p className="text-xs text-[#1D5B4A] font-semibold mb-4">{pwMsg}</p>}
        {pwError && <p className="text-xs text-[#D9381E] font-semibold mb-4">{pwError}</p>}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 rounded-[8px] border border-[#16231F]/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 rounded-[8px] border border-[#16231F]/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
            />
          </div>

          <button
            type="submit"
            className="rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-[#F4F6F3] px-5 py-2.5 text-xs font-semibold shadow-sm transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 shadow-sm">
        <h2 className="text-lg font-heading font-bold text-[#16231F] mb-4 pb-2 border-b border-[#16231F]/10">
          Active Login Sessions
        </h2>
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="p-3.5 rounded-[8px] bg-[#F4F6F3] border border-[#16231F]/10 text-xs flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-sm text-[#16231F]">{s.device}</p>
                <p className="text-[11px] text-[#16231F]/60">IP: {s.ip}</p>
              </div>
              {s.current ? (
                <span className="px-2 py-0.5 rounded-[4px] bg-[#C2E4CE] text-[#16231F] font-bold text-[10px]">
                  Current Device
                </span>
              ) : (
                <button
                  onClick={() => handleRevokeSession(s.id)}
                  className="text-[#D9381E] hover:underline font-semibold"
                >
                  Revoke Session
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
