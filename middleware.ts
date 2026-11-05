import { NextRequest, NextResponse } from "next/server";
import { verifySessionJwt } from "./src/lib/auth/jwt";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/requests/:path*",
    "/swaps/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get("slotswap_session");
  const token = cookie?.value;
  const payload = token ? await verifySessionJwt(token) : null;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/requests") ||
    pathname.startsWith("/swaps") ||
    pathname.startsWith("/profile");
  const isAdminPage = pathname.startsWith("/admin");

  // 1. If already logged in and visiting login/register -> redirect to /dashboard
  if (isAuthPage && payload) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Protected student pages require valid JWT
  if (isProtectedPage && !payload) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Admin pages require valid JWT with role === ADMIN
  if (isAdminPage) {
    if (!payload) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}
