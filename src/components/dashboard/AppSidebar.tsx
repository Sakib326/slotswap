"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ArrowRightLeft,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    studentId?: string;
    role: string;
    batch?: string;
    department?: { code: string };
  } | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Routine", href: "/dashboard", icon: CalendarDays },
    { label: "Swap Requests", href: "/dashboard", icon: ArrowRightLeft },
    { label: "Settings", href: "/dashboard", icon: Settings },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({
      label: "Admin Portal",
      href: "/admin",
      icon: ShieldCheck,
    });
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between p-4 text-[#16231F]">
      <div>
        {/* Brand / Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 font-heading font-extrabold text-lg tracking-tight text-[#16231F] px-2 py-3 mb-4"
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
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#16231F]/50 px-3 mb-2">
          Navigation
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname.startsWith("/admin")
                : pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-[8px] text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#1D5B4A] text-white shadow-sm"
                    : "text-[#16231F]/75 hover:bg-[#16231F]/5 hover:text-[#16231F]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Mini Bar & Logout */}
      <div className="pt-4 border-t border-[#16231F]/10 space-y-3">
        <div className="px-2 py-1.5 rounded-[8px] bg-white border border-[#16231F]/10">
          <p className="font-semibold text-xs text-[#16231F] truncate">
            {user?.name || "Student"}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#16231F]/60 mt-0.5">
            <span className="font-mono">{user?.studentId || "Student"}</span>
            <span>·</span>
            <span>{user?.department?.code || "NSU"}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-semibold text-[#D9381E] hover:bg-[#F2C4C4]/30 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 bg-[#F4F6F3] border-b border-[#16231F]/15 sticky top-0 z-30">
        <Link href="/dashboard" className="font-heading font-bold text-base text-[#16231F]">
          SlotSwap
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 border border-[#16231F]/20 rounded-[6px] text-[#16231F]"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 flex">
          <div className="w-64 bg-[#F4F6F3] h-full shadow-xl">
            <NavContent />
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-[#16231F]/15 bg-[#F4F6F3] shrink-0 min-h-screen sticky top-0 h-screen">
        <NavContent />
      </aside>
    </>
  );
}
