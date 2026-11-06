"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ArrowRightLeft,
  BookOpen,
  Building,
  Calendar,
  FileSpreadsheet,
  Settings,
  BarChart3,
  ScrollText,
  UserCheck,
  RotateCcw,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useAdminStore } from "@/lib/mock/admin-store";
import { useToast } from "@/components/app/Toast";

export function AdminSidebar() {
  const pathname = usePathname();
  const { state, dispatch } = useAdminStore();
  const { toast } = useToast();

  const groups = [
    {
      title: "Overview",
      items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }],
    },
    {
      title: "People",
      items: [{ label: "Users", href: "/admin/users", icon: Users }],
    },
    {
      title: "Swapping",
      items: [
        { label: "Swaps", href: "/admin/swaps", icon: ArrowRightLeft },
        { label: "Requests", href: "/admin/requests", icon: BookOpen },
      ],
    },
    {
      title: "Catalog",
      items: [
        { label: "Departments", href: "/admin/departments", icon: Building },
        { label: "Courses", href: "/admin/courses", icon: BookOpen },
        { label: "CSV Import", href: "/admin/sections/import", icon: FileSpreadsheet },
        { label: "Terms & window", href: "/admin/terms", icon: Calendar },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { label: "Audit log", href: "/admin/audit-logs", icon: ScrollText },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const handleResetData = () => {
    dispatch({ type: "RESET_ADMIN_STORE" });
    toast("Admin store reset to default seed");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#16231F]/15 bg-[#F4F6F3] shrink-0 min-h-screen sticky top-0 h-screen p-4 text-left justify-between overflow-y-auto">
      <div className="space-y-6">
        {/* Brand / Logo + Admin tag */}
        <Link
          href="/admin"
          className="flex items-center gap-2.5 font-heading font-extrabold text-lg tracking-tight text-[#16231F] px-2 py-1"
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
          <div className="flex items-center gap-1.5">
            <span>SlotSwap</span>
            <span className="px-1.5 py-0.2 rounded bg-[#F5E39B] text-[#16231F] text-[10px] font-bold">
              Admin
            </span>
          </div>
        </Link>

        {/* Navigation Groups */}
        <nav className="space-y-5" aria-label="Admin Navigation">
          {groups.map((grp) => (
            <div key={grp.title} className="space-y-1">
              <p className="text-[11px] font-semibold text-[#16231F]/50 px-3 mb-1">
                {grp.title}
              </p>
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
                      isActive
                        ? "text-[#1D5B4A] bg-[#1D5B4A]/10 border-l-2 border-[#1D5B4A]"
                        : "text-[#16231F]/70 hover:bg-[#16231F]/5 hover:text-[#16231F]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer: User profile & demo actions */}
      <div className="pt-4 border-t border-[#16231F]/10 space-y-2">
        <button
          type="button"
          onClick={handleResetData}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[11px] font-medium text-[#16231F]/70 hover:bg-[#16231F]/5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset demo data</span>
        </button>

        <div className="p-2.5 rounded-[8px] bg-white border border-[#16231F]/15">
          <p className="font-semibold text-xs text-[#16231F] truncate">
            {state.currentAdmin.name}
          </p>
          <p className="text-[10px] text-[#16231F]/60 font-mono mt-0.5">
            {state.currentAdmin.email} · Staff
          </p>
        </div>
      </div>
    </aside>
  );
}

export function AdminTopBar() {
  const router = useRouter();
  const { state } = useAdminStore();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeTerm = state.terms.find((t) => t.status === "ACTIVE") || state.terms[0];

  return (
    <header className="h-14 border-b border-[#16231F]/15 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 text-left">
      {/* Left: Term & Window Status Chip */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs font-bold text-[#16231F]">
          {activeTerm?.name || "Fall 2026"}
        </span>
        <span className="text-[#16231F]/30 text-xs hidden sm:inline">|</span>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-xs font-semibold ${
            activeTerm?.swapWindowOpen
              ? "bg-[#C2E4CE] text-[#1D5B4A]"
              : "bg-[#F2C4C4] text-[#D9381E]"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              activeTerm?.swapWindowOpen ? "bg-[#1D5B4A]" : "bg-[#D9381E]"
            }`}
          />
          <span>{activeTerm?.swapWindowOpen ? "Window open, closes in 3 days" : "Window closed"}</span>
        </span>
      </div>

      {/* Right: Switch Role & Menu */}
      <div className="flex items-center gap-3">
        {/* Preview as Student */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#F4F6F3] border border-[#16231F]/15 hover:border-[#1D5B4A] text-xs font-semibold text-[#16231F] transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#1D5B4A]" />
          <span>Preview as student</span>
        </Link>

        {/* User avatar menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-full bg-[#1D5B4A] text-white font-bold text-xs flex items-center justify-center hover:opacity-90"
            aria-expanded={menuOpen}
          >
            NJ
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-[8px] border border-[#16231F]/15 bg-white shadow-lg py-1 z-30"
              onClick={() => setMenuOpen(false)}
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#16231F] hover:bg-[#F4F6F3]"
              >
                <span>Preview as student</span>
              </Link>
              <button
                type="button"
                onClick={() => toast("Admin signed out (Mock mode)")}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#D9381E] hover:bg-[#F2C4C4]/20"
              >
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function AdminMobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const links = [
    { label: "Overview", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Swaps", href: "/admin/swaps" },
    { label: "Requests", href: "/admin/requests" },
    { label: "Departments", href: "/admin/departments" },
    { label: "Courses", href: "/admin/courses" },
    { label: "CSV Import", href: "/admin/sections/import" },
    { label: "Terms & window", href: "/admin/terms" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "Audit log", href: "/admin/audit-logs" },
    { label: "Settings", href: "/admin/settings" },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden bg-black/40">
      <div className="w-64 bg-[#F4F6F3] h-full shadow-2xl p-4 text-left overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#16231F]/15 mb-4">
          <span className="font-heading font-extrabold text-base text-[#16231F]">
            Admin Navigation
          </span>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-[#16231F]" />
          </button>
        </div>

        <nav className="space-y-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block px-3 py-2 rounded-[6px] text-xs font-semibold ${
                pathname === item.href
                  ? "bg-[#1D5B4A] text-white"
                  : "text-[#16231F]/70 hover:bg-[#16231F]/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
