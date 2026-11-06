"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { User, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

interface CurrentUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  studentId?: string;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 1. Check real backend session
    fetch("/api/users/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser({
            name: data.user.name || data.user.email,
            email: data.user.email,
            role: data.user.role,
            studentId: data.user.studentId,
          });
        } else {
          // 2. Check mock session in client storage if in mock demo mode
          const mockStudent = sessionStorage.getItem("slotswap_store_v1");
          const mockAdmin = sessionStorage.getItem("slotswap_admin_store_v1");

          if (mockAdmin && pathname.startsWith("/admin")) {
            try {
              const parsed = JSON.parse(mockAdmin);
              if (parsed.currentAdmin) {
                setCurrentUser({
                  name: parsed.currentAdmin.name,
                  email: parsed.currentAdmin.email,
                  role: "ADMIN",
                });
                return;
              }
            } catch {}
          }

          if (mockStudent) {
            try {
              const parsed = JSON.parse(mockStudent);
              if (parsed.student) {
                setCurrentUser({
                  name: parsed.student.name,
                  email: parsed.student.email,
                  role: "STUDENT",
                  studentId: parsed.student.studentId,
                });
                return;
              }
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    sessionStorage.clear();
    setCurrentUser(null);
    window.location.href = "/login";
  };

  const navLinks = [
    { label: "How it works", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  const dashboardHref = currentUser?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 bg-[#F4F6F3] border-b border-[#16231F]/15">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo with clean 2x2 grid glyph */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-heading font-extrabold text-xl tracking-tight text-[#16231F]"
          >
            <span
              className="grid grid-cols-2 gap-0.5 w-6 h-6 p-1 border border-[#16231F]/25 rounded-[4px] bg-white shrink-0"
              aria-hidden="true"
            >
              <span className="bg-[#1D5B4A] rounded-[1px] w-full h-full block" />
              <span className="bg-[#F5E39B] rounded-[1px] w-full h-full block" />
              <span className="bg-[#BCD7F2] rounded-[1px] w-full h-full block" />
              <span className="bg-[#C2E4CE] rounded-[1px] w-full h-full block" />
            </span>
            <span>SlotSwap</span>
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label="Public navigation"
            className="hidden md:flex items-center gap-7"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-[#1D5B4A] font-semibold"
                      : "text-[#16231F]/75 hover:text-[#16231F]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-[8px] bg-white border border-[#16231F]/15 hover:border-[#1D5B4A] transition text-left cursor-pointer"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-[#C2E4CE] text-[#1D5B4A] font-bold text-xs flex items-center justify-center shrink-0">
                    {currentUser.name
                      ? currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "U"}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#16231F] leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-[#16231F]/60 capitalize">
                      {currentUser.role.toLowerCase()}
                    </p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-[8px] border border-[#16231F]/15 bg-white shadow-lg py-1.5 z-50 text-left"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#16231F]/10">
                      <p className="text-xs font-bold text-[#16231F] truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-[#16231F]/60 truncate font-mono">
                        {currentUser.email}
                      </p>
                    </div>

                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#16231F] hover:bg-[#F4F6F3]"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#1D5B4A]" />
                      <span>{currentUser.role === "ADMIN" ? "Admin Portal" : "Student Dashboard"}</span>
                    </Link>

                    {currentUser.role !== "ADMIN" && (
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#16231F] hover:bg-[#F4F6F3]"
                      >
                        <User className="w-3.5 h-3.5 text-[#16231F]/60" />
                        <span>Profile & Routine</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#D9381E] hover:bg-[#F2C4C4]/20 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#16231F]/80 hover:text-[#16231F]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-[#F4F6F3] text-sm font-semibold px-4 py-2 transition shadow-sm"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="p-2 text-[#16231F] border border-[#16231F]/15 rounded-[8px]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden py-4 border-t border-[#16231F]/15 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-sm rounded-[4px] ${
                  pathname === link.href
                    ? "bg-[#1D5B4A]/10 font-semibold text-[#1D5B4A]"
                    : "text-[#16231F]/80 hover:bg-black/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#16231F]/15 space-y-2">
              {currentUser ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setOpen(false)}
                    className="block text-center text-sm py-2 rounded-[8px] bg-[#1D5B4A] text-white font-semibold"
                  >
                    Open {currentUser.role === "ADMIN" ? "Admin Portal" : "Dashboard"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center text-sm py-2 text-[#D9381E] font-semibold hover:bg-[#F2C4C4]/20 rounded-[8px]"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block text-center text-sm py-2 text-[#16231F]/80 hover:text-[#16231F]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="block text-center text-sm py-2 rounded-[8px] bg-[#1D5B4A] text-[#F4F6F3] font-semibold"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
