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
    const { error } = await supabaseAdmin.from("members").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE member error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete member." }, { status: 500 });
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
    const { name, role, domain, photo_url, display_order } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (domain !== undefined) updateData.domain = domain;
    if (photo_url !== undefined) updateData.photo_url = photo_url;
    if (display_order !== undefined) updateData.display_order = parseInt(display_order);

    const { data: member, error } = await supabaseAdmin
      .from("members")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    console.error("PUT member error:", error);
    return NextResponse.json({ success: false, error: "Failed to update member." }, { status: 500 });
  }
}
