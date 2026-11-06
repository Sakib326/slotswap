"use client";

import React, { use, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdminUser } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { Breadcrumbs, DiffList } from "@/components/admin/AdminCommon";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TypeToConfirmDialog } from "@/components/admin/TypeToConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { formatRelativeTime } from "@/lib/mock/time";
import {
  ShieldCheck,
  User,
  Smartphone,
  History,
  Lock,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";

function UserDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "profile";

  const {
    user,
    userRequests,
    userSwaps,
    userAudits,
    currentAdmin,
    loading,
    changeRole,
    suspendUser,
    reactivateUser,
    deleteUser,
    revokeSessions,
    updateStudentId,
  } = useAdminUser(id);
  const { toast } = useToast();

  const setTab = (t: string) => {
    router.replace(`/admin/users/${id}?tab=${t}`);
  };

  const [editIdModalOpen, setEditIdModalOpen] = useState(false);
  const [newStudentId, setNewStudentId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="User detail" description="Loading profile..." />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="User not found"
        description="The requested user account does not exist or was deleted."
        action={
          <Link
            href="/admin/users"
            className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
          >
            Back to users
          </Link>
        }
      />
    );
  }

  const isSelf = user.id === currentAdmin.id;

  return (
    <div className="space-y-6 text-left">
      <div>
        <Breadcrumbs
          items={[
            { label: "Users", href: "/admin/users" },
            { label: user.name },
          ]}
        />
        <PageHeader
          title={user.name}
          description={`${user.email} · Registered ${formatRelativeTime(user.createdAt)}`}
          action={
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-[4px] text-xs font-bold ${
                  user.role === "ADMIN"
                    ? "border border-[#1D5B4A] text-[#1D5B4A]"
                    : "border border-[#16231F]/20 text-[#16231F] bg-white"
                }`}
              >
                {user.role}
              </span>

              <span
                className={`px-2.5 py-1 rounded-[4px] text-xs font-bold ${
                  user.status === "ACTIVE"
                    ? "bg-[#C2E4CE] text-[#1D5B4A]"
                    : "bg-[#F2C4C4] text-[#D9381E]"
                }`}
              >
                {user.status}
              </span>

              {!isSelf && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (user.status === "ACTIVE") setSuspendModalOpen(true);
                      else {
                        reactivateUser();
                        toast(`Reactivated account for ${user.name}`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold hover:bg-[#16231F]/5"
                  >
                    {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="px-3 py-1.5 rounded-[8px] border border-[#D9381E]/30 text-[#D9381E] hover:bg-[#F2C4C4]/20 text-xs font-semibold"
                  >
                    Delete user
                  </button>
                </>
              )}
            </div>
          }
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#16231F]/15 pb-2">
        <button
          type="button"
          onClick={() => setTab("profile")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            tab === "profile"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("sessions")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            tab === "sessions"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Sessions ({user.sessions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("activity")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            tab === "activity"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Activity & audit</span>
        </button>
      </div>

      {/* TAB 1: Profile Key-Value List */}
      {tab === "profile" && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              Account credentials & identity
            </h2>

            <div className="divide-y divide-[#16231F]/10 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#16231F]/60">Full name</span>
                <span className="font-semibold text-[#16231F]">{user.name}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#16231F]/60">Email</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#16231F]">{user.email}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#C2E4CE] text-[#1D5B4A] font-bold text-[10px]">
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#16231F]/60">Student ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-[#16231F]">
                    {user.studentId || "None (Staff)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewStudentId(user.studentId || "");
                      setEditIdModalOpen(true);
                    }}
                    className="p-1 text-[#1D5B4A] hover:bg-[#F4F6F3] rounded"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#16231F]/60">Department</span>
                <span className="font-semibold text-[#16231F]">{user.departmentCode}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#16231F]/60">Batch</span>
                <span className="font-semibold text-[#16231F]">{user.batch}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#16231F]/60">Phone number</span>
                <span className="font-semibold text-[#16231F]">
                  {user.phone || "Not provided"}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#16231F]/60">Phone visibility</span>
                <span className="font-semibold text-[#16231F]">
                  {user.contactVisibility === "AFTER_CONFIRMATION"
                    ? "Revealed after confirmation"
                    : "Always hidden"}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#16231F]/60">Reliability score</span>
                <span className="font-heading font-extrabold text-[#1D5B4A]">
                  {user.reliability}% ({user.swapsCompleted} completed, {user.swapsCancelled} cancelled)
                </span>
              </div>
              {user.suspendedReason && (
                <div className="py-2.5 flex justify-between items-center text-[#D9381E]">
                  <span className="font-semibold">Suspension reason</span>
                  <span>{user.suspendedReason}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Sessions */}
      {tab === "sessions" && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-sm text-[#16231F]">
              Active device sessions
            </h2>
            {user.sessions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  revokeSessions();
                  toast(`Terminated all sessions for ${user.name}`);
                }}
                className="px-3 py-1.5 rounded-[6px] border border-[#D9381E]/30 text-[#D9381E] text-xs font-semibold hover:bg-[#F2C4C4]/20"
              >
                Force logout all sessions
              </button>
            )}
          </div>

          {user.sessions.length === 0 ? (
            <p className="text-xs text-[#16231F]/60 p-6 text-center border border-dashed rounded-[10px] bg-white">
              No active sessions currently open.
            </p>
          ) : (
            <div className="space-y-2">
              {user.sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-[8px] bg-white border border-[#16231F]/15 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-[#16231F]/60" />
                    <div>
                      <p className="font-semibold text-[#16231F]">{s.device}</p>
                      <p className="text-[10px] text-[#16231F]/60 font-mono mt-0.5">
                        {s.ip} · Active {formatRelativeTime(s.lastActiveAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Activity & Audit */}
      {tab === "activity" && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-3">
            <h2 className="font-heading font-bold text-sm text-[#16231F]">
              Administrative audit log targeting this user
            </h2>

            {userAudits.length === 0 ? (
              <p className="text-xs text-[#16231F]/50">No audit events recorded for this user.</p>
            ) : (
              <div className="space-y-2">
                {userAudits.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-[8px] bg-[#F4F6F3] border border-[#16231F]/10 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#16231F]">{a.action}</span>
                      <span className="text-[10px] font-mono text-[#16231F]/50">
                        {formatRelativeTime(a.timestamp)}
                      </span>
                    </div>
                    <p className="text-[#16231F]/70 text-[11px]">
                      By {a.actorName} ({a.actorRole})
                    </p>
                    {a.details && a.details.length > 0 && <DiffList diffs={a.details} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Student ID Dialog */}
      <ConfirmDialog
        open={editIdModalOpen}
        onClose={() => setEditIdModalOpen(false)}
        onConfirm={() => {
          updateStudentId(newStudentId);
          toast(`Updated student ID to ${newStudentId}`);
          setEditIdModalOpen(false);
        }}
        title="Update Student ID"
        description="Warning: The student ID is the institutional record key used for advising enrollment verification. An audit log entry will be permanently written."
        confirmLabel="Save student ID"
      />

      {/* Suspend Dialog */}
      {suspendModalOpen && (
        <TypeToConfirmDialog
          open={suspendModalOpen}
          onClose={() => setSuspendModalOpen(false)}
          onConfirm={() => {
            suspendUser(suspendReason);
            toast(`Suspended account for ${user.name}`);
            setSuspendModalOpen(false);
          }}
          title={`Suspend ${user.name}?`}
          description="Suspending will immediately terminate all active sessions."
          expectedText="SUSPEND"
          reasonRequired={true}
          onReasonChange={setSuspendReason}
          confirmLabel="Suspend account"
        />
      )}

      {/* Delete Dialog */}
      {deleteModalOpen && (
        <TypeToConfirmDialog
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => {
            deleteUser();
            toast(`Deleted user ${user.name}`);
            router.push("/admin/users");
          }}
          title={`Delete ${user.name}?`}
          description="Permanently delete user profile, sessions, and swap history."
          expectedText={user.email}
          confirmLabel="Delete user"
        />
      )}
    </div>
  );
}

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <UserDetailContent id={id} />
    </Suspense>
  );
}
