import { NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireUser } from "@/lib/auth/guards";
import { clearSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";


export const POST = handle(async () => {
  const { session } = await requireUser();

  // Revoke current session in DB
  await prisma.session.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  // Clear session cookie
  await clearSessionCookie();

  return NextResponse.json({
    message: "Successfully logged out.",
  });
});
