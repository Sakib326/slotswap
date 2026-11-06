"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ArrowRightLeft,
  Bell,
  User,
  LogOut,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { useNotifications, useProfile } from "@/lib/mock/api";
import { useToast } from "./Toast";

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const { student, resetStore } = useProfile();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors
    }
    sessionStorage.clear();
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My routine", href: "/routine", icon: CalendarDays },
    { label: "Requests", href: "/requests", icon: ArrowRightLeft },
    { label: "Swaps", href: "/swaps", icon: ArrowRightLeft },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: "Profile", href: "/profile", icon: User },
  ];

  const handleResetData = () => {
    resetStore();
    toast("Demo data reset to initial seed");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#16231F]/15 bg-[#F4F6F3] shrink-0 min-h-screen sticky top-0 h-screen p-4 text-left justify-between">
      <div className="space-y-6">
        {/* Brand / Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 font-heading font-extrabold text-lg tracking-tight text-[#16231F] px-2 py-2"
        >
          <span
            className="grid grid-cols-2 gap-0.5 w-6 h-6 p-0.5 border border-[#16231F]/25 rounded-[4px] bg-white shrink-0"
            aria-hidden="true"
          >
            <span className="bg-[#1D5B4A] rounded-[1px] w-full h-full block" />
            <span className="bg-[#F5E39B] rounded-[1px] w-full h-full block" />
            <span className="bg-[#BCD7F2] rounded-[1px] w-full h-full block" />
            <span className="bg-[#C2E4CE] rounded-[1px] w-full h-full block" />
          </span>
          <span>
            Slot<span className="text-[#1D5B4A]">Swap</span>
          </span>
        </Link>

        {/* Navigation list */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs font-semibold transition ${
                  isActive
                    ? "text-[#1D5B4A] bg-[#1D5B4A]/10 border-l-2 border-[#1D5B4A]"
                    : "text-[#16231F]/70 hover:bg-[#16231F]/5 hover:text-[#16231F]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#1D5B4A] text-white text-[10px] font-bold tabular-nums">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer: User profile & demo actions */}
      <div className="pt-4 border-t border-[#16231F]/10 space-y-2">
        {/* Reset Demo Data Button */}
        <button
          type="button"
          onClick={handleResetData}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[11px] font-medium text-[#16231F]/70 hover:bg-[#16231F]/5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset demo data</span>
        </button>

        {/* User Card */}
        <div className="p-2.5 rounded-[8px] bg-white border border-[#16231F]/15">
          <p className="font-semibold text-xs text-[#16231F] truncate">
            {student.name}
          </p>
          <p className="text-[10px] text-[#16231F]/60 font-mono mt-0.5">
            {student.studentId} · {student.department}
          </p>
        </div>

        {/* Log Out Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-semibold text-[#D9381E] hover:bg-[#F2C4C4]/30 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export function StudentTopBar() {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const { student } = useProfile();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = student.name
    ? student.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors
    }
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <header className="h-14 border-b border-[#16231F]/15 bg-white px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 text-left gap-2">
      {/* Left: Term & Swap window info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <span className="text-xs font-bold text-[#16231F] shrink-0 truncate max-w-[80px] sm:max-w-none">
          Fall 2026
        </span>
        <span className="text-[#16231F]/30 text-xs hidden sm:inline">|</span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#C2E4CE] text-[#1D5B4A] text-[11px] sm:text-xs font-semibold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D5B4A] shrink-0" />
          <span className="hidden sm:inline">Swap window open, closes in 3 days</span>
          <span className="sm:hidden">Window open</span>
        </span>
      </div>

      {/* Right: Bell & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification Bell */}
        <Link
          href="/notifications"
          aria-label={`Notifications, ${unreadCount} unread`}
          className="relative p-2 rounded-[6px] text-[#16231F]/70 hover:bg-[#16231F]/5 transition shrink-0"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1D5B4A]" />
          )}
        </Link>

        {/* User dropdown menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-[6px] hover:bg-[#16231F]/5 transition"
            aria-expanded={menuOpen}
          >
            <div className="w-7 h-7 rounded-full bg-[#C2E4CE] text-[#1D5B4A] font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
            <span className="text-xs font-semibold text-[#16231F] hidden sm:inline truncate max-w-[120px]">
              {student.name}
            </span>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-[8px] border border-[#16231F]/15 bg-white shadow-lg py-1 z-30"
              onClick={() => setMenuOpen(false)}
            >
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#16231F] hover:bg-[#F4F6F3]"
              >
                <User className="w-3.5 h-3.5 text-[#16231F]/60" />
                <span>Profile & settings</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#D9381E] hover:bg-[#F2C4C4]/20 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function MobileBottomTabs() {
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Routine", href: "/routine", icon: CalendarDays },
    { label: "Requests", href: "/requests", icon: ArrowRightLeft },
    { label: "Swaps", href: "/swaps", icon: ArrowRightLeft },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-[#16231F]/15 z-30 flex items-center justify-around px-2"
      aria-label="Mobile Bottom Navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition ${
              isActive
                ? "text-[#1D5B4A] font-bold"
                : "text-[#16231F]/60 hover:text-[#16231F]"
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
