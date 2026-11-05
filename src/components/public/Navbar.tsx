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
    <header className="sticky top-0 z-40 bg-paper border-b border-ink/15">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo with 2x2 grid glyph where two cells offset to suggest swap */}
          <Link
            href="/"
            className="flex items-center gap-3 font-heading font-extrabold text-xl tracking-tight text-ink"
          >
            <span
              className="grid grid-cols-2 gap-1 w-6 h-6 p-0.5 border border-ink/20 rounded-[4px] bg-paper shrink-0"
              aria-hidden="true"
            >
              <span className="bg-pine rounded-[2px]" />
              <span className="bg-marker-yellow rounded-[2px] translate-y-0.5" />
              <span className="bg-marker-blue rounded-[2px] -translate-y-0.5" />
              <span className="bg-pine rounded-[2px]" />
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
                      ? "text-pine font-semibold"
                      : "text-ink/75 hover:text-ink"
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
              className="text-sm font-medium text-ink/75 hover:text-ink"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-[8px] bg-pine hover:bg-pine-hover text-paper text-sm font-semibold px-4 py-2 transition"
            >
              Create account
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="p-2 text-ink border border-ink/15 rounded-[8px]"
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
          <div className="md:hidden py-4 border-t border-ink/15 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-sm rounded-[4px] ${
                  pathname === link.href
                    ? "bg-pine/10 font-semibold text-pine"
                    : "text-ink/80 hover:bg-black/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-ink/15 space-y-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block text-center text-sm py-2 text-ink/80 hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block text-center text-sm py-2 rounded-[8px] bg-pine text-paper font-semibold"
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
