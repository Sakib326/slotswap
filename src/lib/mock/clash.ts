import { ClashResult, Enrollment, Section, TimeSlotSchedule } from "@/types/domain";

/**
 * Pure function: check if a section clashes with existing enrollments.
 * If excludingCourseCode is given, it won't clash with the student's currently held section of that same course (since you are swapping out of it!).
 */
export function findClashes(
  proposedSection: Section,
  currentEnrollments: Enrollment[],
  excludingCourseCode?: string
): ClashResult {
  const relevantEnrollments = excludingCourseCode
    ? currentEnrollments.filter((e) => e.section.courseCode !== excludingCourseCode)
    : currentEnrollments;

  for (const proposedSlot of proposedSection.schedule) {
    for (const enrollment of relevantEnrollments) {
      for (const enrolledSlot of enrollment.section.schedule) {
        if (
          proposedSlot.day === enrolledSlot.day &&
          proposedSlot.slot === enrolledSlot.slot
        ) {
          return {
            hasClash: true,
            clashingEnrollment: enrollment,
            clashingSlot: proposedSlot,
            explanation: `Clashes with ${enrollment.section.courseCode} (Sec ${enrollment.section.sectionNumber}) on ${proposedSlot.day} ${proposedSlot.slot}`,
          };
        }
      }
    }
  }

  return { hasClash: false };
}

/**
 * Pure function: find all ghost blocks for a proposed section
 */
export function buildGhostBlocks(section: Section) {
  return section.schedule.map((s) => ({
    day: s.day,
    slot: s.slot,
    courseCode: section.courseCode,
    sectionNumber: section.sectionNumber,
    room: section.room,
  }));
}
