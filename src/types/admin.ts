import {
  CourseColor,
  DayOfWeek,
  RequestStatus,
  Section,
  SwapStatus,
  TimeRange,
  TimeSlotId,
  TimeSlotSchedule,
  UserSession,
} from "./domain";

export type AdminRole = "STUDENT" | "ADMIN";
export type AccountStatus = "ACTIVE" | "SUSPENDED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  studentId?: string;
  departmentCode: string;
  batch: string;
  role: AdminRole;
  status: AccountStatus;
  suspendedReason?: string;
  phone: string;
  contactVisibility: "HIDDEN" | "AFTER_CONFIRMATION";
  reliability: number;
  swapsCompleted: number;
  swapsCancelled: number;
  preferredDays: DayOfWeek[];
  preferredTimeRange: TimeRange;
  allowMultiWaySwaps: boolean;
  notifyByEmail: boolean;
  notifyInApp: boolean;
  createdAt: string;
  lastLoginAt: string;
  sessions: UserSession[];
}

export type AuditActionType =
  | "USER_ROLE_CHANGED"
  | "USER_SUSPENDED"
  | "USER_REACTIVATED"
  | "USER_DELETED"
  | "USER_SESSIONS_REVOKED"
  | "USER_STUDENT_ID_CHANGED"
  | "COURSE_CREATED"
  | "COURSE_UPDATED"
  | "COURSE_DELETED"
  | "SECTION_CREATED"
  | "SECTION_UPDATED"
  | "SECTION_DELETED"
  | "SECTIONS_IMPORTED"
  | "SWAP_FORCE_CANCELLED"
  | "SETTINGS_CHANGED"
  | "SWAP_WINDOW_OPENED"
  | "SWAP_WINDOW_CLOSED"
  | "TERM_CREATED"
  | "TERM_ACTIVATED"
  | "DEPARTMENT_CREATED"
  | "DEPARTMENT_UPDATED"
  | "DEPARTMENT_DELETED";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: AdminRole;
  action: AuditActionType;
  targetType: "USER" | "SWAP" | "COURSE" | "SECTION" | "TERM" | "DEPARTMENT" | "SETTINGS";
  targetId?: string;
  targetLabel: string;
  details?: {
    field?: string;
    oldValue?: any;
    newValue?: any;
    reason?: string;
    summary?: string;
  }[];
}

export interface Term {
  id: string;
  name: string;
  status: "ACTIVE" | "ENDED" | "UPCOMING";
  startDate: string;
  endDate: string;
  swapWindowOpen: boolean;
  swapWindowOpensAt: string;
  swapWindowClosesAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  courseCount: number;
  studentCount: number;
}

export interface AdminCourse {
  id: string;
  code: string;
  title: string;
  departmentCode: string;
  credits: number;
  sectionsCount: number;
  openRequestsCount: number;
  color: CourseColor;
}

export interface ImportRow {
  rowNumber: number;
  department: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  section: number;
  facultyName: string;
  facultyCode: string;
  room: string;
  capacity: number;
  day1: string;
  time1: string;
  day2?: string;
  time2?: string;
  isValid: boolean;
  errors: string[];
}

export interface SystemSettingsState {
  confirmationTimeLimitHours: number; // 1 to 72
  maxChainLength: 2 | 3;
  allowMultiWaySwapsGlobally: boolean;
  maxOpenRequestsPerStudent: number; // 1 to 10
  pointsLostOnCancelAfterConfirm: number; // 0 to 50
  pointsLostOnDecline: number; // 0 to 20
  minScoreForMatching: number; // 0 to 100
  allowedEmailDomains: string[];
  requireVerifiedEmail: boolean; // true, disabled
  sessionLengthDays: number; // 1 to 30
  reminderHoursBeforeExpiry: number; // 1 to 24
}

export interface AnalyticsSummary {
  swapsByDay: { date: string; count: number }[];
  funnel: {
    requestsCreated: number;
    matched: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    expired: number;
  };
  mostRequestedSections: {
    courseCode: string;
    sectionNumber: number;
    requestCount: number;
    capacity: number;
  }[];
  unmetDemandCourses: {
    courseCode: string;
    openRequests: number;
    fullSectionsCount: number;
  }[];
  swapTypeSplit: {
    twoWay: number;
    threeWay: number;
  };
  reliabilityDistribution: {
    range: string;
    count: number;
  }[];
}
