import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (eventError) throw eventError;

    const { data: registrations, error: regError } = await supabaseAdmin
      .from("event_registrations")
      .select("*")
      .eq("event_id", id)
      .order("created_at", { ascending: false });

    if (regError) throw regError;

    return NextResponse.json({ success: true, event, registrations });
  } catch (error: any) {
    console.error("GET event registrations error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch registrations." }, { status: 500 });
  }
}
