"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  Enrollment,
  Section,
  StudentNotification,
  StudentProfile,
  SwapChain,
  SwapRequest,
  UserSession,
} from "@/types/domain";
import {
  catalogSections,
  createInitialSwaps,
  initialEnrollments,
  initialNotifications,
  initialRequests,
  initialSessions,
  initialStudent,
} from "./seed";

const STORAGE_KEY = "slotswap_mock_store_v1";

interface MockState {
  student: StudentProfile;
  enrollments: Enrollment[];
  requests: SwapRequest[];
  swaps: SwapChain[];
  notifications: StudentNotification[];
  sessions: UserSession[];
  catalog: Section[];
}

type Action =
  | { type: "RESET_STORE" }
  | { type: "ADD_ENROLLMENT"; payload: Section }
  | { type: "REMOVE_ENROLLMENT"; payload: string } // enrollmentId
  | { type: "POST_REQUEST"; payload: Omit<SwapRequest, "id" | "createdAt" | "timeline"> }
  | { type: "CANCEL_REQUEST"; payload: string } // requestId
  | { type: "ACCEPT_SUGGESTION"; payload: string } // requestId
  | { type: "CONFIRM_SWAP"; payload: string } // swapId
  | { type: "DECLINE_SWAP"; payload: string } // swapId
  | { type: "MARK_NOTIFICATION_READ"; payload: string } // notifId
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  | { type: "UPDATE_PROFILE"; payload: Partial<StudentProfile> }
  | { type: "REVOKE_SESSION"; payload: string } // sessionId
  | { type: "REVOKE_ALL_OTHER_SESSIONS" };

function getInitialState(): MockState {
  if (typeof window !== "undefined") {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
  }
  return {
    student: initialStudent,
    enrollments: initialEnrollments,
    requests: initialRequests,
    swaps: createInitialSwaps(),
    notifications: initialNotifications,
    sessions: initialSessions,
    catalog: catalogSections,
  };
}

function mockReducer(state: MockState, action: Action): MockState {
  switch (action.type) {
    case "RESET_STORE": {
      const fresh = {
        student: initialStudent,
        enrollments: initialEnrollments,
        requests: initialRequests,
        swaps: createInitialSwaps(),
        notifications: initialNotifications,
        sessions: initialSessions,
        catalog: catalogSections,
      };
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      }
      return fresh;
    }

    case "ADD_ENROLLMENT": {
      const newEnrollment: Enrollment = {
        id: `enr-${Date.now()}`,
        section: action.payload,
        enrolledAt: new Date().toISOString(),
      };
      return {
        ...state,
        enrollments: [...state.enrollments, newEnrollment],
      };
    }

    case "REMOVE_ENROLLMENT": {
      return {
        ...state,
        enrollments: state.enrollments.filter((e) => e.id !== action.payload),
      };
    }

    case "POST_REQUEST": {
      const newReq: SwapRequest = {
        ...action.payload,
        id: `req-${Date.now()}`,
        createdAt: new Date().toISOString(),
        timeline: [
          {
            event: `Request created for ${action.payload.heldSection.courseCode} Sec ${action.payload.heldSection.sectionNumber}`,
            timestamp: new Date().toISOString(),
          },
          {
            event: "Searching for 2-way and 3-way cycles",
            timestamp: new Date().toISOString(),
          },
        ],
      };
      return {
        ...state,
        requests: [newReq, ...state.requests],
      };
    }

    case "CANCEL_REQUEST": {
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === action.payload
            ? {
                ...r,
                status: "CANCELLED" as const,
                timeline: [
                  ...r.timeline,
                  {
                    event: "Request cancelled by student",
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : r
        ),
      };
    }

    case "ACCEPT_SUGGESTION": {
      return {
        ...state,
        requests: state.requests.map((r) => {
          if (r.id === action.payload && r.suggestion) {
            return {
              ...r,
              wantedSections: [...r.wantedSections, r.suggestion.section],
              status: "MATCHED" as const,
              suggestion: undefined,
              timeline: [
                ...r.timeline,
                {
                  event: `Added suggested backup ${r.suggestion.section.courseCode} Sec ${r.suggestion.section.sectionNumber}`,
                  timestamp: new Date().toISOString(),
                },
                {
                  event: "Cycle matched instantly",
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          return r;
        }),
      };
    }

    case "CONFIRM_SWAP": {
      return {
        ...state,
        swaps: state.swaps.map((s) => {
          if (s.id === action.payload) {
            const updatedParticipants = s.participants.map((p) =>
              p.isYou ? { ...p, status: "CONFIRMED" as const } : p
            );
            const allConfirmed = updatedParticipants.every(
              (p) => p.status === "CONFIRMED"
            );
            return {
              ...s,
              status: allConfirmed ? ("COMPLETED" as const) : ("CONFIRMED" as const),
              participants: updatedParticipants,
            };
          }
          return s;
        }),
      };
    }

    case "DECLINE_SWAP": {
      return {
        ...state,
        swaps: state.swaps.map((s) => {
          if (s.id === action.payload) {
            return {
              ...s,
              status: "CANCELLED" as const,
              declinedByName: state.student.name,
              participants: s.participants.map((p) =>
                p.isYou ? { ...p, status: "DECLINED" as const } : p
              ),
            };
          }
          return s;
        }),
      };
    }

    case "MARK_NOTIFICATION_READ": {
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };
    }

    case "MARK_ALL_NOTIFICATIONS_READ": {
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };
    }

    case "UPDATE_PROFILE": {
      return {
        ...state,
        student: { ...state.student, ...action.payload },
      };
    }

    case "REVOKE_SESSION": {
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.payload),
      };
    }

    case "REVOKE_ALL_OTHER_SESSIONS": {
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.isCurrent),
      };
    }

    default:
      return state;
  }
}

interface MockContextType {
  state: MockState;
  dispatch: React.Dispatch<Action>;
}

const MockStoreContext = createContext<MockContextType | null>(null);

export function MockStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mockReducer, undefined, getInitialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  return (
    <MockStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </MockStoreContext.Provider>
  );
}

export function useMockStore() {
  const context = useContext(MockStoreContext);
  if (!context) {
    throw new Error("useMockStore must be used within MockStoreProvider");
  }
  return context;
}
