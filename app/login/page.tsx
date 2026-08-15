"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, User, Mail, Phone, School, GraduationCap, Sparkles, LogIn, CheckCircle2,
  Home, Users, CalendarDays, Instagram, Linkedin, Twitter
} from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "About", url: "/about", icon: User },
  { name: "Team", url: "/team", icon: Users },
  { name: "Events", url: "/events", icon: CalendarDays },
  { name: "Contact", url: "/contact", icon: Mail },
  { name: "Portal", url: "/login", icon: LogIn },
];

export default function UserLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", college: "JNCTPU", year: "1st Year" });
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Read email from search query and load existing session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailVal = params.get("email");
      if (emailVal) {
        setFormData((prev) => ({ ...prev, email: emailVal }));
      }

      const stored = localStorage.getItem("user_session");
      if (stored) {
        try {
          setSession(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse stored session", e);
        }
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem("user_session", JSON.stringify(formData));
      setSession(formData);
      
      // Auto redirect to events page after login so they can register
      setTimeout(() => {
        router.push("/events");
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    setSession(null);
    setFormData({ name: "", email: "", phone: "", college: "JNCTPU", year: "1st Year" });
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-between font-sans overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <NavBar items={navItems} />

      {/* Login Box Content */}
      <div className="flex-grow flex items-center justify-center py-28 px-4 relative">
        {/* Ambient background light glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.015)_0%,_transparent_70%)]"
          aria-hidden
        />

        <div className="w-full max-w-lg p-8 relative overflow-hidden liquid-glass border border-white/5 rounded-3xl relative z-10">
          {/* Top-Right Badge */}
          <div className="absolute top-0 right-0 bg-white text-black text-[9px] font-black uppercase px-4 py-1.5 border-b border-l border-white/10 rounded-bl-xl flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Portal Gate
          </div>

          {session ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 bg-white/5 border border-white/10 text-white flex items-center justify-center mx-auto rounded-full">
                <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
              </div>
              
              <div className="space-y-2">
                <span className="liquid-glass rounded-full px-3 py-1 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
                  Session Active
                </span>
                <h2 
                  className="text-2xl font-serif text-white"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  Welcome back, <em>{session.name}</em>
                </h2>
                <div className="text-left text-xs bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2 max-w-sm mx-auto mt-4 font-semibold text-white/50">
                  <p><strong className="text-white/80">Email:</strong> {session.email}</p>
                  <p><strong className="text-white/80">WhatsApp:</strong> {session.phone}</p>
                  <p><strong className="text-white/80">College:</strong> {session.college}</p>
                  <p><strong className="text-white/80">Year:</strong> {session.year}</p>
                </div>
                <p className="text-white/30 text-[10px] font-semibold max-w-sm mx-auto pt-2">
                  Whenever you open any event registration, these credentials will automatically prefill.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleLogout}
                  className="liquid-glass border border-white/10 rounded-full text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  Logout / Clear
                </button>
                <Link
                  href="/events"
                  className="rounded-full bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Explore Events
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 mt-2 flex flex-col items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="E-Cell Logo"
                  className="w-12 h-12 rounded-full border border-white/10"
                />
                <div>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
                    Student Sign In
                  </span>
                <h1 
                  className="mt-4 text-3xl font-serif text-white leading-none"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  Enter Your <em>Details</em>
                </h1>
                <p className="text-white/40 text-xs font-semibold mt-3 leading-relaxed">
                  Enter details once to log in. This allows you to auto-fill all event registration sheets across E-Cell.
                </p>
              </div>
            </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    disabled={loading}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-white/20 text-xs rounded-xl transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    disabled={loading}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-white/20 text-xs rounded-xl transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    WhatsApp Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    disabled={loading}
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-white/20 text-xs rounded-xl transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="college" className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-[#D4AF37]" />
                    College Name *
                  </label>
                  <input
                    id="college"
                    type="text"
                    required
                    disabled={loading}
                    placeholder="e.g. JNCTPU"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-white/20 text-xs rounded-xl transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="year" className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Year of Study *
                  </label>
                  <select
                    id="year"
                    disabled={loading}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 text-white/80 font-medium focus:outline-none focus:border-white/20 text-xs rounded-xl cursor-pointer transition-colors"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Other">Other / Alumnus</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-white text-black w-full py-3.5 text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition-opacity"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? "Saving Session..." : "Secure Login"}
                </button>
              </form>

              {/* Link to Admin secure gate */}
              <div className="mt-8 text-center pt-4 border-t border-white/5">
                <Link
                  href="/admin/login"
                  className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[#D4AF37] transition-colors"
                >
                  Admin Secure Gate
                </Link>
              </div>
            </>
          )}
        </div>
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
                E-Cell JNCT PU • Professional University Portal Initiative
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
