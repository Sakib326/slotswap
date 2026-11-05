import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireUser } from "@/lib/auth/guards";
import { clearSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";


export const POST = handle(async (req: NextRequest) => {
  const { user, session: currentSession } = await requireUser();
  const keepCurrent = req.nextUrl.searchParams.get("keepCurrent") === "true";

  const now = new Date();

  if (keepCurrent) {
    const result = await prisma.session.updateMany({
      where: {
        userId: user.id,
        id: { not: currentSession.id },
        revokedAt: null,
      },
      data: { revokedAt: now },
    });

    return NextResponse.json({
      message: `Revoked ${result.count} other sessions. Current session kept.`,
      revokedCount: result.count,
    });
  } else {
    const result = await prisma.session.updateMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      data: { revokedAt: now },
    });

    await clearSessionCookie();

    return NextResponse.json({
      message: `Revoked all ${result.count} sessions.`,
      revokedCount: result.count,
    });
  }
});
