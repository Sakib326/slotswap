"use client";

import React, { useEffect, useRef } from "react";
import { AlertCircle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      confirmBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md bg-white border border-[#16231F]/15 rounded-[12px] p-6 shadow-xl text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {isDestructive && (
              <div className="w-8 h-8 rounded-full bg-[#F2C4C4]/60 text-[#D9381E] flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            <h2 id="dialog-title" className="font-heading font-bold text-base text-[#16231F]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-[6px] text-[#16231F]/50 hover:bg-[#16231F]/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#16231F]/70 mt-3 leading-relaxed">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#16231F]/10">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold text-[#16231F] hover:bg-[#16231F]/5 transition"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-[8px] text-xs font-semibold text-white transition ${
              isDestructive
                ? "bg-[#D9381E] hover:bg-[#B32B14]"
                : "bg-[#1D5B4A] hover:bg-[#164639]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
