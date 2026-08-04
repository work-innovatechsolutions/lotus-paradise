import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes except /admin/login
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const sessionCookie = request.cookies.get("lp_admin_session");

    if (!sessionCookie) {
      // Redirect unauthenticated requests to login page
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect /admin/dashboard (requested alias) to /admin
  if (path === "/admin/dashboard") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin/dashboard"],
};
