import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { INITIAL_BLOGS, BlogPost } from "@/lib/blogs";

export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    // If Supabase returned rows, use them
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, blogs: data });
    }

    // Fallback to initial preloaded blogs
    return NextResponse.json({ success: true, blogs: INITIAL_BLOGS });
  } catch (err: any) {
    console.error("GET /api/blogs error:", err);
    return NextResponse.json({ success: true, blogs: INITIAL_BLOGS });
  }
}
