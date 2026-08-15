"use client";

import React, { useState } from "react";
import { 
  Home, User, Users, CalendarDays, Mail, LogIn, Rocket, Handshake, Lightbulb, Trophy, 
  Instagram, Linkedin, Twitter 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "About", url: "/about", icon: User },
  { name: "Team", url: "/team", icon: Users },
  { name: "Events", url: "/events", icon: CalendarDays },
  { name: "Contact", url: "/contact", icon: Mail },
  { name: "Portal", url: "/login", icon: LogIn },
];

const pillars = [
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

const FAQ_DATA = [
  {
    question: "What is Venture Incubation at E-Cell JNCTPU?",
    answer: "It's a structured support program that helps students turn raw business ideas into viable, launch-ready startups through mentorship, resources, and community support."
  },
  {
    question: "Who can join the incubation program?",
    answer: "Any student at JNCT Professional University with a startup idea, project, or early-stage venture can apply — no prior business experience required."
  },
  {
    question: "Do I need a registered company to apply?",
    answer: "No. The program is open to idea-stage and early-stage founders — you don't need a registered business to get started."
  },
  {
    question: "What kind of support does E-Cell provide during incubation?",
    answer: "Mentorship from industry professionals, guidance on business models, access to resources and tools, and connections within the startup community."
  },
  {
    question: "How does E-Cell help students connect with investors?",
    answer: "Through networking events, pitch sessions, and curated meetups where student founders can directly interact with investors and industry mentors."
  },
  {
    question: "Is this networking limited to business students?",
    answer: "No — it's open across disciplines, since great startup ideas come from engineering, design, tech, and every other field."
  },
  {
    question: "Can I get funding through E-Cell's network?",
    answer: "While E-Cell doesn't directly fund ventures, it creates access points to investors and capital-raising opportunities through events and its extended network."
  },
  {
    question: "How often are networking events held?",
    answer: "E-Cell JNCTPU organizes networking sessions and meetups periodically through the year, in addition to flagship events like Eureka!."
  },
  {
    question: "What events fall under the Ideation & Building track?",
    answer: "Hackathons, ideathons, entrepreneurship workshops, and design-thinking sessions aimed at building practical problem-solving skills."
  },
  {
    question: "Do I need a business idea already to participate?",
    answer: "No — many of these events are designed to help you discover and develop ideas from scratch through guided ideation."
  },
  {
    question: "Are these events open to first-year students?",
    answer: "Yes, students from any year at JNCTPU can participate and start building their entrepreneurial skills early."
  },
  {
    question: "How do hackathons at E-Cell JNCTPU work?",
    answer: "Teams work on real-world problem statements within a set time frame, with mentorship support, and present their solutions to judges for evaluation and feedback."
  },
  {
    question: "What pitch competitions does E-Cell JNCTPU organize?",
    answer: "Flagship events like the Eureka! Pitching Competition, held as part of our participation in the National Entrepreneurship Challenge (NEC)."
  },
  {
    question: "What is the eligibility to compete in Eureka!?",
    answer: "Student teams from JNCTPU with a business idea or early-stage venture can register and pitch to a panel of external judges."
  },
  {
    question: "What support is available for scaling a venture post-pitch?",
    answer: "Continued mentorship, incubation support, and access to E-Cell's investor and industry network to help ventures grow beyond the campus stage."
  },
  {
    question: "How can I register for upcoming E-Cell events?",
    answer: "Registrations are announced through E-Cell JNCTPU's official Instagram page and campus channels — check the Events section on this website for open registrations."
  }
];

export default function AboutPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* ── NAVBAR ── */}
      <NavBar items={navItems} />

      {/* ── ABOUT CONTENT ── */}
      <section className="py-32 px-6 flex flex-col items-center justify-center relative border-b border-white/5">
        {/* Ambient lighting effect */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.02)_0%,_transparent_75%)]"
          aria-hidden
        />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center mb-16">
            <span className="liquid-glass rounded-full px-4 py-1.5 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
              About E-Cell
            </span>
            <h1
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-none"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Fostering the <em>Next Generation</em> of Innovators
            </h1>
            <p className="mt-6 text-white/40 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-semibold">
              E-Cell JNCT Professional University, Bhopal empowers student founders with startup resources, mentorship programs, and entrepreneurship support to build successful businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => {
              const PillarIcon = pillar.Icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="liquid-glass flex flex-col p-6 rounded-2xl border border-white/5 hover:bg-white/[0.01] transition-colors gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 border border-white/10">
                    <PillarIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-[family-name:var(--font-outfit)]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs text-white/40 leading-relaxed font-semibold">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EXPANDED DETAILED SECTIONS ── */}
      <section className="py-24 px-6 relative border-b border-white/5 bg-[#020202]">
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <div className="text-center mb-12">
            <span className="liquid-glass rounded-full px-4 py-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold font-[family-name:var(--font-outfit)]">
              Detailed Tracks
            </span>
            <h2 
              className="mt-6 text-3xl sm:text-4xl font-serif text-white leading-tight"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Our Entrepreneurial <em>Pipeline</em>
            </h2>
          </div>

          <div className="space-y-10">
            {/* Venture Incubation */}
            <section id="venture-incubation" className="scroll-mt-20 p-8 rounded-3xl border border-white/5 bg-white/[0.01] liquid-glass flex flex-col md:flex-row gap-8 items-start hover:border-white/10 transition-colors">
              <div className="md:w-1/3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] border border-white/10">
                  <Rocket className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold font-[family-name:var(--font-outfit)] block">
                    LAUNCH
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase font-[family-name:var(--font-outfit)] mt-0.5">
                    Venture Incubation
                  </h3>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed font-semibold">
                  E-Cell JNCTPU&apos;s Venture Incubation Program is where student ideas become real businesses. We support early-stage founders at JNCT Professional University, Bhopal with one-on-one mentorship from industry experts, access to startup resources, legal and business-model guidance, and a peer community of like-minded entrepreneurs. Whether you&apos;re validating your first idea or building your MVP, our incubation cell gives you the structure, tools, and network to move from concept to a launch-ready venture — right from campus.
                </p>
              </div>
            </section>

            {/* Networking & Capital */}
            <section id="networking-capital" className="scroll-mt-20 p-8 rounded-3xl border border-white/5 bg-white/[0.01] liquid-glass flex flex-col md:flex-row gap-8 items-start hover:border-white/10 transition-colors">
              <div className="md:w-1/3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] border border-white/10">
                  <Handshake className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold font-[family-name:var(--font-outfit)] block">
                    CONNECT
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase font-[family-name:var(--font-outfit)] mt-0.5">
                    Networking &amp; Capital
                  </h3>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed font-semibold">
                  E-Cell JNCTPU&apos;s Networking &amp; Capital initiative connects student entrepreneurs with the people who matter most — industry leaders, angel investors, alumni founders, and fellow innovators from across disciplines. Through curated networking events, investor meetups, and founder circles, we help you build the relationships and access the early-stage funding conversations that turn a good idea into a fundable venture. This is where campus entrepreneurship meets the real startup ecosystem.
                </p>
              </div>
            </section>

            {/* Ideation & Building */}
            <section id="ideation-building" className="scroll-mt-20 p-8 rounded-3xl border border-white/5 bg-white/[0.01] liquid-glass flex flex-col md:flex-row gap-8 items-start hover:border-white/10 transition-colors">
              <div className="md:w-1/3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] border border-white/10">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold font-[family-name:var(--font-outfit)] block">
                    INNOVATE
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase font-[family-name:var(--font-outfit)] mt-0.5">
                    Ideation &amp; Building
                  </h3>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed font-semibold">
                  The Ideation &amp; Building track at E-Cell JNCTPU is designed to sharpen entrepreneurial thinking through hands-on experience. We run hackathons, ideathons, design-thinking workshops, and problem-solving sprints that push students to identify real-world problems and build practical solutions. It&apos;s the perfect starting point for students who have an entrepreneurial mindset but need a structured environment to test, refine, and build their first idea.
                </p>
              </div>
            </section>

            {/* Scaling Ventures */}
            <section id="scaling-ventures" className="scroll-mt-20 p-8 rounded-3xl border border-white/5 bg-white/[0.01] liquid-glass flex flex-col md:flex-row gap-8 items-start hover:border-white/10 transition-colors">
              <div className="md:w-1/3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] border border-white/10">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold font-[family-name:var(--font-outfit)] block">
                    GROW
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase font-[family-name:var(--font-outfit)] mt-0.5">
                    Scaling Ventures
                  </h3>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed font-semibold">
                  Once your idea is built and validated, E-Cell JNCTPU&apos;s Scaling Ventures initiative helps you take it to the next level. We provide access to funding opportunities, pitch competitions like Eureka! and NEC, and continued incubation support so student founders can scale their startups beyond the campus. This is the growth stage of our entrepreneurship pipeline — designed for founders ready to compete, raise capital, and expand.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* ── VISIBLE ACCORDION FAQ SECTION ── */}
      <section className="py-24 px-6 relative bg-black border-b border-white/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="liquid-glass rounded-full px-4 py-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold font-[family-name:var(--font-outfit)]">
              FAQ Help Desk
            </span>
            <h2 
              className="mt-6 text-3xl sm:text-4xl font-serif text-white leading-tight"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Frequently Asked <em>Questions</em>
            </h2>
            <p className="mt-4 text-white/40 text-xs sm:text-sm max-w-lg mx-auto font-semibold">
              Find quick answers about Venture Incubation, investor networking, hackathons, and registrations at JNCTPU.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((item, index) => {
              const isOpen = activeIndex === index;
              return (
                <div
                  key={index}
                  className="liquid-glass rounded-2xl border border-white/5 overflow-hidden transition-colors hover:border-white/10"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-[family-name:var(--font-outfit)] text-sm font-bold text-white/80 hover:text-white transition-colors gap-4"
                  >
                    <span>{item.question}</span>
                    <span className="text-[#D4AF37] text-base shrink-0 font-mono font-bold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-white/[0.02] text-xs sm:text-sm text-white/40 leading-relaxed font-semibold">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
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

      {/* ── JSON-LD FAQ Schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQ_DATA.map((item) => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
