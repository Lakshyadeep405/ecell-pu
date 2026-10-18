"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  Check, 
  X, 
  Trash2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  Sparkles, 
  Eye, 
  ExternalLink,
  Filter,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogPost, INITIAL_BLOGS } from "@/lib/blogs";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "published" | "rejected">("pending");
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      
      let fetchedList: BlogPost[] = [];
      if (res.ok && data.success && data.blogs) {
        fetchedList = data.blogs;
      } else {
        fetchedList = INITIAL_BLOGS;
      }

      // Check for any locally submitted blogs in localStorage (for fallback testing)
      try {
        const stored = localStorage.getItem("local_pending_blogs");
        if (stored) {
          const locals: BlogPost[] = JSON.parse(stored);
          // Merge avoiding duplicates by id or slug
          locals.forEach((local) => {
            if (!fetchedList.some((b) => b.id === local.id || b.slug === local.slug)) {
              fetchedList.unshift(local);
            }
          });
        }
      } catch {
        // ignore
      }

      setBlogs(fetchedList);
    } catch (err: any) {
      console.warn("Falling back to initial blogs:", err);
      setBlogs(INITIAL_BLOGS);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "published" | "rejected") => {
    try {
      setActionMessage(null);
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update state locally
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );

      // If updating preview modal
      if (previewBlog && previewBlog.id === id) {
        setPreviewBlog({ ...previewBlog, status: newStatus });
      }

      // Also sync localStorage if present
      try {
        const stored = localStorage.getItem("local_pending_blogs");
        if (stored) {
          const locals: BlogPost[] = JSON.parse(stored);
          const updated = locals.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
          localStorage.setItem("local_pending_blogs", JSON.stringify(updated));
        }
      } catch {
        // ignore
      }

      setActionMessage(
        newStatus === "published"
          ? "Blog post confirmed and published to the website!"
          : "Blog post rejected."
      );
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setError("Failed to update blog status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this blog post?")) {
      return;
    }

    try {
      await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });

      setBlogs((prev) => prev.filter((b) => b.id !== id));
      if (previewBlog && previewBlog.id === id) {
        setPreviewBlog(null);
      }

      try {
        const stored = localStorage.getItem("local_pending_blogs");
        if (stored) {
          const locals: BlogPost[] = JSON.parse(stored);
          const updated = locals.filter((b) => b.id !== id);
          localStorage.setItem("local_pending_blogs", JSON.stringify(updated));
        }
      } catch {
        // ignore
      }

      setActionMessage("Blog removed.");
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete blog.");
    }
  };

  // Counts
  const pendingCount = useMemo(() => blogs.filter((b) => b.status === "pending").length, [blogs]);
  const publishedCount = useMemo(() => blogs.filter((b) => b.status === "published").length, [blogs]);
  const rejectedCount = useMemo(() => blogs.filter((b) => b.status === "rejected").length, [blogs]);

  // Filtered list
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesStatus =
        statusFilter === "all" ? true : blog.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [blogs, statusFilter, searchQuery]);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editorial Review Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-[family-name:var(--font-outfit)] font-black tracking-tight text-foreground">
            Blog Submissions & Approvals
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review community blog posts submitted by students. Confirm and approve them to make them live on the public site.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blogs"
            target="_blank"
            className="clay-btn clay-btn-secondary flex items-center gap-2 px-3.5 py-2 text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>View Live Blogs</span>
          </Link>
          <button
            onClick={fetchBlogs}
            className="clay-btn clay-btn-secondary px-3.5 py-2 text-xs"
          >
            Refresh
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Status filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          <button
            onClick={() => setStatusFilter("pending")}
            className={cn(
              "clay-btn px-4 py-2 text-xs flex items-center gap-2 whitespace-nowrap transition-all",
              statusFilter === "pending"
                ? "clay-btn-primary font-bold"
                : "clay-btn-secondary text-muted-foreground"
            )}
          >
            <span>Pending Review</span>
            <span
              className={cn(
                "px-1.5 py-0.2 text-[10px] rounded-full font-bold",
                pendingCount > 0
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("published")}
            className={cn(
              "clay-btn px-4 py-2 text-xs flex items-center gap-2 whitespace-nowrap transition-all",
              statusFilter === "published"
                ? "clay-btn-primary font-bold"
                : "clay-btn-secondary text-muted-foreground"
            )}
          >
            <span>Published</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-muted text-muted-foreground font-bold">
              {publishedCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("rejected")}
            className={cn(
              "clay-btn px-4 py-2 text-xs flex items-center gap-2 whitespace-nowrap transition-all",
              statusFilter === "rejected"
                ? "clay-btn-primary font-bold"
                : "clay-btn-secondary text-muted-foreground"
            )}
          >
            <span>Rejected</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-muted text-muted-foreground font-bold">
              {rejectedCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("all")}
            className={cn(
              "clay-btn px-4 py-2 text-xs whitespace-nowrap transition-all",
              statusFilter === "all"
                ? "clay-btn-primary font-bold"
                : "clay-btn-secondary text-muted-foreground"
            )}
          >
            All ({blogs.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Blogs Listing */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-xs animate-pulse">
          Loading blog submissions...
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-16 clay-card p-8 border border-border rounded-2xl">
          <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground">No submissions found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {statusFilter === "pending"
              ? "All submitted blogs have been reviewed! There are no pending requests right now."
              : "No blogs match the selected status or search query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="clay-card p-5 sm:p-6 rounded-2xl border border-border bg-card/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-border/80 transition-all"
            >
              {/* Blog info */}
              <div className="space-y-2 flex-grow max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      blog.status === "pending" && "bg-amber-500/20 text-amber-400 border border-amber-500/30",
                      blog.status === "published" && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
                      blog.status === "rejected" && "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    )}
                  >
                    {blog.status}
                  </span>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {blog.category}
                  </span>

                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    {blog.read_time}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {blog.title}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {blog.summary || blog.content.slice(0, 140) + "..."}
                </p>

                {/* Author Info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="font-semibold text-foreground">
                    By: {blog.author_name}
                  </span>
                  {blog.author_role && <span>({blog.author_role})</span>}
                  {blog.author_email && (
                    <span className="text-[11px] text-[#D4AF37]/80">
                      ✉ {blog.author_email}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground/60">
                    • Submitted: {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-2 self-stretch md:self-center justify-end flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                {/* Preview Button */}
                <button
                  onClick={() => setPreviewBlog(blog)}
                  className="clay-btn clay-btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5"
                  title="Read full blog text"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                {/* Approve Button */}
                {blog.status !== "published" && (
                  <button
                    onClick={() => handleUpdateStatus(blog.id, "published")}
                    className="clay-btn clay-btn-primary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 text-black bg-[#D4AF37] hover:bg-[#e0bc43]"
                    title="Confirm and publish to website"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm & Publish</span>
                  </button>
                )}

                {/* Reject Button */}
                {blog.status !== "rejected" && (
                  <button
                    onClick={() => handleUpdateStatus(blog.id, "rejected")}
                    className="clay-btn clay-btn-secondary px-3 py-2 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    title="Reject blog post"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="p-2 text-muted-foreground hover:text-rose-400 transition-colors"
                  title="Delete permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewBlog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Submission Preview
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {previewBlog.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewBlog(null)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed">
              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <div>
                  <div className="font-bold text-foreground">{previewBlog.author_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {previewBlog.author_role || "No role specified"}
                    {previewBlog.author_email ? ` • ${previewBlog.author_email}` : ""}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-card border border-border">
                    {previewBlog.category}
                  </span>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {previewBlog.read_time}
                  </div>
                </div>
              </div>

              {previewBlog.summary && (
                <div className="p-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 italic text-xs text-[#D4AF37]">
                  "{previewBlog.summary}"
                </div>
              )}

              {previewBlog.cover_image && (
                <div className="rounded-xl overflow-hidden border border-border h-48 w-full">
                  <img
                    src={previewBlog.cover_image}
                    alt={previewBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4 pt-2">
                {previewBlog.content.split(/\n\s*\n/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 border-t border-border bg-card/80 flex items-center justify-between">
              <div className="text-xs">
                Status:{" "}
                <span className="font-bold uppercase text-[#D4AF37]">
                  {previewBlog.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {previewBlog.status !== "published" && (
                  <button
                    onClick={() => handleUpdateStatus(previewBlog.id, "published")}
                    className="clay-btn clay-btn-primary px-4 py-2 text-xs font-bold bg-[#D4AF37] text-black"
                  >
                    Confirm & Publish
                  </button>
                )}
                {previewBlog.status !== "rejected" && (
                  <button
                    onClick={() => handleUpdateStatus(previewBlog.id, "rejected")}
                    className="clay-btn clay-btn-secondary px-4 py-2 text-xs text-rose-400"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => setPreviewBlog(null)}
                  className="clay-btn clay-btn-secondary px-4 py-2 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
