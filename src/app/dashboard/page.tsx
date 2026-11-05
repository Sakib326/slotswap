"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/public/Container";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredTimeRange, setPreferredTimeRange] = useState("ANY");
  const [allowMultiWaySwaps, setAllowMultiWaySwaps] = useState(true);

  // Password changing
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch("/api/users/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setUser(data);
      setName(data.name || "");
      setPhone(data.phone || "");
      setPreferredTimeRange(data.preferredTimeRange || "ANY");
      setAllowMultiWaySwaps(data.allowMultiWaySwaps ?? true);

      // Load sessions
      const sRes = await fetch("/api/auth/sessions");
      if (sRes.ok) {
        const sData = await sRes.json();
        setSessions(sData);
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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
        const updated = await res.json();
        setUser(updated);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage("");
    setPwError("");
    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error?.message || "Failed to change password.");
      } else {
        setPwMessage("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setIsChangingPassword(false);
        loadData();
      }
    } catch {
      setPwError("An error occurred while changing password.");
    }
  };

  const handleRevokeSession = async (id: string) => {
    const res = await fetch(`/api/auth/sessions/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadData();
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F3] text-sm text-[#16231F]/60">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16 bg-[#F4F6F3] min-h-screen text-[#16231F] text-left">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#16231F]/15 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-[4px] bg-[#C2E4CE] text-[#16231F] text-xs font-semibold mb-2">
              <span>{user?.role} ACCOUNT</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-[#16231F]">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#16231F]/70 mt-1">
              {user?.email} · Student ID: {user?.studentId} · Dept: {user?.department?.code}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "ADMIN" && (
              <Link
                href="/admin/users"
                className="rounded-[8px] bg-[#16231F] text-[#F4F6F3] px-4 py-2 text-xs font-semibold"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="rounded-[8px] border border-[#16231F]/20 bg-white hover:bg-[#F2C4C4]/20 text-[#D9381E] px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Profile Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Profile Overview Card */}
            <div className="border border-[#16231F]/15 rounded-[12px] bg-white p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#16231F]/10">
                <h2 className="text-lg font-heading font-bold text-[#16231F]">
                  Profile Details
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-semibold text-[#1D5B4A] hover:underline cursor-pointer"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-9 rounded-[6px] border border-[#16231F]/20 px-3 text-sm"
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
                      className="w-full h-9 rounded-[6px] border border-[#16231F]/20 px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1">
                      Preferred Time Range
                    </label>
                    <select
                      value={preferredTimeRange}
                      onChange={(e) => setPreferredTimeRange(e.target.value)}
                      className="w-full h-9 rounded-[6px] border border-[#16231F]/20 px-2.5 text-sm"
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
                    className="rounded-[6px] bg-[#1D5B4A] text-white px-4 py-2 text-xs font-semibold"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-[#16231F]/50">Batch</p>
                    <p className="font-semibold text-[#16231F]">{user?.batch}</p>
                  </div>
                  <div>
                    <p className="text-[#16231F]/50">Phone</p>
                    <p className="font-semibold text-[#16231F]">{user?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-[#16231F]/50">Swap Reliability Score</p>
                    <p className="font-semibold text-[#1D5B4A]">{user?.reliabilityScore}%</p>
                  </div>
                  <div>
                    <p className="text-[#16231F]/50">Multi-way Swaps</p>
                    <p className="font-semibold text-[#16231F]">
                      {user?.allowMultiWaySwaps ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Card */}
            <div className="border border-[#16231F]/15 rounded-[12px] bg-white p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#16231F]/10">
                <h2 className="text-lg font-heading font-bold text-[#16231F]">
                  Security & Password
                </h2>
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="text-xs font-semibold text-[#1D5B4A] hover:underline cursor-pointer"
                >
                  {isChangingPassword ? "Cancel" : "Change Password"}
                </button>
              </div>

              {pwMessage && (
                <p className="mb-4 text-xs text-[#1D5B4A] font-semibold">{pwMessage}</p>
              )}
              {pwError && (
                <p className="mb-4 text-xs text-[#D9381E] font-semibold">{pwError}</p>
              )}

              {isChangingPassword && (
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-9 rounded-[6px] border border-[#16231F]/20 px-3 text-sm"
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
                      className="w-full h-9 rounded-[6px] border border-[#16231F]/20 px-3 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-[6px] bg-[#1D5B4A] text-white px-4 py-2 text-xs font-semibold"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Active Sessions Sidebar */}
          <div className="lg:col-span-4 border border-[#16231F]/15 rounded-[12px] bg-white p-6 space-y-4">
            <h2 className="text-lg font-heading font-bold text-[#16231F] pb-3 border-b border-[#16231F]/10">
              Active Sessions
            </h2>
            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-[8px] bg-[#F4F6F3] border border-[#16231F]/10 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#16231F]">{s.device}</span>
                    {s.current ? (
                      <span className="px-1.5 py-0.5 rounded-[4px] bg-[#C2E4CE] text-[#16231F] font-bold text-[10px]">
                        Current
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        className="text-[#D9381E] hover:underline text-[11px] cursor-pointer"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                  <p className="text-[#16231F]/60">IP: {s.ip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
