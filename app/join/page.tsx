"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles, Send, Phone, User, GraduationCap, School, Instagram, Linkedin, Twitter } from "lucide-react";

export default function JoinCommunityPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", college: "JNCTPU", year: "1st Year" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Prefill details from user_session on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("user_session");
      if (stored) {
        const user = JSON.parse(stored);
        setFormData((prev) => ({
          ...prev,
          name: user.name || prev.name,
          phone: user.phone || prev.phone,
          college: user.college || prev.college,
          year: user.year || prev.year,
        }));
      }
    } catch (e) {
      console.error("Failed to restore user session in JoinCommunityPage", e);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-between p-4 sm:p-6 font-sans overflow-x-hidden">
      
      {/* Top Header Bar */}
      <nav className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 sticky top-0 z-40 bg-black/60 backdrop-blur-md">
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
      </nav>

      {/* Form Content */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 relative">
        {/* Ambient background light glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.015)_0%,_transparent_70%)]"
          aria-hidden
        />

        <div className="w-full max-w-lg p-8 relative overflow-hidden liquid-glass border border-white/5 rounded-3xl relative z-10">
          
          {/* Top-Right Badge */}
          <div className="absolute top-0 right-0 bg-white text-black text-[9px] font-black uppercase px-4 py-1.5 border-b border-l border-white/10 rounded-bl-xl flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Join Us
          </div>

          {success ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <span className="liquid-glass rounded-full px-3 py-1 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
                  Request Received
                </span>
                <h2 
                  className="text-2xl font-serif text-white"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  Welcome to the <em>Network!</em>
                </h2>
                <p className="text-white/40 text-xs font-semibold leading-relaxed max-w-sm mx-auto">
                  Your application to join E-Cell JNCTPU has been submitted. Our coordinators will review details and follow up with you on WhatsApp shortly.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="liquid-glass border border-white/10 rounded-full text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  Return Home
                </Link>
                <a
                  href="https://wa.me/919999999999?text=Hi%20E-Cell%20team,%20I've%20submitted%20a%20join%20request%20for%20the%20community!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#25D366] text-black px-6 py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Message coordinator
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 mt-2">
                <span className="liquid-glass rounded-full px-3 py-1 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
                  Community Registration
                </span>
                <h1 
                  className="mt-4 text-3xl font-serif text-white leading-none"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  Join E-Cell <em>JNCT PU</em>
                </h1>
                <p className="text-white/40 text-xs font-semibold mt-3 leading-relaxed">
                  Enter your details to join India&apos;s leading student entrepreneurship network. Access workshops, hackathons, incubator support, and venture networks.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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
                  <label htmlFor="phone" className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    WhatsApp Phone Number *
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
                  <Send className="w-4 h-4" />
                  {loading ? "Registering..." : "Submit Join Request"}
                </button>
              </form>
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
                Empowering student-led innovation, start-up launchpads, and business incubation programs in Central India.
              </p>
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
