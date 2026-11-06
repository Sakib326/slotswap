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
            <AdminTopBar onMenuClick={() => setMobileMenuOpen(true)} />

            <main className="p-3 sm:p-6 lg:p-8 flex-1 max-w-[1240px] w-full mx-auto">
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
