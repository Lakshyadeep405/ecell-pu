"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Home, User, Users, CalendarDays, Mail, LogIn, ArrowRight, Sparkles, MapPin, 
  Rocket, Handshake, Lightbulb, Trophy, Instagram, Linkedin, Twitter
} from "lucide-react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/ui/tubelight-navbar";
import HeroSection from "@/components/ui/HeroSection";
import StatsSection from "@/components/StatsSection";
import { supabase } from "@/lib/supabase";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "About", url: "/about", icon: User },
  { name: "Team", url: "/team", icon: Users },
  { name: "Events", url: "/events", icon: CalendarDays },
  { name: "Contact", url: "/contact", icon: Mail },
  { name: "Portal", url: "/login", icon: LogIn },
];

const PILLARS = [
  {
    tag: "Launch",
    title: "Venture Incubation",
    description: "We help students transform raw ideas into viable startups with mentorship, resources, and a supportive community.",
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
    Icon: Rocket,
    anchor: "venture-incubation",
  },
  {
    tag: "Connect",
    title: "Networking & Capital",
    description: "Build meaningful relationships with industry leaders, investors, and fellow entrepreneurs across disciplines.",
    video: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    Icon: Handshake,
    anchor: "networking-capital",
  },
  {
    tag: "Innovate",
    title: "Ideation & Building",
    description: "Participate in hackathons, ideathons, and workshops designed to sharpen your entrepreneurial thinking.",
    video: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    Icon: Lightbulb,
    anchor: "ideation-building",
  },
  {
    tag: "Grow",
    title: "Scaling Ventures",
    description: "Access funding opportunities, pitch competitions, and incubation support to scale your venture.",
    video: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80",
    Icon: Trophy,
    anchor: "scaling-ventures",
  },
];

