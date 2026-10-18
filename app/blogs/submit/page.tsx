"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  PenLine, 
  AlertCircle,
  HelpCircle,
  Image as ImageIcon
} from "lucide-react";

const CATEGORIES = [
  "Entrepreneurship",
  "Mindset & Innovation",
  "Tech & AI",
  "Startup Stories",
  "Student Journey",
  "Research & Insights",
];

const PRESET_IMAGES = [
  { label: "Startup Desk", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" },
  { label: "Brainstorming", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" },
  { label: "Innovation Lab", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80" },
  { label: "Pitch & Growth", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" },
];

export default function SubmitBlogPage() {
  const [formData, setFormData] = useState({
    title: "",
    author_name: "",
    author_role: "",
    author_email: "",
    category: "Entrepreneurship",
    summary: "",
    content: "",
    cover_image: PRESET_IMAGES[0].url,
  });

  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Please provide a title for your blog post.");
      return;
    }
    if (!formData.author_name.trim()) {
      setError("Please provide your name.");
      return;
    }
    if (wordCount < 15) {
      setError("Your blog content is too short. Please write at least a few thoughtful sentences.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/blogs/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit blog for review.");
      }

      // Store in localStorage for immediate local preview/testing in case admin is in mock mode
      try {
        const stored = localStorage.getItem("local_pending_blogs");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(data.blog || formData);
        localStorage.setItem("local_pending_blogs", JSON.stringify(list));
      } catch {
        // ignore
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 py-4 px-6 bg-black/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/blogs"
            className="liquid-glass flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/80 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blogs
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
      </nav>

      {/* Main Container */}
      <div className="py-12 px-4 flex-grow relative">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.05)_0%,_transparent_75%)]"
          aria-hidden
        />

        <div className="max-w-3xl mx-auto relative z-10">
          {success ? (
            /* Success confirmation card */
            <div className="text-center p-8 sm:p-12 rounded-3xl bg-[#0c0c0e] border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)]">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                Submission Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-4">
                Your blog is now under review!
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-semibold">{formData.author_name}</span>. Your blog post{" "}
                <span className="text-[#D4AF37] font-medium">"{formData.title}"</span> has been queued for editorial review. Once our student editorial board confirms it, it will be published live on the website!
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/blogs"
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#D4AF37] text-black hover:bg-[#e0bc43] transition-all"
                >
                  Explore Published Blogs
                </Link>
                <button
                  onClick={() => {
                    setFormData({
                      title: "",
                      author_name: "",
                      author_role: "",
                      author_email: "",
                      category: "Entrepreneurship",
                      summary: "",
                      content: "",
                      cover_image: PRESET_IMAGES[0].url,
                    });
                    setSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-all"
                >
                  Submit Another Article
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <div className="rounded-3xl bg-[#0c0c0e] border border-white/10 p-6 sm:p-10 shadow-2xl">
              {/* Form Header */}
              <div className="mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Public Editorial Desk</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Submit an Article or Idea
                </h1>
                <p className="text-xs sm:text-sm text-white/50 mt-1 leading-relaxed">
                  Anyone can write and submit a blog post. Every submission is carefully reviewed by the E-Cell JNCT PU team before going live.
                </p>

                {/* Tab switcher: Write vs Preview */}
                <div className="mt-6 flex items-center gap-2 bg-white/[0.04] p-1 rounded-full w-fit border border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === "write"
                        ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>Write</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === "preview"
                        ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {activeTab === "write" ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Article Title */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      Article Title <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Entrepreneurship: One Idea Can Change Everything"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                    />
                  </div>

                  {/* Author Name & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-2">
                        Your Full Name <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Saumya Chaurasiya"
                        value={formData.author_name}
                        onChange={(e) =>
                          setFormData({ ...formData, author_name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-2">
                        Your Branch / Role / College
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CS (AI) Student & E-Cell R&D Member"
                        value={formData.author_role}
                        onChange={(e) =>
                          setFormData({ ...formData, author_role: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#141416] border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-2">
                        Email (Optional, for approval notification)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. yourname@gmail.com"
                        value={formData.author_email}
                        onChange={(e) =>
                          setFormData({ ...formData, author_email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Summary / Excerpt */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      Short Summary / Hook (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="A short 1-2 sentence hook summarizing the key takeaway..."
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                    />
                  </div>

                  {/* Cover Image Presets */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      Cover Image Theme
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {PRESET_IMAGES.map((img) => (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, cover_image: img.url })}
                          className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                            formData.cover_image === img.url
                              ? "border-[#D4AF37] bg-[#D4AF37]/10"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.label}
                            className="w-full h-14 object-cover rounded-lg"
                          />
                          <span className="text-[10px] text-white/70 font-medium">
                            {img.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    <input
                      type="url"
                      placeholder="Or enter custom image URL: https://..."
                      value={formData.cover_image}
                      onChange={(e) =>
                        setFormData({ ...formData, cover_image: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                    />
                  </div>

                  {/* Blog Content */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-white/80">
                        Article Content <span className="text-[#D4AF37]">*</span>
                      </label>
                      <span className="text-[11px] text-white/40">
                        {wordCount} words
                      </span>
                    </div>
                    <textarea
                      required
                      rows={12}
                      placeholder="Write your article here... Use blank lines to separate paragraphs. Share your journey, insights, ideas, or challenges."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 leading-relaxed focus:outline-none focus:border-[#D4AF37]/60 transition-colors font-sans"
                    />
                  </div>

                  {/* Review Notice */}
                  <div className="p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-start gap-3">
                    <HelpCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/60 leading-relaxed">
                      All submitted articles undergo review by our admin board. Once confirmed, your article will be published to the E-Cell website with your name and author attribution.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider bg-[#D4AF37] text-black hover:bg-[#e0bc43] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.25)] disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Submitting for Review...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Blog for Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Live Preview Mode */
                <div className="space-y-6">
                  {formData.cover_image && (
                    <div className="h-48 sm:h-64 w-full rounded-2xl overflow-hidden border border-white/10">
                      <img
                        src={formData.cover_image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                      {formData.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-3 leading-snug">
                      {formData.title || "Your Blog Title Will Appear Here"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-sm uppercase">
                      {(formData.author_name || "A").charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {formData.author_name || "Author Name"}
                      </div>
                      <div className="text-[11px] text-white/50">
                        {formData.author_role || "Student / Contributor"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans">
                    {formData.content ? (
                      formData.content.split(/\n\s*\n/).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))
                    ) : (
                      <p className="text-white/30 italic">
                        Start writing in the "Write" tab to see your article preview here.
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setActiveTab("write")}
                      className="px-5 py-2 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      Return to Editing
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
