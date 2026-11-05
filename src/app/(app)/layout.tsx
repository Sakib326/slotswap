"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AppTopBar } from "@/components/dashboard/AppTopBar";

interface AuthContextType {
  user: any;
  sessions: any[];
  refreshData: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  sessions: [],
  refreshData: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [uRes, sRes] = await Promise.all([
        fetch("/api/users/me"),
        fetch("/api/auth/sessions"),
      ]);

      if (!uRes.ok) {
        router.push("/login");
        return;
      }

      const userData = await uRes.json();
      const sessionData = sRes.ok ? await sRes.json() : [];

      setUser(userData);
      setSessions(sessionData);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F3] text-sm text-[#16231F]/60">
        Loading SlotSwap...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, sessions, refreshData: loadData, loading }}>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6F3] text-[#16231F]">
        {/* Persistent Shared Sidebar across all internal pages */}
        <AppSidebar user={user} />

        {/* Right Shell with Persistent TopBar */}
        <div className="flex-1 flex flex-col min-w-0">
          <AppTopBar user={user} activeSessionCount={sessions.length} />
          <main className="p-6 md:p-8 flex-1">{children}</main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
