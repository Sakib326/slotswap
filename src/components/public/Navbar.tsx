"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "How it works", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

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
          <div className="hidden md:flex items-center gap-5">
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
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
