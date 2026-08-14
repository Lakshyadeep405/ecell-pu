import { NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(request: Request) {
  try {
    const { name, college, year } = await request.json();

    const expectedName = process.env.ADMIN_NAME || "President";
    const expectedCollege = process.env.ADMIN_COLLEGE || "JNCTPU";
    const expectedPassword = process.env.ADMIN_PASSWORD || "90";

    const nameMatches = name?.trim().toLowerCase() === expectedName.toLowerCase();
    const collegeMatches = college?.trim().toLowerCase() === expectedCollege.toLowerCase();
    const passwordMatches = year?.trim() === expectedPassword;

    if (nameMatches && collegeMatches && passwordMatches) {
      // Create JWT secret key encoder
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "ecell_jnctpu_super_secret_jwt_passphrase_key_2026"
      );

      // Sign JWT
      const token = await new jose.SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);

      const response = NextResponse.json({ success: true });

      // Set secure HTTP-only cookie
      response.cookies.set({
        name: "ecell_admin_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid Name, College, or Year code. Please check your credentials." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
