"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/public/Container";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const url = q ? `/api/admin/users?q=${encodeURIComponent(q)}` : "/api/admin/users";
      const res = await fetch(url);
      if (res.status === 403 || res.status === 401) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      setUsers(data.items || []);
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [q]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const res = await fetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        reason: nextStatus === "SUSPENDED" ? "Administrative policy review" : undefined,
      }),
    });
    if (res.ok) {
      fetchUsers();
    } else {
      const err = await res.json();
      alert(err.error?.message || "Failed to update status");
    }
  };

  const handleToggleRole = async (id: string, currentRole: string) => {
    const nextRole = currentRole === "ADMIN" ? "STUDENT" : "ADMIN";
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    if (res.ok) {
      fetchUsers();
    } else {
      const err = await res.json();
      alert(err.error?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user ${name}?`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchUsers();
    } else {
      const err = await res.json();
      alert(err.error?.message || "Failed to delete user");
    }
  };

  return (
    <div className="py-12 bg-[#F4F6F3] min-h-screen text-[#16231F] text-left">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#16231F]/15 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-[4px] bg-[#F5E39B] text-[#16231F] text-xs font-semibold mb-2">
              <span>ADMINISTRATION PORTAL</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-[#16231F]">
              User Management
            </h1>
            <p className="text-xs sm:text-sm text-[#16231F]/70 mt-1">
              Search, moderate accounts, manage roles, and review session activities.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-[8px] border border-[#16231F]/20 bg-white px-4 py-2 text-xs font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-md">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, or student ID..."
            className="w-full h-10 rounded-[8px] border border-[#16231F]/20 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5B4A]"
          />
        </div>

        {error && <p className="text-xs text-[#D9381E] mb-4">{error}</p>}

        {/* Users Table */}
        <div className="border border-[#16231F]/15 rounded-[12px] bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Student ID / Dept</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16231F]/10">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F4F6F3]/50">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-sm text-[#16231F]">{u.name}</p>
                      <p className="text-[11px] text-[#16231F]/60">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-mono text-xs">{u.studentId || "N/A"}</p>
                      <p className="text-[11px] text-[#16231F]/60">{u.department?.code || "N/A"}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-[4px] font-bold text-[10px] ${
                          u.role === "ADMIN"
                            ? "bg-[#1D5B4A] text-white"
                            : "bg-[#BCD7F2] text-[#16231F]"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-[4px] font-bold text-[10px] ${
                          u.status === "ACTIVE"
                            ? "bg-[#C2E4CE] text-[#16231F]"
                            : "bg-[#F2C4C4] text-[#D9381E]"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        className="text-[#1D5B4A] hover:underline font-semibold cursor-pointer"
                      >
                        {u.role === "ADMIN" ? "Demote" : "Promote"}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className="text-[#16231F]/70 hover:underline font-semibold cursor-pointer"
                      >
                        {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="text-[#D9381E] hover:underline font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
}
