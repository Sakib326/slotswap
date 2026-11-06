import { NextRequest, NextResponse } from "next/server";
import { handle, getClientIp } from "@/lib/api";
import { registerSchema } from "@/lib/validators/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { generateRawToken, hashToken } from "@/lib/auth/tokens";
import { sendEmail } from "@/lib/mail";
import { buildRoutineEmailTemplate } from "@/lib/email-templates";
import { checkRateLimit } from "@/lib/rate-limit";
import { AppError } from "@/lib/errors";
import { env } from "@/lib/env";


export const POST = handle(async (req: NextRequest) => {
  const ip = getClientIp(req);
  checkRateLimit(`register:${ip}`, 5, 3600); // 5 per hour per IP

  const body = await req.json();
  const parsed = registerSchema.parse(body);

  // Validate allowed email domains if set
  if (env.ALLOWED_EMAIL_DOMAINS) {
    const allowed = env.ALLOWED_EMAIL_DOMAINS.split(",")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);

    if (allowed.length > 0) {
      const emailDomain = parsed.email.split("@")[1];
      const matches = allowed.some((domain) => emailDomain === domain || emailDomain?.endsWith(`.${domain}`));
      if (!matches) {
        throw new AppError(
          "VALIDATION_ERROR",
          400,
          `Registration is restricted to university email domains (${env.ALLOWED_EMAIL_DOMAINS}).`
        );
      }
    }
  }

  // Verify department exists
  const dept = await prisma.department.findUnique({
    where: { id: parsed.departmentId },
  });
  if (!dept) {
    throw new AppError("VALIDATION_ERROR", 400, "Selected department does not exist.", {
      departmentId: "Select a valid department",
    });
  }

  // Check unique email and studentId
  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.email },
  });
  if (existingUser) {
    throw new AppError("CONFLICT", 409, "An account with this email address already exists.");
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { studentId: parsed.studentId },
  });
  if (existingProfile) {
    throw new AppError("CONFLICT", 409, "An account with this student ID already exists.");
  }

  const passwordHash = await hashPassword(parsed.password);
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  // Transaction: create User + Profile + AuthToken
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: parsed.email,
        passwordHash,
        role: "STUDENT",
        status: "ACTIVE",
        profile: {
          create: {
            name: parsed.name,
            studentId: parsed.studentId,
            departmentId: parsed.departmentId,
            batch: parsed.batch,
            contactVisibility: "HIDDEN",
          },
        },
      },
    });

    await tx.authToken.create({
      data: {
        userId: user.id,
        type: "EMAIL_VERIFY",
        tokenHash,
        expiresAt,
      },
    });
  });

  const verifyUrl = `${env.APP_URL}/api/auth/verify-email?token=${rawToken}`;
  const html = buildRoutineEmailTemplate({
    preheader: "Activate your SlotSwap account",
    badge: {
      text: "EMAIL VERIFICATION",
      bg: "#C2E4CE",
      color: "#1D5B4A",
    },
    title: "Verify your university email address",
    recipientName: parsed.name,
    introText:
      "Welcome to SlotSwap! You have registered with your university student email. Please confirm your email to activate your account and start swapping course sections.",
    highlightBox: {
      label: "Registered Student ID",
      value: parsed.studentId,
      details: "Link expires in 24 hours.",
    },
    cta: {
      label: "Verify Email Address",
      url: verifyUrl,
    },
    footerNote: "If you did not create a SlotSwap account, you can safely ignore this email.",
  });

  await sendEmail({
    to: parsed.email,
    subject: "Verify your email - SlotSwap",
    text: `Welcome to SlotSwap, ${parsed.name}!\n\nPlease verify your email by clicking the link below:\n${verifyUrl}\n\nThis link expires in 24 hours.`,
    html,
  });

  return NextResponse.json(
    { message: "Registration successful. Please check your email to verify your account." },
    { status: 201 }
  );
});
