import React from "react";
import { RequestStatus, SwapStatus } from "@/types/domain";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  XCircle,
  AlertCircle,
  Hourglass,
} from "lucide-react";

type AnyStatus = RequestStatus | SwapStatus;

interface StatusTagProps {
  status: AnyStatus;
  className?: string;
}

export function StatusTag({ status, className = "" }: StatusTagProps) {
  switch (status) {
    case "OPEN":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#F4F6F3] border border-[#16231F]/20 text-[#16231F] text-xs font-medium tabular-nums ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-[#16231F]/70" aria-hidden="true" />
          <span>Open</span>
        </span>
      );

    case "MATCHED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#BCD7F2] border border-[#16231F]/15 text-[#16231F] text-xs font-semibold tabular-nums ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1D5B4A]" aria-hidden="true" />
          <span>Matched</span>
        </span>
      );

    case "AWAITING_CONFIRMATION":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#F5E39B] border border-[#16231F]/15 text-[#16231F] text-xs font-semibold tabular-nums ${className}`}
        >
          <Hourglass className="w-3.5 h-3.5 text-[#16231F]" aria-hidden="true" />
          <span>Awaiting confirmation</span>
        </span>
      );

    case "CONFIRMED":
    case "COMPLETED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#C2E4CE] border border-[#16231F]/15 text-[#16231F] text-xs font-semibold tabular-nums ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1D5B4A]" aria-hidden="true" />
          <span>{status === "COMPLETED" ? "Completed" : "Confirmed"}</span>
        </span>
      );

    case "DECLINED":
    case "CANCELLED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#F2C4C4] border border-[#D9381E]/20 text-[#16231F] text-xs font-semibold tabular-nums ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-[#D9381E]" aria-hidden="true" />
          <span>{status === "DECLINED" ? "Declined" : "Cancelled"}</span>
        </span>
      );

    case "EXPIRED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-transparent border border-[#16231F]/20 text-[#16231F]/60 text-xs font-medium tabular-nums ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-[#16231F]/50" aria-hidden="true" />
          <span>Expired</span>
        </span>
      );

    default:
      return null;
  }
}
