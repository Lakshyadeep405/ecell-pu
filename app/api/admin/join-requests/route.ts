import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { data: requests, error } = await supabaseAdmin
      .from("members_join_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    console.error("GET join requests error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
