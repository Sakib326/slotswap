import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#16231F]/10 rounded-[6px] ${className}`}
      aria-hidden="true"
    />
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-[10px] bg-white border border-[#16231F]/10 flex items-center justify-between"
        >
          <div className="space-y-2 flex-1 max-w-sm">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20 rounded-[4px]" />
        </div>
      ))}
    </div>
  );
}
