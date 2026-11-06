"use client";

import React, { useEffect, useState } from "react";
import { formatTimeRemaining } from "@/lib/mock/time";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownBarProps {
  expiresAt: string;
  className?: string;
}

export function CountdownBar({ expiresAt, className = "" }: CountdownBarProps) {
  const [timeState, setTimeState] = useState(() => formatTimeRemaining(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeState(formatTimeRemaining(expiresAt));
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, [expiresAt]);

  const { text, isUrgent, isExpired } = timeState;

  if (isExpired) {
    return (
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#F2C4C4]/50 border border-[#D9381E]/30 text-xs font-semibold text-[#D9381E] tabular-nums ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Confirmation window expired</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs font-medium tabular-nums transition ${
        isUrgent
          ? "bg-[#F2C4C4]/60 border border-[#D9381E]/40 text-[#D9381E] font-semibold"
          : "bg-[#F5E39B]/50 border border-[#16231F]/15 text-[#16231F]"
      } ${className}`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-3.5 h-3.5 text-[#D9381E] shrink-0" aria-hidden="true" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-[#16231F]/60 shrink-0" aria-hidden="true" />
      )}
      <span>Expires in {text}</span>
    </div>
  );
}
