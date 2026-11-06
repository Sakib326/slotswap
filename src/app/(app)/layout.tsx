"use client";

import React from "react";
import { MockStoreProvider } from "@/lib/mock/store";
import { ToastProvider } from "@/components/app/Toast";
import {
  StudentSidebar,
  StudentTopBar,
  MobileBottomTabs,
} from "@/components/app/NavigationShell";

export default function StudentAppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MockStoreProvider>
      <ToastProvider>
        <div className="min-h-screen flex bg-[#F4F6F3] text-[#16231F] font-body">
          {/* Desktop Sidebar (>= lg) */}
          <StudentSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
            <StudentTopBar />
            <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1200px] w-full mx-auto">
              {children}
            </main>
          </div>

          {/* Mobile Bottom Tabs (< lg) */}
          <MobileBottomTabs />
        </div>
      </ToastProvider>
    </MockStoreProvider>
  );
}
