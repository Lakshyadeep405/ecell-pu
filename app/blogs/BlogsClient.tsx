"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  PenSquare, 
  Clock, 
  User, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  Tag,
  CheckCircle2,
  Instagram,
  Linkedin,
  Twitter
} from "lucide-react";
import { BlogPost } from "@/lib/blogs";

interface BlogsClientProps {
  initialBlogs: BlogPost[];
}

export default function BlogsClient({ initialBlogs }: BlogsClientProps) {
  const [blogs] = useState<BlogPost[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["All", ...Array.from(set)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-white/5 py-4 px-6 bg-black/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="liquid-glass flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/80 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/blogs/submit"
              className="clay-btn clay-btn-primary flex items-center gap-2 px-4 py-2 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#e0bc43] transition-all rounded-full shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Submit Blog</span>
            </Link>
            <div className="flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <span className="text-black bg-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded leading-none font-[family-name:var(--font-outfit)]">
                E-CELL
              </span>
              <span className="font-[family-name:var(--font-outfit)] uppercase tracking-widest text-[9px] sm:text-xs text-white">
                JNCT PU
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <section className="py-14 px-4 flex-grow relative">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06)_0%,_transparent_70%)]"
          aria-hidden
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="liquid-glass rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold font-[family-name:var(--font-outfit)] border border-[#D4AF37]/20">
              Community Voices & Insights
            </span>
            <h1
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              The E-Cell <em>Chronicles</em>
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-white/50 leading-relaxed font-normal max-w-lg mx-auto">
              Stories of ambition, startup thinking, research, and drive. Written by students, innovators, and members of JNCT Professional University.
            </p>

            {/* Quick Submit CTA bar */}
            <div className="mt-7 inline-flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-full p-1.5 pr-4">
              <span className="bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                Open to all students
              </span>
              <Link
                href="/blogs/submit"
                className="text-xs text-white/80 hover:text-white flex items-center gap-1.5 group font-medium"
              >
                <span>Have an entrepreneurial thought or story?</span>
                <span className="text-[#D4AF37] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Post your blog <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by title, topic, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>

              {/* Counter */}
              <div className="text-[11px] text-white/40 tracking-wider uppercase font-semibold">
                Showing {filteredBlogs.length} of {blogs.length} published {blogs.length === 1 ? "article" : "articles"}
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blog Cards Grid */}
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl p-8 bg-white/[0.01]">
              <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white/80">No articles found</h3>
              <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
                No published articles matched your search query. Try searching for something else or submit the first one!
              </p>
              <Link
                href="/blogs/submit"
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-[#D4AF37] text-black rounded-full"
              >
                <PenSquare className="w-3.5 h-3.5" />
                Submit an Article
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group relative rounded-2xl bg-[#0c0c0e] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/50 hover:shadow-[0_10px_30px_rgba(212,175,55,0.08)] transition-all duration-300"
                >
                  {/* Optional Cover Image */}
                  {blog.cover_image && (
                    <div className="relative h-48 w-full overflow-hidden bg-white/5 border-b border-white/5">
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent" />
                      
                      {/* Category Badge on top of image */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30">
                          {blog.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/70 backdrop-blur-md text-white/70 border border-white/10 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D4AF37]" />
                          {blog.read_time}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                    <div>
                      {/* If no cover image, display category badge here */}
                      {!blog.cover_image && (
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                            {blog.category}
                          </span>
                          <span className="text-[11px] text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            {blog.read_time}
                          </span>
                        </div>
                      )}

                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                        <Link href={`/blogs/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      <p className="mt-3 text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-3">
                        {blog.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                      {/* Author Info */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-xs uppercase font-[family-name:var(--font-outfit)]">
                          {blog.author_name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-white/90">
                            {blog.author_name}
                          </span>
                          {blog.author_role && (
                            <span className="text-[10px] text-white/40">
                              {blog.author_role}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Read More Button */}
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-white transition-colors group/btn"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Bottom Callout / Pitch Section */}
          <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.02] via-[#D4AF37]/[0.04] to-white/[0.02] p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="max-w-xl mx-auto relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-3">
                <Sparkles className="w-3 h-3" /> E-Cell Publishing Platform
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Have an idea, startup learning, or research insight?
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-white/60 leading-relaxed">
                Submit your article to the E-Cell JNCT PU editorial board. Once reviewed and approved by the team, your blog will be featured across our official website and community channels.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/blogs/submit"
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#D4AF37] text-black hover:bg-[#e0bc43] transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center gap-2"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Submit an Article for Review</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-black text-center text-xs text-white/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-[family-name:var(--font-outfit)] text-xs text-white/40">
            © {new Date().getFullYear()} E-CELL JNCT PROFESSIONAL UNIVERSITY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 text-white/40">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            <Link href="/blogs" className="text-[#D4AF37]">Blogs</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
