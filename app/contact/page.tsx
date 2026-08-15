"use client";

import { Home, User, Users, CalendarDays, Mail, LogIn, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "About", url: "/about", icon: User },
  { name: "Team", url: "/team", icon: Users },
  { name: "Events", url: "/events", icon: CalendarDays },
  { name: "Contact", url: "/contact", icon: Mail },
  { name: "Portal", url: "/login", icon: LogIn },
];

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* ── NAVBAR ── */}
      <NavBar items={navItems} />

      {/* ── CONTACT CONTENT ── */}
      <section className="flex-grow py-32 px-6 flex flex-col items-center justify-center relative">
        {/* Ambient lighting effect */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_75%)]"
          aria-hidden
        />

        <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
          <div className="liquid-glass rounded-3xl p-8 sm:p-16 border-white/5 relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.025)_0%,_transparent_65%)] pointer-events-none" />

            <span className="relative z-10 liquid-glass rounded-full px-3.5 py-1.5 text-[9px] uppercase tracking-widest text-white/50 font-bold font-[family-name:var(--font-outfit)]">
              Get Connected
            </span>
            <h2
              className="relative z-10 mt-6 text-4xl sm:text-5xl font-serif text-white leading-tight"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Ready to Redefine Your <em>Future?</em>
            </h2>
            <p className="relative z-10 mt-4 text-xs sm:text-sm text-white/40 max-w-md mx-auto leading-relaxed font-semibold">
              Join E-Cell JNCT Professional University and be part of a movement that&apos;s redefining entrepreneurship on campus.
            </p>
            <div className="relative z-10 mt-10 flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:ecell@pu.ac.in"
                id="email-btn"
                className="rounded-full bg-white px-8 py-3.5 text-xs font-bold text-black hover:opacity-90 transition-opacity"
              >
                Get in Touch
              </a>
              <Link
                href="/about"
                id="learn-more-btn"
                className="liquid-glass rounded-full px-8 py-3.5 text-xs font-bold text-white hover:bg-white/5 transition-colors border border-white/15"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
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
              © 2026 E-Cell, JNCT Professional University. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
