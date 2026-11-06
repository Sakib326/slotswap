import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#16231F]/60 mb-2" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <ChevronRight className="w-3 h-3 text-[#16231F]/40" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#1D5B4A] transition font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#16231F] font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function StatLine({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
  return (
    <div className="p-3.5 rounded-[10px] bg-white border border-[#16231F]/15 text-left">
      <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider block">
        {label}
      </span>
      <p className="font-heading font-extrabold text-2xl text-[#16231F] mt-1 tabular-nums">
        {value}
      </p>
      {subtext && <p className="text-xs text-[#1D5B4A] mt-0.5">{subtext}</p>}
    </div>
  );
}

export function DiffList({ diffs }: { diffs: { field?: string; oldValue?: any; newValue?: any; summary?: string }[] }) {
  return (
    <div className="space-y-1.5 text-xs font-mono">
      {diffs.map((d, i) => (
        <div key={i} className="p-2 rounded-[6px] bg-[#F4F6F3] border border-[#16231F]/10 space-y-0.5">
          {d.field && (
            <span className="font-sans font-bold text-[#16231F] block text-[11px]">
              Field: {d.field}
            </span>
          )}
          {d.summary ? (
            <p className="font-sans text-[#16231F]/80">{d.summary}</p>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[#D9381E] line-through">{String(d.oldValue ?? "none")}</span>
              <span className="text-[#16231F]/40 font-sans">→</span>
              <span className="text-[#1D5B4A] font-bold">{String(d.newValue ?? "none")}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
