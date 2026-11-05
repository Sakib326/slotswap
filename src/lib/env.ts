import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  APP_URL: z.string().url("APP_URL must be a valid URL").default("http://localhost:3000"),
  SESSION_DAYS: z.coerce.number().int().positive().default(7),
  ALLOWED_EMAIL_DOMAINS: z.string().default(""),
  TRUST_PROXY: z
    .string()
    .default("false")
    .transform((val) => val === "true" || val === "1"),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_FROM: z.string().default("SlotSwap <no-reply@slotswap.example>"),
  ADMIN_EMAIL: z.string().email().optional().default("admin@slotswap.example"),
  ADMIN_PASSWORD: z.string().min(8).optional().default("AdminPassword123"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  throw new Error("Invalid environment configuration. Fix the variables in your .env file.");
}

export const env = parsed.data;
