import { cookies } from "next/headers";
import { prisma } from "../prisma";
import { verifySessionJwt } from "./jwt";
import { SESSION_COOKIE_NAME } from "./session";
import { AppError } from "../errors";

export async function requireUser() {
  let token: string | undefined;

  try {
    const cookieStore = await cookies();
    token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  } catch (err: any) {
    if (err?.digest === "HANGING_PROMISE_REJECTION") {
      throw err;
    }
  }

  if (!token) {
    throw new AppError("UNAUTHENTICATED", 401, "You must be signed in to perform this action.");
  }

  const payload = await verifySessionJwt(token);
  if (!payload) {
    throw new AppError("UNAUTHENTICATED", 401, "Invalid or expired session token.");
  }

  const session = await prisma.session.findUnique({
    where: { id: payload.sid },
    include: {
      user: {
        include: {
          profile: {
            include: {
              department: true,
            },
          },
        },
      },
    },
  });

  if (!session || session.revokedAt || new Date() > session.expiresAt) {
    throw new AppError("UNAUTHENTICATED", 401, "Session has expired or was revoked.");
  }

  const user = session.user;
  if (!user || user.status === "SUSPENDED") {
    throw new AppError(
      "ACCOUNT_SUSPENDED",
      403,
      user?.suspendedReason
        ? `Your account is suspended: ${user.suspendedReason}`
        : "Your account is suspended."
    );
  }

  // Update lastActiveAt if older than 5 minutes
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  if (session.lastActiveAt < fiveMinAgo) {
    prisma.session.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});
  }

  return { user, session };
}

export async function requireRole(expectedRole: "ADMIN" | "STUDENT") {
  const { user, session } = await requireUser();
  if (user.role !== expectedRole) {
    throw new AppError("FORBIDDEN", 403, "You do not have permission to access this resource.");
  }
  return { user, session };
}
