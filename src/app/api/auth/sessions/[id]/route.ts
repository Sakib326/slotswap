import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireUser } from "@/lib/auth/guards";
import { clearSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";


export const DELETE = handle(async (_req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
  const { user, session: currentSession } = await requireUser();
  const params = await ctx?.params;
  const sessionId = params?.id;

  if (!sessionId) {
    throw new AppError("NOT_FOUND", 404, "Session not found.");
  }

  // Must belong to caller, otherwise 404
  const targetSession = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId: user.id,
      revokedAt: null,
    },
  });

  if (!targetSession) {
    throw new AppError("NOT_FOUND", 404, "Session not found.");
  }

  await prisma.session.update({
    where: { id: targetSession.id },
    data: { revokedAt: new Date() },
  });

  // If revoking current session, clear cookie
  if (targetSession.id === currentSession.id) {
    await clearSessionCookie();
  }

  return NextResponse.json({
    message: "Session revoked successfully.",
  });
});
