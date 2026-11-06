"use client";

import React, { useState } from "react";
import { Enrollment, DayOfWeek, TimeSlotId } from "@/types/domain";
import { DAYS, DAY_LABELS, TIME_SLOTS, getCourseColor } from "@/lib/mock/colors";

export interface GhostBlock {
  day: DayOfWeek;
  slot: TimeSlotId;
  courseCode: string;
  sectionNumber: number;
  room?: string;
}

export interface ClashBlock {
  day: DayOfWeek;
  slot: TimeSlotId;
  courseCode: string;
}

interface RoutineGridProps {
  enrollments: Enrollment[];
  ghostBlocks?: GhostBlock[];
  clashes?: ClashBlock[];
  onBlockClick?: (enrollment: Enrollment) => void;
  compact?: boolean;
}

export function RoutineGrid({
  enrollments,
  ghostBlocks = [],
  clashes = [],
  onBlockClick,
  compact = false,
}: RoutineGridProps) {
  const [selectedMobileDay, setSelectedMobileDay] = useState<DayOfWeek>("SUN");
  const [showFullGridOnMobile, setShowFullGridOnMobile] = useState(false);

  // Helper to find enrollment in a slot
  const findEnrollment = (day: DayOfWeek, slotId: TimeSlotId) => {
    return enrollments.find((e) =>
      e.section.schedule.some((s) => s.day === day && s.slot === slotId)
    );
  };

  // Helper to find ghost block in a slot
  const findGhost = (day: DayOfWeek, slotId: TimeSlotId) => {
    return ghostBlocks.find((g) => g.day === day && g.slot === slotId);
  };

  // Helper to find clash in a slot
  const findClash = (day: DayOfWeek, slotId: TimeSlotId) => {
    return clashes.find((c) => c.day === day && c.slot === slotId);
  };

  return (
    <div className="w-full text-left">
      {/* Mobile Agenda View (< md) */}
      <div className={`md:hidden ${compact ? "hidden" : "block"}`}>
        <div className="flex items-center justify-between mb-3 border-b border-[#16231F]/15 pb-2">
          {/* Day selection tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {DAYS.map((day) => {
              const count = enrollments.filter((e) =>
                e.section.schedule.some((s) => s.day === day)
              ).length;
              const isSelected = selectedMobileDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedMobileDay(day)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold tabular-nums transition ${
                    isSelected
                      ? "bg-[#1D5B4A] text-white"
                      : "bg-white border border-[#16231F]/15 text-[#16231F]"
                  }`}
                >
                  {day} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowFullGridOnMobile(!showFullGridOnMobile)}
            className="text-xs text-[#1D5B4A] underline font-semibold shrink-0 ml-2"
          >
            {showFullGridOnMobile ? "Hide grid" : "View grid"}
          </button>
        </div>

        {/* Selected day classes list */}
        {!showFullGridOnMobile ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#16231F]/60">
              {DAY_LABELS[selectedMobileDay]} schedule
            </p>
            {TIME_SLOTS.map((slot) => {
              const enrollment = findEnrollment(selectedMobileDay, slot.id);
              const ghost = findGhost(selectedMobileDay, slot.id);
              const clash = findClash(selectedMobileDay, slot.id);

              if (!enrollment && !ghost) return null;

              if (enrollment) {
                const color = getCourseColor(enrollment.section.courseCode);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onBlockClick?.(enrollment)}
                    className={`w-full p-3 rounded-[8px] border text-left flex items-center justify-between ${color.bg} ${color.border} ${
                      clash ? "ring-2 ring-[#D9381E]" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-sm text-[#16231F]">
                          {enrollment.section.courseCode}
                        </span>
                        <span className="text-xs font-semibold text-[#16231F]/70 tabular-nums">
                          Sec {enrollment.section.sectionNumber}
                        </span>
                      </div>
                      <p className="text-xs text-[#16231F]/70 mt-0.5">
                        Room {enrollment.section.room} · {enrollment.section.faculty}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#16231F]/70 tabular-nums">
                      {slot.label}
                    </span>
                  </button>
                );
              }

              if (ghost) {
                return (
                  <div
                    key={slot.id}
                    className="w-full p-3 rounded-[8px] border border-dashed border-[#16231F] bg-white/70 text-left flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-sm text-[#16231F]">
                          {ghost.courseCode} (Proposed)
                        </span>
                        <span className="text-xs font-semibold text-[#16231F]/70 tabular-nums">
                          Sec {ghost.sectionNumber}
                        </span>
                      </div>
                      {ghost.room && (
                        <p className="text-xs text-[#16231F]/70 mt-0.5">Room {ghost.room}</p>
                      )}
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#16231F]/70 tabular-nums">
                      {slot.label}
                    </span>
                  </div>
                );
              }

              return null;
            })}

            {/* Empty check for selected day */}
            {enrollments.filter((e) =>
              e.section.schedule.some((s) => s.day === selectedMobileDay)
            ).length === 0 && (
              <p className="text-xs text-[#16231F]/50 py-6 text-center border border-dashed border-[#16231F]/15 rounded-[8px] bg-white">
                No classes scheduled for {DAY_LABELS[selectedMobileDay]}.
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Desktop / Full Grid View */}
      <div
        className={`${
          showFullGridOnMobile ? "block" : "hidden md:block"
        } overflow-x-auto border border-[#16231F]/15 rounded-[12px] bg-white`}
      >
        <table
          className="w-full border-collapse min-w-[620px] text-xs"
          role="grid"
          aria-label="Weekly university class timetable"
        >
          <thead>
            <tr className="border-b border-[#16231F]/15 bg-[#F4F6F3]">
              <th className="py-2.5 px-3 text-left font-semibold text-[#16231F]/60 text-[11px] uppercase tracking-wider w-24">
                Time
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="py-2.5 px-3 text-left font-semibold text-[#16231F]/70 text-[11px] uppercase tracking-wider"
                >
                  {DAY_LABELS[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16231F]/10">
            {TIME_SLOTS.map((slot) => (
              <tr key={slot.id} className="hover:bg-[#F4F6F3]/30">
                {/* Sticky Time Slot Header */}
                <td className="py-3 px-3 font-mono font-semibold text-[#16231F]/70 tabular-nums text-[11px] bg-[#F4F6F3]/50 border-r border-[#16231F]/10 align-top">
                  {slot.label}
                </td>

                {/* Day Cells */}
                {DAYS.map((day) => {
                  const enrollment = findEnrollment(day, slot.id);
                  const ghost = findGhost(day, slot.id);
                  const clash = findClash(day, slot.id);

                  return (
                    <td
                      key={day}
                      className={`p-1.5 align-top min-h-[50px] border-r border-[#16231F]/5 last:border-r-0 ${
                        clash ? "bg-[#D9381E]/10" : ""
                      }`}
                    >
                      {enrollment && (
                        (() => {
                          const color = getCourseColor(enrollment.section.courseCode);
                          return (
                            <button
                              type="button"
                              onClick={() => onBlockClick?.(enrollment)}
                              aria-label={`${enrollment.section.courseCode} Section ${enrollment.section.sectionNumber}, ${DAY_LABELS[day]} ${slot.label}, room ${enrollment.section.room}`}
                              className={`w-full text-left p-2 rounded-[4px] border ${color.bg} ${color.border} transition hover:opacity-90 ${
                                clash ? "ring-2 ring-[#D9381E]" : ""
                              } ${compact ? "py-1 px-1.5" : "p-2"}`}
                            >
                              <div className="font-heading font-extrabold text-[#16231F] text-xs flex items-center justify-between gap-1">
                                <span>{enrollment.section.courseCode}</span>
                                <span className="text-[10px] tabular-nums font-semibold opacity-75">
                                  Sec {enrollment.section.sectionNumber}
                                </span>
                              </div>
                              {!compact && (
                                <div className="text-[10px] text-[#16231F]/75 mt-0.5 truncate">
                                  {enrollment.section.room} · {enrollment.section.faculty}
                                </div>
                              )}
                            </button>
                          );
                        })()
                      )}

                      {/* Ghost Block Preview */}
                      {!enrollment && ghost && (
                        <div
                          className={`w-full text-left rounded-[4px] border border-dashed border-[#16231F] bg-white/70 p-2 ${
                            clash ? "ring-2 ring-[#D9381E]" : ""
                          }`}
                        >
                          <div className="font-heading font-extrabold text-[#16231F] text-xs flex items-center justify-between">
                            <span>{ghost.courseCode}</span>
                            <span className="text-[10px] tabular-nums">
                              Sec {ghost.sectionNumber}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#16231F]/70 mt-0.5">Proposed</div>
                        </div>
                      )}

                      {!enrollment && !ghost && (
                        <div className="h-8 flex items-center justify-center text-[#16231F]/15 font-mono text-xs">
                          -
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
