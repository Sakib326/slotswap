import React from "react";
import { Container } from "./Container";
import Link from "next/link";

interface SectionLink {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: SectionLink[];
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  lastUpdated,
  sections,
  children,
}: LegalLayoutProps) {
  return (
    <div className="py-12 md:py-20 bg-bg">
      <Container>
        {/* Header */}
        <div className="mb-12 border-b border-border pb-8">
          <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-2">
            Legal & Compliance
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-text tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-sm text-text-subtle">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content with Sticky Table of Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Table of contents */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 bg-bg-muted border border-border rounded-2xl p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-subtle mb-4">
                On this page
              </h2>
              <nav aria-label="Table of contents" className="space-y-2">
                {sections.map((sec) => (
                  <Link
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block text-sm text-text-muted hover:text-primary transition-colors py-1 font-medium"
                  >
                    {sec.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main prose */}
          <div className="lg:col-span-8 max-w-3xl prose prose-slate">
            {children}
            <div className="mt-12 pt-6 border-t border-border text-xs text-text-subtle">
              SlotSwap is a university student project built for CSE 327: Software Engineering. This document is a course project template and does not constitute formal legal advice.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
