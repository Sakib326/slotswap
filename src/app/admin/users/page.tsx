"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdminUsers } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TypeToConfirmDialog } from "@/components/admin/TypeToConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { AdminUser } from "@/types/admin";
import { formatRelativeTime } from "@/lib/mock/time";
import {
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  UserX,
  UserCheck,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

function UsersTableContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    users,
    currentAdmin,
    loading,
    error,
    changeRole,
    suspendUser,
    reactivateUser,
    deleteUser,
    revokeSessions,
  } = useAdminUsers();
  const { toast } = useToast();

  // URL state
  const q = searchParams.get("q") || "";
  const roleFilter = searchParams.get("role") || "ALL";
  const statusFilter = searchParams.get("status") || "ALL";
  const deptFilter = searchParams.get("dept") || "ALL";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const sort = searchParams.get("sort") || "name";

  const updateParam = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "ALL" || !val) params.delete(key);
    else params.set(key, val);
    if (key !== "page") params.set("page", "1");
    router.replace(`/admin/users?${params.toString()}`);
  };

  // Row Selection & Bulk
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Action Dialog States
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<"ADMIN" | "STUDENT">("STUDENT");
  const [suspendTarget, setSuspendTarget] = useState<AdminUser | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [logoutTarget, setLogoutTarget] = useState<AdminUser | null>(null);

  // Safety checks
  const activeAdminsCount = users.filter((u) => u.role === "ADMIN" && u.status === "ACTIVE").length;

  const isSelf = (userId: string) => userId === currentAdmin.id;
  const isLastAdmin = (user: AdminUser) => user.role === "ADMIN" && activeAdminsCount <= 1;

  // Filtered and Sorted users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
      if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
      if (deptFilter !== "ALL" && u.departmentCode !== deptFilter) return false;

      if (q.trim()) {
        const query = q.toLowerCase();
        const mName = u.name.toLowerCase().includes(query);
        const mEmail = u.email.toLowerCase().includes(query);
        const mId = u.studentId?.toLowerCase().includes(query) || false;
        if (!mName && !mEmail && !mId) return false;
      }
      return true;
    });
  }, [users, q, roleFilter, statusFilter, deptFilter]);

  // Pagination slice
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length) setSelectedIds([]);
    else setSelectedIds(paginatedUsers.map((u) => u.id));
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkSuspend = () => {
    for (const id of selectedIds) {
      if (!isSelf(id)) suspendUser(id, "Bulk administrative policy enforcement");
    }
    toast(`Suspended ${selectedIds.length} users`);
    setSelectedIds([]);
  };

  const handleBulkLogout = () => {
    for (const id of selectedIds) {
      revokeSessions(id);
    }
    toast(`Logged out sessions for ${selectedIds.length} users`);
    setSelectedIds([]);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Users" description="Loading user directory..." />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Users" description="System user accounts." />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Users"
        description="Search registered university students and administrators, manage roles, audit sessions, and enforce policy."
      />

      {/* Toolbar: Search, Filters, Bulk Action Bar */}
      <div className="p-3.5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#16231F]/40" />
            <input
              type="text"
              value={q}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="Search by name, email, or student ID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-[8px] border border-[#16231F]/20 bg-white text-xs text-[#16231F] focus:ring-2 focus:ring-[#1D5B4A] focus:outline-none"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => updateParam("role", e.target.value)}
              className="p-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => updateParam("status", e.target.value)}
              className="p-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => updateParam("dept", e.target.value)}
              className="p-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
            >
              <option value="ALL">All Depts</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="BBA">BBA</option>
              <option value="ENG">ENG</option>
              <option value="MAT">MAT</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="p-2 rounded-[8px] bg-[#1D5B4A]/10 border border-[#1D5B4A]/20 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1D5B4A]">
              {selectedIds.length} users selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBulkLogout}
                className="px-2.5 py-1 rounded-[6px] bg-white border border-[#16231F]/20 text-xs font-semibold hover:bg-[#16231F]/5"
              >
                Force logout
              </button>
              <button
                type="button"
                onClick={handleBulkSuspend}
                className="px-2.5 py-1 rounded-[6px] bg-[#D9381E] text-white text-xs font-semibold hover:bg-[#B32B14]"
              >
                Suspend selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table View */}
      {paginatedUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try adjusting your search query or clear active filters."
          action={
            <button
              onClick={() => router.replace("/admin/users")}
              className="px-3.5 py-1.5 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="border border-[#16231F]/15 rounded-[12px] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === paginatedUsers.length &&
                        paginatedUsers.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded accent-[#1D5B4A]"
                    />
                  </th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Dept</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Reliability</th>
                  <th className="py-2.5 px-3">Last Login</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16231F]/10">
                {paginatedUsers.map((u) => {
                  const selfDisabled = isSelf(u.id);
                  const lastAdminDisabled = isLastAdmin(u);

                  return (
                    <tr key={u.id} className="hover:bg-[#F4F6F3]/50">
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleSelectRow(u.id)}
                          className="rounded accent-[#1D5B4A]"
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="font-semibold text-[#16231F] hover:text-[#1D5B4A] hover:underline"
                        >
                          {u.name}
                        </Link>
                        <p className="text-[11px] text-[#16231F]/60">{u.email}</p>
                      </td>

                      <td className="py-2.5 px-3 font-mono">
                        {u.studentId || "Staff"}
                      </td>

                      <td className="py-2.5 px-3 font-semibold">{u.departmentCode}</td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                            u.role === "ADMIN"
                              ? "border border-[#1D5B4A] text-[#1D5B4A]"
                              : "border border-[#16231F]/20 text-[#16231F] bg-[#F4F6F3]"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                            u.status === "ACTIVE"
                              ? "bg-[#C2E4CE] text-[#1D5B4A]"
                              : "bg-[#F2C4C4] text-[#D9381E]"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right tabular-nums font-semibold">
                        {u.reliability}%
                      </td>

                      <td className="py-2.5 px-3 text-[#16231F]/60 text-[11px]">
                        {formatRelativeTime(u.lastLoginAt)}
                      </td>

                      <td className="py-2.5 px-3 text-right space-x-2">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="text-[#1D5B4A] hover:underline font-semibold"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          disabled={selfDisabled || lastAdminDisabled}
                          title={
                            selfDisabled
                              ? "You cannot modify your own role"
                              : lastAdminDisabled
                              ? "There must be at least one active admin"
                              : "Change role"
                          }
                          onClick={() => {
                            setRoleTarget(u);
                            setNewRole(u.role === "ADMIN" ? "STUDENT" : "ADMIN");
                          }}
                          className="text-[#16231F]/70 hover:underline font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Role
                        </button>

                        <button
                          type="button"
                          disabled={selfDisabled || lastAdminDisabled}
                          onClick={() => {
                            if (u.status === "ACTIVE") {
                              setSuspendTarget(u);
                            } else {
                              reactivateUser(u.id);
                              toast(`Reactivated account for ${u.name}`);
                            }
                          }}
                          className="text-[#16231F]/70 hover:underline font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>

                        <button
                          type="button"
                          disabled={selfDisabled || lastAdminDisabled}
                          onClick={() => setDeleteTarget(u)}
                          className="text-[#D9381E] hover:underline font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-[#16231F]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#16231F]/70">
            <span>
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, totalItems)} of {totalItems} users
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateParam("page", String(page - 1))}
                className="p-1 rounded border border-[#16231F]/20 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-[#16231F]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => updateParam("page", String(page + 1))}
                className="p-1 rounded border border-[#16231F]/20 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Dialog */}
      {roleTarget && (
        <ConfirmDialog
          open={Boolean(roleTarget)}
          onClose={() => setRoleTarget(null)}
          onConfirm={() => {
            changeRole(roleTarget.id, newRole);
            toast(`Updated role for ${roleTarget.name} to ${newRole}`);
            setRoleTarget(null);
          }}
          title={`Change role for ${roleTarget.name}`}
          description={`Switching role to ${newRole}. Administrators have full master permissions over student accounts, courses, and swap resolution cycles.`}
          confirmLabel={`Change to ${newRole}`}
        />
      )}

      {/* Suspend User Dialog */}
      {suspendTarget && (
        <TypeToConfirmDialog
          open={Boolean(suspendTarget)}
          onClose={() => setSuspendTarget(null)}
          onConfirm={() => {
            suspendUser(suspendTarget.id, suspendReason);
            toast(`Suspended account for ${suspendTarget.name}`);
            setSuspendTarget(null);
          }}
          title={`Suspend ${suspendTarget.name}?`}
          description={`Suspending will immediately terminate all ${suspendTarget.sessions.length} active sessions. The student will be unable to access SlotSwap until an administrator reactivates the account.`}
          expectedText="SUSPEND"
          reasonRequired={true}
          onReasonChange={setSuspendReason}
          confirmLabel="Suspend account"
        />
      )}

      {/* Delete User Dialog */}
      {deleteTarget && (
        <TypeToConfirmDialog
          open={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteUser(deleteTarget.id);
            toast(`Deleted user ${deleteTarget.name}`);
            setDeleteTarget(null);
          }}
          title={`Permanently delete ${deleteTarget.name}?`}
          description="Warning: All associated enrollments, swap requests, and session records will be permanently erased. This action cannot be reversed."
          expectedText={deleteTarget.email}
          confirmLabel="Delete account"
        />
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <UsersTableContent />
    </Suspense>
  );
}
