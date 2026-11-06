import {
  Enrollment,
  Section,
  StudentNotification,
  StudentProfile,
  SwapChain,
  SwapRequest,
  UserSession,
} from "@/types/domain";

// Current Student Profile
export const initialStudent: StudentProfile = {
  name: "Tanvir Hasan",
  email: "tanvir.hasan@northsouth.edu",
  isEmailVerified: true,
  studentId: "2024-1-60-123",
  department: "CSE",
  batch: "Fall 2024",
  phone: "+8801712345678",
  contactVisibility: "AFTER_CONFIRMATION",
  reliability: 92,
  swapsCompleted: 4,
  swapsCancelled: 1,
  preferredDays: ["SUN", "TUE", "THU"],
  preferredTimeRange: "MORNING",
  allowMultiWaySwaps: true,
  notifyByEmail: true,
  notifyInApp: true,
};

// Course Section Catalog (12 realistic university courses with sections)
export const catalogSections: Section[] = [
  // CSE327 - Software Engineering
  {
    id: "sec-cse327-1",
    courseCode: "CSE327",
    courseTitle: "Software Engineering",
    sectionNumber: 1,
    faculty: "MRK",
    room: "SAC401",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 0, // FULL
    schedule: [
      { day: "SUN", slot: "08:30-10:00" },
      { day: "TUE", slot: "08:30-10:00" },
    ],
  },
  {
    id: "sec-cse327-2",
    courseCode: "CSE327",
    courseTitle: "Software Engineering",
    sectionNumber: 2,
    faculty: "NAH",
    room: "SAC403",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 2,
    schedule: [
      { day: "MON", slot: "10:00-11:30" },
      { day: "WED", slot: "10:00-11:30" },
    ],
  },
  {
    id: "sec-cse327-3",
    courseCode: "CSE327",
    courseTitle: "Software Engineering",
    sectionNumber: 3,
    faculty: "NAH",
    room: "SAC404",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 1,
    schedule: [
      { day: "MON", slot: "11:30-13:00" },
      { day: "WED", slot: "11:30-13:00" },
    ],
  },
  {
    id: "sec-cse327-4",
    courseCode: "CSE327",
    courseTitle: "Software Engineering",
    sectionNumber: 4,
    faculty: "SZK",
    room: "SAC408",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 0, // FULL
    schedule: [
      { day: "SUN", slot: "13:00-14:30" },
      { day: "TUE", slot: "13:00-14:30" },
    ],
  },
  {
    id: "sec-cse327-5",
    courseCode: "CSE327",
    courseTitle: "Software Engineering",
    sectionNumber: 5,
    faculty: "MRK",
    room: "SAC410",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 0,
    schedule: [
      { day: "SUN", slot: "10:00-11:30" },
      { day: "TUE", slot: "10:00-11:30" },
    ],
  },
  {
    id: "sec-cse327-6",
    courseCode: "CSE327",
    courseTitle: "Software Engineering",
    sectionNumber: 6,
    faculty: "SZK",
    room: "SAC412",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 4,
    schedule: [
      { day: "MON", slot: "14:30-16:00" },
      { day: "WED", slot: "14:30-16:00" },
    ],
  },

  // CSE311 - Database Systems
  {
    id: "sec-cse311-1",
    courseCode: "CSE311",
    courseTitle: "Database Systems",
    sectionNumber: 1,
    faculty: "AKM",
    room: "LIB602",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 0,
    schedule: [
      { day: "SUN", slot: "08:30-10:00" },
      { day: "TUE", slot: "08:30-10:00" },
    ],
  },
  {
    id: "sec-cse311-2",
    courseCode: "CSE311",
    courseTitle: "Database Systems",
    sectionNumber: 2,
    faculty: "SBD",
    room: "LIB604",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 0,
    schedule: [
      { day: "SUN", slot: "11:30-13:00" },
      { day: "TUE", slot: "11:30-13:00" },
    ],
  },
  {
    id: "sec-cse311-3",
    courseCode: "CSE311",
    courseTitle: "Database Systems",
    sectionNumber: 3,
    faculty: "SBD",
    room: "LIB605",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 3,
    schedule: [
      { day: "MON", slot: "13:00-14:30" },
      { day: "WED", slot: "13:00-14:30" },
    ],
  },

  // MAT216 - Linear Algebra
  {
    id: "sec-mat216-1",
    courseCode: "MAT216",
    courseTitle: "Linear Algebra & Complex Variables",
    sectionNumber: 1,
    faculty: "MAH",
    room: "NAC501",
    credits: 3,
    totalSeats: 40,
    seatsLeft: 0,
    schedule: [
      { day: "SUN", slot: "10:00-11:30" },
      { day: "TUE", slot: "10:00-11:30" },
    ],
  },
  {
    id: "sec-mat216-2",
    courseCode: "MAT216",
    courseTitle: "Linear Algebra & Complex Variables",
    sectionNumber: 2,
    faculty: "MAH",
    room: "NAC502",
    credits: 3,
    totalSeats: 40,
    seatsLeft: 2,
    schedule: [
      { day: "MON", slot: "08:30-10:00" },
      { day: "WED", slot: "08:30-10:00" },
    ],
  },
  {
    id: "sec-mat216-3",
    courseCode: "MAT216",
    courseTitle: "Linear Algebra & Complex Variables",
    sectionNumber: 3,
    faculty: "FZH",
    room: "NAC503",
    credits: 3,
    totalSeats: 40,
    seatsLeft: 0,
    schedule: [
      { day: "MON", slot: "08:30-10:00" },
      { day: "WED", slot: "08:30-10:00" },
    ],
  },

  // ENG201 - Technical Writing
  {
    id: "sec-eng201-1",
    courseCode: "ENG201",
    courseTitle: "Technical Writing",
    sectionNumber: 1,
    faculty: "SHM",
    room: "NAC308",
    credits: 3,
    totalSeats: 30,
    seatsLeft: 0,
    schedule: [
      { day: "MON", slot: "11:30-13:00" },
      { day: "WED", slot: "11:30-13:00" },
    ],
  },
  {
    id: "sec-eng201-2",
    courseCode: "ENG201",
    courseTitle: "Technical Writing",
    sectionNumber: 2,
    faculty: "SHM",
    room: "NAC309",
    credits: 3,
    totalSeats: 30,
    seatsLeft: 5,
    schedule: [
      { day: "SUN", slot: "14:30-16:00" },
      { day: "TUE", slot: "14:30-16:00" },
    ],
  },

  // PHY112 - Physics II
  {
    id: "sec-phy112-4",
    courseCode: "PHY112",
    courseTitle: "Physics II (Electricity & Magnetism)",
    sectionNumber: 4,
    faculty: "KZM",
    room: "SAC202",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 0,
    schedule: [
      { day: "THU", slot: "10:00-11:30" },
      { day: "THU", slot: "11:30-13:00" },
    ],
  },
  {
    id: "sec-phy112-1",
    courseCode: "PHY112",
    courseTitle: "Physics II (Electricity & Magnetism)",
    sectionNumber: 1,
    faculty: "KZM",
    room: "SAC201",
    credits: 3,
    totalSeats: 35,
    seatsLeft: 2,
    schedule: [
      { day: "SUN", slot: "14:30-16:00" },
      { day: "TUE", slot: "14:30-16:00" },
    ],
  },
];

