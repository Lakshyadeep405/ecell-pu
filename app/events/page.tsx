import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CalendarDays, MapPin, Sparkles, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// SEO Metadata for events listing
export const metadata: Metadata = {
  title: "Upcoming Startup Events & Hackathons | E-Cell JNCT PU",
  description:
    "Explore upcoming entrepreneurship summits, pitch competitions, and startup incubation workshops hosted by E-Cell JNCTPU. Register today and pitch your startup idea.",
  keywords: [
    "E-Cell JNCT PU events",
    "startup summits JNCT",
    "hackathons Bhopal",
    "pitch competitions JNCT Professional University",
    "entrepreneurship workshops India",
  ],
};

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  banner_url?: string;
  status: "draft" | "published" | "closed";
  created_at: string;
}

export const revalidate = 0; // Disable caching to fetch live data on request

export default async function PublicEventsPage() {
  let events: EventItem[] = [];
  let errorMsg: string | null = null;

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("date", { ascending: true });

    if (error) throw error;
    events = data || [];
  } catch (err: any) {
    console.error("Error loading public events:", err);
    errorMsg = "Failed to load events. Please try again later.";
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* Navigation Header */}
      <nav className="border-b-2 border-border py-4 px-6 bg-card sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 border-2 border-border bg-background text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#D4AF37] transition-all duration-150 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="font-[family-name:var(--font-outfit)] text-lg font-black">
            <span className="text-[#D4AF37]">E-Cell</span> JNCT PU
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <section className="py-16 px-4 flex-grow">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-foreground border-2 border-foreground rounded-none px-3.5 py-1.5 mb-6 bg-background shadow-[3px_3px_0px_#00FF66]">
              Incubator Calendar
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase font-[family-name:var(--font-outfit)]"
              style={{ textShadow: "3px 3px 0px #D4AF37" }}
            >
              Startup <span className="gradient-text">Events</span> & workshops
            </h1>
            <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Participate in hackathons, business pitch competitions, and leadership conferences hosted at JNCT Professional University.
            </p>
          </div>

          {/* Error fallback */}
          {errorMsg && (
            <div className="p-4 border-2 border-red-500 bg-red-500/10 text-red-500 text-xs font-bold max-w-xl mx-auto flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Empty list state */}
          {!errorMsg && events.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-border bg-card max-w-xl mx-auto">
              <p className="text-muted-foreground font-black uppercase text-sm tracking-widest">
                No upcoming events scheduled right now.
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Check back soon or follow our social channels for announcements!
              </p>
              <Link
                href="/join"
                className="mt-6 inline-block px-6 py-2.5 border-2 border-border bg-background text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#D4AF37] transition-all"
              >
                Join E-Cell Community
              </Link>
            </div>
          )}

          {/* Events Grid list */}
          {events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((event) => {
                const eventDate = new Date(event.date);
                const day = eventDate.toLocaleDateString("en-IN", { day: "2-digit" });
                const month = eventDate.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
                const year = eventDate.toLocaleDateString("en-IN", { year: "numeric" });
                const time = eventDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

                return (
                  <div
                    key={event.id}
                    className="flex flex-col bg-card border-2 border-border rounded-none shadow-[4px_4px_0px_#D4AF37] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#D4AF37] transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Event Banner */}
                    <div className="h-48 w-full border-b-2 border-border bg-muted relative">
                      {event.banner_url ? (
                        <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[linear-gradient(to_right,var(--border-pattern)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-pattern)_1px,transparent_1px)] bg-[size:16px_16px] flex items-center justify-center">
                          <CalendarDays className="w-12 h-12 text-[#D4AF37]/45" />
                        </div>
                      )}
                      
                      {/* Date Badge absolute overlay */}
                      <div className="absolute top-4 left-4 bg-background border-2 border-border p-2 min-w-[56px] text-center shadow-[2px_2px_0px_#000]">
                        <span className="font-[family-name:var(--font-outfit)] text-xl font-black leading-none block text-foreground">
                          {day}
                        </span>
                        <span className="text-[9px] font-black tracking-widest text-[#D4AF37] mt-0.5 block">{month}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/35 bg-[#D4AF37]/5 px-2 py-0.5 rounded-none">
                          <Sparkles className="w-2.5 h-2.5" />
                          Registration Active
                        </span>
                        <h3 className="font-[family-name:var(--font-outfit)] text-xl font-black uppercase text-foreground leading-tight">
                          {event.title}
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                          {event.description || "No description provided."}
                        </p>
                      </div>

                      {/* Details row */}
                      <div className="pt-4 border-t border-border/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                          <CalendarDays className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                          <span>{time} ({day} {month} {year})</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                          <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>

                      {/* Form redirect link */}
                      <Link
                        href={`/events/${event.id}/register`}
                        className="w-full text-center py-3.5 border-2 border-border bg-foreground text-background font-black uppercase text-xs tracking-wider transition-all duration-150 shadow-[3px_3px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#D4AF37] cursor-pointer block"
                      >
                        Register For Event
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SEO Footer */}
      <footer className="border-t-2 border-border py-8 px-6 bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="font-[family-name:var(--font-outfit)] text-lg font-black">
            <span className="text-[#D4AF37]">E-Cell</span> JNCT PU
          </div>
          <p className="text-muted-foreground text-xs">
            © 2026 E-Cell, JNCT PU Professional University. Bhopal Startup Network. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
