"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Users, Cpu, Palette, Megaphone, Wrench, ShieldCheck, Instagram, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// --- Types ---
interface TeamMember {
  id: string;
  name: string;
  role: string;
  domain: "core" | "technical" | "creatives" | "marketing" | "operations";
  image?: string;
}

// --- Full Team Dataset ---
const ALL_MEMBERS: TeamMember[] = [
  // Core Team (8 Members)
  { id: "1", name: "Lakshyadeep", role: "PRESIDENT", domain: "core" },
  { id: "2", name: "Yashaswi", role: "VICE PRESIDENT", domain: "core" },
  { id: "3", name: "Avdesh", role: "CO-ORDINATOR HEAD", domain: "core" },
  { id: "4", name: "Animesh", role: "OPERATIONAL HEAD", domain: "core" },
  { id: "5", name: "Ritika", role: "R&D HEAD", domain: "core" },
  { id: "6", name: "Rajneesh", role: "TECHNICAL HEAD", domain: "core" },
  { id: "7", name: "Geetansh", role: "CORPORATE RELATIONS HEAD", domain: "core" },
  { id: "8", name: "Bishal", role: "SOCIAL MEDIA & DESIGN HEAD", domain: "core" },

  // Technical Domain
  { id: "9", name: "Rohit", role: "R&D", domain: "technical" },
  { id: "10", name: "Amit", role: "TECHNICAL", domain: "technical" },
  { id: "11", name: "Shantanu", role: "TECHNICAL", domain: "technical" },

  // Creatives & Design
  { id: "12", name: "Lokesh", role: "S M & D", domain: "creatives" },
  { id: "13", name: "Hariom", role: "S M & D", domain: "creatives" },
  { id: "14", name: "Anit", role: "S M & D", domain: "creatives" },

  // Marketing & PR
  { id: "15", name: "Bhupendra Patwari", role: "CORPORATE RELATIONS", domain: "marketing" },

  // Operations
  { id: "16", name: "Sidhi", role: "MANAGEMENT", domain: "operations" },
  { id: "17", name: "Pavni", role: "MANAGEMENT", domain: "operations" },
  { id: "18", name: "Kartavya", role: "MANAGEMENT", domain: "operations" },
  { id: "19", name: "Lipika", role: "MANAGEMENT", domain: "operations" },
  { id: "20", name: "Raghav Soni", role: "MANAGEMENT", domain: "operations" },
  { id: "21", name: "Shrishti", role: "MANAGEMENT", domain: "operations" },
];

// --- Domain Info for Filters ---
const DOMAINS = [
  { id: "all", label: "All Members", Icon: Users },
  { id: "core", label: "Core Team", Icon: ShieldCheck },
  { id: "technical", label: "Technical", Icon: Cpu },
  { id: "creatives", label: "Creatives & Design", Icon: Palette },
  { id: "marketing", label: "Marketing & PR", Icon: Megaphone },
  { id: "operations", label: "Operations", Icon: Wrench },
];

