import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import RegisterForm from "./RegisterForm";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  banner_url?: string;
  status: "draft" | "published" | "closed";
}

interface FieldItem {
  id: string;
  field_label: string;
  field_type: "text" | "number" | "textarea" | "select" | "file";
  options: string[];
  required: boolean;
}

// ── Dynamic SEO Metadata generation ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data: event } = await supabase
      .from("events")
      .select("title, description")
      .eq("id", id)
      .single();

    if (!event) {
      return {
        title: "Registration Form | E-Cell JNCT PU",
        description: "Join upcoming entrepreneurship events at JNCT Professional University.",
      };
    }

    return {
      title: `Register for ${event.title} | E-Cell JNCT PU`,
      description: event.description || `Sign up now for ${event.title} organized by E-Cell JNCT Professional University.`,
    };
  } catch (error) {
    return {
      title: "Event Registration | E-Cell JNCT PU",
    };
  }
}

export const revalidate = 0; // Live fetching of custom fields and status

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let event: EventItem | null = null;
  let fields: FieldItem[] = [];
  let errorMsg: string | null = null;

  try {
    // 1. Fetch Event details
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (eventError || !eventData) {
      errorMsg = "Event not found. It may have been removed or scheduled under a different ID.";
    } else {
      event = eventData;

      if (eventData.status === "closed") {
        errorMsg = `Registration for "${eventData.title}" is now closed. Stay tuned for future events!`;
      } else if (eventData.status === "draft") {
        errorMsg = "This event registration form is currently undergoing configuration and is not open to public.";
      } else {
        // 2. Fetch custom fields if published
        const { data: fieldsData, error: fieldsError } = await supabase
          .from("event_fields")
          .select("*")
          .eq("event_id", id)
          .order("display_order", { ascending: true });

        if (fieldsError) throw fieldsError;
        fields = fieldsData || [];
      }
    }
  } catch (err: any) {
    console.error("Error loading registration page:", err);
    errorMsg = "Failed to load the registration form. Please try reloading the page.";
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top navbar */}
      <nav className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 sticky top-0 z-40 bg-background/85 backdrop-blur-md">
        <Link
          href="/events"
          className="flex items-center gap-2 px-4 py-2 border-2 border-border bg-card text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#D4AF37] transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
        <div className="font-[family-name:var(--font-outfit)] text-lg font-black tracking-tight">
          <span className="text-[#D4AF37]">E-Cell</span> JNCT PU
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center py-10 px-4">
        {errorMsg ? (
          <div className="w-full max-w-md bg-card border-2 border-border p-8 shadow-[6px_6px_0px_#EF4444] text-center space-y-6">
            <div className="w-12 h-12 bg-red-500/10 border-2 border-red-500 text-red-500 flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-black uppercase text-foreground leading-tight">
              Access Restricted
            </h2>
            <p className="text-muted-foreground text-xs font-semibold leading-relaxed">
              {errorMsg}
            </p>
            <div className="pt-2">
              <Link
                href="/events"
                className="inline-block px-6 py-2.5 border-2 border-border bg-background text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#D4AF37] transition-all"
              >
                Go to Events listing
              </Link>
            </div>
          </div>
        ) : (
          event && <RegisterForm event={event} fields={fields} />
        )}
      </div>

      {/* SEO Footer */}
      <footer className="text-center py-4 border-t-2 border-border max-w-6xl w-full mx-auto space-y-1">
        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
          E-Cell JNCT PU • Professional University Event Incubation Gate
        </p>
        <p className="text-[9px] text-muted-foreground">
          Bhopal, Central India Startup Incubation and Skill Development Program.
        </p>
      </footer>
    </main>
  );
}
