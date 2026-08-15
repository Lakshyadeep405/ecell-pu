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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, date, venue, status, banner_url } = body;

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
    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error("PUT event error:", error);
    return NextResponse.json({ success: false, error: "Failed to update event." }, { status: 500 });
  }
}
