import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, AlertTriangle, Instagram, Linkedin, Twitter } from "lucide-react";
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
      .select("title, description, status")
      .eq("id", id)
      .single();

    if (!event || event.status === "draft") {
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
    <main className="min-h-screen bg-black text-white flex flex-col justify-between p-4 sm:p-6 font-sans overflow-x-hidden">
      {/* Top navbar */}
      <nav className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 sticky top-0 z-40 bg-black/60 backdrop-blur-md">
        <Link
          href="/events"
          className="liquid-glass flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/80 hover:text-white border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Events
        </Link>
        <div className="flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          <span className="text-black bg-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded leading-none font-[family-name:var(--font-outfit)]">
            E-CELL
          </span>
          <span className="font-[family-name:var(--font-outfit)] uppercase tracking-widest text-[9px] sm:text-xs text-white">JNCT PU</span>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center py-10 px-4 relative">
        {/* Ambient background light glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.015)_0%,_transparent_70%)]"
          aria-hidden
        />

        {errorMsg ? (
          <div className="w-full max-w-md p-8 text-center space-y-6 liquid-glass border border-red-500/20 bg-red-500/5 rounded-3xl relative z-10">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl text-white leading-tight">
              Access Restricted
            </h2>
            <p className="text-white/40 text-xs font-semibold leading-relaxed">
              {errorMsg}
            </p>
            <div className="pt-2">
              <Link
                href="/events"
                className="liquid-glass border border-white/10 rounded-full text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors inline-block"
              >
                Go to Events listing
              </Link>
            </div>
          </div>
        ) : (
          event && <RegisterForm event={event} fields={fields} />
        )}
      </div>

      <footer className="border-t border-white/5 pt-8 pb-28 px-6 bg-[#030303] max-w-6xl w-full mx-auto mt-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-3">
            {[
              { Icon: Instagram, label: "Instagram", url: "https://www.instagram.com/ecell.jnctpu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
              { Icon: Linkedin, label: "LinkedIn", url: "#" },
              { Icon: Twitter, label: "Twitter", url: "#" },
            ].map(({ Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="liquid-glass rounded-full p-2 text-white/50 transition-all hover:bg-white/5 hover:text-white border border-white/5"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 pt-4 border-t border-white/[0.02] text-center sm:text-left">
            <div className="flex flex-col gap-1.5 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="E-Cell JNCT PU Logo"
                  className="w-5 h-5 rounded-full border border-white/10"
                />
                <span className="font-[family-name:var(--font-outfit)] uppercase tracking-widest text-[10px] font-bold text-white">JNCT PU</span>
              </div>
              <p className="text-[8px] text-white/20 font-medium">
                E-Cell JNCT PU • Professional University Event Incubation Gate
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
