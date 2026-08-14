import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch Event Details
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (eventError) throw eventError;

    // 2. Fetch Event Registrations
    const { data: registrations, error: regError } = await supabaseAdmin
      .from("event_registrations")
      .select("*")
      .eq("event_id", id)
      .order("created_at", { ascending: false });

    if (regError) throw regError;

    return NextResponse.json({
      success: true,
      event,
      registrations,
    });
  } catch (error: any) {
    console.error("GET event registrations error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
