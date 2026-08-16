import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const { error } = await supabaseAdmin.from("events").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE event error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete event." }, { status: 500 });
  }
}

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

    if (eventError) {
      return NextResponse.json({ success: false, error: "Event not found." }, { status: 404 });
    }

    const { data: fields, error: fieldsError } = await supabaseAdmin
      .from("event_fields")
      .select("*")
      .eq("event_id", id)
      .order("display_order", { ascending: true });

    if (fieldsError) throw fieldsError;

    return NextResponse.json({ success: true, event, fields: fields || [] });
  } catch (error: any) {
    console.error("GET admin event details error:", error);
    return NextResponse.json({ success: false, error: "Failed to load event details." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, date, venue, status, banner_url, fields } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date).toISOString();
    if (venue !== undefined) updateData.venue = venue;
    if (status !== undefined) updateData.status = status;
    if (banner_url !== undefined) updateData.banner_url = banner_url;

    const { data: event, error } = await supabaseAdmin
      .from("events")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (fields !== undefined) {
      const { error: deleteFieldsError } = await supabaseAdmin
        .from("event_fields")
        .delete()
        .eq("event_id", id);
      
      if (deleteFieldsError) throw deleteFieldsError;

      if (fields.length > 0) {
        const fieldsToInsert = fields.map((f: any, idx: number) => ({
          event_id: id,
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
    }

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error("PUT event error:", error);
    return NextResponse.json({ success: false, error: "Failed to update event." }, { status: 500 });
  }
}
