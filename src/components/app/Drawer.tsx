"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      drawerRef.current?.focus();
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
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex-1" onClick={onClose} />
      <div
        ref={drawerRef}
        className="w-full max-w-md bg-white h-full border-l border-[#16231F]/15 p-6 shadow-2xl flex flex-col text-left overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#16231F]/15 mb-4">
          <h2 className="font-heading font-bold text-lg text-[#16231F]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1 rounded-[6px] text-[#16231F]/50 hover:bg-[#16231F]/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
