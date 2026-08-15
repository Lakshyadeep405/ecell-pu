import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { data: members, error } = await supabaseAdmin
      .from("members")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    console.error("GET members error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch members." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, role, domain, photo_url, display_order } = body;

    if (!name || !role) {
      return NextResponse.json(
        { success: false, error: "Name and Role are required." },
        { status: 400 }
      );
    }

    const { data: member, error } = await supabaseAdmin
      .from("members")
      .insert({
        name,
        role,
        domain: domain || "core",
        photo_url,
        display_order: display_order !== undefined ? parseInt(display_order) : 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    console.error("POST member error:", error);
    return NextResponse.json({ success: false, error: "Failed to add member." }, { status: 500 });
  }
}
