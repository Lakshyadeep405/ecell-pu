"use client";

import React, { useState, useEffect } from 'react';
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    role: 'PRESIDENT',
    image: '',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '2',
    name: 'Diya Mehra',
    role: 'VICE PRESIDENT',
    image: '',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '3',
    name: 'Kabir Singh',
    role: 'TECHNICAL HEAD',
    image: '',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '4',
    name: 'Riya Kapoor',
    role: 'MARKETING & PR LEAD',
    image: '',
    social: { instagram: '#', linkedin: '#' },
  },
  {
    id: '5',
    name: 'Aryan Verma',
    role: 'EVENTS MANAGER',
    image: '',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '6',
    name: 'Ananya Goel',
    role: 'STARTUP RELATIONS',
    image: '',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '7',
    name: 'Rohan Malhotra',
    role: 'CREATIVE DIRECTOR',
    image: '',
    social: { behance: '#', linkedin: '#' },
  },
  {
    id: '8',
    name: 'Sanya Gupta',
    role: 'OPERATIONS HEAD',
    image: '',
    social: { instagram: '#', linkedin: '#' },
  },
];

interface TeamShowcaseProps {
  members?: TeamMember[];
}

export function TeamShowcase({ members = DEFAULT_MEMBERS }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Clear hover state on outer click (especially useful on mobile touch screens)
  useEffect(() => {
    const handleOutsideClick = () => {
      setHoveredId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="members-grid-new">
      {members.map((member) => (
        <div
          key={member.id}
          className="member-card-wrapper"
          onPointerEnter={() => setHoveredId(member.id)}
          onPointerLeave={() => setHoveredId(null)}
          onClick={(e) => {
            e.stopPropagation();
            setHoveredId((prev) => (prev === member.id ? null : member.id));
          }}
        >
          {/* Photo */}
          <PhotoCard
            member={member}
            className="member-photo-size"
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
          {/* Name + Role below photo */}
          <div className="member-card-label">
            <span
              className="member-card-name"
              style={{ color: hoveredId === member.id ? '#D4AF37' : undefined }}
            >
              {member.name}
            </span>
            <span className="member-card-role">{member.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────── */
function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  
  const hasImage = member.image && member.image.trim() !== "" && !member.image.includes("placeholder");

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 relative border border-border',
        className,
        isDimmed ? 'opacity-30' : 'opacity-100',
        isActive ? 'clay-card-gold scale-102' : 'clay-card',
      )}
    >
      {hasImage ? (
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-[filter] duration-500"
          style={{
            filter: isActive ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.77)',
          }}
        />
      ) : (
        <div 
          className={cn(
            "w-full h-full flex flex-col items-center justify-center bg-muted transition-all duration-300 relative",
            isActive 
              ? "bg-[linear-gradient(to_right,rgba(212,175,55,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.12)_1px,transparent_1px)] bg-[size:12px_12px]" 
              : "bg-[linear-gradient(to_right,var(--border-pattern)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-pattern)_1px,transparent_1px)] bg-[size:12px_12px]"
          )}
        >
          <span className={cn(
            "text-2xl md:text-3xl font-black select-none transition-colors duration-300 font-[family-name:var(--font-outfit)]",
            isActive ? "text-foreground" : "text-foreground/20"
          )}>
            {member.name.split(" ").map(n => n[0]).join("")}
          </span>
          <span className={cn(
            "text-[7px] md:text-[8px] uppercase tracking-wider mt-1 select-none transition-colors duration-300 font-bold",
            isActive ? "text-[#D4AF37]" : "text-[#4B5563]/30"
          )}>
            Core Member
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Member name section
 ───────────────────────────────────────── */

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const hasSocial = member.social?.twitter ?? member.social?.linkedin ?? member.social?.instagram ?? member.social?.behance;

  return (
    <div
      className={cn(
        'cursor-pointer transition-opacity duration-300 group pointer-events-auto w-fit',
        isDimmed ? 'opacity-50' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Name + social*/}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'w-4 h-3 rounded-full flex-shrink-0 transition-all duration-300',
            isActive ? 'bg-[#D4AF37] w-5' : 'bg-foreground/20',
          )}
        />
        <span
          className={cn(
            'text-base md:text-[18px] font-black leading-none tracking-tight uppercase transition-colors duration-300 font-[family-name:var(--font-outfit)]',
            isActive ? 'text-[#D4AF37]' : 'text-foreground/85 group-hover:text-foreground',
          )}
        >
          {member.name}
        </span>

        {/* Social icons */}
        {hasSocial && (
          <div
            className={cn(
              'flex items-center gap-1.5 ml-2 transition-all duration-200',
              isActive
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-2 pointer-events-none',
            )}
          >
            {member.social?.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-full border border-transparent text-[#4B5563] hover:text-white hover:bg-[#1F2937] hover:border-[#1F2937] hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-150"
                title="X / Twitter"
              >
                <FaTwitter size={11} />
              </a>
            )}
            {member.social?.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-full border border-transparent text-[#4B5563] hover:text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_2px_6px_rgba(212,175,55,0.2)] transition-all duration-150"
                title="LinkedIn"
              >
                <FaLinkedinIn size={11} />
              </a>
            )}
            {member.social?.instagram && (
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-full border border-transparent text-[#4B5563] hover:text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_2px_6px_rgba(212,175,55,0.2)] transition-all duration-150"
                title="Instagram"
              >
                <FaInstagram size={11} />
              </a>
            )}
            {member.social?.behance && (
              <a
                href={member.social.behance}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-full border border-transparent text-[#4B5563] hover:text-white hover:bg-[#1F2937] hover:border-[#1F2937] hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-150"
                title="Behance"
              >
                <FaBehance size={11} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Role */}
      <p className="mt-1.5 pl-[27px] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
        {member.role}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Section Wrapper Component
 ───────────────────────────────────────── */

export default function MembersSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .eq("domain", "core")
          .order("display_order", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped: TeamMember[] = data.map((m: any) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            image: m.photo_url || "",
          }));
          setMembers(mapped);
        }
      } catch (err) {
        console.error("Error loading team members:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  return (
    <section
      id="team"
      className="py-24 px-4 bg-background border-t border-border"
      role="region"
      aria-label="Entrepreneurship Cell JNCT PU Team Members"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="clay-badge px-3.5 py-1.5 mb-6 bg-background/50 text-foreground">
            Our Core Team
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase font-[family-name:var(--font-outfit)]">
            Meet the <span className="gradient-text">Visionaries</span>
          </h2>
          <p className="mt-6 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The dedicated team of student leaders, builders, and entrepreneurs working to foster startup culture at JNCT PU.
          </p>
        </div>

        {/* Team Showcase component */}
        <TeamShowcase members={members.length > 0 ? members : undefined} />

        {/* View All Members Button */}
        <div className="mt-16 text-center">
          <a
            href="/team"
            className="clay-btn clay-btn-secondary px-8 py-3.5 text-sm"
          >
            More Members
          </a>
        </div>
      </div>
    </section>
  );
}
