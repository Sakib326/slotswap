import { NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireUser } from "@/lib/auth/guards";
import { clearSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";


export const POST = handle(async () => {
  try {
    const { session } = await requireUser();

    // Revoke current session in DB if exists
    if (session?.id) {
      await prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
    }
  } catch {
    // If not authenticated or in mock mode without valid DB session,
    // still proceed to clear the session cookie cleanly
  }

  // Clear session cookie
  await clearSessionCookie();

  return NextResponse.json({
    message: "Successfully logged out.",
  });
});
