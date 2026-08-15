import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { data: requests, error } = await supabaseAdmin
      .from("members_join_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    console.error("GET join requests error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch join requests." }, { status: 500 });
  }
}
