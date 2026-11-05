"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/public/Container";

interface Department {
  id: string;
  code: string;
  name: string;
}

export default function RegisterPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    departmentId: "",
    batch: "Spring 2026",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDepartments(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, departmentId: data[0].id }));
          }
        }
      })
      .catch((err) => console.error("Failed to load departments:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Registration failed.");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 md:py-20 bg-[#F4F6F3] text-[#16231F]">
      <Container>
        <div className="max-w-md mx-auto text-left">
          <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#16231F]/60">
                Join SlotSwap
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#16231F] mt-1">
                Create an account
              </h1>
              <p className="text-xs sm:text-sm text-[#16231F]/75 mt-1.5 leading-relaxed">
                Connect your institutional profile to start trading course sections.
              </p>
            </div>

            {status === "success" ? (
              <div className="p-4 rounded-[8px] bg-[#C2E4CE]/40 border border-[#1D5B4A]/30 text-xs text-[#16231F] leading-relaxed">
                <p className="font-bold text-sm mb-1 text-[#1D5B4A]">
                  Registration successful!
                </p>
                <p className="mb-4">
                  We have dispatched a verification link to <strong>{formData.email}</strong>. Check your inbox to activate your account.
                </p>
                <Link
                  href="/login"
                  className="inline-block rounded-[6px] bg-[#1D5B4A] text-white px-4 py-2 font-semibold text-xs"
                >
                  Proceed to Login
                </Link>
              </div>
            ) : (
              <>
                {status === "error" && (
                  <div
                    role="alert"
                    className="mb-5 p-3 rounded-[6px] border border-[#D9381E]/40 bg-[#F2C4C4]/40 text-xs text-[#D9381E] font-medium"
                  >
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Tanvir Rahman"
                      className="w-full h-10 rounded-[8px] border border-[#16231F]/20 bg-white px-3 text-sm text-[#16231F] focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1"
                    >
                      University Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@university.edu"
                      className="w-full h-10 rounded-[8px] border border-[#16231F]/20 bg-white px-3 text-sm text-[#16231F] focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="studentId"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1"
                      >
                        Student ID
                      </label>
                      <input
                        id="studentId"
                        name="studentId"
                        type="text"
                        required
                        value={formData.studentId}
                        onChange={handleChange}
                        placeholder="2024-0012"
                        className="w-full h-10 rounded-[8px] border border-[#16231F]/20 bg-white px-3 text-sm text-[#16231F] focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="batch"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1"
                      >
                        Batch
                      </label>
                      <input
                        id="batch"
                        name="batch"
                        type="text"
                        required
                        value={formData.batch}
                        onChange={handleChange}
                        placeholder="Spring 2026"
                        className="w-full h-10 rounded-[8px] border border-[#16231F]/20 bg-white px-3 text-sm text-[#16231F] focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="departmentId"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1"
                    >
                      Department
                    </label>
                    <select
                      id="departmentId"
                      name="departmentId"
                      required
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="w-full h-10 rounded-[8px] border border-[#16231F]/20 bg-white px-2.5 text-sm text-[#16231F] focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#16231F]/75 mb-1"
                    >
                      Password (min 8 chars, 1 letter, 1 number)
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-10 rounded-[8px] border border-[#16231F]/20 bg-white px-3 text-sm text-[#16231F] focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-11 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-[#F4F6F3] font-semibold text-sm transition disabled:opacity-50 cursor-pointer mt-2"
                  >
                    {status === "loading" ? "Creating account..." : "Create account"}
                  </button>
                </form>

                <div className="mt-5 pt-4 border-t border-[#16231F]/10 text-xs text-[#16231F]/70 text-center">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#1D5B4A] font-semibold hover:underline"
                  >
                    Log in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
