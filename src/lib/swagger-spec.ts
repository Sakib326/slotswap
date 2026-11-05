export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "SlotSwap API Documentation",
    version: "1.0.0",
    description:
      "Interactive API documentation for SlotSwap course section swapping platform. Authentication, session management, user profiles, and administrative operations.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Development Server",
    },
  ],
  paths: {
    "/api/departments": {
      get: {
        summary: "List all departments",
        description: "Returns all university departments ({ id, code, name }) for registration dropdowns.",
        tags: ["Public & Meta"],
        responses: {
          "200": {
            description: "Array of departments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "cmhn6c16h0000r39g40r4v85h" },
                      code: { type: "string", example: "CSE" },
                      name: { type: "string", example: "Computer Science and Engineering" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        summary: "Register new student",
        description: "Registers a new student user and profile in an unverified state, creates an EMAIL_VERIFY token, and dispatches an activation email.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "studentId", "departmentId", "batch"],
                properties: {
                  name: { type: "string", example: "Tanvir Rahman" },
                  email: { type: "string", format: "email", example: "tanvir@northsouth.edu" },
                  password: { type: "string", format: "password", example: "Password123" },
                  studentId: { type: "string", example: "2024-0012" },
                  departmentId: { type: "string", example: "cmhn6c16h0000r39g40r4v85h" },
                  batch: { type: "string", example: "Spring 2024" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Registration initiated successfully",
          },
          "400": { description: "Validation error or disallowed domain" },
          "409": { description: "Email or Student ID conflict" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "User login",
        description: "Authenticates credentials, issues an httpOnly session cookie with JWT, records a Session row, and returns the me profile.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@slotswap.example" },
                  password: { type: "string", format: "password", example: "AdminPassword123" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful with user profile" },
          "401": { description: "Invalid credentials" },
          "403": { description: "Email not verified or account suspended" },
        },
      },
    },
    "/api/auth/verify-email": {
      get: {
        summary: "Verify student email",
        description: "Validates verification token and 303 redirects to /verify-email?status=success|invalid|expired",
        tags: ["Authentication"],
        parameters: [
          {
            name: "token",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "303": { description: "Redirect to verify-email status page" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        summary: "User logout",
        description: "Revokes current session in the database and clears the session cookie.",
        tags: ["Authentication"],
        responses: {
          "200": { description: "Successfully logged out" },
          "401": { description: "Unauthenticated" },
        },
      },
    },
    "/api/auth/sessions": {
      get: {
        summary: "List user active sessions",
        description: "Returns list of caller's active sessions with parsed device strings, IPs, and current session flag.",
        tags: ["Authentication"],
        responses: {
          "200": { description: "Array of user sessions" },
          "401": { description: "Unauthenticated" },
        },
      },
    },
    "/api/auth/sessions/{id}": {
      delete: {
        summary: "Revoke specific session",
        description: "Revokes a session belonging to the caller. Returns 404 if not found or belongs to another user.",
        tags: ["Authentication"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Session revoked successfully" },
          "404": { description: "Session not found" },
        },
      },
    },
    "/api/auth/logout-all": {
      post: {
        summary: "Revoke all sessions",
        description: "Revokes all of user's active sessions. Accepts optional ?keepCurrent=true.",
        tags: ["Authentication"],
        parameters: [
          {
            name: "keepCurrent",
            in: "query",
            schema: { type: "boolean" },
          },
        ],
        responses: {
          "200": { description: "Sessions revoked" },
        },
      },
    },
    "/api/users/me": {
      get: {
        summary: "Get current user profile",
        description: "Returns full me payload for authenticated user with department information.",
        tags: ["User Profile"],
        responses: {
          "200": { description: "Current user profile" },
          "401": { description: "Unauthenticated" },
        },
      },
      patch: {
        summary: "Update current profile",
        description: "Updates editable profile fields. Rejects unauthorized or immutable fields like role or studentId with 400.",
        tags: ["User Profile"],
        responses: {
          "200": { description: "Updated profile payload" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/users/me/password": {
      patch: {
        summary: "Change account password",
        description: "Validates current password, updates to new password hash, and revokes all other active sessions.",
        tags: ["User Profile"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Password updated successfully" },
          "400": { description: "Invalid current password" },
        },
      },
    },
    "/api/admin/users": {
      get: {
        summary: "Admin: Search & list users",
        description: "Returns paginated list of users with search filter q (name, email, studentId) and status/role filters.",
        tags: ["Admin"],
        parameters: [
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "role", in: "query", schema: { type: "string", enum: ["STUDENT", "ADMIN"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["ACTIVE", "SUSPENDED"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": { description: "Paginated user summaries" },
          "403": { description: "Forbidden - Admin access required" },
        },
      },
    },
    "/api/admin/users/{id}": {
      get: {
        summary: "Admin: Get user details",
        description: "Returns complete user details with activeSessionCount.",
        tags: ["Admin"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "User details" },
          "404": { description: "User not found" },
        },
      },
      delete: {
        summary: "Admin: Delete user",
        description: "Hard-deletes user. Prevents self-deletion and deleting the last active admin.",
        tags: ["Admin"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "User deleted" },
          "403": { description: "Cannot delete self" },
          "409": { description: "Cannot delete last active admin" },
        },
      },
    },
    "/api/admin/users/{id}/role": {
      patch: {
        summary: "Admin: Update user role",
        description: "Updates role between STUDENT and ADMIN. Prevents self-demotion or demoting the last admin.",
        tags: ["Admin"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Role updated" },
          "409": { description: "Cannot demote last active admin" },
        },
      },
    },
    "/api/admin/users/{id}/status": {
      patch: {
        summary: "Admin: Update account status",
        description: "Sets status to ACTIVE or SUSPENDED. Suspending immediately revokes all user sessions in a transaction.",
        tags: ["Admin"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Status updated" },
          "409": { description: "Cannot suspend last active admin" },
        },
      },
    },
    "/api/admin/users/{id}/sessions": {
      get: {
        summary: "Admin: List user sessions",
        description: "Lists all active sessions for target user.",
        tags: ["Admin"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "List of sessions" },
        },
      },
      delete: {
        summary: "Admin: Force logout user",
        description: "Revokes all active sessions for target user.",
        tags: ["Admin"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Sessions revoked" },
        },
      },
    },
  },
};
