import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";
import { INITIAL_BLOGS } from "@/lib/blogs";

export async function GET(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { data: blogs, error } = await supabaseAdmin
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase admin fetch blogs warning:", error.message);
      return NextResponse.json({ success: true, blogs: INITIAL_BLOGS });
    }

    if (!blogs || blogs.length === 0) {
      return NextResponse.json({ success: true, blogs: INITIAL_BLOGS });
    }

    return NextResponse.json({ success: true, blogs });
  } catch (error: any) {
    console.error("GET admin blogs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs." },
      { status: 500 }
    );
  }
}
