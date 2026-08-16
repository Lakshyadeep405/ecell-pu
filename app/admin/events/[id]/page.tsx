"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles, 
  Save, 
  Upload, 
  FileText, 
  HelpCircle,
  CheckSquare
} from "lucide-react";

interface CustomField {
  field_label: string;
  field_type: "text" | "number" | "textarea" | "select" | "file";
  options: string[];
  required: boolean;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Event core fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "closed">("published");

  // Dynamic Custom Fields
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/events/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load event details.");
      }

      const event = data.event;
      setTitle(event.title || "");
      setDescription(event.description || "");
      
      // Format the ISO date string to YYYY-MM-DDTHH:MM for datetime-local input
      if (event.date) {
        const d = new Date(event.date);
        const pad = (n: number) => String(n).padStart(2, "0");
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        setDate(`${year}-${month}-${day}T${hours}:${minutes}`);
      }

      setVenue(event.venue || "");
      setBannerUrl(event.banner_url || "");
      setStatus(event.status || "published");

      // Format custom fields
      const formattedFields = (data.fields || []).map((f: any) => ({
        field_label: f.field_label || "",
        field_type: f.field_type || "text",
        options: f.options || [],
        required: f.required !== undefined ? f.required : true,
      }));
      setCustomFields(formattedFields);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields,
      { field_label: "", field_type: "text", options: [], required: true },
    ]);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, idx) => idx !== index));
  };

  const handleFieldChange = (index: number, key: keyof CustomField, value: any) => {
    setCustomFields(
      customFields.map((field, idx) => {
        if (idx === index) {
          return { ...field, [key]: value };
        }
        return field;
      })
    );
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validations
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      setError("Invalid file type. Only JPG, PNG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError("File is too large. Maximum allowed size is 5MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "banner");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload banner.");
      }

      setBannerUrl(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload image. Paste a direct link instead.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Validate fields
    if (customFields.some(f => !f.field_label.trim())) {
      setError("Please specify a label for all custom fields.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date,
          venue,
          banner_url: bannerUrl,
          status,
          fields: customFields,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update event.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred saving the event.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-xs font-black uppercase tracking-widest text-muted-foreground">
          Synchronizing event details...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header breadcrumb */}
      <div className="pb-6 border-b-2 border-border flex items-center justify-between">
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-border bg-background text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#D4AF37] transition-all cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-black uppercase tracking-tight">
            Modify <span className="gradient-text">Event Details</span>
          </h1>
          <p className="text-muted-foreground text-xs font-semibold">
            Edit your entrepreneurship event, update coordinates, or refine the signup form template.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 border-2 border-red-500 bg-red-500/10 text-red-500 text-xs font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Core Event Information */}
        <div className="bg-card border-2 border-border p-6 shadow-[3px_3px_0px_#D4AF37] space-y-6">
          <h3 className="font-[family-name:var(--font-outfit)] text-base font-black uppercase tracking-wide border-b-2 border-border pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            1. Core Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. StartUp Summit 2026"
                className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what the event is about, ticket pricing, prizes, speakers, etc."
                className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-sm rounded-none resize-none font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Venue *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Seminar Hall 3 / Online (Zoom)"
                className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
              />
            </div>

            {/* Banner image upload + direct url */}
            <div className="space-y-1.5 md:col-span-2 border-t border-border/10 pt-4">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Event Banner Image
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col justify-center p-4 border-2 border-dashed border-border bg-muted/20 text-center relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:pointer-events-none"
                  />
                  <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                  <span className="text-xs font-black uppercase tracking-wider text-foreground">
                    {uploading ? "Uploading banner..." : "Upload File"}
                  </span>
                  <span className="text-[9px] text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</span>
                </div>

                <div className="flex flex-col justify-center space-y-3">
                  <span className="text-[10px] font-bold text-center sm:text-left text-muted-foreground uppercase">
                    — OR — PASTE DIRECT LINK
                  </span>
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
                  />
                </div>
              </div>

              {bannerUrl && (
                <div className="mt-4 border-2 border-border p-2 bg-muted/20 w-fit max-w-md">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground block mb-2">Banner Preview</span>
                  <img src={bannerUrl} alt="Banner Preview" className="h-32 object-cover border border-border" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Registration Fields */}
        <div className="bg-card border-2 border-border p-6 shadow-[3px_3px_0px_#D4AF37] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-border pb-3">
            <h3 className="font-[family-name:var(--font-outfit)] text-base font-black uppercase tracking-wide flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#D4AF37]" />
              2. Form Fields Setup
            </h3>
            <button
              type="button"
              onClick={handleAddCustomField}
              className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-border bg-background text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#F9FAFB] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A0A0A] dark:hover:shadow-[3px_3px_0px_#F9FAFB] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Field</span>
            </button>
          </div>

          {/* Standard fields reminder */}
          <div className="p-4 border-2 border-[#D4AF37] bg-[#D4AF37]/5 text-xs">
            <span className="font-black uppercase tracking-wider text-[#D4AF37] block mb-1">Standard Base Fields (Always Included)</span>
            <p className="text-muted-foreground font-semibold leading-relaxed">
              Every registration form dynamically includes inputs for: <span className="text-foreground font-bold">Name, Phone number, Email address, College name, and Year of study</span>. Add custom fields only if you need extra details.
            </p>
          </div>

          {/* Custom field builder list */}
          {customFields.length === 0 ? (
            <div className="text-center py-10 border-dashed border-2 border-border bg-muted/10">
              <p className="text-muted-foreground text-xs font-semibold">
                No custom fields added. Only the standard registration form fields will be generated.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customFields.map((field, index) => (
                <div key={index} className="p-4 border-2 border-border bg-muted/20 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end relative">
                  
                  {/* Delete button absolute */}
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(index)}
                    className="absolute top-2 right-2 p-1.5 border border-transparent text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Remove Field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                      Field Label *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Team Name / Why do you want to join?"
                      value={field.field_label}
                      onChange={(e) => handleFieldChange(index, "field_label", e.target.value)}
                      className="w-full px-3 py-2 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-xs rounded-none"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                      Field Type
                    </label>
                    <select
                      value={field.field_type}
                      onChange={(e) => handleFieldChange(index, "field_type", e.target.value as any)}
                      className="w-full px-3 py-2 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-xs rounded-none cursor-pointer"
                    >
                      <option value="text">Text Input</option>
                      <option value="number">Number</option>
                      <option value="textarea">Paragraph Box</option>
                      <option value="select">Dropdown Menu</option>
                      <option value="file">File Upload (Screenshot/Resume)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5 flex items-center justify-start h-10 pb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
                        className="w-4 h-4 border-2 border-border accent-[#D4AF37]"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Required</span>
                    </label>
                  </div>

                  {field.field_type === "select" && (
                    <div className="sm:col-span-12 space-y-1.5 border-t border-border/10 pt-3">
                      <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                        Dropdown Options (comma-separated) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Option 1, Option 2, Option 3"
                        value={field.options.join(", ")}
                        onChange={(e) => 
                          handleFieldChange(
                            index, 
                            "options", 
                            e.target.value.split(",").map(v => v.trim()).filter(Boolean)
                          )
                        }
                        className="w-full px-3 py-2 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-xs rounded-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Event triggers */}
        <div className="bg-card border-2 border-border p-6 shadow-[3px_3px_0px_#D4AF37] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Publish Status</span>
            <div className="flex gap-4 mt-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="w-4 h-4 border-2 border-border accent-[#D4AF37]"
                />
                <span className="text-xs font-black uppercase tracking-wider">Publish Immediately</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="w-4 h-4 border-2 border-border accent-[#D4AF37]"
                />
                <span className="text-xs font-black uppercase tracking-wider">Save as Draft</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="closed"
                  checked={status === "closed"}
                  onChange={() => setStatus("closed")}
                  className="w-4 h-4 border-2 border-border accent-[#D4AF37]"
                />
                <span className="text-xs font-black uppercase tracking-wider">Close Event</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full sm:w-auto px-8 py-3.5 border-2 border-border bg-[#D4AF37] text-black font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F9FAFB] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] dark:hover:shadow-[6px_6px_0px_#F9FAFB] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Updating Event Details..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
