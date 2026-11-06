"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminStore } from "./admin-store";
import {
  AdminCourse,
  AdminUser,
  AnalyticsSummary,
  AuditEntry,
  Department,
  ImportRow,
  SystemSettingsState,
  Term,
} from "@/types/admin";
import { Section, SwapChain, SwapRequest } from "@/types/domain";

const MOCK_DELAY = 350;

function useAdminMockQuery() {
  const searchParams = useSearchParams();
  const mock = searchParams.get("mock");
  return {
    isEmpty: mock === "empty",
    isError: mock === "error",
  };
}

// MOCK: useAdminUsers
export function useAdminUsers() {
  const { state, dispatch } = useAdminStore();
  const { isEmpty, isError } = useAdminMockQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, []);

  return {
    users: isEmpty ? [] : isError ? [] : state.users,
    currentAdmin: state.currentAdmin,
    loading,
    error: isError ? "We couldn't load the users list." : null,
    changeRole: (userId: string, newRole: "ADMIN" | "STUDENT") =>
      dispatch({ type: "CHANGE_USER_ROLE", payload: { userId, newRole } }),
    suspendUser: (userId: string, reason: string) =>
      dispatch({ type: "SUSPEND_USER", payload: { userId, reason } }),
    reactivateUser: (userId: string) =>
      dispatch({ type: "REACTIVATE_USER", payload: { userId } }),
    deleteUser: (userId: string) =>
      dispatch({ type: "DELETE_USER", payload: { userId } }),
    revokeSessions: (userId: string) =>
      dispatch({ type: "REVOKE_USER_SESSIONS", payload: { userId } }),
    updateStudentId: (userId: string, studentId: string) =>
      dispatch({ type: "UPDATE_STUDENT_ID", payload: { userId, studentId } }),
  };
}

// MOCK: useAdminUser(id)
export function useAdminUser(id: string) {
  const { state, dispatch } = useAdminStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, [id]);

  const user = state.users.find((u) => u.id === id);
  const userRequests = state.requests.filter((r) => r.heldSection && user?.name === "Tanvir Hasan"); // Tanvir Hasan owns the mock requests
  const userSwaps = state.swaps.filter((s) => s.participants.some((p) => p.id === user?.id || (user?.id === "user-tanvir" && p.isYou)));
  const userAudits = state.auditLogs.filter((a) => a.targetId === id || a.targetLabel.includes(user?.name || ""));

  return {
    user,
    userRequests,
    userSwaps,
    userAudits,
    currentAdmin: state.currentAdmin,
    loading,
    changeRole: (newRole: "ADMIN" | "STUDENT") =>
      dispatch({ type: "CHANGE_USER_ROLE", payload: { userId: id, newRole } }),
    suspendUser: (reason: string) =>
      dispatch({ type: "SUSPEND_USER", payload: { userId: id, reason } }),
    reactivateUser: () =>
      dispatch({ type: "REACTIVATE_USER", payload: { userId: id } }),
    deleteUser: () =>
      dispatch({ type: "DELETE_USER", payload: { userId: id } }),
    revokeSessions: () =>
      dispatch({ type: "REVOKE_USER_SESSIONS", payload: { userId: id } }),
    updateStudentId: (studentId: string) =>
      dispatch({ type: "UPDATE_STUDENT_ID", payload: { userId: id, studentId } }),
  };
}

// MOCK: useAdminSwaps
export function useAdminSwaps() {
  const { state, dispatch } = useAdminStore();
  const { isEmpty, isError } = useAdminMockQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, []);

  return {
    swaps: isEmpty ? [] : isError ? [] : state.swaps,
    loading,
    error: isError ? "We couldn't load the swaps." : null,
    forceCancelSwap: (swapId: string, reason: string) =>
      dispatch({ type: "FORCE_CANCEL_SWAP", payload: { swapId, reason } }),
  };
}

// MOCK: useAdminSwap(id)
export function useAdminSwap(id: string) {
  const { state, dispatch } = useAdminStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, [id]);

  const swap = state.swaps.find((s) => s.id === id);

  return {
    swap,
    loading,
    forceCancelSwap: (reason: string) =>
      dispatch({ type: "FORCE_CANCEL_SWAP", payload: { swapId: id, reason } }),
  };
}

// MOCK: useAdminRequests
export function useAdminRequests() {
  const { state } = useAdminStore();
  const { isEmpty, isError } = useAdminMockQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, []);

  return {
    requests: isEmpty ? [] : isError ? [] : state.requests,
    loading,
    error: isError ? "We couldn't load the requests." : null,
  };
}

// MOCK: useAdminDepartments
export function useAdminDepartments() {
  const { state, dispatch } = useAdminStore();
  const { isEmpty, isError } = useAdminMockQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, []);

  return {
    departments: isEmpty ? [] : isError ? [] : state.departments,
    loading,
    error: isError ? "We couldn't load the departments." : null,
    addDepartment: (code: string, name: string) =>
      dispatch({ type: "ADD_DEPARTMENT", payload: { code, name } }),
    updateDepartment: (id: string, name: string) =>
      dispatch({ type: "UPDATE_DEPARTMENT", payload: { id, name } }),
    deleteDepartment: (id: string) =>
      dispatch({ type: "DELETE_DEPARTMENT", payload: { id } }),
  };
}

