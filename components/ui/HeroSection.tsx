"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import FadingVideo from "./FadingVideo";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

export default function HeroSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    if (email) {
      window.location.href = `/login?email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <section id="hero" className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      {/* Background Layer: JNCT College Campus */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/campus-banner.webp"
          alt="JNCT Professional University Campus"
          className="h-full w-full object-cover object-center scale-105 filter brightness-[0.7] contrast-[1.1]"
        />
        {/* Atmospheric darkening overlay to keep text legible and emphasize center action */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 50% 65%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%),
              linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.95) 100%)
            `,
          }}
        />
      </div>

      {/* Live Video Layer: Rotating glowing circles, student, and floral elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none mix-blend-screen overflow-hidden">
        <video
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-between pt-10 sm:pt-14 pb-24 px-6 text-center">
        {/* Top Header Section */}
        <div className="flex flex-col items-center">
          <p className="font-[family-name:var(--font-outfit)] text-[10px] sm:text-[11px] font-bold tracking-[0.35em] uppercase text-white/80 mb-2 font-sans drop-shadow-md">
            JNCT PROFESSIONAL UNIVERSITY ENTREPRENEURSHIP CELL
          </p>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05] uppercase font-serif drop-shadow-2xl"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Ignite Your<br />
            Entrepreneurial<br />
            Spirit
          </h1>
        </div>

        {/* Center space remains open showcasing the college building, girl, and glowing sphere */}
        <div className="my-auto" />

        {/* Bottom Interactive Section */}
        <div className="w-full max-w-xl mx-auto space-y-3.5 z-20">
          {submitted ? (
            <p
              className="liquid-glass rounded-full px-6 py-3.5 text-sm font-medium text-white max-w-md mx-auto backdrop-blur-md bg-black/40 border border-white/20"
              role="status"
            >
              You&apos;re on the list — we&apos;ll be in touch soon.
            </p>
          ) : (
            <form
              className="liquid-glass flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 max-w-md mx-auto backdrop-blur-md bg-black/40 border border-white/20 shadow-2xl"
              onSubmit={handleEmailSubmit}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="min-w-0 flex-1 border-none bg-transparent text-sm sm:text-base text-white placeholder:text-white/50 outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-white p-2.5 sm:p-3 text-black transition-transform hover:scale-105 active:scale-95"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </form>
          )}

          <p className="px-4 text-[11px] sm:text-xs leading-relaxed text-white/60 max-w-md mx-auto drop-shadow">
            Stay updated with the latest events and incubation cohorts at Jai Narain College of Technology. Join the official E-Cell community today.
          </p>

          <div className="pt-1">
            <Link
              href="/about"
              className="liquid-glass rounded-full px-7 py-2.5 text-xs font-semibold text-white/90 hover:text-white transition-all backdrop-blur-md bg-black/30 border border-white/20 hover:bg-white/10 inline-block shadow-lg"
            >
              Explore E-Cell
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
