import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Check if database already has members
    const { count, error: countError } = await supabaseAdmin
      .from("members")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // We can also allow forcing seed using ?force=true query parameter
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    if (count && count > 0 && !force) {
      return NextResponse.json(
        { success: false, error: "Database already has members. Seed is blocked unless force parameter is true." },
        { status: 400 }
      );
    }

    const defaultMembers = [
      { name: "Lakshyadeep", role: "PRESIDENT", domain: "core", display_order: 10 },
      { name: "Yashaswi", role: "VICE PRESIDENT", domain: "core", display_order: 20 },
      { name: "Avdesh", role: "CO-ORDINATOR HEAD", domain: "core", display_order: 30 },
      { name: "Animesh", role: "OPERATIONAL HEAD", domain: "core", display_order: 40 },
      { name: "Ritika", role: "RESEARCH & INNOVATION HEAD", domain: "core", display_order: 50 },
      { name: "Rajneesh", role: "TECHNICAL HEAD", domain: "core", display_order: 60 },
      { name: "Geetansh", role: "CORPORATE RELATIONS HEAD", domain: "core", display_order: 70 },
      { name: "Bishal", role: "SOCIAL MEDIA & DESIGN HEAD", domain: "core", display_order: 80 },
      { name: "Rohit", role: "RESEARCH & INNOVATION", domain: "technical", display_order: 90 },
      { name: "Amit", role: "TECHNICAL", domain: "technical", display_order: 100 },
      { name: "Shantanu", role: "TECHNICAL", domain: "technical", display_order: 110 },
      { name: "Lokesh", role: "S M & D", domain: "creatives", display_order: 120 },
      { name: "Hariom", role: "S M & D", domain: "creatives", display_order: 130 },
      { name: "Anit", role: "S M & D", domain: "creatives", display_order: 140 },
      { name: "Bhupendra Patwari", role: "CORPORATE RELATIONS", domain: "marketing", display_order: 150 },
      { name: "Sidhi", role: "MANAGEMENT", domain: "operations", display_order: 160 },
      { name: "Pavni", role: "MANAGEMENT", domain: "operations", display_order: 170 },
      { name: "Kartavya", role: "MANAGEMENT", domain: "operations", display_order: 180 },
      { name: "Lipika", role: "MANAGEMENT", domain: "operations", display_order: 190 },
      { name: "Raghav Soni", role: "MANAGEMENT", domain: "operations", display_order: 200 },
      { name: "Shrishti", role: "MANAGEMENT", domain: "operations", display_order: 210 },
    ];

    // If force is true and database has elements, delete them first
    if (force && count && count > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from("members")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all
      if (deleteError) throw deleteError;
    }

    const { error: insertError } = await supabaseAdmin
      .from("members")
      .insert(defaultMembers);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, message: "Successfully seeded default squad members." });
  } catch (error: any) {
    console.error("POST seed error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to seed members." }, { status: 500 });
  }
}