// MOCK: useAdminCourses
export function useAdminCourses() {
  const { state, dispatch } = useAdminStore();
  const { isEmpty, isError } = useAdminMockQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, []);

  return {
    courses: isEmpty ? [] : isError ? [] : state.courses,
    sections: state.sections,
    departments: state.departments,
    loading,
    error: isError ? "We couldn't load the courses." : null,
    addCourse: (course: Omit<AdminCourse, "id" | "sectionsCount" | "openRequestsCount" | "color">) =>
      dispatch({ type: "ADD_COURSE", payload: course }),
    updateCourse: (id: string, title: string, credits: number) =>
      dispatch({ type: "UPDATE_COURSE", payload: { id, title, credits } }),
    deleteCourse: (id: string) =>
      dispatch({ type: "DELETE_COURSE", payload: { id } }),
  };
}

// MOCK: useAdminCourse(id)
export function useAdminCourse(id: string) {
  const { state, dispatch } = useAdminStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, [id]);

  const course = state.courses.find((c) => c.id === id);
  const sections = state.sections.filter((s) => s.courseCode === course?.code);
  const terms = state.terms;

  return {
    course,
    sections,
    terms,
    loading,
    updateCourse: (title: string, credits: number) =>
      dispatch({ type: "UPDATE_COURSE", payload: { id, title, credits } }),
    deleteCourse: () =>
      dispatch({ type: "DELETE_COURSE", payload: { id } }),
    addSection: (sec: Omit<Section, "id">) =>
      dispatch({ type: "ADD_SECTION", payload: sec }),
    updateSection: (sectionId: string, updates: Partial<Section>) =>
      dispatch({ type: "UPDATE_SECTION", payload: { id: sectionId, updates } }),
    deleteSection: (sectionId: string) =>
      dispatch({ type: "DELETE_SECTION", payload: { id: sectionId } }),
  };
}

// MOCK: useAdminTerms
export function useAdminTerms() {
  const { state, dispatch } = useAdminStore();
  const { isEmpty, isError } = useAdminMockQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, []);

  return {
    terms: isEmpty ? [] : isError ? [] : state.terms,
    loading,
    error: isError ? "We couldn't load the terms." : null,
    toggleSwapWindow: (termId: string, isOpen: boolean) =>
      dispatch({ type: "TOGGLE_SWAP_WINDOW", payload: { termId, isOpen } }),
    setActiveTerm: (termId: string) =>
      dispatch({ type: "SET_ACTIVE_TERM", payload: { termId } }),
    createTerm: (term: Omit<Term, "id" | "status" | "swapWindowOpen">) =>
      dispatch({ type: "CREATE_TERM", payload: term }),
  };
}

// MOCK: useAdminSettings
export function useAdminSettings() {
  const { state, dispatch } = useAdminStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, []);

  return {
    settings: state.settings,
    loading,
    updateSettings: (updates: Partial<SystemSettingsState>) =>
      dispatch({ type: "UPDATE_SETTINGS", payload: updates }),
    resetToDefaults: () =>
      dispatch({ type: "RESET_SETTINGS_DEFAULT" }),
  };
}

// MOCK: useAdminAuditLogs
export function useAdminAuditLogs() {
  const { state } = useAdminStore();
  const { isEmpty, isError } = useAdminMockQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, []);

  return {
    logs: isEmpty ? [] : isError ? [] : state.auditLogs,
    loading,
    error: isError ? "We couldn't load the audit logs." : null,
  };
}

// MOCK: useAdminAnalytics
export function useAdminAnalytics(rangeDays = 30): {
  analytics: AnalyticsSummary;
  loading: boolean;
} {
  const { state } = useAdminStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(t);
  }, [rangeDays]);

  // Construct deterministic analytics from current state
  const swapsByDay = Array.from({ length: Math.min(rangeDays, 30) }).map((_, i) => {
    const d = new Date(Date.now() - (rangeDays - 1 - i) * 86400000);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    const count = (i * 3 + (i % 4) * 2) % 11 + 2;
    return { date: dateStr, count };
  });

  const funnel = {
    requestsCreated: 142,
    matched: 98,
    confirmed: 82,
    completed: 76,
    cancelled: 14,
    expired: 8,
  };

  const mostRequestedSections = [
    { courseCode: "CSE327", sectionNumber: 2, requestCount: 22, capacity: 35 },
    { courseCode: "CSE327", sectionNumber: 5, requestCount: 18, capacity: 35 },
    { courseCode: "CSE311", sectionNumber: 3, requestCount: 16, capacity: 35 },
    { courseCode: "MAT216", sectionNumber: 1, requestCount: 14, capacity: 40 },
    { courseCode: "CSE465", sectionNumber: 1, requestCount: 12, capacity: 35 },
  ];

  const unmetDemandCourses = [
    { courseCode: "CSE327", openRequests: 14, fullSectionsCount: 2 },
    { courseCode: "CSE465", openRequests: 12, fullSectionsCount: 3 },
    { courseCode: "CSE225", openRequests: 11, fullSectionsCount: 2 },
    { courseCode: "CSE373", openRequests: 9, fullSectionsCount: 1 },
    { courseCode: "CSE311", openRequests: 8, fullSectionsCount: 1 },
  ];

  const swapTypeSplit = {
    twoWay: 48,
    threeWay: 28,
  };

  const reliabilityDistribution = [
    { range: "90-100%", count: 32 },
    { range: "80-89%", count: 10 },
    { range: "70-79%", count: 4 },
    { range: "< 70%", count: 2 },
  ];

  return {
    analytics: {
      swapsByDay,
      funnel,
      mostRequestedSections,
      unmetDemandCourses,
      swapTypeSplit,
      reliabilityDistribution,
    },
    loading,
  };
}
