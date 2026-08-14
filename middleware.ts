import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin paths, except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("ecell_admin_session");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "ecell_jnctpu_super_secret_jwt_passphrase_key_2026"
      );
      
      // Verify JWT
      await jose.jwtVerify(sessionCookie.value, secret);
      
      // Verification succeeded, allow request
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      // Verification failed, clear invalid cookie and redirect to login
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("ecell_admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

// Specify matching paths for middleware
export const config = {
  matcher: ["/admin/:path*"],
};
