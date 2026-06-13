"use client";

export default function StatsSection() {
  return (
    <section
      className="py-16 px-4 border-t-2 border-[#0A0A0A] bg-background text-center"
      role="region"
      aria-label="University Affiliation"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
        <h2
          className="font-[family-name:var(--font-outfit)] font-black uppercase text-foreground tracking-tight leading-none"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3.8rem)", textShadow: "3px 3px 0px #D4AF37" }}
        >
          JNCT PU <span className="gradient-text">Professional</span> University
        </h2>
      </div>
    </section>
  );
}
