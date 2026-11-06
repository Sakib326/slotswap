"use client";

import React, { use, Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminCourse } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { Breadcrumbs } from "@/components/admin/AdminCommon";
import { Drawer } from "@/components/app/Drawer";
import { RoutineGrid } from "@/components/app/RoutineGrid";
import { TypeToConfirmDialog } from "@/components/admin/TypeToConfirmDialog";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState } from "@/components/app/StateViews";
import { useToast } from "@/components/app/Toast";
import { DayOfWeek, Section, TimeSlotId, TimeSlotSchedule } from "@/types/domain";
import { DAYS, TIME_SLOTS, getCourseColor } from "@/lib/mock/colors";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";

function CourseDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const {
    course,
    sections,
    terms,
    loading,
    updateCourse,
    deleteCourse,
    addSection,
    updateSection,
    deleteSection,
  } = useAdminCourse(id);
  const { toast } = useToast();

  const [activeTermId, setActiveTermId] = useState(terms[0]?.id || "term-fall-2026");

  // Section Form Drawer
  const [sectionDrawerOpen, setSectionDrawerOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // Section Form Fields
  const [secNum, setSecNum] = useState(1);
  const [facultyName, setFacultyName] = useState("");
  const [facultyCode, setFacultyCode] = useState("");
  const [room, setRoom] = useState("");
  const [capacity, setCapacity] = useState(35);
  const [slots, setSlots] = useState<TimeSlotSchedule[]>([
    { day: "SUN", slot: "08:30-10:00" },
    { day: "TUE", slot: "08:30-10:00" },
  ]);

  // Dialogs
  const [deleteCourseOpen, setDeleteCourseOpen] = useState(false);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState<Section | null>(null);

  const handleOpenAddSection = () => {
    setEditingSection(null);
    setSecNum(sections.length + 1);
    setFacultyName("");
    setFacultyCode("");
    setRoom("SAC401");
    setCapacity(35);
    setSlots([
      { day: "SUN", slot: "08:30-10:00" },
      { day: "TUE", slot: "08:30-10:00" },
    ]);
    setSectionDrawerOpen(true);
  };

  const handleOpenEditSection = (s: Section) => {
    setEditingSection(s);
    setSecNum(s.sectionNumber);
    setFacultyName(s.faculty);
    setFacultyCode(s.faculty);
    setRoom(s.room);
    setCapacity(s.totalSeats);
    setSlots(s.schedule);
    setSectionDrawerOpen(true);
  };

  // Check self-slot overlaps
  const hasSelfOverlap = useMemo(() => {
    if (slots.length < 2) return false;
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        if (slots[i].day === slots[j].day && slots[i].slot === slots[j].slot) {
          return true;
        }
      }
    }
    return false;
  }, [slots]);

  // Mini RoutineGrid preview blocks for the section
  const miniGhostBlocks = useMemo(() => {
    return slots.map((s) => ({
      day: s.day,
      slot: s.slot,
      courseCode: course?.code || "COURSE",
      sectionNumber: secNum,
      room,
    }));
  }, [slots, course, secNum, room]);

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasSelfOverlap) {
      toast("Error: A section cannot have overlapping slots on the same day", "error");
      return;
    }
    if (!facultyCode) {
      toast("Faculty code is required (e.g. MRK)", "error");
      return;
    }
    if (!room) {
      toast("Room is required", "error");
      return;
    }

    if (editingSection) {
      updateSection(editingSection.id, {
        sectionNumber: secNum,
        faculty: facultyCode.toUpperCase(),
        room,
        totalSeats: capacity,
        schedule: slots,
      });
      toast(`Updated Section ${secNum}`);
    } else {
      addSection({
        courseCode: course!.code,
        courseTitle: course!.title,
        sectionNumber: secNum,
        faculty: facultyCode.toUpperCase(),
        room,
        credits: course!.credits,
        totalSeats: capacity,
        seatsLeft: capacity,
        schedule: slots,
      });
      toast(`Created Section ${secNum}`);
    }
    setSectionDrawerOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Course detail" description="Loading course..." />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        description="The course may have been deleted or does not exist."
        action={
          <Link
            href="/admin/courses"
            className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
          >
            Back to courses
          </Link>
        }
      />
    );
  }

  const color = getCourseColor(course.code);

  return (
    <div className="space-y-6 text-left">
      <div>
        <Breadcrumbs
          items={[
            { label: "Courses", href: "/admin/courses" },
            { label: course.code },
          ]}
        />
        <PageHeader
          title={`${course.code}: ${course.title}`}
          description={`${course.departmentCode} department · ${course.credits}.0 Credits · ${sections.length} active sections.`}
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddSection}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Add section</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteCourseOpen(true)}
                className="px-3 py-2 rounded-[8px] border border-[#D9381E]/30 text-[#D9381E] hover:bg-[#F2C4C4]/20 text-xs font-semibold"
              >
                Delete course
              </button>
            </div>
          }
        />
      </div>

      {/* Sections Table for Selected Term */}
      <div className="p-4 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#16231F]/10">
          <h2 className="font-heading font-bold text-base text-[#16231F]">
            Sections for Fall 2026
          </h2>
          <span className="text-xs text-[#16231F]/60">
            {sections.length} sections registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2 px-3">Section</th>
                <th className="py-2 px-3">Faculty</th>
                <th className="py-2 px-3">Room</th>
                <th className="py-2 px-3">Weekly Schedule</th>
                <th className="py-2 px-3 text-right">Capacity</th>
                <th className="py-2 px-3 text-right">Seats Left</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16231F]/10">
              {sections.map((sec) => (
                <tr key={sec.id} className="hover:bg-[#F4F6F3]/50">
                  <td className="py-2.5 px-3 font-heading font-bold text-xs text-[#16231F]">
                    Sec {sec.sectionNumber}
                  </td>
                  <td className="py-2.5 px-3 font-semibold">{sec.faculty}</td>
                  <td className="py-2.5 px-3 font-mono">{sec.room}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {sec.schedule.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-[4px] bg-[#F4F6F3] border border-[#16231F]/15 text-[11px] font-mono"
                        >
                          {s.day} {s.slot}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{sec.totalSeats}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    {sec.seatsLeft === 0 ? (
                      <span className="px-1.5 py-0.2 rounded bg-[#F2C4C4] text-[#D9381E] font-bold text-[10px]">
                        FULL
                      </span>
                    ) : (
                      <span className="font-semibold text-[#1D5B4A]">
                        {sec.seatsLeft}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditSection(sec)}
                      className="text-[#1D5B4A] hover:underline font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteSectionTarget(sec)}
                      className="text-[#D9381E] hover:underline font-semibold"
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

      {/* Section Form Drawer with SlotEditor & Mini Grid Preview */}
      <Drawer
        open={sectionDrawerOpen}
        onClose={() => setSectionDrawerOpen(false)}
        title={editingSection ? `Edit Section ${editingSection.sectionNumber}` : "Add Section"}
      >
        <form onSubmit={handleSaveSection} className="space-y-4 text-xs text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Section Number
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={secNum}
                onChange={(e) => setSecNum(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Capacity (seats)
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Faculty Code (e.g. MRK)
              </label>
              <input
                type="text"
                value={facultyCode}
                onChange={(e) => setFacultyCode(e.target.value.toUpperCase())}
                placeholder="MRK"
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#16231F] mb-1">
                Room (e.g. SAC401)
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value.toUpperCase())}
                placeholder="SAC401"
                className="w-full p-2.5 rounded-[8px] border border-[#16231F]/20 text-xs font-mono"
              />
            </div>
          </div>

          {/* SlotEditor: add/edit up to 2 slots */}
          <div className="space-y-2 pt-2 border-t border-[#16231F]/10">
            <label className="block font-semibold text-[#16231F]">
              Weekly Day & Time Slots (max 2 slots)
            </label>

            {slots.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={s.day}
                  onChange={(e) => {
                    const next = [...slots];
                    next[idx].day = e.target.value as DayOfWeek;
                    setSlots(next);
                  }}
                  className="p-2 rounded-[6px] border border-[#16231F]/20 text-xs bg-white"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={s.slot}
                  onChange={(e) => {
                    const next = [...slots];
                    next[idx].slot = e.target.value as TimeSlotId;
                    setSlots(next);
                  }}
                  className="p-2 rounded-[6px] border border-[#16231F]/20 text-xs bg-white flex-1"
                >
                  {TIME_SLOTS.map((ts) => (
                    <option key={ts.id} value={ts.id}>
                      {ts.label}
                    </option>
                  ))}
                </select>

                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setSlots(slots.filter((_, i) => i !== idx))}
                    className="p-1 text-[#D9381E] hover:bg-[#F2C4C4]/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {slots.length < 2 && (
              <button
                type="button"
                onClick={() =>
                  setSlots([...slots, { day: "MON", slot: "10:00-11:30" }])
                }
                className="text-xs font-semibold text-[#1D5B4A] hover:underline"
              >
                + Add second weekly slot
              </button>
            )}

            {hasSelfOverlap && (
              <div className="p-2 rounded bg-[#F2C4C4]/50 border border-[#D9381E]/30 text-[#D9381E] text-xs flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Slots overlap! Choose different days or times.</span>
              </div>
            )}
          </div>

          {/* Mini RoutineGrid Preview */}
          <div className="space-y-1.5 pt-2 border-t border-[#16231F]/10">
            <span className="font-semibold text-[#16231F] block text-xs">
              Section schedule preview:
            </span>
            <div className="p-2 rounded-[8px] bg-[#F4F6F3] border border-[#16231F]/15">
              <RoutineGrid enrollments={[]} ghostBlocks={miniGhostBlocks} compact={true} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-[#16231F]/10">
            <button
              type="button"
              onClick={() => setSectionDrawerOpen(false)}
              className="px-3.5 py-2 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasSelfOverlap}
              className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] disabled:bg-[#16231F]/20 disabled:cursor-not-allowed text-white text-xs font-semibold"
            >
              {editingSection ? "Save changes" : "Create section"}
            </button>
          </div>
        </form>
      </Drawer>

      {/* Delete Section Dialog */}
      {deleteSectionTarget && (
        <TypeToConfirmDialog
          open={Boolean(deleteSectionTarget)}
          onClose={() => setDeleteSectionTarget(null)}
          onConfirm={() => {
            deleteSection(deleteSectionTarget.id);
            toast(`Deleted section ${deleteSectionTarget.sectionNumber}`);
            setDeleteSectionTarget(null);
          }}
          title={`Delete Section ${deleteSectionTarget.sectionNumber}?`}
          description="Any active swap requests posted for this section will be cancelled."
          expectedText={`SEC${deleteSectionTarget.sectionNumber}`}
          confirmLabel="Delete section"
        />
      )}

      {/* Delete Course Dialog */}
      {deleteCourseOpen && (
        <TypeToConfirmDialog
          open={deleteCourseOpen}
          onClose={() => setDeleteCourseOpen(false)}
          onConfirm={() => {
            deleteCourse();
            toast(`Deleted course ${course.code}`);
            router.push("/admin/courses");
          }}
          title={`Delete ${course.code}?`}
          description={`Permanently deletes course ${course.code} and its ${sections.length} active sections.`}
          expectedText={course.code}
          confirmLabel="Delete course"
        />
      )}
    </div>
  );
}

export default function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <CourseDetailContent id={id} />
    </Suspense>
  );
}
