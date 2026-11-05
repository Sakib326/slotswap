"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, ChevronDown, UserCheck } from "lucide-react";

interface AppTopBarProps {
  user: {
    name: string;
    email: string;
    studentId?: string;
    role: string;
    batch?: string;
    department?: { code: string };
  } | null;
  activeSessionCount?: number;
}

export function AppTopBar({ user, activeSessionCount = 1 }: AppTopBarProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-[#16231F]/15 bg-white/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Advising Semester Badge */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#C2E4CE] text-[#16231F] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#1D5B4A] animate-pulse" />
          <span>Spring 2026 Advising Phase</span>
        </span>
        <span className="text-xs text-[#16231F]/60 hidden md:inline">
          Advising window active · Cycle matching online
        </span>
      </div>

      {/* Right: Notifications, User Badge & Menu */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification Bell with simulated active swap alert */}
        <button
          className="relative p-2 rounded-[8px] text-[#16231F]/70 hover:bg-[#16231F]/5 transition cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D9381E] rounded-full" />
        </button>

        {/* User Batch & Profile Pill with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-[8px] border border-[#16231F]/15 hover:bg-[#16231F]/5 transition text-left cursor-pointer"
          >
            {/* User details */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#16231F] leading-tight">
                {user?.name || "Student"}
              </p>
              <p className="text-[10px] text-[#16231F]/60">
                {user?.batch || "Spring 2026"} · {user?.department?.code || "CSE"}
              </p>
            </div>

            {/* Avatar / Badge */}
            <div className="w-7 h-7 rounded-[4px] bg-[#1D5B4A] text-[#F4F6F3] font-bold text-xs flex items-center justify-center">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#16231F]/50" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-[10px] border border-[#16231F]/15 bg-white shadow-lg p-2 text-xs z-50">
              <div className="px-3 py-2 border-b border-[#16231F]/10 mb-1">
                <p className="font-bold text-[#16231F] truncate">{user?.name}</p>
                <p className="text-[11px] text-[#16231F]/60 truncate">{user?.email}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-[#1D5B4A]">
                  <UserCheck className="w-3 h-3" />
                  <span>{user?.role} · ID: {user?.studentId}</span>
                </div>
              </div>

              <div className="py-1">
                <div className="px-3 py-1.5 text-[11px] text-[#16231F]/70 flex justify-between">
                  <span>Active Sessions:</span>
                  <span className="font-semibold text-[#16231F]">{activeSessionCount}</span>
                </div>
              </div>

              <div className="pt-1 border-t border-[#16231F]/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#D9381E] hover:bg-[#F2C4C4]/20 rounded-[6px] font-semibold transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
