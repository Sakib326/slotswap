import { NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { parseDeviceString } from "@/lib/auth/session";


export const GET = handle(async () => {
  const { user, session: currentSession } = await requireUser();

  const sessions = await prisma.session.findMany({
    where: {
      userId: user.id,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  const list = sessions.map((s) => ({
    id: s.id,
    device: parseDeviceString(s.userAgent),
    ip: s.ip || "Unknown IP",
    createdAt: s.createdAt,
    lastActiveAt: s.lastActiveAt,
    current: s.id === currentSession.id,
  }));

  return NextResponse.json(list);
});
