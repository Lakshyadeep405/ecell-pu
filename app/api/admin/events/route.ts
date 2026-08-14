import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ── GET: List all events with registration counts ──
export async function GET(request: Request) {
  try {
    // 1. Fetch events
    const { data: events, error: eventsError } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (eventsError) throw eventsError;

    // 2. Fetch registrations count for each event
    const eventsWithCount = await Promise.all(
      (events || []).map(async (event: any) => {
        const { count, error: countError } = await supabaseAdmin
          .from("event_registrations")
          .select("*", { count: "exact", head: true })
          .eq("event_id", event.id);

        if (countError) console.error("Error fetching count for event", event.id, countError);

        return {
          ...event,
          registrations_count: count || 0,
        };
      })
    );

    return NextResponse.json({ success: true, events: eventsWithCount });
  } catch (error: any) {
    console.error("GET events error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── POST: Create a new event and its form fields ──
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, date, venue, banner_url, status, fields } = body;

    if (!title || !date || !venue) {
      return NextResponse.json(
        { success: false, error: "Title, Date, and Venue are required." },
        { status: 400 }
      );
    }

    // 1. Insert Event
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .insert({
        title,
        description,
        date: new Date(date).toISOString(),
        venue,
        banner_url,
        status: status || "draft",
      })
      .select()
      .single();

    if (eventError) throw eventError;

    // 2. Insert Custom Form Fields (Default fields: Name, Phone, Email, College, Year are built-in, no need to save unless custom, but let's save custom fields)
    if (fields && fields.length > 0) {
      const fieldsToInsert = fields.map((f: any, idx: number) => ({
        event_id: event.id,
        field_label: f.field_label,
        field_type: f.field_type || "text",
        options: f.options || [],
        required: f.required !== undefined ? f.required : true,
        display_order: idx,
      }));

      const { error: fieldsError } = await supabaseAdmin
        .from("event_fields")
        .insert(fieldsToInsert);

      if (fieldsError) throw fieldsError;
    }

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error("POST event error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
