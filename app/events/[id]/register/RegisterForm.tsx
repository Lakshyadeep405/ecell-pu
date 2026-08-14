"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Send, 
  Upload, 
  Phone, 
  User, 
  Mail, 
  School, 
  GraduationCap, 
  ExternalLink,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldItem {
  id: string;
  field_label: string;
  field_type: "text" | "number" | "textarea" | "select" | "file";
  options: string[];
  required: boolean;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  banner_url?: string;
  status: "draft" | "published" | "closed";
}

interface RegisterFormProps {
  event: EventItem;
  fields: FieldItem[];
}

export default function RegisterForm({ event, fields }: RegisterFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({
    Name: "",
    Email: "",
    Phone: "",
    College: "JNCTPU",
    Year: "1st Year",
  });

  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploading((prev) => ({ ...prev, [label]: true }));
    setError(null);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `registrations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("ecell-assets")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        throw new Error(
          uploadError.message + 
          ". Note: Ensure a public bucket named 'ecell-assets' exists in your Supabase."
        );
      }

      const { data } = supabase.storage.from("ecell-assets").getPublicUrl(filePath);
      handleInputChange(label, data.publicUrl);
    } catch (err: any) {
      console.error(err);
      setError(`File upload failed: ${err.message}`);
    } finally {
      setFileUploading((prev) => ({ ...prev, [label]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Dynamic field validation
    for (const field of fields) {
      if (field.required && (!formData[field.field_label] || !String(formData[field.field_label]).trim())) {
        setError(`Custom field '${field.field_label}' is required.`);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submitted_data: formData }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit registration.");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  // Generate WhatsApp redirect URL with prefilled text
  const getWhatsAppLink = () => {
    const coordinatorPhone = "919999999999"; // Replace with E-Cell coordinator WhatsApp number
    const text = `Hi E-Cell team, I've registered for "${event.title}"!\nName: ${formData.Name}\nEmail: ${formData.Email}\nCollege: ${formData.College}`;
    return `https://wa.me/${coordinatorPhone}?text=${encodeURIComponent(text)}`;
  };

  if (success) {
    return (
      <div className="w-full max-w-lg bg-card border-2 border-border p-8 shadow-[6px_6px_0px_#D4AF37] text-center space-y-6 relative overflow-hidden bg-[linear-gradient(to_right,var(--border-pattern)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-pattern)_1px,transparent_1px)] bg-[size:16px_16px]">
        {/* Success badge */}
        <div className="w-16 h-16 bg-[#00FF66]/10 border-2 border-[#00FF66] text-[#00FF66] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_#F9FAFB]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block text-[0.55rem] font-bold tracking-[0.2em] uppercase text-foreground border-2 border-foreground rounded-none px-2.5 py-1 mb-2 bg-background shadow-[2px_2px_0px_#00FF66]">
            Registration Complete
          </span>
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-black uppercase text-foreground">
            You&apos;re <span className="gradient-text">Registered!</span>
          </h2>
          <p className="text-muted-foreground text-xs font-semibold leading-relaxed max-w-sm mx-auto">
            Your details have been successfully logged. Please join the WhatsApp event group or contact coordinators to complete verification.
          </p>
        </div>

        {/* WhatsApp redirect button */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/events"
            className="px-6 py-3 border-2 border-border bg-background text-foreground font-black uppercase text-xs tracking-wider transition-all duration-150 shadow-[3px_3px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#D4AF37]"
          >
            All Events
          </Link>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border-2 border-border bg-[#00FF66] text-black font-black uppercase text-xs tracking-wider transition-all duration-150 shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-card border-2 border-border p-8 shadow-[6px_6px_0px_#D4AF37] relative overflow-hidden bg-[linear-gradient(to_right,var(--border-pattern)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-pattern)_1px,transparent_1px)] bg-[size:16px_16px]">
      
      {/* Dynamic top badge */}
      <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] font-black uppercase px-4 py-1.5 border-b-2 border-l-2 border-border flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        Register
      </div>

      <div className="mb-8 mt-2">
        <span className="inline-block text-[0.55rem] font-bold tracking-[0.2em] uppercase text-foreground border-2 border-foreground rounded-none px-2.5 py-1 mb-4 bg-background shadow-[2px_2px_0px_#00FF66]">
          Event Registration
        </span>
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl sm:text-3xl font-black uppercase text-foreground tracking-tight leading-none truncate">
          {event.title}
        </h1>
        <p className="text-muted-foreground text-xs font-semibold mt-3 leading-relaxed">
          {event.description || "Register today by submitting your details."}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border-2 border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* ── Standard core fields ── */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
            Full Name *
          </label>
          <input
            type="text"
            required
            disabled={loading}
            placeholder="Enter your name"
            value={formData.Name}
            onChange={(e) => handleInputChange("Name", e.target.value)}
            className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold placeholder:text-muted-foreground/35 focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
            Email Address *
          </label>
          <input
            type="email"
            required
            disabled={loading}
            placeholder="e.g. you@example.com"
            value={formData.Email}
            onChange={(e) => handleInputChange("Email", e.target.value)}
            className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold placeholder:text-muted-foreground/35 focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            WhatsApp Phone Number *
          </label>
          <input
            type="tel"
            required
            disabled={loading}
            placeholder="e.g. +91 98765 43210"
            value={formData.Phone}
            onChange={(e) => handleInputChange("Phone", e.target.value)}
            className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold placeholder:text-muted-foreground/35 focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-[#D4AF37]" />
            College Name *
          </label>
          <input
            type="text"
            required
            disabled={loading}
            placeholder="e.g. JNCTPU"
            value={formData.College}
            onChange={(e) => handleInputChange("College", e.target.value)}
            className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold placeholder:text-muted-foreground/35 focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
            Year of Study *
          </label>
          <select
            disabled={loading}
            value={formData.Year}
            onChange={(e) => handleInputChange("Year", e.target.value)}
            className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-sm rounded-none cursor-pointer"
          >
            <option value="1st Year">1st Year (Freshman)</option>
            <option value="2nd Year">2nd Year (Sophomore)</option>
            <option value="3rd Year">3rd Year (Junior)</option>
            <option value="4th Year">4th Year (Senior)</option>
            <option value="Other">Other / Alumnus</option>
          </select>
        </div>

        {/* ── Dynamic custom fields ── */}
        {fields.map((field) => {
          const key = field.field_label;
          const isUploading = !!fileUploading[key];

          return (
            <div key={field.id} className="space-y-1.5 border-t border-border/10 pt-3">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                {field.field_label} {field.required && "*"}
              </label>

              {field.field_type === "textarea" ? (
                <textarea
                  rows={3}
                  required={field.required}
                  disabled={loading}
                  value={formData[key] || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  placeholder="Type your response..."
                  className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold placeholder:text-muted-foreground/35 focus:outline-none focus:border-[#D4AF37] text-sm rounded-none resize-none"
                />
              ) : field.field_type === "select" ? (
                <select
                  required={field.required}
                  disabled={loading}
                  value={formData[key] || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold focus:outline-none focus:border-[#D4AF37] text-sm rounded-none cursor-pointer"
                >
                  <option value="" disabled>Select an option</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.field_type === "file" ? (
                <div className="space-y-2">
                  <div className="flex flex-col justify-center p-4 border-2 border-dashed border-border bg-muted/20 text-center relative">
                    <input
                      type="file"
                      required={field.required && !formData[key]}
                      onChange={(e) => handleFileUpload(e, key)}
                      disabled={loading || isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:pointer-events-none"
                    />
                    <Upload className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-foreground">
                      {isUploading ? "Uploading file..." : formData[key] ? "Change File" : "Upload File"}
                    </span>
                  </div>
                  {formData[key] && (
                    <div className="flex items-center gap-2 text-xs font-bold text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Upload completed successfully!</span>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type={field.field_type}
                  required={field.required}
                  disabled={loading}
                  placeholder={field.field_type === "number" ? "e.g. 5" : "Enter details"}
                  value={formData[key] || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full px-4 py-3 bg-background border-2 border-border text-foreground font-semibold placeholder:text-muted-foreground/35 focus:outline-none focus:border-[#D4AF37] text-sm rounded-none"
                />
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={loading || Object.values(fileUploading).some(Boolean)}
          className="w-full py-4 border-2 border-border bg-[#D4AF37] text-black font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F9FAFB] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] dark:hover:shadow-[6px_6px_0px_#F9FAFB] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-4"
        >
          <Send className="w-4 h-4" />
          {loading ? "Registering..." : "Confirm Event Registration"}
        </button>
      </form>
    </div>
  );
}
