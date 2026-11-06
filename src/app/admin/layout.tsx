"use client";

import React, { useState } from "react";
import { AdminStoreProvider } from "@/lib/mock/admin-store";
import { ToastProvider } from "@/components/app/Toast";
import { AdminSidebar, AdminTopBar, AdminMobileDrawer } from "@/components/admin/AdminShell";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AdminStoreProvider>
      <ToastProvider>
        <div className="min-h-screen flex bg-[#F4F6F3] text-[#16231F] font-body">
          {/* Desktop Sidebar (>= lg) */}
          <AdminSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile Header with Hamburger (< lg) */}
            <div className="lg:hidden flex items-center justify-between px-4 h-12 bg-white border-b border-[#16231F]/15">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1 rounded text-[#16231F]"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-heading font-bold text-sm text-[#16231F]">
                SlotSwap Admin
              </span>
              <div className="w-5" />
            </div>

            <AdminTopBar />

            <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1240px] w-full mx-auto">
              {children}
            </main>
          </div>

          {/* Mobile Drawer */}
          <AdminMobileDrawer
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>
      </ToastProvider>
    </AdminStoreProvider>
  );
}
