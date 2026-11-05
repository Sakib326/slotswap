import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { ArrowRightLeft } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-heading font-extrabold text-xl text-white"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <ArrowRightLeft className="w-4 h-4 text-accent-soft" />
              </div>
              <span>
                Slot<span className="text-primary-soft">Swap</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Automated course section swapping platform for university students. Multi-way matching, schedule clash validation, and zero manual chaos.
            </p>
            <p className="text-xs text-slate-500">
              Built for CSE 327: Software Engineering course project.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Frequently Asked
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Student Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About SlotSwap
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/api-doc" className="hover:text-white transition">
                  API & Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SlotSwap. A CSE 327 course project.</p>
          <p>Not affiliated with official university administration.</p>
        </div>
      </Container>
    </footer>
  );
}
