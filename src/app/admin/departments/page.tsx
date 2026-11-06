"use client";

import React, { Suspense, useState } from "react";
import { useAdminDepartments } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { Drawer } from "@/components/app/Drawer";
import { TypeToConfirmDialog } from "@/components/admin/TypeToConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { Department } from "@/types/admin";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminDepartmentsPage() {
  const {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useAdminDepartments();
  const { toast } = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptCode, setDeptCode] = useState("");
  const [deptName, setDeptName] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setDeptCode("");
    setDeptName("");
    setDrawerOpen(true);
  };

  const handleOpenEdit = (d: Department) => {
    setEditingDept(d);
    setDeptCode(d.code);
    setDeptName(d.name);
    setDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept && (!deptCode || deptCode.length < 2 || deptCode.length > 6)) {
      toast("Department code must be 2 to 6 letters", "error");
      return;
    }
    if (!deptName || deptName.length < 3 || deptName.length > 80) {
      toast("Department name must be between 3 and 80 characters", "error");
      return;
    }

    if (editingDept) {
      updateDepartment(editingDept.id, deptName);
      toast(`Updated department ${editingDept.code}`);
    } else {
      addDepartment(deptCode, deptName);
      toast(`Created department ${deptCode}`);
    }
    setDrawerOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Departments" description="Loading department master records..." />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Departments" description="University academic departments." />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Departments"
        description="Master list of university academic departments, student counts, and course offerings."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add department</span>
          </button>
        }
      />

      <div className="border border-[#16231F]/15 rounded-[12px] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Code</th>
                <th className="py-2.5 px-4">Department Name</th>
                <th className="py-2.5 px-4 text-right">Active Courses</th>
                <th className="py-2.5 px-4 text-right">Registered Students</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16231F]/10">
              {departments.map((d) => {
                const hasRelations = d.courseCount > 0 || d.studentCount > 0;

                return (
                  <tr key={d.id} className="hover:bg-[#F4F6F3]/50">
                    <td className="py-3 px-4 font-heading font-extrabold text-sm text-[#16231F]">
                      {d.code}
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#16231F]">
                      {d.name}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums">
                      {d.courseCount}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums">
                      {d.studentCount}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(d)}
                        className="text-[#1D5B4A] hover:underline font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={hasRelations}
                        title={
                          hasRelations
                            ? "Cannot delete department with active courses or students"
                            : "Delete department"
                        }
                        onClick={() => setDeleteTarget(d)}
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
      </div>

      {/* Add / Edit Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingDept ? `Edit ${editingDept.code}` : "Add Department"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
          {!editingDept && (
            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Department Code (2-6 uppercase letters)
              </label>
              <input
                type="text"
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value.toUpperCase())}
                placeholder="e.g. CSE"
                maxLength={6}
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs font-mono"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#16231F] mb-1">
              Full Department Name
            </label>
            <input
              type="text"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="px-3.5 py-2 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold"
            >
              {editingDept ? "Save changes" : "Create department"}
            </button>
          </div>
        </form>
      </Drawer>

      {/* Delete Department Dialog */}
      {deleteTarget && (
        <TypeToConfirmDialog
          open={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteDepartment(deleteTarget.id);
            toast(`Deleted department ${deleteTarget.code}`);
            setDeleteTarget(null);
          }}
          title={`Delete department ${deleteTarget.code}?`}
          description="This action will permanently delete the department."
          expectedText={deleteTarget.code}
          confirmLabel="Delete department"
        />
      )}
    </div>
  );
}
