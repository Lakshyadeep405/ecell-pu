import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/auth";

export async function POST(request: Request) {
  // Rate limit: max 5 join requests per IP per hour
  const ip = getClientIp(request);
  if (!checkRateLimit(`join:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { name, phone, college, year } = body;

    if (!name || !phone || !college || !year) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required fields: Name, Phone, College, and Year." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("members_join_requests")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        college: college.trim(),
        year: year.trim(),
        status: "pending",
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Public join request API error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit request. Please try again." }, { status: 500 });
  }
}
