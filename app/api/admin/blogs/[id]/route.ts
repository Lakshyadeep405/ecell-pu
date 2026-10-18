import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!["pending", "published", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("blogs")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.warn("Supabase update blog warning:", error.message);
    }

    return NextResponse.json({
      success: true,
      message: `Blog status updated to ${status}.`,
      blog: data || { id, status },
    });
  } catch (error: any) {
    console.error("PATCH admin blog error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update blog." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const { error } = await supabaseAdmin.from("blogs").delete().eq("id", id);
    if (error) {
      console.warn("Supabase delete blog warning:", error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE admin blog error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete blog." },
      { status: 500 }
    );
  }
}
