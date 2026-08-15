import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // 1. Authenticate the admin
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // "member" or "banner"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded." },
        { status: 400 }
      );
    }

    if (!type || !["member", "banner"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid upload type specified." },
        { status: 400 }
      );
    }

    // 2. Validate file type (MIME types)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // 3. Validate file size (Max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { success: false, error: "File is too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // 4. Generate safe unique filename
    const fileExt = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const folder = type === "member" ? "members" : "banners";
    const filePath = `${folder}/${fileName}`;

    // Convert file to ArrayBuffer/Buffer for Supabase Storage Node API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Upload via supabaseAdmin (service_role key bypasses client RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from("ecell-assets")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to store uploaded asset." },
        { status: 502 }
      );
    }

    // 6. Retrieve public URL
    const { data } = supabaseAdmin.storage
      .from("ecell-assets")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
    });
  } catch (error: any) {
    console.error("Admin upload API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
