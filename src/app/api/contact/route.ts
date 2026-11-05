import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name cannot exceed 80 characters"),
  email: z.string().trim().email("Invalid email address"),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(120, "Subject cannot exceed 120 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message cannot exceed 2000 characters"),
  website: z.string().optional(), // Honeypot
});

// Simple in-memory rate limiter: max 3 requests per IP per hour
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + 60 * 60 * 1000, // 1 hour
    });
    return false;
  }

  if (record.count >= 3) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again after an hour." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Check honeypot: bots fill this field. Silently return success to waste their time.
    if (body.website && body.website.trim() !== "") {
      console.warn(`[Contact API] Honeypot triggered by IP: ${ip}`);
      return NextResponse.json({ ok: true });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ ok: false, error: errorMsg }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;

    // Save to PostgreSQL via Prisma
    try {
      await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject,
          message,
          status: "NEW",
        },
      });
    } catch (dbError) {
      console.error("[Contact API] Failed to save to database:", dbError);
      // Fallback log
      console.log(`[Contact Message Log] From: ${name} <${email}> | Subject: ${subject}\nMessage: ${message}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[Contact API] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
