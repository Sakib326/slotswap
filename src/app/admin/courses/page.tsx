"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminCourses } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { Drawer } from "@/components/app/Drawer";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { getCourseColor } from "@/lib/mock/colors";
import { AdminCourse } from "@/types/admin";
import { Plus, Search, BookOpen } from "lucide-react";

function CoursesTableContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { courses, departments, loading, error, addCourse } = useAdminCourses();
  const { toast } = useToast();

  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [deptCode, setDeptCode] = useState("CSE");
  const [credits, setCredits] = useState(3);

  const deptFilter = searchParams.get("dept") || "ALL";
  const q = searchParams.get("q") || "";

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (deptFilter !== "ALL" && c.departmentCode !== deptFilter) return false;
      if (q.trim()) {
        const query = q.toLowerCase();
        if (
          !c.code.toLowerCase().includes(query) &&
          !c.title.toLowerCase().includes(query)
        )
          return false;
      }
      return true;
    });
  }, [courses, deptFilter, q]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || courseCode.length < 3) {
      toast("Course code required (e.g. CSE327)", "error");
      return;
    }
    if (!courseTitle || courseTitle.length < 3) {
      toast("Course title required", "error");
      return;
    }

    addCourse({
      code: courseCode.toUpperCase(),
      title: courseTitle,
      departmentCode: deptCode,
      credits,
    });
    toast(`Course ${courseCode.toUpperCase()} added`);
    setAddDrawerOpen(false);
    setCourseCode("");
    setCourseTitle("");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Courses" description="Loading course catalog..." />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Courses" description="Master course catalog." />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Courses & Sections Catalog"
        description="Master university course catalog, active sections, and student advising swap demands."
        action={
          <button
            type="button"
            onClick={() => setAddDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add course</span>
          </button>
        }
      />

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-[12px] bg-white border border-[#16231F]/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#16231F]/40" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams.toString());
              if (e.target.value) p.set("q", e.target.value);
              else p.delete("q");
              router.replace(`/admin/courses?${p.toString()}`);
            }}
            placeholder="Search by code or title..."
            className="w-full pl-9 pr-3 py-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white focus:ring-2 focus:ring-[#1D5B4A] focus:outline-none"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => {
            const p = new URLSearchParams(searchParams.toString());
            if (e.target.value !== "ALL") p.set("dept", e.target.value);
            else p.delete("dept");
            router.replace(`/admin/courses?${p.toString()}`);
          }}
          className="p-1.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
        >
          <option value="ALL">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.code}>
              {d.code}
            </option>
          ))}
        </select>
      </div>

      {filteredCourses.length === 0 ? (
        <EmptyState title="No courses found" description="Try clearing search or filters." />
      ) : (
        <div className="border border-[#16231F]/15 rounded-[12px] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-4">Course</th>
                  <th className="py-2.5 px-4">Dept</th>
                  <th className="py-2.5 px-4">Credits</th>
                  <th className="py-2.5 px-4 text-right">Sections</th>
                  <th className="py-2.5 px-4 text-right">Open Requests</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16231F]/10">
                {filteredCourses.map((c) => {
                  const color = getCourseColor(c.code);

                  return (
                    <tr key={c.id} className="hover:bg-[#F4F6F3]/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-3.5 h-3.5 rounded-[3px] ${color.bg} border ${color.border} shrink-0`}
                          />
                          <div>
                            <Link
                              href={`/admin/courses/${c.id}`}
                              className="font-heading font-extrabold text-sm text-[#16231F] hover:text-[#1D5B4A] hover:underline"
                            >
                              {c.code}
                            </Link>
                            <p className="text-[11px] text-[#16231F]/60">{c.title}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-[#16231F]">
                        {c.departmentCode}
                      </td>

                      <td className="py-3 px-4 font-mono">{c.credits}.0</td>

                      <td className="py-3 px-4 text-right tabular-nums font-semibold">
                        {c.sectionsCount}
                      </td>

                      <td className="py-3 px-4 text-right tabular-nums">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] font-bold text-[11px] ${
                            c.openRequestsCount > 5
                              ? "bg-[#F5E39B] text-[#16231F]"
                              : "bg-[#F4F6F3] text-[#16231F]/70"
                          }`}
                        >
                          {c.openRequestsCount}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/courses/${c.id}`}
                          className="text-[#1D5B4A] hover:underline font-semibold"
                        >
                          Manage sections
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Course Drawer */}
      <Drawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        title="Add New Course"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs text-left">
          <div>
            <label className="block font-semibold text-[#16231F] mb-1">
              Course Code (e.g. CSE327)
            </label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              placeholder="CSE327"
              className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#16231F] mb-1">
              Course Title
            </label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Software Engineering"
              className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Department
              </label>
              <select
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value)}
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs bg-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Credits (1 - 4)
              </label>
              <input
                type="number"
                min={1}
                max={4}
                value={credits}
                onChange={(e) => setCredits(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddDrawerOpen(false)}
              className="px-3.5 py-2 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold"
            >
              Create course
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <CoursesTableContent />
    </Suspense>
  );
}
