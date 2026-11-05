import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";
import { env } from "./env";

export function getClientIp(req: NextRequest): string {
  if (env.TRUST_PROXY) {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export function assertSameOrigin(req: NextRequest) {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return;
  }

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const source = origin || referer;

  if (!source) {
    throw new AppError("FORBIDDEN", 403, "Missing origin header");
  }

  try {
    const sourceHost = new URL(source).host;
    const targetHost = new URL(env.APP_URL).host;

    if (sourceHost !== targetHost) {
      throw new AppError("FORBIDDEN", 403, "Cross-origin request rejected");
    }
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    throw new AppError("FORBIDDEN", 403, "Invalid origin header");
  }
}

export function handle(
  handler: (req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => Promise<NextResponse | Response>
) {
  return async (req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
    try {
      assertSameOrigin(req);
      return await handler(req, ctx);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              ...(error.fields ? { fields: error.fields } : {}),
            },
          },
          { status: error.status }
        );
      }

      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        for (const issue of error.issues) {
          const path = issue.path.join(".") || "root";
          if (!fields[path]) {
            fields[path] = issue.message;
          }
        }
        return NextResponse.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed. Please correct the specified fields.",
              fields,
            },
          },
          { status: 400 }
        );
      }

      console.error("[API Error]", error);
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL",
            message: "An internal server error occurred. Please try again later.",
          },
        },
        { status: 500 }
      );
    }
  };
}
