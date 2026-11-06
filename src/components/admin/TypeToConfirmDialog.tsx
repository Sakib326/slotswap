"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";

interface TypeToConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  expectedText: string;
  confirmLabel?: string;
  reasonRequired?: boolean;
  onReasonChange?: (reason: string) => void;
}

export function TypeToConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  expectedText,
  confirmLabel = "Confirm delete",
  reasonRequired = false,
  onReasonChange,
}: TypeToConfirmDialogProps) {
  const [typedText, setTypedText] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setTypedText("");
      setReason("");
    }
  }, [open]);

  if (!open) return null;

  const isMatched = typedText.trim() === expectedText.trim();
  const isReasonValid = !reasonRequired || reason.trim().length >= 5;
  const isEnabled = isMatched && isReasonValid;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white border border-[#16231F]/15 rounded-[12px] p-6 shadow-xl text-left space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F2C4C4]/60 text-[#D9381E] flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#16231F]/40 hover:text-[#16231F]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#16231F]/70 leading-relaxed">
          {description}
        </p>

        {reasonRequired && (
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-[#16231F]">
              Reason for this action (min 5 characters)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                onReasonChange?.(e.target.value);
              }}
              placeholder="State the administrative reason..."
              className="w-full p-2 rounded-[8px] border border-[#16231F]/20 text-xs focus:ring-2 focus:ring-[#D9381E] focus:outline-none"
            />
          </div>
        )}

        <div className="space-y-1.5 text-xs">
          <label className="text-[#16231F]/80">
            To proceed, type <strong className="font-mono text-[#D9381E]">{expectedText}</strong> below:
          </label>
          <input
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder={expectedText}
            className="w-full p-2 rounded-[8px] border border-[#16231F]/20 text-xs font-mono focus:ring-2 focus:ring-[#D9381E] focus:outline-none"
          />
        </div>

        <div className="pt-3 border-t border-[#16231F]/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold text-[#16231F] hover:bg-[#16231F]/5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isEnabled}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-[8px] bg-[#D9381E] hover:bg-[#B32B14] disabled:bg-[#16231F]/20 disabled:cursor-not-allowed text-white text-xs font-semibold transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
