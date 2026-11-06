import { CourseColor, DayOfWeek, TimeSlotId } from "@/types/domain";

export const DAYS: DayOfWeek[] = ["SUN", "MON", "TUE", "WED", "THU"];
export const DAY_LABELS: Record<DayOfWeek, string> = {
  SUN: "Sunday",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
};

export const TIME_SLOTS: { id: TimeSlotId; label: string; start: string; end: string }[] = [
  { id: "08:30-10:00", label: "08:30 – 10:00", start: "08:30", end: "10:00" },
  { id: "10:00-11:30", label: "10:00 – 11:30", start: "10:00", end: "11:30" },
  { id: "11:30-13:00", label: "11:30 – 13:00", start: "11:30", end: "13:00" },
  { id: "13:00-14:30", label: "13:00 – 14:30", start: "13:00", end: "14:30" },
  { id: "14:30-16:00", label: "14:30 – 16:00", start: "14:30", end: "16:00" },
];

const COLOR_PALETTE: {
  bg: string;
  token: CourseColor;
  border: string;
}[] = [
  { token: "marker-blue", bg: "bg-[#BCD7F2]", border: "border-[#16231F]/20" },
  { token: "marker-yellow", bg: "bg-[#F5E39B]", border: "border-[#16231F]/20" },
  { token: "marker-mint", bg: "bg-[#C2E4CE]", border: "border-[#16231F]/20" },
  { token: "marker-pink", bg: "bg-[#F2C4C4]", border: "border-[#16231F]/20" },
  { token: "marker-peach", bg: "bg-[#F8D5B5]", border: "border-[#16231F]/20" },
  { token: "marker-lilac", bg: "bg-[#DCD3F0]", border: "border-[#16231F]/20" },
];

/**
 * Deterministically get course marker color based on course code
 */
export function getCourseColor(courseCode: string) {
  let hash = 0;
  for (let i = 0; i < courseCode.length; i++) {
    hash = (hash << 5) - hash + courseCode.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}
