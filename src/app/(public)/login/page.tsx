"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/public/Container";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Guard: if already logged in, redirect away from /login
  useEffect(() => {
    // 1. Check real backend session
    fetch("/api/users/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && (data.name || data.email)) {
          router.replace(data.role === "ADMIN" ? "/admin" : "/dashboard");
          return;
        }
        checkMockStore();
      })
      .catch(() => {
        checkMockStore();
      });

    function checkMockStore() {
      try {
        const mockAdmin = sessionStorage.getItem("slotswap_admin_store_v1");
        const mockStudent = sessionStorage.getItem("slotswap_mock_store_v1");
        if (mockAdmin) {
          const parsed = JSON.parse(mockAdmin);
          if (parsed.currentAdmin) {
            router.replace("/admin");
            return;
          }
        }
        if (mockStudent) {
          const parsed = JSON.parse(mockStudent);
          if (parsed.student) {
            router.replace("/dashboard");
            return;
          }
        }
      } catch {}
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Invalid credentials. Please try again.");
      }

      // Check role to redirect appropriately
      if (data.user?.role === "ADMIN") {
        router.push("/admin/users");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An error occurred during sign in.");
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 md:py-20 bg-[#F4F6F3] text-[#16231F]">
      <Container>
        <div className="max-w-md mx-auto text-left">
          {/* Card container */}
          <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#16231F]/60">
                Student & Staff Access
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#16231F] mt-1">
                Log in to SlotSwap
              </h1>
              <p className="text-xs sm:text-sm text-[#16231F]/75 mt-1.5 leading-relaxed">
                Enter your university email to access your section swaps and routines.
              </p>
            </div>

            {status === "error" && (
              <div
                role="alert"
                className="mb-5 p-3 rounded-[6px] border border-[#D9381E]/40 bg-[#F2C4C4]/40 text-xs text-[#D9381E] font-medium"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1.5"
                >
                  University Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full h-10 rounded-[8px] border border-[#16231F]/20 bg-white px-3 text-sm text-[#16231F] focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#1D5B4A] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 rounded-[8px] border border-[#16231F]/20 bg-white px-3 text-sm text-[#16231F] focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-11 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-[#F4F6F3] font-semibold text-sm transition disabled:opacity-50 cursor-pointer mt-2"
              >
                {status === "loading" ? "Signing in..." : "Log in"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#16231F]/10 text-xs text-[#16231F]/70 text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#1D5B4A] font-semibold hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
