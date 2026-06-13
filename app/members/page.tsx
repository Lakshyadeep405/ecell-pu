"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Users, Cpu, Palette, Megaphone, Wrench, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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
  { id: "1", name: "Aarav Sharma", role: "PRESIDENT", domain: "core" },
  { id: "2", name: "Diya Mehra", role: "VICE PRESIDENT", domain: "core" },
  { id: "3", name: "Kabir Singh", role: "TECHNICAL HEAD", domain: "core" },
  { id: "4", name: "Riya Kapoor", role: "MARKETING & PR LEAD", domain: "core" },
  { id: "5", name: "Aryan Verma", role: "EVENTS MANAGER", domain: "core" },
  { id: "6", name: "Ananya Goel", role: "STARTUP RELATIONS", domain: "core" },
  { id: "7", name: "Rohan Malhotra", role: "CREATIVE DIRECTOR", domain: "core" },
  { id: "8", name: "Sanya Gupta", role: "OPERATIONS HEAD", domain: "core" },

  // Technical Domain
  { id: "9", name: "Devansh Mehta", role: "LEAD WEB DEVELOPER", domain: "technical" },
  { id: "10", name: "Ishaan Malhotra", role: "FRONTEND DEVELOPER", domain: "technical" },
  { id: "11", name: "Sneha Joshi", role: "BACKEND DEVELOPER", domain: "technical" },
  { id: "12", name: "Tushar Sen", role: "APP DEVELOPER", domain: "technical" },

  // Creatives & Design
  { id: "13", name: "Tanvi Roy", role: "LEAD UI/UX DESIGNER", domain: "creatives" },
  { id: "14", name: "Arjun Saxena", role: "GRAPHICS DESIGNER", domain: "creatives" },
  { id: "15", name: "Meera Nair", role: "VIDEO EDITOR", domain: "creatives" },
  { id: "16", name: "Sahil Khanna", role: "CONTENT WRITER", domain: "creatives" },

  // Marketing & PR
  { id: "17", name: "Kritika Sen", role: "OUTREACH MANAGER", domain: "marketing" },
  { id: "18", name: "Rahul Varma", role: "SOCIAL MEDIA MANAGER", domain: "marketing" },
  { id: "19", name: "Preeti Chaudhary", role: "PUBLIC RELATIONS EXECUTIVE", domain: "marketing" },

  // Operations
  { id: "20", name: "Aman Kapoor", role: "LOGISTICS COORDINATOR", domain: "operations" },
  { id: "21", name: "Yash Singhal", role: "EVENT OPERATIONS EXECUTIVE", domain: "operations" },
  { id: "22", name: "Divya Sharma", role: "SPONSORSHIP MANAGER", domain: "operations" },
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");

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
  const filteredMembers = ALL_MEMBERS.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "all" || member.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header Bar */}
      <nav className="border-b-2 border-border py-4 px-6 bg-card sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 border-2 border-border bg-background text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#D4AF37] transition-all duration-150 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="font-[family-name:var(--font-outfit)] text-lg font-black">
            <span className="text-[#D4AF37]">E-Cell</span> JNCT PU
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <section className="py-16 px-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-foreground border-2 border-foreground rounded-none px-3.5 py-1.5 mb-6 bg-background shadow-[3px_3px_0px_#00FF66]">
              E-Cell JNCT PU Team
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase font-[family-name:var(--font-outfit)]"
              style={{ textShadow: "3px 3px 0px #D4AF37" }}
            >
              Meet the Entire <span className="gradient-text">Squad</span>
            </h1>
            <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
              The builders, designers, marketers, and operations leads pushing the boundaries of entrepreneurship.
            </p>
          </div>

          {/* Controls: Search and Filters */}
          <div className="flex flex-col gap-6 mb-12">
            {/* Search Input */}
            <div className="relative max-w-md mx-auto w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border-2 border-border text-foreground font-semibold placeholder-muted-foreground focus:outline-none focus:border-[#D4AF37] shadow-[3px_3px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_#F9FAFB] transition-all"
              />
            </div>

            {/* Domain Filter Tabs */}
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto mt-4">
              {DOMAINS.map((dom) => {
                const DomIcon = dom.Icon;
                const isSelected = selectedDomain === dom.id;
                return (
                  <button
                    key={dom.id}
                    onClick={() => setSelectedDomain(dom.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 border-2 border-border text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer",
                      isSelected
                        ? "bg-[#D4AF37] text-black shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#F9FAFB]"
                        : "bg-card text-foreground shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#D4AF37]"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {filteredMembers.map((member) => {
                const isActive = hoveredId === member.id;
                const isDimmed = hoveredId !== null && !isActive;

                return (
                  <div
                    key={member.id}
                    className="flex flex-col items-center cursor-pointer group relative"
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
                        "overflow-hidden rounded-none cursor-pointer transition-all duration-300 relative border-2 border-border w-full aspect-[3/4] max-w-[170px]",
                        isDimmed ? "opacity-30" : "opacity-100",
                        isActive
                          ? "-translate-x-1 -translate-y-1 shadow-[4px_4px_0px_var(--primary)]"
                          : "shadow-[2px_2px_0px_#D4AF37]"
                      )}
                    >
                      {/* Fallback Graphic */}
                      <div
                        className={cn(
                          "w-full h-full flex flex-col items-center justify-center bg-muted transition-all duration-300 relative",
                          isActive
                            ? "bg-[linear-gradient(to_right,rgba(212,175,55,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.12)_1px,transparent_1px)] bg-[size:12px_12px]"
                            : "bg-[linear-gradient(to_right,var(--border-pattern)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-pattern)_1px,transparent_1px)] bg-[size:12px_12px]"
                        )}
                      >
                        <span
                          className={cn(
                            "text-2xl sm:text-3xl font-black select-none transition-colors duration-300 font-[family-name:var(--font-outfit)]",
                            isActive ? "text-foreground" : "text-foreground/20"
                          )}
                        >
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                        <span
                          className={cn(
                            "text-[6px] sm:text-[7px] uppercase tracking-wider mt-1 select-none transition-colors duration-300 font-bold",
                            isActive ? "text-[#D4AF37]" : "text-[#4B5563]/30"
                          )}
                        >
                          {member.domain === "core" ? "Core Member" : `${member.domain} Team`}
                        </span>
                      </div>
                    </div>

                    {/* Label */}
                    <div className="flex flex-col items-center gap-1 mt-4 text-center w-full max-w-[170px]">
                      <span
                        className="font-[family-name:var(--font-outfit)] font-extrabold text-xs uppercase tracking-tight line-clamp-1 w-full transition-colors"
                        style={{ color: isActive ? "#D4AF37" : "var(--foreground)" }}
                      >
                        {member.name}
                      </span>
                      <span className="font-[family-name:var(--font-outfit)] font-bold text-[0.55rem] tracking-wider text-[#D4AF37] uppercase line-clamp-1 w-full">
                        {member.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-border bg-card max-w-xl mx-auto">
              <p className="text-muted-foreground font-black uppercase text-sm tracking-widest">
                No squad members found matching filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDomain("all");
                }}
                className="mt-6 px-6 py-2.5 border-2 border-border bg-background text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#D4AF37] transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Copy */}
      <footer className="border-t-2 border-border py-8 px-6 bg-card mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="font-[family-name:var(--font-outfit)] text-lg font-black">
            <span className="text-primary">E-Cell</span> <span className="text-[#D4AF37]">JNCT PU</span>
          </div>
          <p className="text-muted-foreground text-xs">
            © 2026 E-Cell, JNCT PU Professional University. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
