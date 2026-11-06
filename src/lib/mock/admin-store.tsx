"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  AdminCourse,
  AdminUser,
  AuditEntry,
  Department,
  ImportRow,
  SystemSettingsState,
  Term,
} from "@/types/admin";
import { Section, SwapChain, SwapRequest } from "@/types/domain";
import {
  currentAdminUser,
  initialAdminUsers,
  initialAuditLogs,
  initialCourses,
  initialDepartments,
  initialSystemSettings,
  initialTerms,
} from "./admin-seed";
import { catalogSections, createInitialSwaps, initialRequests } from "./seed";
import { getCourseColor } from "./colors";

const ADMIN_STORAGE_KEY = "slotswap_admin_store_v1";

interface AdminState {
  currentAdmin: AdminUser;
  users: AdminUser[];
  departments: Department[];
  terms: Term[];
  courses: AdminCourse[];
  sections: Section[];
  swaps: SwapChain[];
  requests: SwapRequest[];
  settings: SystemSettingsState;
  auditLogs: AuditEntry[];
}

type AdminAction =
  | { type: "RESET_ADMIN_STORE" }
  | { type: "CHANGE_USER_ROLE"; payload: { userId: string; newRole: "ADMIN" | "STUDENT" } }
  | { type: "SUSPEND_USER"; payload: { userId: string; reason: string } }
  | { type: "REACTIVATE_USER"; payload: { userId: string } }
  | { type: "DELETE_USER"; payload: { userId: string } }
  | { type: "REVOKE_USER_SESSIONS"; payload: { userId: string } }
  | { type: "UPDATE_STUDENT_ID"; payload: { userId: string; studentId: string } }
  | { type: "FORCE_CANCEL_SWAP"; payload: { swapId: string; reason: string } }
  | { type: "ADD_DEPARTMENT"; payload: { code: string; name: string } }
  | { type: "UPDATE_DEPARTMENT"; payload: { id: string; name: string } }
  | { type: "DELETE_DEPARTMENT"; payload: { id: string } }
  | { type: "ADD_COURSE"; payload: Omit<AdminCourse, "id" | "sectionsCount" | "openRequestsCount" | "color"> }
  | { type: "UPDATE_COURSE"; payload: { id: string; title: string; credits: number } }
  | { type: "DELETE_COURSE"; payload: { id: string } }
  | { type: "ADD_SECTION"; payload: Omit<Section, "id"> }
  | { type: "UPDATE_SECTION"; payload: { id: string; updates: Partial<Section> } }
  | { type: "DELETE_SECTION"; payload: { id: string } }
  | { type: "IMPORT_SECTIONS"; payload: ImportRow[] }
  | { type: "TOGGLE_SWAP_WINDOW"; payload: { termId: string; isOpen: boolean } }
  | { type: "SET_ACTIVE_TERM"; payload: { termId: string } }
  | { type: "CREATE_TERM"; payload: Omit<Term, "id" | "status" | "swapWindowOpen"> }
  | { type: "UPDATE_SETTINGS"; payload: Partial<SystemSettingsState> }
  | { type: "RESET_SETTINGS_DEFAULT" };

