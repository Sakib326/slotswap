export type ErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_TOKEN"
  | "INVALID_CURRENT_PASSWORD"
  | "UNAUTHENTICATED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "ACCOUNT_SUSPENDED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "LAST_ADMIN"
  | "RATE_LIMITED"
  | "INTERNAL";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly fields?: Record<string, string>;

  constructor(
    code: ErrorCode,
    status: number,
    message: string,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}
