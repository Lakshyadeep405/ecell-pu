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
      <div className="absolute inset-0">
        <FadingVideo
          src={HERO_VIDEO}
          shiftY
          className="h-full w-full object-cover"
        />
      </div>

      {/* Gradient Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 45%, rgba(10,10,10,0.6) 100%),
            linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, transparent 25%, transparent 75%, rgba(0,0,0,1) 100%)
          `,
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-between pt-24">
        {/* Spacer for navbar */}
        <div />

        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex flex-col items-center gap-2 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="E-Cell JNCT PU Logo"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-white/10 shadow-2xl mb-4"
            />
            <p className="font-[family-name:var(--font-outfit)] text-xs font-bold tracking-[0.25em] uppercase text-[#D4AF37]">
              jnct professional university (jnctpu bhopal)
            </p>
            <p className="font-[family-name:var(--font-outfit)] text-[10px] font-medium tracking-[0.4em] uppercase text-white/70">
              Entrepreneurship Cell (E-Cell)
            </p>
          </div>
          <h1
            className="mb-8 text-5xl tracking-tight text-white md:text-7xl lg:text-8xl leading-none uppercase font-serif"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Ignite Your<br />
            <em className="text-white/60 not-italic">Entrepreneurial</em><br />
            Spirit
          </h1>

          <div className="w-full max-w-xl space-y-5">
            {submitted ? (
              <p
                className="liquid-glass rounded-full px-6 py-4 text-sm font-medium text-white max-w-md mx-auto"
                role="status"
              >
                You&apos;re on the list — we&apos;ll be in touch soon.
              </p>
            ) : (
              <form
                className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-6 pr-2 max-w-md mx-auto"
                onSubmit={handleEmailSubmit}
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 border-none bg-transparent text-base text-white placeholder:text-white/40 outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white p-3 text-black transition-transform hover:translate-x-0.5"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            )}

            <p className="px-4 text-xs leading-relaxed text-white/40 max-w-md mx-auto">
              Stay updated with the latest events and incubation cohorts at Jai Narain College of Technology. Join the official E-Cell community today.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="liquid-glass rounded-full px-8 py-3 text-xs font-medium text-white transition-colors hover:bg-white/5 inline-block"
              >
                Explore E-Cell
              </Link>
            </div>
          </div>
        </div>

        <div className="pb-12" />
      </div>
    </section>
  );
}