function getInitialAdminState(): AdminState {
  if (typeof window !== "undefined") {
    try {
      const saved = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
  }

  return {
    currentAdmin: currentAdminUser,
    users: initialAdminUsers,
    departments: initialDepartments,
    terms: initialTerms,
    courses: initialCourses,
    sections: catalogSections,
    swaps: createInitialSwaps(),
    requests: initialRequests,
    settings: initialSystemSettings,
    auditLogs: initialAuditLogs,
  };
}

function appendAudit(
  state: AdminState,
  entry: Omit<AuditEntry, "id" | "timestamp" | "actorName" | "actorRole">
): AuditEntry[] {
  const newEntry: AuditEntry = {
    ...entry,
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName: state.currentAdmin.name,
    actorRole: state.currentAdmin.role,
  };
  return [newEntry, ...state.auditLogs];
}

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "RESET_ADMIN_STORE": {
      const fresh: AdminState = {
        currentAdmin: currentAdminUser,
        users: initialAdminUsers,
        departments: initialDepartments,
        terms: initialTerms,
        courses: initialCourses,
        sections: catalogSections,
        swaps: createInitialSwaps(),
        requests: initialRequests,
        settings: initialSystemSettings,
        auditLogs: initialAuditLogs,
      };
      if (typeof window !== "undefined") {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(fresh));
      }
      return fresh;
    }

    case "CHANGE_USER_ROLE": {
      const target = state.users.find((u) => u.id === action.payload.userId);
      if (!target) return state;

      const updatedUsers = state.users.map((u) =>
        u.id === action.payload.userId ? { ...u, role: action.payload.newRole } : u
      );

      const logs = appendAudit(state, {
        action: "USER_ROLE_CHANGED",
        targetType: "USER",
        targetId: target.id,
        targetLabel: `${target.name} (${target.email})`,
        details: [{ field: "role", oldValue: target.role, newValue: action.payload.newRole }],
      });

      return { ...state, users: updatedUsers, auditLogs: logs };
    }

    case "SUSPEND_USER": {
      const target = state.users.find((u) => u.id === action.payload.userId);
      if (!target) return state;

      const updatedUsers = state.users.map((u) =>
        u.id === action.payload.userId
          ? {
              ...u,
              status: "SUSPENDED" as const,
              suspendedReason: action.payload.reason,
              sessions: [], // Force logout all sessions
            }
          : u
      );

      const logs = appendAudit(state, {
        action: "USER_SUSPENDED",
        targetType: "USER",
        targetId: target.id,
        targetLabel: `${target.name} (${target.email})`,
        details: [
          { field: "status", oldValue: "ACTIVE", newValue: "SUSPENDED", reason: action.payload.reason },
        ],
      });

      return { ...state, users: updatedUsers, auditLogs: logs };
    }

    case "REACTIVATE_USER": {
      const target = state.users.find((u) => u.id === action.payload.userId);
      if (!target) return state;

      const updatedUsers = state.users.map((u) =>
        u.id === action.payload.userId
          ? { ...u, status: "ACTIVE" as const, suspendedReason: undefined }
          : u
      );

      const logs = appendAudit(state, {
        action: "USER_REACTIVATED",
        targetType: "USER",
        targetId: target.id,
        targetLabel: `${target.name} (${target.email})`,
        details: [{ field: "status", oldValue: "SUSPENDED", newValue: "ACTIVE" }],
      });

      return { ...state, users: updatedUsers, auditLogs: logs };
    }

    case "DELETE_USER": {
      const target = state.users.find((u) => u.id === action.payload.userId);
      if (!target) return state;

      const updatedUsers = state.users.filter((u) => u.id !== action.payload.userId);
      const logs = appendAudit(state, {
        action: "USER_DELETED",
        targetType: "USER",
        targetId: target.id,
        targetLabel: `${target.name} (${target.email})`,
      });

      return { ...state, users: updatedUsers, auditLogs: logs };
    }

    case "REVOKE_USER_SESSIONS": {
      const target = state.users.find((u) => u.id === action.payload.userId);
      if (!target) return state;

      const count = target.sessions.length;
      const updatedUsers = state.users.map((u) =>
        u.id === action.payload.userId ? { ...u, sessions: [] } : u
      );

      const logs = appendAudit(state, {
        action: "USER_SESSIONS_REVOKED",
        targetType: "USER",
        targetId: target.id,
        targetLabel: `${target.name} (${target.email})`,
        details: [{ summary: `Ended ${count} active sessions` }],
      });

      return { ...state, users: updatedUsers, auditLogs: logs };
    }

    case "UPDATE_STUDENT_ID": {
      const target = state.users.find((u) => u.id === action.payload.userId);
      if (!target) return state;

      const updatedUsers = state.users.map((u) =>
        u.id === action.payload.userId ? { ...u, studentId: action.payload.studentId } : u
      );

      const logs = appendAudit(state, {
        action: "USER_STUDENT_ID_CHANGED",
        targetType: "USER",
        targetId: target.id,
        targetLabel: `${target.name}`,
        details: [{ field: "studentId", oldValue: target.studentId, newValue: action.payload.studentId }],
      });

      return { ...state, users: updatedUsers, auditLogs: logs };
    }

    case "FORCE_CANCEL_SWAP": {
      const target = state.swaps.find((s) => s.id === action.payload.swapId);
      if (!target) return state;

      const updatedSwaps = state.swaps.map((s) =>
        s.id === action.payload.swapId
          ? {
              ...s,
              status: "CANCELLED" as const,
              declinedByName: `Admin (${state.currentAdmin.name}): ${action.payload.reason}`,
            }
          : s
      );

      const logs = appendAudit(state, {
        action: "SWAP_FORCE_CANCELLED",
        targetType: "SWAP",
        targetId: target.id,
        targetLabel: `${target.courseCode} ${target.type === "THREE_WAY" ? "3-way" : "2-way"} swap`,
        details: [{ field: "status", oldValue: target.status, newValue: "CANCELLED", reason: action.payload.reason }],
      });

      return { ...state, swaps: updatedSwaps, auditLogs: logs };
    }

    case "ADD_DEPARTMENT": {
      const newDept: Department = {
        id: `dept-${action.payload.code.toLowerCase()}`,
        code: action.payload.code.toUpperCase(),
        name: action.payload.name,
        courseCount: 0,
        studentCount: 0,
      };

      const logs = appendAudit(state, {
        action: "DEPARTMENT_CREATED",
        targetType: "DEPARTMENT",
        targetId: newDept.id,
        targetLabel: `${newDept.code} - ${newDept.name}`,
      });

      return {
        ...state,
        departments: [...state.departments, newDept],
        auditLogs: logs,
      };
    }

    case "UPDATE_DEPARTMENT": {
      const target = state.departments.find((d) => d.id === action.payload.id);
      if (!target) return state;

      const updatedDepts = state.departments.map((d) =>
        d.id === action.payload.id ? { ...d, name: action.payload.name } : d
      );

      const logs = appendAudit(state, {
        action: "DEPARTMENT_UPDATED",
        targetType: "DEPARTMENT",
        targetId: target.id,
        targetLabel: `${target.code} - ${action.payload.name}`,
        details: [{ field: "name", oldValue: target.name, newValue: action.payload.name }],
      });

      return { ...state, departments: updatedDepts, auditLogs: logs };
    }

    case "DELETE_DEPARTMENT": {
      const target = state.departments.find((d) => d.id === action.payload.id);
      if (!target) return state;

      const updatedDepts = state.departments.filter((d) => d.id !== action.payload.id);
      const logs = appendAudit(state, {
        action: "DEPARTMENT_DELETED",
        targetType: "DEPARTMENT",
        targetId: target.id,
        targetLabel: `${target.code} - ${target.name}`,
      });

      return { ...state, departments: updatedDepts, auditLogs: logs };
    }

    case "ADD_COURSE": {
      const color = getCourseColor(action.payload.code);
      const newCourse: AdminCourse = {
        ...action.payload,
        id: `c-${action.payload.code.toLowerCase()}`,
        sectionsCount: 0,
        openRequestsCount: 0,
        color: color.token,
      };

      const logs = appendAudit(state, {
        action: "COURSE_CREATED",
        targetType: "COURSE",
        targetId: newCourse.id,
        targetLabel: `${newCourse.code} (${newCourse.title})`,
      });

      return {
        ...state,
        courses: [...state.courses, newCourse],
        auditLogs: logs,
      };
    }

    case "UPDATE_COURSE": {
      const target = state.courses.find((c) => c.id === action.payload.id);
      if (!target) return state;

      const updatedCourses = state.courses.map((c) =>
        c.id === action.payload.id
          ? { ...c, title: action.payload.title, credits: action.payload.credits }
          : c
      );

      const logs = appendAudit(state, {
        action: "COURSE_UPDATED",
        targetType: "COURSE",
        targetId: target.id,
        targetLabel: `${target.code}`,
        details: [
          { field: "title", oldValue: target.title, newValue: action.payload.title },
          { field: "credits", oldValue: target.credits, newValue: action.payload.credits },
        ],
      });

      return { ...state, courses: updatedCourses, auditLogs: logs };
    }

    case "DELETE_COURSE": {
      const target = state.courses.find((c) => c.id === action.payload.id);
      if (!target) return state;

      const updatedCourses = state.courses.filter((c) => c.id !== action.payload.id);
      const logs = appendAudit(state, {
        action: "COURSE_DELETED",
        targetType: "COURSE",
        targetId: target.id,
        targetLabel: `${target.code}`,
      });

      return { ...state, courses: updatedCourses, auditLogs: logs };
    }

    case "ADD_SECTION": {
      const newSec: Section = {
        ...action.payload,
        id: `sec-${action.payload.courseCode.toLowerCase()}-${action.payload.sectionNumber}-${Date.now()}`,
      };

      const updatedSections = [...state.sections, newSec];
      const updatedCourses = state.courses.map((c) =>
        c.code === newSec.courseCode
          ? { ...c, sectionsCount: c.sectionsCount + 1 }
          : c
      );

      const logs = appendAudit(state, {
        action: "SECTION_CREATED",
        targetType: "SECTION",
        targetId: newSec.id,
        targetLabel: `${newSec.courseCode} Sec ${newSec.sectionNumber}`,
      });

      return {
        ...state,
        sections: updatedSections,
        courses: updatedCourses,
        auditLogs: logs,
      };
    }

    case "UPDATE_SECTION": {
      const target = state.sections.find((s) => s.id === action.payload.id);
      if (!target) return state;

      const updatedSections = state.sections.map((s) =>
        s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
      );

      const logs = appendAudit(state, {
        action: "SECTION_UPDATED",
        targetType: "SECTION",
        targetId: target.id,
        targetLabel: `${target.courseCode} Sec ${target.sectionNumber}`,
      });

      return { ...state, sections: updatedSections, auditLogs: logs };
    }

    case "DELETE_SECTION": {
      const target = state.sections.find((s) => s.id === action.payload.id);
      if (!target) return state;

      const updatedSections = state.sections.filter((s) => s.id !== action.payload.id);
      const updatedCourses = state.courses.map((c) =>
        c.code === target.courseCode
          ? { ...c, sectionsCount: Math.max(0, c.sectionsCount - 1) }
          : c
      );

      const logs = appendAudit(state, {
        action: "SECTION_DELETED",
        targetType: "SECTION",
        targetId: target.id,
        targetLabel: `${target.courseCode} Sec ${target.sectionNumber}`,
      });

      return {
        ...state,
        sections: updatedSections,
        courses: updatedCourses,
        auditLogs: logs,
      };
    }

    case "IMPORT_SECTIONS": {
      const validRows = action.payload.filter((r) => r.isValid);
      let newSectionsCount = 0;
      const updatedSections = [...state.sections];

      for (const row of validRows) {
        const schedule = [{ day: row.day1 as any, slot: row.time1 as any }];
        if (row.day2 && row.time2) {
          schedule.push({ day: row.day2 as any, slot: row.time2 as any });
        }

        const sec: Section = {
          id: `sec-imp-${row.courseCode.toLowerCase()}-${row.section}-${Date.now()}-${newSectionsCount}`,
          courseCode: row.courseCode,
          courseTitle: row.courseTitle,
          sectionNumber: row.section,
          faculty: row.facultyCode,
          room: row.room,
          credits: row.credits,
          totalSeats: row.capacity,
          seatsLeft: Math.floor(row.capacity * 0.1), // 10% seats left
          schedule,
        };
        updatedSections.push(sec);
        newSectionsCount++;
      }

      const logs = appendAudit(state, {
        action: "SECTIONS_IMPORTED",
        targetType: "SECTION",
        targetLabel: `Imported ${newSectionsCount} sections from CSV`,
        details: [{ summary: `Successfully created ${newSectionsCount} sections` }],
      });

      return {
        ...state,
        sections: updatedSections,
        auditLogs: logs,
      };
    }

    case "TOGGLE_SWAP_WINDOW": {
      const updatedTerms = state.terms.map((t) =>
        t.id === action.payload.termId
          ? { ...t, swapWindowOpen: action.payload.isOpen }
          : t
      );

      const term = state.terms.find((t) => t.id === action.payload.termId);
      const logs = appendAudit(state, {
        action: action.payload.isOpen ? "SWAP_WINDOW_OPENED" : "SWAP_WINDOW_CLOSED",
        targetType: "TERM",
        targetId: action.payload.termId,
        targetLabel: term ? term.name : "Term",
      });

      return { ...state, terms: updatedTerms, auditLogs: logs };
    }

    case "SET_ACTIVE_TERM": {
      const updatedTerms = state.terms.map((t) => ({
        ...t,
        status: t.id === action.payload.termId ? ("ACTIVE" as const) : ("ENDED" as const),
      }));

      const term = state.terms.find((t) => t.id === action.payload.termId);
      const logs = appendAudit(state, {
        action: "TERM_ACTIVATED",
        targetType: "TERM",
        targetId: action.payload.termId,
        targetLabel: term ? term.name : "Term",
      });

      return { ...state, terms: updatedTerms, auditLogs: logs };
    }

    case "CREATE_TERM": {
      const newTerm: Term = {
        ...action.payload,
        id: `term-${action.payload.name.toLowerCase().replace(/\s+/g, "-")}`,
        status: "UPCOMING",
        swapWindowOpen: false,
      };

      const logs = appendAudit(state, {
        action: "TERM_CREATED",
        targetType: "TERM",
        targetId: newTerm.id,
        targetLabel: newTerm.name,
      });

      return {
        ...state,
        terms: [...state.terms, newTerm],
        auditLogs: logs,
      };
    }

    case "UPDATE_SETTINGS": {
      const updatedSettings = { ...state.settings, ...action.payload };

      const diffDetails: { field: string; oldValue: any; newValue: any }[] = [];
      for (const [key, val] of Object.entries(action.payload)) {
        diffDetails.push({
          field: key,
          oldValue: (state.settings as any)[key],
          newValue: val,
        });
      }

      const logs = appendAudit(state, {
        action: "SETTINGS_CHANGED",
        targetType: "SETTINGS",
        targetLabel: "System Configuration",
        details: diffDetails,
      });

      return {
        ...state,
        settings: updatedSettings,
        auditLogs: logs,
      };
    }

    case "RESET_SETTINGS_DEFAULT": {
      return {
        ...state,
        settings: initialSystemSettings,
      };
    }

    default:
      return state;
  }
}

interface AdminContextType {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
}

const AdminStoreContext = createContext<AdminContextType | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, undefined, getInitialAdminState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  return (
    <AdminStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const context = useContext(AdminStoreContext);
  if (!context) {
    throw new Error("useAdminStore must be used within AdminStoreProvider");
  }
  return context;
}
