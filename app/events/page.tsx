import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CalendarDays, MapPin, Sparkles, AlertTriangle, Instagram, Linkedin, Twitter } from "lucide-react";
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
    <main className="min-h-screen bg-black text-white flex flex-col font-sans overflow-x-hidden">
      
      {/* Navigation Header */}
      <nav className="border-b border-white/5 py-4 px-6 bg-black/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="liquid-glass flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/80 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <div className="flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            <span className="text-black bg-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded leading-none font-[family-name:var(--font-outfit)]">
              E-CELL
            </span>
            <span className="font-[family-name:var(--font-outfit)] uppercase tracking-widest text-[9px] sm:text-xs text-white">JNCT PU</span>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <section className="py-16 px-4 flex-grow relative">
        {/* Ambient lighting effect */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.015)_0%,_transparent_75%)]"
          aria-hidden
        />

        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="liquid-glass rounded-full px-3.5 py-1.5 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
              Incubator Calendar
            </span>
            <h1
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-none"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Startup <em>Events</em> & workshops
            </h1>
            <p className="mt-6 text-xs sm:text-sm text-white/40 leading-relaxed font-semibold max-w-md mx-auto">
              Participate in hackathons, business pitch competitions, and leadership conferences hosted at JNCT Professional University.
            </p>
          </div>

          {/* Error fallback */}
          {errorMsg && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold max-w-xl mx-auto flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Empty list state */}
          {!errorMsg && events.length === 0 && (
            <div className="text-center py-20 liquid-glass max-w-xl mx-auto rounded-3xl border border-white/5">
              <p className="text-white/30 font-bold uppercase text-xs tracking-widest">
                No upcoming events scheduled right now.
              </p>
              <p className="text-[10px] text-white/20 mt-2 font-medium">
                Check back soon or follow our social channels for announcements!
              </p>
              <Link
                href="/join"
                className="mt-6 liquid-glass rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider border border-white/10 text-white/80 hover:text-white inline-block"
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

                 const eventMidnight = new Date(event.date);
                 eventMidnight.setHours(0, 0, 0, 0);
                 const todayMidnight = new Date();
                 todayMidnight.setHours(0, 0, 0, 0);
                 const isPast = eventMidnight < todayMidnight;

                return (
                  <div
                    key={event.id}
                    className="flex flex-col liquid-glass rounded-3xl border border-white/5 overflow-hidden justify-between hover:bg-white/[0.01] transition-colors"
                  >
                    {/* Event Banner */}
                    <div className="h-48 w-full border-b border-white/5 bg-white/[0.01] relative">
                      {event.banner_url ? (
                        <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] flex items-center justify-center">
                          <CalendarDays className="w-12 h-12 text-white/10" />
                        </div>
                      )}
                      
                      {/* Date Badge absolute overlay */}
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md p-2 min-w-[56px] text-center rounded-xl border border-white/10">
                        <span className="font-[family-name:var(--font-outfit)] text-base font-black leading-none block text-white">
                          {day}
                        </span>
                        <span className="text-[8px] font-black tracking-widest text-[#D4AF37] mt-0.5 block">{month}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        {isPast ? (
                          <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-white/40 border border-white/10 bg-white/5 px-2.5 py-0.5 rounded-md font-[family-name:var(--font-outfit)]">
                            Event Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-2.5 py-0.5 rounded-md font-[family-name:var(--font-outfit)]">
                            <Sparkles className="w-2.5 h-2.5" />
                            Registration Active
                          </span>
                        )}
                        <h3 className="font-[family-name:var(--font-outfit)] text-lg font-black uppercase text-white leading-tight">
                          {event.title}
                        </h3>
                        <p className="text-white/40 text-xs leading-relaxed line-clamp-3">
                          {event.description || "No description provided."}
                        </p>
                      </div>

                      {/* Details row */}
                      <div className="pt-4 border-t border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                          <CalendarDays className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                          <span>{time} ({day} {month} {year})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>

                      {/* Form redirect link */}
                      {isPast ? (
                        <div
                          className="rounded-full bg-white/5 border border-white/10 text-white/40 text-center py-3 text-xs font-bold uppercase tracking-wider cursor-not-allowed block"
                        >
                          Event Completed
                        </div>
                      ) : (
                        <Link
                          href={`/events/${event.id}/register`}
                          className="rounded-full bg-white text-black text-center py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity block"
                        >
                          Register For Event
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-8 pb-28 px-6 bg-[#030303]">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <div className="flex gap-3">
            {[
              { Icon: Instagram, label: "Instagram", url: "#" },
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
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="E-Cell JNCT PU Logo"
                className="w-5 h-5 rounded-full border border-white/10"
              />
              <span className="font-[family-name:var(--font-outfit)] uppercase tracking-widest text-[10px] font-bold text-white">JNCT PU</span>
            </div>
            <p className="text-white/30 text-[10px] font-medium tracking-wider">
              © 2026 E-Cell, JNCT Professional University. Bhopal Startup Network. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