export default function MembersPage() {
  const [membersList, setMembersList] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");

  // Fetch squad members on mount
  useEffect(() => {
    async function loadMembers() {
      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .order("display_order", { ascending: true });
        
        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: TeamMember[] = data.map((m: any) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            domain: m.domain,
            image: m.photo_url || undefined,
          }));
          setMembersList(mapped);
        } else {
          setMembersList(ALL_MEMBERS);
        }
      } catch (err) {
        console.error("Error loading squad:", err);
        setMembersList(ALL_MEMBERS);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  // Reset hover state on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setHoveredId(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Filter team members based on search and domain selectors
  const filteredMembers = membersList.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "all" || member.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans overflow-x-hidden">
      {/* Header Bar */}
      <nav className="border-b border-white/5 py-4 px-6 bg-black/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
        </div>
      </nav>

      {/* Main Section */}
      <section className="py-16 px-4 flex-grow relative">
        {/* Ambient lighting effect */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.015)_0%,_transparent_75%)]"
          aria-hidden
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="liquid-glass rounded-full px-3.5 py-1.5 text-[9px] uppercase tracking-widest text-white/40 font-bold font-[family-name:var(--font-outfit)]">
              E-Cell JNCT PU Team
            </span>
            <h1
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-none"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Meet the Entire <em>Squad</em>
            </h1>
            <p className="mt-6 text-xs sm:text-sm text-white/40 leading-relaxed font-semibold max-w-md mx-auto">
              The builders, designers, marketers, and operations leads pushing the boundaries of entrepreneurship at JNCT Professional University.
            </p>
          </div>

          {/* Controls: Search and Filters */}
          <div className="flex flex-col gap-6 mb-16">
            {/* Search Input */}
            <div className="relative max-w-md mx-auto w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all rounded-full text-xs font-semibold"
              />
            </div>

            {/* Domain Filter Tabs */}
            <div className="flex flex-wrap gap-2.5 justify-center max-w-4xl mx-auto mt-2">
              {DOMAINS.map((dom) => {
                const DomIcon = dom.Icon;
                const isSelected = selectedDomain === dom.id;
                return (
                  <button
                    key={dom.id}
                    onClick={() => setSelectedDomain(dom.id)}
                    className={cn(
                      "relative flex items-center gap-1.5 px-4 py-2 text-[9px] font-bold uppercase tracking-wider rounded-full transition-all border",
                      isSelected
                        ? "bg-white text-black border-white"
                        : "liquid-glass text-white/60 hover:text-white border-white/5"
                    )}
                  >
                    <DomIcon className="w-3.5 h-3.5" />
                    {dom.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Layout */}
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto justify-items-center">
              {filteredMembers.map((member) => {
                const isActive = hoveredId === member.id;
                const isDimmed = hoveredId !== null && !isActive;

                return (
                  <div
                    key={member.id}
                    className="flex flex-col items-center cursor-pointer group relative w-full max-w-[130px] sm:max-w-[170px] min-w-0"
                    onPointerEnter={() => setHoveredId(member.id)}
                    onPointerLeave={() => setHoveredId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredId((prev) => (prev === member.id ? null : member.id));
                    }}
                  >
                    {/* Card container */}
                    <div
                      className={cn(
                        "overflow-hidden rounded-2xl cursor-pointer transition-all duration-350 relative border w-full aspect-[3/4]",
                        isDimmed ? "opacity-30" : "opacity-100",
                        isActive
                          ? "bg-white/10 scale-102 border-white/20 shadow-lg"
                          : "liquid-glass border-white/5 hover:bg-white/[0.02]"
                      )}
                    >
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-all duration-500"
                          style={{
                            filter: isActive ? "grayscale(0) brightness(1.05)" : "grayscale(1) brightness(0.7)",
                          }}
                        />
                      ) : (
                        /* Fallback Graphic */
                        <div
                          className={cn(
                            "w-full h-full flex flex-col items-center justify-center bg-white/[0.01] transition-all duration-300 relative",
                            isActive
                              ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:12px_12px]"
                              : "bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:12px_12px]"
                          )}
                        >
                          <span
                            className={cn(
                              "text-2xl sm:text-3xl font-black select-none transition-colors duration-300 font-[family-name:var(--font-outfit)]",
                              isActive ? "text-white" : "text-white/20"
                            )}
                          >
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                          <span
                            className={cn(
                              "text-[6px] sm:text-[7px] uppercase tracking-wider mt-1.5 select-none transition-colors duration-300 font-bold",
                              isActive ? "text-[#D4AF37]" : "text-white/20"
                            )}
                          >
                            {member.domain === "core" ? "Core Member" : `${member.domain}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex flex-col items-center gap-0.5 mt-4 text-center w-full min-w-0">
                      <span
                        className="font-[family-name:var(--font-outfit)] font-black text-xs uppercase tracking-wider line-clamp-1 w-full transition-colors"
                        style={{ color: isActive ? "#D4AF37" : "#FFFFFF" }}
                      >
                        {member.name}
                      </span>
                      <span className="font-[family-name:var(--font-outfit)] font-semibold text-[9px] tracking-widest text-white/40 uppercase line-clamp-1 w-full mt-0.5">
                        {member.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 liquid-glass max-w-xl mx-auto rounded-3xl border border-white/5">
              <p className="text-white/30 font-bold uppercase text-xs tracking-widest">
                No squad members found matching filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDomain("all");
                }}
                className="mt-6 liquid-glass rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider border border-white/10 text-white/80 hover:text-white"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Copy */}
      <footer className="border-t border-white/5 pt-8 pb-28 px-6 bg-[#030303]">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
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
