import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch Event Details (Must be published or closed)
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (eventError) {
      return NextResponse.json({ success: false, error: "Event not found." }, { status: 404 });
    }

    // 2. Fetch Custom Registration Fields
    const { data: fields, error: fieldsError } = await supabaseAdmin
      .from("event_fields")
      .select("*")
      .eq("event_id", id)
      .order("display_order", { ascending: true });

    if (fieldsError) throw fieldsError;

    return NextResponse.json({
      success: true,
      event,
      fields: fields || [],
    });
  } catch (error: any) {
    console.error("GET event form data error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { submitted_data } = body;

    if (!submitted_data || typeof submitted_data !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid form data submitted." },
        { status: 400 }
      );
    }

    // Basic verification of event state
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("status")
      .eq("id", id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ success: false, error: "Event not found." }, { status: 404 });
    }

    if (event.status === "closed") {
      return NextResponse.json(
        { success: false, error: "Registration for this event is closed." },
        { status: 400 }
      );
    }

    if (event.status === "draft") {
      return NextResponse.json(
        { success: false, error: "Registration form is not active yet." },
        { status: 400 }
      );
    }

    // Verify required standard fields are present in submitted_data
    const standardFields = ["Name", "Email", "Phone", "College", "Year"];
    for (const f of standardFields) {
      if (!submitted_data[f] || !String(submitted_data[f]).trim()) {
        return NextResponse.json(
          { success: false, error: `Base field '${f}' is required.` },
          { status: 400 }
        );
      }
    }

    // Write registration
    const { data: registration, error: regError } = await supabaseAdmin
      .from("event_registrations")
      .insert({
        event_id: id,
        submitted_data,
      })
      .select()
      .single();

    if (regError) throw regError;

    return NextResponse.json({ success: true, registration });
  } catch (error: any) {
    console.error("POST event registration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
