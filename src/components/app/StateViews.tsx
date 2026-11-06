import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="py-12 px-6 rounded-[12px] border border-dashed border-[#16231F]/20 bg-white text-center flex flex-col items-center justify-center">
      {icon ? (
        <div className="mb-3 text-[#16231F]/40">{icon}</div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#F4F6F3] border border-[#16231F]/15 flex items-center justify-center text-[#16231F]/50 mb-3">
          <AlertCircle className="w-5 h-5" />
        </div>
      )}
      <h3 className="font-heading font-bold text-base text-[#16231F]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#16231F]/60 mt-1 max-w-[50ch]">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "We couldn't load your requests.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="py-10 px-6 rounded-[12px] border border-[#D9381E]/20 bg-[#F2C4C4]/20 text-center flex flex-col items-center justify-center">
      <AlertCircle className="w-6 h-6 text-[#D9381E] mb-2" />
      <p className="text-sm font-semibold text-[#16231F]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-[#16231F]/20 text-xs font-semibold text-[#16231F] hover:bg-[#16231F]/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
