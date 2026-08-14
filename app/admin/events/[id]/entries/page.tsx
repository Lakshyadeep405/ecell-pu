"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Sparkles, 
  Calendar, 
  UserCheck, 
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";

interface RegistrationItem {
  id: string;
  event_id: string;
  submitted_data: Record<string, any>;
  created_at: string;
}

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
}

export default function EventEntriesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (id) fetchEntries();
  }, [id]);

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/events/${id}/entries`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load event registrations.");
      }

      setEvent(data.event);
      setRegistrations(data.registrations || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred loading registrations.");
    } finally {
      setLoading(false);
    }
  };

  // Find all unique keys present in the submitted_data of all registrations to generate columns
  // Standard fields first to keep order consistent: Name, Email, Phone, College, Year, then others.
  const getColumns = () => {
    const defaultOrder = ["Name", "Email", "Phone", "College", "Year"];
    const allKeys = new Set<string>();

    registrations.forEach((reg) => {
      if (reg.submitted_data) {
        Object.keys(reg.submitted_data).forEach((k) => allKeys.add(k));
      }
    });

    const customKeys = Array.from(allKeys).filter((k) => !defaultOrder.includes(k));
    const finalColumns = defaultOrder.filter((d) => allKeys.has(d)).concat(customKeys);
    
    // Fallback if no registrations yet
    return finalColumns.length > 0 ? finalColumns : defaultOrder;
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const searchLower = searchQuery.toLowerCase();
    return Object.values(reg.submitted_data || {}).some((val) => 
      String(val).toLowerCase().includes(searchLower)
    );
  });

  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const columns = getColumns();
    const headers = [...columns, "Submission Time"];
    
    const csvRows = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","), // Headers row
      ...filteredRegistrations.map((reg) => {
        const rowValues = columns.map((col) => {
          const val = reg.submitted_data[col] || "";
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        // Append created_at formatted
        const time = new Date(reg.created_at).toLocaleString("en-IN");
        rowValues.push(`"${time}"`);
        return rowValues.join(",");
      })
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Registrations-${event?.title || "Event"}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = getColumns();

  return (
    <div className="space-y-10">
      {/* Navigation and titles */}
      <div className="pb-6 border-b-2 border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-border bg-background text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#D4AF37] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#D4AF37] transition-all cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-black uppercase tracking-tight">
            Event <span className="gradient-text">Registrations</span>
          </h1>
          {event && (
            <div className="flex flex-wrap gap-4 mt-2 text-xs font-bold text-muted-foreground uppercase">
              <span className="flex items-center gap-1.5 text-foreground bg-muted/40 border border-border px-2 py-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                {event.title}
              </span>
              <span className="flex items-center gap-1 border border-border px-2 py-0.5 bg-background">
                {event.venue}
              </span>
            </div>
          )}
        </div>

        {registrations.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-border bg-[#D4AF37] text-black font-black uppercase text-xs tracking-wider transition-all duration-150 shadow-[3px_3px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_#F9FAFB] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] dark:hover:shadow-[5px_5px_0px_#F9FAFB] cursor-pointer w-full md:w-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 border-2 border-red-500 bg-red-500/10 text-red-500 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Main Table view */}
      <div className="bg-card border-2 border-border shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F9FAFB] overflow-hidden">
        {/* Table controls */}
        <div className="p-4 border-b-2 border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Submissions ({filteredRegistrations.length})
          </span>
          
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-background border-2 border-border text-foreground font-semibold placeholder-muted-foreground/50 focus:outline-none focus:border-[#D4AF37] text-xs rounded-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Synchronizing data files...
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-24 m-4 border-dashed border-2 border-border bg-muted/10">
            <AlertCircle className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
            <p className="text-muted-foreground text-xs font-black uppercase tracking-wider">
              No registrations submitted yet for this event.
            </p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-24 m-4 border-dashed border-2 border-border bg-muted/10">
            <p className="text-muted-foreground text-xs font-bold">
              No entries found matching filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-border bg-muted/10">
                  {columns.map((col) => (
                    <th key={col} className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-muted/10">
                    {columns.map((col) => {
                      const value = reg.submitted_data[col];
                      const isFile = typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://")) && (value.includes("/ecell-assets/") || value.includes("supabase"));
                      
                      return (
                        <td key={col} className="p-4 align-middle font-semibold text-foreground">
                          {value === undefined || value === null || value === "" ? (
                            <span className="text-muted-foreground/30 font-medium">—</span>
                          ) : isFile ? (
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline font-bold"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>View File</span>
                            </a>
                          ) : (
                            <span className="line-clamp-2 select-text">{String(value)}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 align-middle text-muted-foreground font-semibold whitespace-nowrap">
                      {new Date(reg.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
