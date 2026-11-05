export function formatMeUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    emailVerifiedAt: user.emailVerifiedAt,
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    name: user.profile?.name ?? null,
    studentId: user.profile?.studentId ?? null,
    department: user.profile?.department
      ? {
          id: user.profile.department.id,
          code: user.profile.department.code,
          name: user.profile.department.name,
        }
      : null,
    batch: user.profile?.batch ?? null,
    phone: user.profile?.phone ?? null,
    contactVisibility: user.profile?.contactVisibility ?? "HIDDEN",
    preferredDays: user.profile?.preferredDays ?? [],
    preferredTimeRange: user.profile?.preferredTimeRange ?? "ANY",
    allowMultiWaySwaps: user.profile?.allowMultiWaySwaps ?? true,
    notifyByEmail: user.profile?.notifyByEmail ?? true,
    notifyInApp: user.profile?.notifyInApp ?? true,
    reliabilityScore: user.profile?.reliabilityScore ?? 100,
    totalSwapsCompleted: user.profile?.totalSwapsCompleted ?? 0,
    totalSwapsCancelled: user.profile?.totalSwapsCancelled ?? 0,
  };
}
