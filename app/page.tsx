"use client";

import { Home, User, Users, CalendarDays, Mail, Rocket, Handshake, Lightbulb, Trophy } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import ScrollHero from "@/components/ScrollHero";
import MembersSection from "@/components/MembersSection";
import StatsSection from "@/components/StatsSection";
import { cn } from "@/lib/utils";
import { FeatureGrid } from "@/components/ui/modern-feature-grid";

const navItems = [
  { name: "Home", url: "#home", icon: Home },
  { name: "About", url: "#about", icon: User },
  { name: "Team", url: "#team", icon: Users },
  { name: "Events", url: "#events", icon: CalendarDays },
  { name: "Contact", url: "#contact", icon: Mail },
];

const aboutFeatures = [
  {
    Icon: Rocket,
    title: "Launch",
    description: "We help students transform raw ideas into viable startups with mentorship, resources, and a supportive community.",
  },
  {
    Icon: Handshake,
    title: "Connect",
    description: "Build meaningful relationships with industry leaders, investors, and fellow entrepreneurs across disciplines.",
  },
  {
    Icon: Lightbulb,
    title: "Innovate",
    description: "Participate in hackathons, ideathons, and workshops designed to sharpen your entrepreneurial thinking.",
  },
  {
    Icon: Trophy,
    title: "Grow",
    description: "Access funding opportunities, pitch competitions, and incubation support to scale your venture.",
  },
];

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* ── TUBELIGHT NAVBAR ── */}
      <NavBar items={navItems} />

      {/* ── SCROLL HERO (canvas animation) ── */}
      <ScrollHero />

      {/* ── ABOUT ── */}
      <section
        id="about"
        className="py-20 px-4 border-t-2 border-border bg-card text-foreground"
        role="region"
        aria-label="About E-Cell JNCT PU — Entrepreneurship Cell"
      >
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-foreground border-2 border-foreground rounded-none px-3.5 py-1.5 mb-6 bg-background shadow-[3px_3px_0px_#00FF66]">
            About Us
          </span>
        </div>
        <FeatureGrid
          sectionTitle={
            <>
              Fostering the <span className="gradient-text">Next Generation</span> of Innovators
            </>
          }
          sectionDescription="E-Cell JNCT PU empowers JNCT Professional University students with startup resources, mentorship programs, and entrepreneurship support to build successful businesses."
          features={aboutFeatures}
          className="py-8"
        />
      </section>

      {/* ── MEMBERS / TEAM ── */}
      <MembersSection />

      {/* ── EVENTS ── */}
      <section id="events" className="py-24 px-4 bg-background border-t-2 border-border">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-foreground border-2 border-foreground rounded-none px-3.5 py-1.5 mb-6 bg-background shadow-[3px_3px_0px_#00FF66]">
            Events
          </span>
          <h2
            className="font-[family-name:var(--font-outfit)] font-black uppercase text-foreground mb-16 tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", textShadow: "3px 3px 0px #D4AF37" }}
          >
            Upcoming <span className="gradient-text">Highlights</span>
          </h2>

          <div className="flex flex-col gap-6">
            {[
              { day: "24", month: "JUN", tag: "Flagship", title: "StartUp Summit 2026", desc: "The biggest entrepreneurship summit at JNCT PU — pitches, panels, and prizes.", featured: true },
              { day: "05", month: "JUL", tag: "Workshop", title: "Pitch Perfect", desc: "Master the art of pitching your idea to investors in 60 seconds.", featured: false },
              { day: "18", month: "JUL", tag: "Hackathon", title: "InnoHack 2026", desc: "48-hour hackathon to solve real-world problems with tech and creativity.", featured: false },
            ].map((ev) => (
              <div
                key={ev.title}
                className={cn(
                  "flex items-center gap-6 rounded-none p-6 transition-all duration-300 cursor-default border-2 border-border",
                  ev.featured
                    ? "bg-card shadow-[4px_4px_0px_#00FF66] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#00FF66]"
                    : "bg-card shadow-[3px_3px_0px_#FFDE00] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#FFDE00]"
                )}
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center h-16 w-16 min-w-[64px] rounded-none border-2 border-border p-2",
                    ev.featured ? "bg-[#D4AF37] text-black font-black" : "bg-[#FFDE00] text-black font-black"
                  )}
                >
                  <span className="font-[family-name:var(--font-outfit)] text-2xl font-black leading-none">
                    {ev.day}
                  </span>
                  <span className="text-[0.6rem] font-black tracking-wider mt-0.5">{ev.month}</span>
                </div>
                <div>
                  <span className={cn(
                    "text-[0.65rem] font-black uppercase tracking-widest",
                    ev.featured ? "text-[#D4AF37]" : "text-[#FFDE00]"
                  )}>
                    {ev.tag}
                  </span>
                  <h3 className="font-[family-name:var(--font-outfit)] text-xl font-black uppercase text-foreground mt-1 mb-2">
                    {ev.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsSection />

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="py-24 px-4 bg-muted border-t-2 border-border"
      >
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden bg-card border-2 border-border rounded-none p-16 text-center shadow-[6px_6px_0px_#FFDE00] bg-[linear-gradient(to_right,var(--border-pattern)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-pattern)_1px,transparent_1px)] bg-[size:16px_16px]">
            <span className="relative inline-block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-foreground border-2 border-foreground rounded-none px-3.5 py-1.5 mb-6 bg-background shadow-[3px_3px_0px_#00FF66]">
              Get Involved
            </span>
            <h2
              className="relative font-[family-name:var(--font-outfit)] font-black uppercase text-foreground mb-6 tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", textShadow: "3px 3px 0px #D4AF37" }}
            >
              Ready to <span className="gradient-text">Start?</span>
            </h2>
            <p className="relative text-muted-foreground text-base max-w-md mx-auto mb-10 leading-relaxed font-medium">
              Join E-Cell JNCT PU and be part of a movement that&apos;s redefining entrepreneurship on campus.
            </p>
            <div className="relative flex gap-6 justify-center flex-wrap">
              <a
                href="mailto:ecell@pu.ac.in"
                id="email-btn"
                className="inline-block px-8 py-3.5 rounded-none text-sm font-black text-primary uppercase tracking-wider transition-all duration-200 border-2 border-primary bg-primary/15 backdrop-blur-md shadow-[4px_4px_0px_#FFDE00] hover:-translate-x-1 hover:-translate-y-1 hover:bg-primary/25 hover:shadow-[8px_8px_0px_#FFDE00]"
              >
                Get in Touch
              </a>
              <a
                href="#about"
                id="learn-more-btn"
                className="inline-block px-8 py-3.5 rounded-none text-sm font-black text-foreground uppercase tracking-wider transition-all duration-200 border-2 border-border bg-foreground/5 backdrop-blur-md shadow-[4px_4px_0px_#00FF66] hover:-translate-x-1 hover:-translate-y-1 hover:bg-foreground/10 hover:shadow-[8px_8px_0px_#00FF66]"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-border py-8 px-4 bg-background">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="font-[family-name:var(--font-outfit)] text-xl font-black">
            <span className="text-primary">Entrepreneurship</span>
            <span className="text-foreground"> Cell</span>
            <span className="ml-1.5 text-xs font-bold text-black bg-[#FFDE00] border-2 border-border px-1.5 py-0.5 rounded-none align-middle shadow-[2px_2px_0px_#00FF66]">
              JNCT PU
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            © 2026 E-Cell, JNCT PU Professional University. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Instagram", "LinkedIn", "Twitter"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
