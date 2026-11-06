export type DayOfWeek = "SUN" | "MON" | "TUE" | "WED" | "THU";

export type TimeSlotId =
  | "08:30-10:00"
  | "10:00-11:30"
  | "11:30-13:00"
  | "13:00-14:30"
  | "14:30-16:00";

export type TimeRange = "MORNING" | "AFTERNOON" | "EVENING" | "ANY";

export type ContactVisibility = "HIDDEN" | "AFTER_CONFIRMATION";

export type RequestStatus =
  | "OPEN"
  | "MATCHED"
  | "AWAITING_CONFIRMATION"
  | "COMPLETED"
  | "CANCELLED";

export type SwapStatus =
  | "AWAITING_CONFIRMATION"
  | "CONFIRMED"
  | "COMPLETED"
  | "DECLINED"
  | "CANCELLED"
  | "EXPIRED";

export type NotificationType =
  | "MATCH_FOUND"
  | "CONFIRMATION_NEEDED"
  | "PARTNER_CONFIRMED"
  | "SWAP_COMPLETED"
  | "CHAIN_CANCELLED"
  | "DEADLINE_REMINDER";

export type CourseColor =
  | "marker-blue"
  | "marker-yellow"
  | "marker-pink"
  | "marker-mint"
  | "marker-peach"
  | "marker-lilac";

export interface TimeSlotSchedule {
  day: DayOfWeek;
  slot: TimeSlotId; // e.g. "08:30-10:00"
}

export interface Section {
  id: string;
  courseCode: string;
  courseTitle: string;
  sectionNumber: number;
  faculty: string;
  room: string;
  credits: number;
  totalSeats: number;
  seatsLeft: number;
  schedule: TimeSlotSchedule[];
}

export interface Enrollment {
  id: string;
  section: Section;
  enrolledAt: string;
}

export interface SwapSuggestion {
  id: string;
  section: Section;
  reason: string;
  matchesInstantlyWithCount: number;
}

export interface SwapChainParticipant {
  id: string;
  name: string;
  department: string;
  reliability: number;
  isYou: boolean;
  givingSection: Section;
  gettingSection: Section;
  status: "CONFIRMED" | "WAITING" | "DECLINED";
  phone?: string;
  contactVisibility: ContactVisibility;
}

export interface SwapChain {
  id: string;
  type: "TWO_WAY" | "THREE_WAY";
  status: SwapStatus;
  participants: SwapChainParticipant[];
  expiresAt: string; // ISO string
  createdAt: string;
  courseCode: string;
  declinedByName?: string;
}

export interface SwapRequest {
  id: string;
  heldSection: Section;
  wantedSections: Section[];
  status: RequestStatus;
  createdAt: string;
  preferredDays: DayOfWeek[];
  preferredTimeRange: TimeRange;
  allowMultiWaySwaps: boolean;
  suggestion?: SwapSuggestion;
  matchedSwapId?: string;
  timeline: {
    event: string;
    timestamp: string;
  }[];
}

export interface StudentNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface UserSession {
  id: string;
  device: string;
  ip: string;
  isCurrent: boolean;
  createdAt: string;
  lastActiveAt: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  isEmailVerified: boolean;
  studentId: string;
  department: string;
  batch: string;
  phone: string;
  contactVisibility: ContactVisibility;
  reliability: number;
  swapsCompleted: number;
  swapsCancelled: number;
  preferredDays: DayOfWeek[];
  preferredTimeRange: TimeRange;
  allowMultiWaySwaps: boolean;
  notifyByEmail: boolean;
  notifyInApp: boolean;
}

export interface ClashResult {
  hasClash: boolean;
  clashingEnrollment?: Enrollment;
  clashingSlot?: TimeSlotSchedule;
  explanation?: string;
}
