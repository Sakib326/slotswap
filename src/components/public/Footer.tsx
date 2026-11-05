import React from "react";
import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="bg-ink text-paper border-t border-ink py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-paper/15">
          {/* Identity */}
          <div className="md:col-span-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-heading font-extrabold text-xl text-paper mb-3"
            >
              <span>SlotSwap</span>
            </Link>
            <p className="text-sm text-paper/70 max-w-md leading-relaxed">
              Course section swapping platform for university students during advising.
              Automated 2-way and 3-way cycle matching with timetable clash checking.
            </p>
          </div>

          {/* Links 1 */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-paper/50 mb-3">
              Product
            </p>
            <ul className="space-y-2 text-sm text-paper/80">
              <li>
                <Link href="/how-it-works" className="hover:text-paper">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-paper">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-paper">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-paper">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-paper/50 mb-3">
              Legal
            </p>
            <ul className="space-y-2 text-sm text-paper/80">
              <li>
                <Link href="/terms" className="hover:text-paper">
                  Terms and conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-paper">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-paper/60">
          <p>SlotSwap, a CSE 327 course project.</p>
          <p className="tabular-nums">Academic year 2026</p>
        </div>
      </Container>
    </footer>
  );
}
