"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRoutine } from "@/lib/mock/api";
import { RoutineGrid } from "@/components/app/RoutineGrid";
import { Drawer } from "@/components/app/Drawer";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { TableSkeleton } from "@/components/app/Skeleton";
import { useToast } from "@/components/app/Toast";
import { Enrollment, Section } from "@/types/domain";
import { getCourseColor } from "@/lib/mock/colors";
import { findClashes } from "@/lib/mock/clash";
import { Plus, ArrowRightLeft, Trash2, AlertCircle } from "lucide-react";

export default function RoutinePage() {
  const { enrollments, catalog, loading, error, addEnrollment, removeEnrollment } =
    useRoutine();
  const { toast } = useToast();

  const [activeEnrollment, setActiveEnrollment] = useState<Enrollment | null>(null);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<Enrollment | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("CSE");
  const [selectedCourse, setSelectedCourse] = useState("CSE327");

  // Calculate total credits
  const totalCredits = enrollments.reduce((acc, e) => acc + e.section.credits, 0);

  // Filter catalog courses by selected dept
  const coursesInDept = Array.from(
    new Set(catalog.map((s) => s.courseCode))
  ).filter((code) => code.startsWith(selectedDept));

  const sectionsForCourse = catalog.filter((s) => s.courseCode === selectedCourse);

  const handleAddSection = (section: Section) => {
    // Check clash
    const clash = findClashes(section, enrollments);
    if (clash.hasClash) {
      toast(clash.explanation || "Section clashes with an existing class", "error");
      return;
    }
    addEnrollment(section);
    toast(`Added ${section.courseCode} Sec ${section.sectionNumber} to routine`);
    setAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (enrollmentToDelete) {
      removeEnrollment(enrollmentToDelete.id);
      toast(
        `Removed ${enrollmentToDelete.section.courseCode} Sec ${enrollmentToDelete.section.sectionNumber} from routine`
      );
      setEnrollmentToDelete(null);
      setActiveEnrollment(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My routine"
          description="View and manage your weekly registered class schedule for Fall 2026."
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My routine"
          description="View and manage your weekly registered class schedule for Fall 2026."
        />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="My routine"
        description="Weekly timetable for Fall 2026. Click any class block to view details or create a swap request."
        action={
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add section</span>
          </button>
        }
      />

      {enrollments.length === 0 ? (
        <EmptyState
          title="No classes in your routine"
          description="You are not currently enrolled in any course sections for Fall 2026."
          action={
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-3 py-1.5 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
            >
              Add a section
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Grid View (8/12) */}
          <div className="lg:col-span-9 space-y-4">
            <RoutineGrid
              enrollments={enrollments}
              onBlockClick={(e) => setActiveEnrollment(e)}
            />
          </div>

          {/* Enrolled Courses Side List (3/12) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-[12px] bg-white border border-[#16231F]/15 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#16231F]/10">
                <span className="text-xs font-bold text-[#16231F]">
                  Enrolled courses
                </span>
                <span className="text-xs font-semibold text-[#1D5B4A] tabular-nums">
                  {totalCredits} Credits
                </span>
              </div>

              <div className="space-y-2">
                {enrollments.map((e) => {
                  const color = getCourseColor(e.section.courseCode);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setActiveEnrollment(e)}
                      className="w-full text-left p-2.5 rounded-[8px] hover:bg-[#F4F6F3] border border-transparent hover:border-[#16231F]/10 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-[3px] ${color.bg} border ${color.border} shrink-0`}
                        />
                        <div>
                          <p className="font-heading font-bold text-xs text-[#16231F]">
                            {e.section.courseCode} · Sec {e.section.sectionNumber}
                          </p>
                          <p className="text-[10px] text-[#16231F]/60">
                            {e.section.faculty} · Room {e.section.room}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-[#16231F]/60 tabular-nums font-mono">
                        {e.section.credits} cr
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Detail Drawer */}
      <Drawer
        open={Boolean(activeEnrollment)}
        onClose={() => setActiveEnrollment(null)}
        title={
          activeEnrollment
            ? `${activeEnrollment.section.courseCode} Section ${activeEnrollment.section.sectionNumber}`
            : ""
        }
      >
        {activeEnrollment && (
          <div className="space-y-6">
            <div className="space-y-3 text-xs">
              <p className="text-sm font-semibold text-[#16231F]">
                {activeEnrollment.section.courseTitle}
              </p>

              <div className="p-3 rounded-[8px] bg-[#F4F6F3] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#16231F]/60">Faculty:</span>
                  <span className="font-semibold">{activeEnrollment.section.faculty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#16231F]/60">Room:</span>
                  <span className="font-semibold">{activeEnrollment.section.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#16231F]/60">Credits:</span>
                  <span className="font-semibold tabular-nums">
                    {activeEnrollment.section.credits} Credits
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#16231F]/60">Schedule:</span>
                  <span className="font-semibold tabular-nums text-right">
                    {activeEnrollment.section.schedule
                      .map((s) => `${s.day} ${s.slot}`)
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#16231F]/15">
              <Link
                href={`/requests/new?hold=${activeEnrollment.section.id}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Create swap request for this section</span>
              </Link>

              <button
                type="button"
                onClick={() => setEnrollmentToDelete(activeEnrollment)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] border border-[#D9381E]/30 text-[#D9381E] hover:bg-[#F2C4C4]/20 text-xs font-semibold transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove from routine</span>
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Section Dialog */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white border border-[#16231F]/15 rounded-[12px] p-6 shadow-xl text-left space-y-4">
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              Add section to routine
            </h2>

            {/* Course selector */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#16231F]/60 font-semibold mb-1">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    const firstCourse = catalog.find((c) =>
                      c.courseCode.startsWith(e.target.value)
                    )?.courseCode;
                    if (firstCourse) setSelectedCourse(firstCourse);
                  }}
                  className="w-full p-2 border border-[#16231F]/20 rounded-[8px] bg-white text-xs"
                >
                  <option value="CSE">CSE</option>
                  <option value="MAT">MAT</option>
                  <option value="ENG">ENG</option>
                  <option value="PHY">PHY</option>
                </select>
              </div>

              <div>
                <label className="block text-[#16231F]/60 font-semibold mb-1">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2 border border-[#16231F]/20 rounded-[8px] bg-white text-xs"
                >
                  {coursesInDept.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Available sections */}
            <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
              <p className="text-xs font-semibold text-[#16231F]/70">
                Available sections for {selectedCourse}:
              </p>
              {sectionsForCourse.map((sec) => {
                const clash = findClashes(sec, enrollments);
                const isAlreadyEnrolled = enrollments.some(
                  (e) => e.section.id === sec.id
                );

                return (
                  <div
                    key={sec.id}
                    className="p-3 rounded-[8px] border border-[#16231F]/15 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-heading font-bold text-[#16231F]">
                        Sec {sec.sectionNumber}
                      </span>{" "}
                      · {sec.faculty} · Room {sec.room}
                      <p className="text-[11px] text-[#16231F]/60 mt-0.5">
                        {sec.schedule.map((s) => `${s.day} ${s.slot}`).join(", ")}
                      </p>
                      {clash.hasClash && (
                        <p className="text-[10px] text-[#D9381E] font-semibold mt-0.5">
                          {clash.explanation}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isAlreadyEnrolled || clash.hasClash}
                      onClick={() => handleAddSection(sec)}
                      className="px-3 py-1.5 rounded-[6px] bg-[#1D5B4A] hover:bg-[#164639] disabled:bg-[#16231F]/20 disabled:cursor-not-allowed text-white text-xs font-semibold"
                    >
                      {isAlreadyEnrolled ? "Enrolled" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#16231F]/10">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-3 py-1.5 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        open={Boolean(enrollmentToDelete)}
        onClose={() => setEnrollmentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove section from routine?"
        description={
          enrollmentToDelete
            ? `Are you sure you want to drop ${enrollmentToDelete.section.courseCode} Section ${enrollmentToDelete.section.sectionNumber}? Any active swap requests for this section will need to be cancelled.`
            : ""
        }
        confirmLabel="Remove section"
        isDestructive={true}
      />
    </div>
  );
}
