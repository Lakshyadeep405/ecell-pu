import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
