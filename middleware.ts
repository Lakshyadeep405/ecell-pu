import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("ecell_admin_session");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Fail closed — never authenticate if JWT_SECRET is not set
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("SECURITY: JWT_SECRET is not set. Blocking admin access.");
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("ecell_admin_session");
      return response;
    }

    try {
      const secret = new TextEncoder().encode(jwtSecret);
      await jose.jwtVerify(sessionCookie.value, secret);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("ecell_admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
