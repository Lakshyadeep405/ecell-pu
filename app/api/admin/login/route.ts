import { NextResponse } from "next/server";
import * as jose from "jose";
import { checkRateLimit, getClientIp } from "@/lib/auth";

export async function POST(request: Request) {
  // Rate limit: max 10 attempts per IP per 15 minutes
  const ip = getClientIp(request);
  if (!checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  // Fail closed — refuse login if secrets aren't configured
  const jwtSecret = process.env.JWT_SECRET;
  const expectedName = process.env.ADMIN_NAME;
  const expectedCollege = process.env.ADMIN_COLLEGE;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!jwtSecret || !expectedName || !expectedCollege || !expectedPassword) {
    console.error("SECURITY: Admin credentials or JWT_SECRET env vars are not configured.");
    return NextResponse.json(
      { success: false, error: "Server is not configured for admin access." },
      { status: 503 }
    );
  }

  try {
    const { name, college, year } = await request.json();

    const nameMatches = name?.trim().toLowerCase() === expectedName.toLowerCase();
    const collegeMatches = college?.trim().toLowerCase() === expectedCollege.toLowerCase();
    const passwordMatches = year?.trim() === expectedPassword;

    if (nameMatches && collegeMatches && passwordMatches) {
      const secret = new TextEncoder().encode(jwtSecret);

      const token = await new jose.SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);

      const response = NextResponse.json({ success: true });

      response.cookies.set({
        name: "ecell_admin_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // Generic message — don't reveal which field was wrong
    return NextResponse.json(
      { success: false, error: "Invalid credentials." },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
