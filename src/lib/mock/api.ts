"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMockStore } from "./store";
import {
  Enrollment,
  Section,
  StudentNotification,
  StudentProfile,
  SwapChain,
  SwapRequest,
  UserSession,
} from "@/types/domain";

const MOCK_DELAY = 350; // ms

// Helper to simulate delay and check mock query params
function useMockQueryState() {
  const searchParams = useSearchParams();
  const mockParam = searchParams.get("mock");
  return {
    isEmpty: mockParam === "empty",
    isError: mockParam === "error",
  };
}

// MOCK: getRoutine
export function useRoutine() {
  const { state, dispatch } = useMockStore();
  const { isEmpty, isError } = useMockQueryState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const addEnrollment = (section: Section) => {
    dispatch({ type: "ADD_ENROLLMENT", payload: section });
  };

  const removeEnrollment = (enrollmentId: string) => {
    dispatch({ type: "REMOVE_ENROLLMENT", payload: enrollmentId });
  };

  return {
    enrollments: isEmpty ? [] : isError ? [] : state.enrollments,
    catalog: state.catalog,
    loading,
    error: isError ? "We couldn't load your routine." : null,
    addEnrollment,
    removeEnrollment,
  };
}

// MOCK: listRequests
export function useRequests() {
  const { state, dispatch } = useMockStore();
  const { isEmpty, isError } = useMockQueryState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const postRequest = (
    req: Omit<SwapRequest, "id" | "createdAt" | "timeline">
  ) => {
    dispatch({ type: "POST_REQUEST", payload: req });
  };

  const cancelRequest = (id: string) => {
    dispatch({ type: "CANCEL_REQUEST", payload: id });
  };

  const acceptSuggestion = (id: string) => {
    dispatch({ type: "ACCEPT_SUGGESTION", payload: id });
  };

  return {
    requests: isEmpty ? [] : isError ? [] : state.requests,
    loading,
    error: isError ? "We couldn't load your requests." : null,
    postRequest,
    cancelRequest,
    acceptSuggestion,
  };
}

// MOCK: getRequest(id)
export function useRequest(id: string) {
  const { state, dispatch } = useMockStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(timer);
  }, [id]);

  const request = state.requests.find((r) => r.id === id);

  return {
    request,
    loading,
    cancelRequest: () => dispatch({ type: "CANCEL_REQUEST", payload: id }),
    acceptSuggestion: () =>
      dispatch({ type: "ACCEPT_SUGGESTION", payload: id }),
  };
}

// MOCK: listSwaps
export function useSwaps() {
  const { state, dispatch } = useMockStore();
  const { isEmpty, isError } = useMockQueryState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const confirmSwap = (id: string) => {
    dispatch({ type: "CONFIRM_SWAP", payload: id });
  };

  const declineSwap = (id: string) => {
    dispatch({ type: "DECLINE_SWAP", payload: id });
  };

  return {
    swaps: isEmpty ? [] : isError ? [] : state.swaps,
    loading,
    error: isError ? "We couldn't load your swaps." : null,
    confirmSwap,
    declineSwap,
  };
}

// MOCK: getSwap(id)
export function useSwap(id: string) {
  const { state, dispatch } = useMockStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(timer);
  }, [id]);

  const swap = state.swaps.find((s) => s.id === id);

  return {
    swap,
    loading,
    confirmSwap: () => dispatch({ type: "CONFIRM_SWAP", payload: id }),
    declineSwap: () => dispatch({ type: "DECLINE_SWAP", payload: id }),
  };
}

// MOCK: listNotifications
export function useNotifications() {
  const { state, dispatch } = useMockStore();
  const { isEmpty, isError } = useMockQueryState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const markRead = (id: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
  };

  const markAllRead = () => {
    dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" });
  };

  const unreadCount = state.notifications.filter((n) => !n.isRead).length;

  return {
    notifications: isEmpty ? [] : isError ? [] : state.notifications,
    unreadCount,
    loading,
    error: isError ? "We couldn't load your notifications." : null,
    markRead,
    markAllRead,
  };
}

// MOCK: getProfile / updateProfile / sessions
export function useProfile() {
  const { state, dispatch } = useMockStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const updateProfile = (data: Partial<StudentProfile>) => {
    dispatch({ type: "UPDATE_PROFILE", payload: data });
  };

  const revokeSession = (id: string) => {
    dispatch({ type: "REVOKE_SESSION", payload: id });
  };

  const revokeAllOtherSessions = () => {
    dispatch({ type: "REVOKE_ALL_OTHER_SESSIONS" });
  };

  const resetStore = () => {
    dispatch({ type: "RESET_STORE" });
  };

  return {
    student: state.student,
    sessions: state.sessions,
    loading,
    updateProfile,
    revokeSession,
    revokeAllOtherSessions,
    resetStore,
  };
}
