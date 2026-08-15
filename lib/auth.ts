import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

/**
 * Verifies the admin JWT cookie on every /api/admin/* request.
 * Returns null if valid (caller proceeds), or a 401 NextResponse to return immediately.
 * Fails CLOSED — if JWT_SECRET env var is missing, the server refuses all admin requests.
 */
export async function requireAdmin(
  request: NextRequest | Request
): Promise<NextResponse | null> {
  const jwtSecret = process.env.JWT_SECRET;

  // Fail closed — never allow admin access without a real secret
  if (!jwtSecret) {
    console.error("SECURITY: JWT_SECRET env var is not set. Refusing admin request.");
    return NextResponse.json(
      { success: false, error: "Server misconfiguration." },
      { status: 503 }
    );
  }

  const cookie =
    request instanceof Request
      ? request.headers.get("cookie")
      : (request as NextRequest).headers.get("cookie");

  const sessionToken = cookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("ecell_admin_session="))
    ?.split("=")
    .slice(1)
    .join("=");

  if (!sessionToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    await jose.jwtVerify(sessionToken, secret);
    return null; // Valid — caller may proceed
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 }
    );
  }
}

/** Simple in-memory rate limiter (per-IP, resets on server restart) */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Returns true if the IP is within limits, false if rate-limited.
 * @param key      Unique key e.g. "login:<ip>" or "join:<ip>"
 * @param maxHits  Max requests allowed in the window
 * @param windowMs Time window in ms
 */
export function checkRateLimit(
  key: string,
  maxHits: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxHits) return false;

  entry.count++;
  return true;
}

/** Extracts a best-effort client IP from a Next.js request */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
