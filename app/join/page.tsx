"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles, Send, Phone, User, GraduationCap, School } from "lucide-react";

export default function JoinCommunityPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", college: "JNCTPU", year: "1st Year" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Header Bar */}
      <nav className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 sticky top-0 z-40 bg-background/80 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 border-2 border-border bg-card text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#D4AF37] transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="font-[family-name:var(--font-outfit)] text-lg font-black tracking-tight">
          <span className="text-[#D4AF37]">E-Cell</span> JNCT PU
        </div>
      </nav>

      {/* Form Content */}
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg bg-card border-2 border-border p-8 shadow-[6px_6px_0px_#D4AF37] relative overflow-hidden bg-[linear-gradient(to_right,var(--border-pattern)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-pattern)_1px,transparent_1px)] bg-[size:16px_16px]">
          
          {/* Brutalist aesthetic badge */}
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] font-black uppercase px-4 py-1.5 border-b-2 border-l-2 border-border flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Join Us
          </div>

          {success ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 bg-[#00FF66]/10 border-2 border-[#00FF66] text-[#00FF66] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_#F9FAFB]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <span className="inline-block text-[0.55rem] font-bold tracking-[0.2em] uppercase text-foreground border-2 border-foreground rounded-none px-2.5 py-1 mb-2 bg-background shadow-[2px_2px_0px_#00FF66]">
                  Request Received
                </span>
                <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-black uppercase text-foreground">
                  Welcome to the <span className="gradient-text">Network!</span>
                </h2>
                <p className="text-muted-foreground text-xs font-semibold leading-relaxed max-w-sm mx-auto">
                  Your application to join E-Cell JNCTPU has been submitted. Our coordinators will review details and follow up with you on WhatsApp shortly.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 border-2 border-border bg-background text-foreground font-black uppercase text-xs tracking-wider transition-all duration-150 shadow-[3px_3px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#D4AF37]"
                >
                  Return Home
                </Link>
                <a
                  href="https://wa.me/919999999999?text=Hi%20E-Cell%20team,%20I've%20submitted%20a%20join%20request%20for%20the%20community!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border-2 border-border bg-[#00FF66] text-black font-black uppercase text-xs tracking-wider transition-all duration-150 shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000]"
                >
                  Message coordinator
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 mt-2">
                <span className="inline-block text-[0.55rem] font-bold tracking-[0.2em] uppercase text-foreground border-2 border-foreground rounded-none px-2.5 py-1 mb-4 bg-background shadow-[2px_2px_0px_#00FF66]">
                  Community Registration
                </span>
                <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-black uppercase text-foreground tracking-tight leading-none">
                  Join E-Cell <span className="gradient-text">JNCT PU</span>
                </h1>
                <p className="text-muted-foreground text-xs font-semibold mt-3 leading-relaxed">
                  Enter your details to join India&apos;s leading student entrepreneurship network. Access workshops, hackathons, incubator support, and venture networks.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 border-2 border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
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
                    className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold placeholder:text-muted-foreground/35 focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
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
                    className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold placeholder:text-muted-foreground/35 focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="college" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
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
                    className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold placeholder:text-muted-foreground/35 focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="year" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Year of Study *
                  </label>
                  <select
                    id="year"
                    disabled={loading}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-sm rounded-none cursor-pointer"
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
                  className="w-full py-4 border-2 border-border bg-[#D4AF37] text-black font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F9FAFB] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] dark:hover:shadow-[6px_6px_0px_#F9FAFB] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Registering..." : "Submit Join Request"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* SEO Footer */}
      <footer className="text-center py-4 border-t-2 border-border max-w-6xl w-full mx-auto space-y-1">
        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
          E-Cell JNCT PU • Professional University Entrepreneurship Initiative
        </p>
        <p className="text-[9px] text-muted-foreground">
          Empowering student-led innovation, start-up launchpads, and business incubation programs in Central India.
        </p>
      </footer>
    </main>
  );
}
