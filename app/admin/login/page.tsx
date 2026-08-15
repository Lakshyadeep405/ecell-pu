"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldAlert, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", college: "", year: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Navigation */}
      <nav className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <Link
          href="/"
          className="clay-btn clay-btn-secondary flex items-center gap-2 px-4 py-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="font-[family-name:var(--font-outfit)] text-lg font-black tracking-tight">
          <span className="text-[#D4AF37]">E-Cell</span> JNCT PU
        </div>
      </nav>

      {/* Login Box */}
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-md p-8 relative overflow-hidden clay-card bg-[linear-gradient(to_right,var(--border-pattern)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-pattern)_1px,transparent_1px)] bg-[size:16px_16px]">
          
          {/* Brutalist badge */}
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] font-black uppercase px-3.5 py-1.5 border-b border-l border-border rounded-bl-xl flex items-center gap-1.5 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_inset_-1px_-1px_2px_rgba(0,0,0,0.15)]">
            <Lock className="w-3 h-3" />
            Secure Gate
          </div>

          <div className="mb-8 mt-2">
            <span className="clay-badge px-2.5 py-1 mb-4 bg-background/50 text-foreground">
              Admin Login
            </span>
            <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-black uppercase text-foreground tracking-tight leading-none">
              Command <span className="gradient-text">Center</span>
            </h1>
            <p className="text-muted-foreground text-xs font-medium mt-3 leading-relaxed">
              Verify your credentials to manage events, registrations, team members, and community join requests.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 clay-card-red text-[#EF4444] text-xs font-bold flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                required
                disabled={loading}
                placeholder="e.g. President"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-background border text-foreground font-semibold placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#D4AF37] transition-all text-sm clay-input"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="college" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                College Affiliation
              </label>
              <input
                id="college"
                type="text"
                required
                disabled={loading}
                placeholder="e.g. JNCTPU"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-4 py-3 bg-background border text-foreground font-semibold placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#D4AF37] transition-all text-sm clay-input"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="year" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Passphrase / Year Code
              </label>
              <input
                id="year"
                type="password"
                required
                disabled={loading}
                placeholder="••••"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 bg-background border text-foreground font-semibold placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#D4AF37] transition-all text-sm clay-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="clay-btn clay-btn-primary w-full py-3.5 text-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>Verifying Command...</>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Grant Access
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-border max-w-6xl w-full mx-auto">
        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
          Authorized Access Only • E-Cell JNCT PU Entrepreneurship Network
        </p>
      </footer>
    </main>
  );
}
