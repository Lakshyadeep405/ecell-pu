import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { INITIAL_BLOGS, BlogPost } from "@/lib/blogs";
import { ArrowLeft, Clock, Calendar, Share2, Sparkles, User, PenSquare, ArrowRight } from "lucide-react";
import ShareButton from "./ShareButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

async function getBlog(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("Supabase fetch single blog fallback:", err);
  }

  // Fallback check in INITIAL_BLOGS
  const found = INITIAL_BLOGS.find(
    (b) => b.slug === slug && b.status === "published"
  );
  return found || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | E-Cell JNCT PU",
    };
  }

  return {
    title: `${blog.title} | E-Cell JNCT PU Blog`,
    description: blog.summary,
    openGraph: {
      title: blog.title,
      description: blog.summary,
      images: blog.cover_image ? [{ url: blog.cover_image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Split content by paragraphs
  const paragraphs = blog.content.split(/\n\s*\n/).filter((p) => p.trim() !== "");

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-white/5 py-4 px-6 bg-black/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/blogs"
            className="liquid-glass flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/80 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Blogs
          </Link>

          <div className="flex items-center gap-3">
            <ShareButton title={blog.title} />
            <Link
              href="/blogs/submit"
              className="clay-btn clay-btn-primary flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#e0bc43] transition-all rounded-full"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Write</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Article Container */}
      <article className="py-12 px-4 flex-grow relative">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.05)_0%,_transparent_75%)]"
          aria-hidden
        />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
              {blog.category}
            </span>
            <span className="text-white/40 text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              {blog.read_time}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-white/40 text-xs flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-white/40" />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-8"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {blog.title}
          </h1>

          {/* Author Header Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-bold text-base uppercase font-[family-name:var(--font-outfit)]">
                {blog.author_name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{blog.author_name}</div>
                {blog.author_role && (
                  <div className="text-xs text-white/50">{blog.author_role}</div>
                )}
              </div>
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold font-[family-name:var(--font-outfit)] hidden sm:block">
              Community Contributor
            </div>
          </div>

          {/* Cover image if available */}
          {blog.cover_image && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-white/10 relative h-64 sm:h-80 md:h-96 w-full">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="space-y-6 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-sans font-light">
            {paragraphs.map((para, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? "first-letter:text-5xl first-letter:font-bold first-letter:text-[#D4AF37] first-letter:mr-2 first-letter:float-left text-white/90"
                    : "text-white/80"
                }
              >
                {para}
              </p>
            ))}
          </div>

          {/* Bottom Author Bio Card */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black text-xl uppercase font-[family-name:var(--font-outfit)] flex-shrink-0">
                {blog.author_name.charAt(0)}
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
                  Written By
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{blog.author_name}</h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  {blog.author_role || "Passionate about entrepreneurship and innovation at JNCT Professional University."}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA to write */}
          <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#D4AF37]/10 border border-[#D4AF37]/20">
            <h4 className="text-xl font-serif font-bold text-white">Inspired by this read?</h4>
            <p className="text-xs text-white/60 mt-2 max-w-md mx-auto">
              Share your own perspective, lessons from building projects, or thoughts on the future of startups.
            </p>
            <Link
              href="/blogs/submit"
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-[#D4AF37] text-black hover:bg-[#e0bc43] transition-all"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Write & Submit Your Blog</span>
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-black text-center text-xs text-white/30">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-[family-name:var(--font-outfit)] text-xs text-white/40">
            © {new Date().getFullYear()} E-CELL JNCT PU
          </div>
          <Link href="/blogs" className="text-[#D4AF37] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to all articles
          </Link>
        </div>
      </footer>
    </main>
  );
}
