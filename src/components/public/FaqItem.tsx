import React from "react";
import { cn } from "@/lib/utils";

interface FaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export function FaqItem({
  question,
  answer,
  defaultOpen = false,
  className,
}: FaqItemProps) {
  return (
    <details
      className={cn(
        "group bg-white rounded-2xl border border-border p-5 md:p-6 shadow-sm transition-all open:ring-1 open:ring-primary/20",
        className
      )}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center justify-between font-heading font-semibold text-text text-base md:text-lg list-none select-none">
        <span>{question}</span>
        <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-muted text-text-subtle transition-transform duration-200 group-open:rotate-180">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="mt-4 text-text-muted text-sm md:text-base leading-relaxed border-t border-border/60 pt-4">
        {answer}
      </div>
    </details>
  );
}
