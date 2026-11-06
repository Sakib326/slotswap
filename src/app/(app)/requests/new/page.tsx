"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequests, useRoutine, useProfile } from "@/lib/mock/api";
import { PageHeader } from "@/components/app/PageHeader";
import { RoutineGrid } from "@/components/app/RoutineGrid";
import { SectionRow } from "@/components/app/SectionRow";
import { useToast } from "@/components/app/Toast";
import { findClashes } from "@/lib/mock/clash";
import { getCourseColor } from "@/lib/mock/colors";
import { Section, DayOfWeek, TimeRange } from "@/types/domain";

function NewRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedHoldId = searchParams.get("hold");

  const { enrollments, catalog } = useRoutine();
  const { postRequest } = useRequests();
  const { student } = useProfile();
  const { toast } = useToast();

  // Part 1: Section you hold
  const initialHeld =
    enrollments.find((e) => e.section.id === preselectedHoldId)?.section ||
    enrollments[0]?.section;
  const [heldSection, setHeldSection] = useState<Section | undefined>(initialHeld);

  // Available candidate sections for the selected course (excluding held section)
  const candidateSections = useMemo(() => {
    if (!heldSection) return [];
    return catalog.filter(
      (s) =>
        s.courseCode === heldSection.courseCode &&
        s.sectionNumber !== heldSection.sectionNumber
    );
  }, [heldSection, catalog]);

  // Part 2: Sections you'd accept (multi-select)
  const [selectedWantedIds, setSelectedWantedIds] = useState<string[]>([]);

  // Part 3: Preferences
  const [preferredDays, setPreferredDays] = useState<DayOfWeek[]>(student.preferredDays);
  const [preferredTimeRange, setPreferredTimeRange] = useState<TimeRange>(
    student.preferredTimeRange
  );
  const [allowMultiWaySwaps, setAllowMultiWaySwaps] = useState<boolean>(
    student.allowMultiWaySwaps
  );

  const toggleWanted = (id: string) => {
    setSelectedWantedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDay = (day: DayOfWeek) => {
    setPreferredDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Live ghost blocks for selected wanted sections
  const ghostBlocks = useMemo(() => {
    return candidateSections
      .filter((s) => selectedWantedIds.includes(s.id))
      .flatMap((s) =>
        s.schedule.map((slot) => ({
          day: slot.day,
          slot: slot.slot,
          courseCode: s.courseCode,
          sectionNumber: s.sectionNumber,
          room: s.room,
        }))
      );
  }, [candidateSections, selectedWantedIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heldSection) {
      toast("Select the section you currently hold", "error");
      return;
    }
    if (selectedWantedIds.length === 0) {
      toast("Select at least one section you would accept", "error");
      return;
    }

    const wanted = candidateSections.filter((s) =>
      selectedWantedIds.includes(s.id)
    );

    postRequest({
      heldSection,
      wantedSections: wanted,
      status: "OPEN",
      preferredDays,
      preferredTimeRange,
      allowMultiWaySwaps,
    });

    toast("Swap request posted successfully");
    router.push("/requests");
  };

  if (!heldSection) {
    return (
      <div className="p-6 text-center text-xs text-[#16231F]/60">
        You have no registered sections to swap. Please add a section to your routine first.
      </div>
    );
  }

  const holdColor = getCourseColor(heldSection.courseCode);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left">
      <PageHeader
        title="Create swap request"
        description="Choose the course section you want to give up and select all alternative sections you would accept."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3 Step Sequence (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          {/* STEP 1: Section you hold */}
          <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1D5B4A] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-heading font-bold text-base text-[#16231F]">
                Section you hold
              </h2>
            </div>
            <p className="text-xs text-[#16231F]/70">
              Select which of your registered courses you want to swap out of:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {enrollments.map((e) => {
                const isSelected = heldSection.id === e.section.id;
                const c = getCourseColor(e.section.courseCode);

                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      setHeldSection(e.section);
                      setSelectedWantedIds([]);
                    }}
                    className={`p-3 rounded-[8px] border text-left transition ${
                      isSelected
                        ? "bg-white border-2 border-[#1D5B4A]"
                        : "bg-[#F4F6F3]/50 border-[#16231F]/15 hover:border-[#16231F]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-[4px] border ${c.bg} ${c.border} font-bold text-xs`}
                      >
                        {e.section.courseCode} · Sec {e.section.sectionNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#16231F]/60 mt-1">
                      {e.section.schedule.map((s) => `${s.day} ${s.slot}`).join(", ")}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Sections you'd accept */}
          <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1D5B4A] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-heading font-bold text-base text-[#16231F]">
                  Sections you would accept
                </h2>
              </div>
              <span className="text-xs text-[#1D5B4A] font-semibold">
                {selectedWantedIds.length} selected
              </span>
            </div>
            <p className="text-xs text-[#16231F]/70">
              Select all sections that fit your timetable. Choosing multiple sections improves match speed by up to 3x.
            </p>

            <div className="space-y-2">
              {candidateSections.map((sec) => {
                // Calculate clash against other classes (excluding the held course code)
                const clash = findClashes(sec, enrollments, heldSection.courseCode);
                const isSelected = selectedWantedIds.includes(sec.id);

                return (
                  <SectionRow
                    key={sec.id}
                    section={sec}
                    isSelected={isSelected}
                    onToggle={() => toggleWanted(sec.id)}
                    clashExplanation={clash.explanation}
                    disabled={clash.hasClash}
                  />
                );
              })}
            </div>
          </div>

          {/* STEP 3: Request Preferences */}
          <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1D5B4A] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-heading font-bold text-base text-[#16231F]">
                Matching preferences
              </h2>
            </div>

            {/* Preferred Days Toggle */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-[#16231F]">Preferred days</label>
              <div className="flex gap-2">
                {(["SUN", "MON", "TUE", "WED", "THU"] as DayOfWeek[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-[6px] font-semibold text-xs transition ${
                      preferredDays.includes(d)
                        ? "bg-[#1D5B4A] text-white"
                        : "bg-[#F4F6F3] border border-[#16231F]/20 text-[#16231F]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-way Swaps Toggle */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs text-[#16231F]">
                  Allow 3-way cycle chains
                </p>
                <p className="text-[11px] text-[#16231F]/60">
                  Enables matching through triangular swaps (A→B→C→A) when no direct pair exists.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowMultiWaySwaps}
                onChange={(e) => setAllowMultiWaySwaps(e.target.checked)}
                className="w-4 h-4 accent-[#1D5B4A] rounded"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/requests")}
              className="px-4 py-2 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold text-[#16231F] hover:bg-[#16231F]/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedWantedIds.length === 0}
              className="px-5 py-2.5 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] disabled:bg-[#16231F]/20 disabled:cursor-not-allowed text-white text-xs font-semibold transition"
            >
              Post request
            </button>
          </div>
        </div>

        {/* Right Column: Live Routine Preview with Ghost Blocks (5/12) */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-sm text-[#16231F]">
              Live schedule preview
            </h2>
            <span className="text-[11px] text-[#16231F]/60">
              Dashed blocks = proposed sections
            </span>
          </div>

          <div className="p-4 rounded-[12px] bg-white border border-[#16231F]/15">
            <RoutineGrid
              enrollments={enrollments}
              ghostBlocks={ghostBlocks}
              compact={true}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default function NewRequestPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#16231F]/60">Loading...</div>}>
      <NewRequestForm />
    </Suspense>
  );
}
