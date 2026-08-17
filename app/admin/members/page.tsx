"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Users2, 
  Save, 
  Search,
  Cpu,
  Palette,
  Megaphone,
  Wrench,
  ShieldCheck,
  FolderMinus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  domain: "core" | "technical" | "creatives" | "marketing" | "operations";
  photo_url?: string;
  display_order: number;
}

const DOMAINS = [
  { id: "core", label: "Core Team", Icon: ShieldCheck },
  { id: "technical", label: "Technical", Icon: Cpu },
  { id: "creatives", label: "Creatives & Design", Icon: Palette },
  { id: "marketing", label: "Marketing & PR", Icon: Megaphone },
  { id: "operations", label: "Operations", Icon: Wrench },
];

export default function MembersAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [domain, setDomain] = useState<TeamMember["domain"]>("core");
  const [photoUrl, setPhotoUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [uploading, setUploading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/members");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch members");
      }
      setMembers(data.members || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred loading squad members.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedMembers = async () => {
    if (!confirm("Are you sure you want to import the default 21 squad members into the database?")) {
      return;
    }
    setSeeding(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/members/seed", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to import default squad.");
      }
      fetchMembers();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred importing default squad.");
    } finally {
      setSeeding(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validations
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      alert("Invalid file type. Only JPG, PNG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert("File is too large. Maximum allowed size is 5MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "member");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload photo.");
      }

      setPhotoUrl(data.url);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Photo upload failed. Please try pasting a direct URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setDomain("core");
    setPhotoUrl("");
    setDisplayOrder("0");
  };

  const handleEditInit = (m: TeamMember) => {
    setEditingId(m.id);
    setName(m.name);
    setRole(m.role);
    setDomain(m.domain);
    setPhotoUrl(m.photo_url || "");
    setDisplayOrder(String(m.display_order));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    const payload = {
      name,
      role,
      domain,
      photo_url: photoUrl || null,
      display_order: parseInt(displayOrder) || 0,
    };

    try {
      const url = editingId ? `/api/admin/members/${editingId}` : "/api/admin/members";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save team member");
      }

      resetForm();
      fetchMembers();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error saving team member.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from E-Cell JNCTPU squad?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete member");
      }
      fetchMembers();
    } catch (err: any) {
      alert(err.message || "Error deleting member");
    }
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="pb-6 border-b border-border flex items-center justify-between">
        <div className="space-y-2">
          <Link
            href="/admin"
            className="clay-btn clay-btn-secondary inline-flex items-center gap-2 px-3 py-1.5 text-[10px] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-black uppercase tracking-tight">
            Manage <span className="gradient-text">Squad</span>
          </h1>
          <p className="text-muted-foreground text-xs font-semibold">
            Add team members, assign portfolios/roles, and dictate their public site layout display order.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 clay-card-red text-red-500 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Main split-screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Members List (7 cols) */}
        <div className="lg:col-span-7 overflow-hidden clay-card">
          <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Current Squad ({filteredMembers.length})
            </span>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search squad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border text-foreground font-semibold placeholder-muted-foreground/50 focus:outline-none focus:border-[#D4AF37] text-xs clay-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Retrieving squad rosters...
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 px-6 m-4 border border-dashed border-border bg-muted/10 rounded-2xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <FolderMinus className="w-8 h-8 text-[#D4AF37] mx-auto" />
              <div className="space-y-1">
                <p className="text-foreground text-sm font-black uppercase tracking-wider">
                  No squad members in DB
                </p>
                <p className="text-muted-foreground text-[10px] sm:text-xs max-w-md mx-auto leading-relaxed">
                  The public website is currently showing 21 default team members from code config.
                  Import them to the database now so you can edit their portfolios or delete them.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSeedMembers}
                disabled={seeding}
                className="clay-btn clay-btn-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-2"
              >
                {seeding ? "Importing..." : "Import Default Squad"}
              </button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-20 m-4 border border-dashed border-border bg-muted/10 rounded-2xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.02)]">
              <FolderMinus className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
              <p className="text-muted-foreground text-xs font-black uppercase tracking-wider">
                No squad members found matching search.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {filteredMembers.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/10">
                  <div className="flex items-center gap-4 min-w-0">
                    
                    {/* Member photo or placeholder */}
                    <div className="w-12 h-16 border border-border bg-muted flex-shrink-0 overflow-hidden relative rounded-xl shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_inset_-1px_-1px_2px_rgba(0,0,0,0.15)]">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground/50 text-[10px]">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-[family-name:var(--font-outfit)] font-black uppercase text-foreground leading-tight truncate">
                        {member.name}
                      </h4>
                      <p className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase mt-1">
                        {member.role}
                      </p>
                      
                      {/* Domain badge */}
                      <span className="clay-badge mt-2 text-[7px] bg-background/50 px-1.5 py-0.5">
                        {member.domain}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="clay-badge text-[10px] bg-background/50 px-2 py-1 mr-2" title="Display Order">
                      Order: {member.display_order}
                    </span>
                    <button
                      onClick={() => handleEditInit(member)}
                      className="clay-btn clay-btn-secondary p-2"
                      title="Edit Member"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id, member.name)}
                      className="clay-btn clay-btn-secondary p-2 text-red-500 hover:bg-red-500/10"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Form Editor (5 cols) */}
        <div className="lg:col-span-5 p-6 clay-card space-y-6">
          <h3 className="font-[family-name:var(--font-outfit)] text-base font-black uppercase tracking-wide border-b border-border pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users2 className="w-5 h-5 text-[#D4AF37]" />
              {editingId ? "Edit Squad Member" : "Add Squad Member"}
            </span>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="clay-btn clay-btn-secondary text-[9px] px-2 py-0.5"
              >
                Cancel
              </button>
            )}
          </h3>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kabir Singh"
                className="w-full px-3 py-2 bg-background border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-xs clay-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                Role / Portfolio *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. TECHNICAL HEAD"
                className="w-full px-3 py-2 bg-background border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-xs clay-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                Domain / Department
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as any)}
                className="w-full px-3 py-2 bg-background border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-xs clay-input cursor-pointer"
              >
                {DOMAINS.map(d => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="e.g. 0 (lower values show first)"
                className="w-full px-3 py-2 bg-background border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-xs clay-input"
              />
              <span className="text-[8px] text-muted-foreground block">
                Assign lower number to showcase them higher up in listings.
              </span>
            </div>

            {/* Photo Uploader */}
            <div className="space-y-1 pt-2 border-t border-border/10">
              <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">
                Profile Photo
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <div className="flex flex-col justify-center p-3 border border-dashed border-border bg-muted/20 rounded-2xl text-center relative h-20 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.02)]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:pointer-events-none"
                  />
                  <Upload className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-foreground">
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </span>
                </div>

                <div className="flex flex-col justify-center space-y-2">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase text-center sm:text-left">
                    — OR LINK URL —
                  </span>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://direct-link-to-photo.jpg"
                    className="w-full px-3.5 py-2 bg-background border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-[10px] clay-input"
                  />
                </div>
              </div>

              {photoUrl && (
                <div className="mt-3 border border-border p-1.5 bg-muted/20 w-fit rounded-2xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.02)]">
                  <img src={photoUrl} alt="Photo Preview" className="w-16 h-20 object-cover border border-border rounded-xl" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={formLoading || uploading}
              className="clay-btn clay-btn-primary w-full py-3.5 text-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-6"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingId ? "Save Member Details" : "Add to Squad"}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
