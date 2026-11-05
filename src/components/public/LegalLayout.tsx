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
    <div className="py-12 md:py-20 text-left">
      <Container>
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-ink/15 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-ink leading-tight mb-2">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-ink/60">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Layout with sticky TOC on desktop and collapsible details on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Table of contents */}
          <aside className="lg:col-span-4">
            {/* Mobile disclosure */}
            <details className="lg:hidden border border-ink/15 rounded-[8px] p-3 bg-white/50 mb-6 text-sm">
              <summary className="font-semibold text-ink cursor-pointer">
                On this page
              </summary>
              <nav className="mt-3 space-y-1.5 pt-2 border-t border-ink/10">
                {sections.map((sec) => (
                  <Link
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block text-xs text-ink/80 hover:text-pine py-0.5"
                  >
                    {sec.title}
                  </Link>
                ))}
              </nav>
            </details>

            {/* Desktop sticky list */}
            <div className="hidden lg:block sticky top-24 border border-ink/15 rounded-[12px] p-5 bg-white/60">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-3">
                On this page
              </p>
              <nav aria-label="Table of contents" className="space-y-1.5 text-xs">
                {sections.map((sec) => (
                  <Link
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block text-ink/80 hover:text-pine hover:underline py-1"
                  >
                    {sec.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main prose */}
          <div className="lg:col-span-8 max-w-[70ch] space-y-10">
            {children}
            <div className="pt-8 border-t border-ink/15 text-xs text-ink/60">
              This is a course project template for CSE 327: Software Engineering and does not constitute formal legal counsel.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
