"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AppTopBar } from "@/components/dashboard/AppTopBar";
import {
  CalendarDays,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active simulated match confirmation
  const [swapConfirmed, setSwapConfirmed] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/users/me").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/auth/sessions").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([userData, sessionData]) => {
        if (!userData) {
          router.push("/login");
          return;
        }
        setUser(userData);
        setSessions(sessionData || []);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F3] text-sm text-[#16231F]/60">
        Loading student portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6F3] text-[#16231F]">
      {/* 1. App Sidebar */}
      <AppSidebar user={user} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with user badge, active session info, and logout */}
        <AppTopBar user={user} activeSessionCount={sessions.length} />

        {/* Dashboard Body */}
        <main className="p-6 md:p-8 space-y-8 max-w-7xl">
          {/* Welcome & Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-4">
              <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider">
                Enrolled Sections
              </span>
              <p className="text-2xl font-heading font-extrabold text-[#16231F] mt-1">
                5 Sections
              </p>
              <p className="text-xs text-[#16231F]/60 mt-0.5">15.0 Credits · Routine synced</p>
            </div>

            <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-4">
              <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider">
                Swap Requests
              </span>
              <p className="text-2xl font-heading font-extrabold text-[#1D5B4A] mt-1">
                2 Active
              </p>
              <p className="text-xs text-[#16231F]/60 mt-0.5">1 Match waiting confirmation</p>
            </div>

            <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-4">
              <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider">
                Reliability Score
              </span>
              <p className="text-2xl font-heading font-extrabold text-[#1D5B4A] mt-1">
                {user?.reliabilityScore ?? 100}%
              </p>
              <p className="text-xs text-[#1D5B4A] mt-0.5">High priority matching queue</p>
            </div>

            <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-4">
              <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider">
                Active Sessions
              </span>
              <p className="text-2xl font-heading font-extrabold text-[#16231F] mt-1">
                {sessions.length} Devices
              </p>
              <p className="text-xs text-[#16231F]/60 mt-0.5">Logged in from {sessions[0]?.device || "Desktop"}</p>
            </div>
          </div>

          {/* Top Priority Action Banner: Match Pending Confirmation */}
          <div className="bg-white border-2 border-[#1D5B4A] rounded-[12px] p-6 text-left relative overflow-hidden shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#C2E4CE] text-[#16231F] text-xs font-bold uppercase tracking-wider">
                    Action Required · 3-Way Cycle Match Found
                  </span>
                  <span className="text-xs font-semibold text-[#D9381E] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 01:24:15 remaining
                  </span>
                </div>
                <h2 className="text-xl font-heading font-bold text-[#16231F]">
                  Trade Proposal for CSE327 (Software Engineering)
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm pt-1">
                  <span className="px-2.5 py-1 rounded-[4px] bg-[#F2C4C4] border border-[#D9381E]/30 text-xs font-semibold">
                    You Give: Sec 5
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#16231F]/40" />
                  <span className="px-2.5 py-1 rounded-[4px] bg-[#C2E4CE] border border-[#1D5B4A]/30 text-xs font-semibold">
                    You Get: Sec 2
                  </span>
                  <span className="text-xs text-[#16231F]/60">
                    Cycle Partners: Rafi (Confirmed), Nila (Confirmed)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {swapConfirmed ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#C2E4CE] text-[#1D5B4A] font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Swap Confirmed! Coordinate in NSU portal
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setSwapConfirmed(true)}
                      className="rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-[#F4F6F3] px-6 py-2.5 text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      Confirm Swap
                    </button>
                    <button
                      onClick={() => alert("Swap declined. Your request has returned to the queue.")}
                      className="rounded-[8px] border border-[#16231F]/20 hover:bg-[#16231F]/5 text-[#16231F] px-4 py-2.5 text-xs font-semibold transition cursor-pointer"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Routine & Requests Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* Left 7 Cols: Enrolled Routine Matrix */}
            <div className="lg:col-span-7 bg-white border border-[#16231F]/15 rounded-[12px] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#16231F]/10">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#1D5B4A]" />
                  <h3 className="font-heading font-bold text-base text-[#16231F]">
                    Weekly Class Timetable
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-[#1D5B4A] bg-[#C2E4CE] px-2 py-0.5 rounded-[4px]">
                  0 Schedule Clashes
                </span>
              </div>

              {/* Timetable Snippet */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[420px]">
                  <thead>
                    <tr className="border-b border-[#16231F]/10 text-[#16231F]/60 font-semibold">
                      <th className="py-2">Time</th>
                      <th className="py-2">Sun</th>
                      <th className="py-2">Mon</th>
                      <th className="py-2">Tue</th>
                      <th className="py-2">Wed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#16231F]/5">
                    <tr>
                      <td className="py-3 font-mono text-[#16231F]/60">08:30</td>
                      <td>-</td>
                      <td className="py-2">
                        <span className="px-2 py-1 rounded-[4px] bg-[#F5E39B] border border-[#16231F]/10 block font-semibold">
                          MAT216 · Sec 3
                        </span>
                      </td>
                      <td>-</td>
                      <td className="py-2">
                        <span className="px-2 py-1 rounded-[4px] bg-[#F5E39B] border border-[#16231F]/10 block font-semibold">
                          MAT216 · Sec 3
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#16231F]/60">10:00</td>
                      <td className="py-2">
                        <span className="px-2 py-1 rounded-[4px] bg-[#F2C4C4] border border-[#D9381E]/40 block font-semibold text-[#D9381E]">
                          CSE327 · Sec 5 (Swap Pending)
                        </span>
                      </td>
                      <td>-</td>
                      <td className="py-2">
                        <span className="px-2 py-1 rounded-[4px] bg-[#C2E4CE] border border-[#1D5B4A]/30 block font-semibold">
                          CSE327 · Sec 2 (Target)
                        </span>
                      </td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#16231F]/60">11:30</td>
                      <td>-</td>
                      <td className="py-2">
                        <span className="px-2 py-1 rounded-[4px] bg-[#BCD7F2] border border-[#16231F]/10 block font-semibold">
                          ENG201 · Sec 1
                        </span>
                      </td>
                      <td>-</td>
                      <td className="py-2">
                        <span className="px-2 py-1 rounded-[4px] bg-[#BCD7F2] border border-[#16231F]/10 block font-semibold">
                          ENG201 · Sec 1
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 5 Cols: Active Swap Queues & Unlock Suggestions */}
            <div className="lg:col-span-5 space-y-6">
              {/* Active Requests Card */}
              <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#16231F]/10">
                  <h3 className="font-heading font-bold text-base text-[#16231F]">
                    My Swap Requests
                  </h3>
                  <button className="text-xs font-semibold text-[#1D5B4A] hover:underline cursor-pointer">
                    + New Swap
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Item 1 */}
                  <div className="p-3 rounded-[8px] border border-[#16231F]/10 bg-[#F4F6F3] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#16231F]">CSE327</span>
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#C2E4CE] text-[#16231F] font-bold text-[10px]">
                        MATCHED (3-WAY)
                      </span>
                    </div>
                    <p className="text-[#16231F]/70">
                      Holding: <strong>Sec 5</strong> → Target: <strong>Sec 2, Sec 7</strong>
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 rounded-[8px] border border-[#16231F]/10 bg-[#F4F6F3] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#16231F]">MAT216</span>
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#F5E39B] text-[#16231F] font-bold text-[10px]">
                        SEARCHING
                      </span>
                    </div>
                    <p className="text-[#16231F]/70">
                      Holding: <strong>Sec 3</strong> → Target: <strong>Sec 1</strong>
                    </p>
                    {/* Algorithm Unlock Suggestion */}
                    <div className="pt-2 border-t border-[#16231F]/10 flex items-start gap-1.5 text-[11px] text-[#1D5B4A]">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        Suggestion: Accept Sec 4 as a backup to match instantly with 2 students.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Sessions Mini Card */}
              <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#16231F]/10">
                  <h4 className="font-heading font-bold text-sm text-[#16231F]">
                    Session Activity
                  </h4>
                  <span className="text-[11px] text-[#16231F]/60">
                    {sessions.length} Active
                  </span>
                </div>
                <div className="space-y-2">
                  {sessions.slice(0, 2).map((s) => (
                    <div key={s.id} className="text-xs flex items-center justify-between py-1">
                      <div>
                        <p className="font-semibold text-[#16231F]">{s.device}</p>
                        <p className="text-[10px] text-[#16231F]/50">IP: {s.ip}</p>
                      </div>
                      {s.current && (
                        <span className="text-[10px] bg-[#C2E4CE] text-[#16231F] font-bold px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