// Student's 5 Enrolled Sections (15 Credits)
export const initialEnrollments: Enrollment[] = [
  {
    id: "enr-1",
    section: catalogSections.find((s) => s.id === "sec-cse327-5")!, // CSE327 Sec 5
    enrolledAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "enr-2",
    section: catalogSections.find((s) => s.id === "sec-cse311-2")!, // CSE311 Sec 2
    enrolledAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "enr-3",
    section: catalogSections.find((s) => s.id === "sec-mat216-3")!, // MAT216 Sec 3
    enrolledAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "enr-4",
    section: catalogSections.find((s) => s.id === "sec-eng201-1")!, // ENG201 Sec 1
    enrolledAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "enr-5",
    section: catalogSections.find((s) => s.id === "sec-phy112-4")!, // PHY112 Sec 4
    enrolledAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

// Swaps (5 Chains)
export const createInitialSwaps = (): SwapChain[] => {
  const now = Date.now();

  const cse327Sec5 = catalogSections.find((s) => s.id === "sec-cse327-5")!;
  const cse327Sec2 = catalogSections.find((s) => s.id === "sec-cse327-2")!;
  const cse327Sec3 = catalogSections.find((s) => s.id === "sec-cse327-3")!;

  const cse311Sec2 = catalogSections.find((s) => s.id === "sec-cse311-2")!;
  const cse311Sec3 = catalogSections.find((s) => s.id === "sec-cse311-3")!;

  const mat216Sec3 = catalogSections.find((s) => s.id === "sec-mat216-3")!;
  const mat216Sec2 = catalogSections.find((s) => s.id === "sec-mat216-2")!;
  const mat216Sec1 = catalogSections.find((s) => s.id === "sec-mat216-1")!;

  return [
    // 1. STAR OF DEMO: 3-way chain awaiting Tanvir's confirmation (expires in ~11h 20m)
    {
      id: "swap-star-3way",
      type: "THREE_WAY",
      status: "AWAITING_CONFIRMATION",
      courseCode: "CSE327",
      createdAt: new Date(now - 45 * 60000).toISOString(),
      expiresAt: new Date(now + 11 * 3600000 + 20 * 60000).toISOString(), // now + 11h 20m
      participants: [
        {
          id: "p-you",
          name: "Tanvir Hasan",
          department: "CSE",
          reliability: 92,
          isYou: true,
          givingSection: cse327Sec5,
          gettingSection: cse327Sec2,
          status: "WAITING",
          phone: "+8801712345678",
          contactVisibility: "AFTER_CONFIRMATION",
        },
        {
          id: "p-maya",
          name: "Maya Rahman",
          department: "CSE",
          reliability: 96,
          isYou: false,
          givingSection: cse327Sec2,
          gettingSection: cse327Sec3,
          status: "CONFIRMED",
          phone: "+8801819234567",
          contactVisibility: "AFTER_CONFIRMATION",
        },
        {
          id: "p-arif",
          name: "Arif Hossain",
          department: "EEE",
          reliability: 88,
          isYou: false,
          givingSection: cse327Sec3,
          gettingSection: cse327Sec5,
          status: "CONFIRMED",
          phone: "+8801912887766",
          contactVisibility: "AFTER_CONFIRMATION",
        },
      ],
    },

    // 2. 2-way where Tanvir already confirmed, waiting for partner
    {
      id: "swap-2way-confirmed",
      type: "TWO_WAY",
      status: "AWAITING_CONFIRMATION",
      courseCode: "CSE311",
      createdAt: new Date(now - 2 * 3600000).toISOString(),
      expiresAt: new Date(now + 6 * 3600000).toISOString(),
      participants: [
        {
          id: "p-you-2",
          name: "Tanvir Hasan",
          department: "CSE",
          reliability: 92,
          isYou: true,
          givingSection: cse311Sec2,
          gettingSection: cse311Sec3,
          status: "CONFIRMED",
          phone: "+8801712345678",
          contactVisibility: "AFTER_CONFIRMATION",
        },
        {
          id: "p-sadia",
          name: "Sadia Chowdhury",
          department: "CSE",
          reliability: 94,
          isYou: false,
          givingSection: cse311Sec3,
          gettingSection: cse311Sec2,
          status: "WAITING",
          phone: "+8801733445566",
          contactVisibility: "AFTER_CONFIRMATION",
        },
      ],
    },

    // 3. COMPLETED 3-way with contact details revealed
    {
      id: "swap-completed-history",
      type: "THREE_WAY",
      status: "COMPLETED",
      courseCode: "MAT216",
      createdAt: new Date(now - 3 * 86400000).toISOString(),
      expiresAt: new Date(now - 2 * 86400000).toISOString(),
      participants: [
        {
          id: "p-you-3",
          name: "Tanvir Hasan",
          department: "CSE",
          reliability: 92,
          isYou: true,
          givingSection: mat216Sec1,
          gettingSection: mat216Sec3,
          status: "CONFIRMED",
          phone: "+8801712345678",
          contactVisibility: "AFTER_CONFIRMATION",
        },
        {
          id: "p-rakib",
          name: "Rakibul Islam",
          department: "MAT",
          reliability: 100,
          isYou: false,
          givingSection: mat216Sec3,
          gettingSection: mat216Sec2,
          status: "CONFIRMED",
          phone: "+8801611223344",
          contactVisibility: "AFTER_CONFIRMATION",
        },
        {
          id: "p-fariha",
          name: "Fariha Zahan",
          department: "CSE",
          reliability: 90,
          isYou: false,
          givingSection: mat216Sec2,
          gettingSection: mat216Sec1,
          status: "CONFIRMED",
          phone: "+8801555123456",
          contactVisibility: "AFTER_CONFIRMATION",
        },
      ],
    },

    // 4. CANCELLED because another participant declined
    {
      id: "swap-declined-chain",
      type: "THREE_WAY",
      status: "CANCELLED",
      courseCode: "ENG201",
      declinedByName: "Farhan Ahmed",
      createdAt: new Date(now - 5 * 86400000).toISOString(),
      expiresAt: new Date(now - 4 * 86400000).toISOString(),
      participants: [
        {
          id: "p-you-4",
          name: "Tanvir Hasan",
          department: "CSE",
          reliability: 92,
          isYou: true,
          givingSection: catalogSections.find((s) => s.id === "sec-eng201-2")!,
          gettingSection: catalogSections.find((s) => s.id === "sec-eng201-1")!,
          status: "CONFIRMED",
          contactVisibility: "AFTER_CONFIRMATION",
        },
        {
          id: "p-farhan",
          name: "Farhan Ahmed",
          department: "ENG",
          reliability: 80,
          isYou: false,
          givingSection: catalogSections.find((s) => s.id === "sec-eng201-1")!,
          gettingSection: catalogSections.find((s) => s.id === "sec-eng201-2")!,
          status: "DECLINED",
          contactVisibility: "HIDDEN",
        },
      ],
    },

    // 5. EXPIRED
    {
      id: "swap-expired-chain",
      type: "TWO_WAY",
      status: "EXPIRED",
      courseCode: "PHY112",
      createdAt: new Date(now - 7 * 86400000).toISOString(),
      expiresAt: new Date(now - 6 * 86400000).toISOString(),
      participants: [
        {
          id: "p-you-5",
          name: "Tanvir Hasan",
          department: "CSE",
          reliability: 92,
          isYou: true,
          givingSection: catalogSections.find((s) => s.id === "sec-phy112-1")!,
          gettingSection: catalogSections.find((s) => s.id === "sec-phy112-4")!,
          status: "WAITING",
          contactVisibility: "AFTER_CONFIRMATION",
        },
        {
          id: "p-sakib",
          name: "Sakib Mahmud",
          department: "EEE",
          reliability: 85,
          isYou: false,
          givingSection: catalogSections.find((s) => s.id === "sec-phy112-4")!,
          gettingSection: catalogSections.find((s) => s.id === "sec-phy112-1")!,
          status: "WAITING",
          contactVisibility: "AFTER_CONFIRMATION",
        },
      ],
    },
  ];
};

// Requests (5 Items)
export const initialRequests: SwapRequest[] = [
  // 1. OPEN with suggestion (CSE327 Sec 5 -> Sec 2 or 4, no match yet, suggestion for Sec 3)
  {
    id: "req-open-with-sug",
    heldSection: catalogSections.find((s) => s.id === "sec-cse327-5")!,
    wantedSections: [
      catalogSections.find((s) => s.id === "sec-cse327-2")!,
      catalogSections.find((s) => s.id === "sec-cse327-4")!,
    ],
    status: "OPEN",
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    preferredDays: ["SUN", "TUE"],
    preferredTimeRange: "MORNING",
    allowMultiWaySwaps: true,
    suggestion: {
      id: "sug-1",
      section: catalogSections.find((s) => s.id === "sec-cse327-3")!,
      reason: "Accept Sec 3 as a backup and you match right away",
      matchesInstantlyWithCount: 2,
    },
    timeline: [
      {
        event: "Request created for CSE327 Sec 5",
        timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      },
      {
        event: "Match engine analyzed 14 potential cycles",
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
    ],
  },

  // 2. MATCHED (Found chain, waiting initiation)
  {
    id: "req-matched",
    heldSection: catalogSections.find((s) => s.id === "sec-cse311-2")!,
    wantedSections: [catalogSections.find((s) => s.id === "sec-cse311-3")!],
    status: "MATCHED",
    matchedSwapId: "swap-2way-confirmed",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    preferredDays: ["MON", "WED"],
    preferredTimeRange: "AFTERNOON",
    allowMultiWaySwaps: true,
    timeline: [
      {
        event: "Request created for CSE311 Sec 2",
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      },
      {
        event: "Direct 2-way cycle matched with Sadia Chowdhury",
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
    ],
  },

  // 3. AWAITING_CONFIRMATION (Linked to the star 3-way swap)
  {
    id: "req-awaiting-conf",
    heldSection: catalogSections.find((s) => s.id === "sec-cse327-5")!,
    wantedSections: [catalogSections.find((s) => s.id === "sec-cse327-2")!],
    status: "AWAITING_CONFIRMATION",
    matchedSwapId: "swap-star-3way",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    preferredDays: ["MON", "WED"],
    preferredTimeRange: "MORNING",
    allowMultiWaySwaps: true,
    timeline: [
      {
        event: "Request created",
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
      {
        event: "3-Way cycle matched with Maya Rahman and Arif Hossain",
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      },
      {
        event: "Confirmation window opened (expires in 11h 20m)",
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      },
    ],
  },

  // 4. COMPLETED
  {
    id: "req-completed",
    heldSection: catalogSections.find((s) => s.id === "sec-mat216-1")!,
    wantedSections: [catalogSections.find((s) => s.id === "sec-mat216-3")!],
    status: "COMPLETED",
    matchedSwapId: "swap-completed-history",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    preferredDays: ["MON", "WED"],
    preferredTimeRange: "MORNING",
    allowMultiWaySwaps: true,
    timeline: [
      {
        event: "Request created",
        timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        event: "3-Way chain confirmed by all 3 students",
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        event: "Routine updated automatically",
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ],
  },

  // 5. CANCELLED
  {
    id: "req-cancelled",
    heldSection: catalogSections.find((s) => s.id === "sec-eng201-2")!,
    wantedSections: [catalogSections.find((s) => s.id === "sec-eng201-1")!],
    status: "CANCELLED",
    matchedSwapId: "swap-declined-chain",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    preferredDays: ["SUN", "TUE"],
    preferredTimeRange: "AFTERNOON",
    allowMultiWaySwaps: false,
    timeline: [
      {
        event: "Request created",
        timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        event: "Swap chain cancelled: participant declined",
        timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
  },
];

// Notifications (8 mix)
export const initialNotifications: StudentNotification[] = [
  {
    id: "notif-1",
    type: "CONFIRMATION_NEEDED",
    title: "Action required: Confirm your CSE327 3-way swap",
    description: "Maya and Arif are waiting for your confirmation. Window expires in 11h 20m.",
    link: "/swaps/swap-star-3way",
    isRead: false,
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: "notif-2",
    type: "MATCH_FOUND",
    title: "3-Way cycle found for CSE327",
    description: "We found a clash-free 3-way swap chain giving Sec 5 and getting Sec 2.",
    link: "/swaps/swap-star-3way",
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: "notif-3",
    type: "PARTNER_CONFIRMED",
    title: "Maya Rahman confirmed the CSE327 swap",
    description: "1 of 2 partners has confirmed. Only your confirmation remains.",
    link: "/swaps/swap-star-3way",
    isRead: false,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: "notif-4",
    type: "DEADLINE_REMINDER",
    title: "Advising swap window closes in 3 days",
    description: "Make sure all open requests have enough backup sections chosen.",
    link: "/requests",
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "notif-5",
    type: "MATCH_FOUND",
    title: "Match found for CSE311",
    description: "Sadia Chowdhury matched your CSE311 Sec 2 request.",
    link: "/swaps/swap-2way-confirmed",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "notif-6",
    type: "SWAP_COMPLETED",
    title: "MAT216 swap completed successfully",
    description: "Your routine was updated with MAT216 Section 3.",
    link: "/swaps/swap-completed-history",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "notif-7",
    type: "CHAIN_CANCELLED",
    title: "ENG201 swap chain cancelled",
    description: "A participant declined the proposal. Your original section was preserved.",
    link: "/requests/req-cancelled",
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "notif-8",
    type: "DEADLINE_REMINDER",
    title: "Fall 2026 Advising window officially opened",
    description: "SlotSwap cycle matching engine is now live and verifying clashes.",
    link: "/routine",
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

// Sessions (4 Active Sessions)
export const initialSessions: UserSession[] = [
  {
    id: "sess-1",
    device: "Chrome on Windows",
    ip: "103.114.98.24 (Dhaka, Bangladesh)",
    isCurrent: true,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "sess-2",
    device: "Chrome on Android (Samsung Galaxy)",
    ip: "103.114.98.24 (Dhaka, Bangladesh)",
    isCurrent: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: "sess-3",
    device: "Safari on iPhone",
    ip: "103.102.42.12 (Chittagong, Bangladesh)",
    isCurrent: false,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "sess-4",
    device: "Firefox on Linux (Ubuntu)",
    ip: "119.30.38.150 (Dhaka, Bangladesh)",
    isCurrent: false,
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - 21 * 86400000).toISOString(), // 3 weeks ago
  },
];
