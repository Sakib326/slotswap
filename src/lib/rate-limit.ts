import { AppError } from "./errors";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return;
  }

  if (record.count >= limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    const err = new AppError(
      "RATE_LIMITED",
      429,
      `Too many requests. Please try again in ${retryAfter} seconds.`
    );
    throw err;
  }

  record.count += 1;
}

export function clearRateLimit(key: string) {
  rateLimitMap.delete(key);
}
