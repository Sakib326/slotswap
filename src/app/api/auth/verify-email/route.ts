import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth/tokens";
import { env } from "@/lib/env";


export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?status=invalid", env.APP_URL), 303);
  }

  const tokenHash = hashToken(token);
  const authToken = await prisma.authToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!authToken || authToken.type !== "EMAIL_VERIFY" || authToken.usedAt) {
    return NextResponse.redirect(new URL("/verify-email?status=invalid", env.APP_URL), 303);
  }

  if (new Date() > authToken.expiresAt) {
    return NextResponse.redirect(new URL("/verify-email?status=expired", env.APP_URL), 303);
  }

  // Mark token used and user email verified in transaction
  await prisma.$transaction([
    prisma.authToken.update({
      where: { id: authToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: authToken.userId },
      data: { emailVerifiedAt: new Date() },
    }),
  ]);

  return NextResponse.redirect(new URL("/verify-email?status=success", env.APP_URL), 303);
}