export default function HomePageClient() {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);

  useEffect(() => {
    async function loadHighlights() {
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "published")
          .gte("date", todayStr)
          .order("date", { ascending: true })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((ev: any) => {
            const evDate = new Date(ev.date);
            const day = evDate.toLocaleDateString("en-IN", { day: "2-digit" });
            const month = evDate.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
            return {
              id: ev.id,
              dateStr: `${day} ${month}`,
              tag: "UPCOMING",
              title: ev.title,
              desc: ev.description || "No description provided.",
              venue: ev.venue || "Campus Incubator",
            };
          });
          setHighlights(mapped);
        } else {
          setHighlights([]);
        }

        // Fetch past events
        const { data: pastData, error: pastError } = await supabase
          .from("events")
          .select("*")
          .eq("status", "published")
          .lt("date", todayStr)
          .order("date", { ascending: false });

        if (pastError) throw pastError;
        setPastEvents(pastData || []);
      } catch (err) {
        console.error("Error loading highlights:", err);
        setHighlights([]);
        setPastEvents([]);
      }
    }
    loadHighlights();
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* ── NAVBAR ── */}
      <NavBar items={navItems} />

      {/* ── CINEMATIC HERO ── */}
      <HeroSection />

      {/* ── STATS SECTION ── */}
      <StatsSection />

      {/* ── E-CELL CORE PILLARS SECTION ── */}
      <section className="relative overflow-hidden bg-black px-6 py-20 md:py-32">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.015)_0%,_transparent_60%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-3 font-semibold font-[family-name:var(--font-outfit)]">
                Our Pillars
              </p>
              <h2 
                className="text-4xl tracking-tight text-white md:text-5xl font-serif"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                How We Empower <em>Innovators</em>
              </h2>
            </div>
            <p className="text-sm text-white/40 max-w-md">
              E-Cell JNCT Professional University operates as a startup incubator and founder community, providing critical resources at every milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {PILLARS.map((pillar, i) => {
              const PillarIcon = pillar.Icon;
              return (
                <motion.article
                  key={pillar.tag}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                  className="liquid-glass group overflow-hidden rounded-3xl"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {pillar.video.endsWith(".mp4") ? (
                      <video
                        src={pillar.video}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        muted
                        autoPlay
                        loop
                        playsInline
                        preload="auto"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pillar.video}
                        alt={pillar.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold font-[family-name:var(--font-outfit)] flex items-center gap-1.5">
                        <PillarIcon className="w-3.5 h-3.5" />
                        {pillar.tag}
                      </span>
                      <Link
                        href={`/about#${pillar.anchor}`}
                        className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-colors duration-300"
                        aria-label={`Read more about ${pillar.title}`}
                      >
                        <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform duration-350" />
                      </Link>
                    </div>
                    <h3 className="mb-3 text-lg sm:text-xl font-bold tracking-tight text-white uppercase font-[family-name:var(--font-outfit)]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-white/50">{pillar.description}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EVENTS HIGHLIGHTS SECTION ── */}
      {highlights.length > 0 && (
        <section className="relative overflow-hidden bg-black px-6 py-16 md:py-24 border-t border-white/5">
          <div className="relative mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <span className="liquid-glass rounded-full px-3 py-1 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
                Dynamic Highlights
              </span>
              <h2 
                className="mt-4 text-3xl md:text-4xl font-serif text-white"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Upcoming <em>Programs</em>
              </h2>
            </div>

            <div className="space-y-4">
              {highlights.map((ev, idx) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="liquid-glass flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center liquid-glass rounded-xl p-3 min-w-[70px] text-center border-white/10">
                      <span className="font-[family-name:var(--font-outfit)] font-black text-sm uppercase text-[#D4AF37]">
                        {ev.dateStr.split(" ")[0]}
                      </span>
                      <span className="text-[9px] font-bold text-white/40 tracking-wider">
                        {ev.dateStr.split(" ")[1] || ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/20 bg-[#D4AF37]/5 font-[family-name:var(--font-outfit)]">
                        {ev.tag}
                      </span>
                      <h3 className="mt-2 text-base font-bold text-white uppercase tracking-tight font-[family-name:var(--font-outfit)]">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-white/40 mt-1 max-w-xl">{ev.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-3 md:pt-0 border-t border-white/5 md:border-none">
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="font-semibold">{ev.venue}</span>
                    </div>
                    <Link
                      href={ev.id.startsWith("default") ? "/events" : `/events/${ev.id}/register`}
                      className="liquid-glass rounded-full px-5 py-2 text-xs font-semibold hover:bg-white/5 transition-colors flex items-center gap-1.5 border border-white/10"
                    >
                      Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PAST EVENTS MEMORIES SECTION ── */}
      {pastEvents.length > 0 && (
        <section className="relative overflow-hidden bg-black px-6 py-16 md:py-24 border-t border-white/5">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.01)_0%,_transparent_70%)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <span className="liquid-glass rounded-full px-3 py-1 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
                Our Legacy
              </span>
              <h2
                className="mt-4 text-3xl md:text-4xl font-serif text-white"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Stories of <em>Innovation</em>
              </h2>
              <p className="mt-4 text-xs text-white/40 max-w-md mx-auto font-semibold">
                Look back at our past pitch hackathons, bootcamps, and student launch achievements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pastEvents.map((ev) => {
                const eventDate = new Date(ev.date);
                const dateFormatted = eventDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={ev.id}
                    className="liquid-glass rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="p-6 space-y-4 flex-grow">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold px-2 py-0.5 rounded border border-white/10 bg-white/5 font-[family-name:var(--font-outfit)]">
                          Past Event
                        </span>
                        <h3 className="mt-2.5 text-base font-bold text-white uppercase tracking-tight font-[family-name:var(--font-outfit)]">
                          {ev.title}
                        </h3>
                        <p className="text-[10px] font-bold text-[#D4AF37] mt-1">{dateFormatted} • {ev.venue}</p>
                      </div>

                      <p className="text-xs text-white/50 leading-relaxed font-medium">
                        {ev.summary || ev.description || "Event completed successfully."}
                      </p>

                      {/* Photo Gallery (horizontal scroll) */}
                      {ev.photos && ev.photos.length > 0 && (
                        <div className="pt-2">
                          <p className="text-[9px] font-black uppercase tracking-wider text-white/30 mb-2 font-[family-name:var(--font-outfit)]">
                            Event Gallery
                          </p>
                          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                            {ev.photos.map((photoUrl: string, idx: number) => (
                              <div
                                key={idx}
                                className="w-24 h-16 rounded-lg border border-white/10 overflow-hidden flex-shrink-0 relative group/photo cursor-zoom-in"
                                onClick={() => window.open(photoUrl, "_blank")}
                              >
                                <img
                                  src={photoUrl}
                                  alt={`${ev.title} photo ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/photo:scale-105"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── GEO/AEO QUICK DIRECTORY & FAQS ── */}
      <section className="relative overflow-hidden bg-black px-6 py-16 md:py-24 border-t border-white/5">
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="liquid-glass rounded-full px-3 py-1 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
              Quick Guide
            </span>
            <h2 
              className="mt-4 text-3xl md:text-4xl font-serif text-white"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Factual <em>Directory</em>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                q: "What is an E-Cell (Entrepreneurship Cell)?",
                a: "An E-Cell (Entrepreneurship Cell) is a university-based student organization dedicated to promoting entrepreneurial spirit, startup incubation, and business innovation. At JNCT Professional University, the E-Cell acts as the official campus startup incubator."
              },
              {
                q: "Where is E-Cell JNCT PU located in Bhopal?",
                a: "The E-Cell startup incubation lab and office is located on the main academic campus of JNCT Professional University (formerly Jai Narain College of Technology), New Bypass Road, Karond, Bhopal, Madhya Pradesh 462022."
              },
              {
                q: "Is E-Cell part of JNCT Professional University (JNCTPU)?",
                a: "Yes, E-Cell JNCT PU is the official, university-sanctioned Entrepreneurship Cell of JNCT Professional University (JNCTPU Bhopal). We manage all official student innovation initiatives and coordinate with the university's startup cell coordinators."
              },
              {
                q: "Who is eligible to join E-Cell JNCT Bhopal?",
                a: "All active students across all branches and disciplines (including Engineering, B.Tech, MBA, MCA, Pharmacy) at JNCT Professional University, Bhopal are eligible to join E-Cell, participate in hackathons like InnoHack, or submit incubation requests."
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="liquid-glass p-6 rounded-2xl border border-white/5 flex flex-col justify-start gap-2.5 hover:bg-white/[0.01] transition-all"
              >
                <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] font-[family-name:var(--font-outfit)]">
                  {item.q}
                </h3>
                <p className="text-xs leading-relaxed text-white/50 font-medium">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA SECTION ── */}
      <section className="relative overflow-hidden bg-black px-6 py-20 md:py-32 border-t border-white/5">
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="liquid-glass rounded-3xl p-8 sm:p-16 border-white/10 relative overflow-hidden">
            {/* Ambient lighting effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.035)_0%,_transparent_65%)] pointer-events-none" />
            
            <span className="relative z-10 liquid-glass rounded-full px-3.5 py-1.5 text-[9px] uppercase tracking-widest text-white/50 font-bold font-[family-name:var(--font-outfit)]">
              Get Connected
            </span>
            <h2
              className="relative z-10 mt-6 text-4xl sm:text-5xl font-serif text-white leading-tight"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Ready to Redefine Your <em>Future?</em>
            </h2>
            <p className="relative z-10 mt-4 text-xs sm:text-sm text-white/40 max-w-md mx-auto leading-relaxed font-medium">
              Join E-Cell JNCT Professional University and connect with a massive network of student builders, mentors, and early-stage capital.
            </p>
            <div className="relative z-10 mt-10 flex flex-wrap gap-4 justify-center">
              <Link
                href="/join"
                className="rounded-full bg-white px-8 py-3.5 text-xs font-bold text-black hover:opacity-90 transition-opacity"
              >
                Join E-Cell
              </Link>
              <a
                href="mailto:ecell@pu.ac.in"
                className="liquid-glass rounded-full px-8 py-3.5 text-xs font-bold text-white hover:bg-white/5 transition-colors border border-white/15"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 pt-12 pb-28 px-6 bg-[#030303]">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <div className="flex gap-4">
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
                className="liquid-glass rounded-full p-2.5 text-white/50 transition-all hover:bg-white/5 hover:text-white border border-white/5"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 pt-4 border-t border-white/[0.02]">
            <div className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="E-Cell JNCT PU Logo"
                className="w-5 h-5 rounded-full border border-white/10"
              />
              <span className="font-[family-name:var(--font-outfit)] uppercase tracking-widest text-xs font-bold text-white">JNCT PU</span>
            </div>
            <p className="text-white/30 text-xs font-medium font-[family-name:var(--font-outfit)] tracking-wider">
              © 2026 E-Cell, JNCT Professional University. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
