import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, college, year } = body;

    // Validate inputs
    if (!name || !phone || !college || !year) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required fields: Name, Phone, College, and Year." },
        { status: 400 }
      );
    }

    // Insert request into members_join_requests table
    const { data, error } = await supabaseAdmin
      .from("members_join_requests")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        college: college.trim(),
        year: year.trim(),
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, request: data });
  } catch (error: any) {
    console.error("Public join request API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
