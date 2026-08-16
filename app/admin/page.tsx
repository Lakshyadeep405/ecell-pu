"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CalendarDays, 
  Plus, 
  Trash2, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileSpreadsheet, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  banner_url?: string;
  status: "draft" | "published" | "closed";
  created_at: string;
  registrations_count: number;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ eventsCount: 0, registrationsCount: 0, pendingRequests: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch events
      const eventsRes = await fetch("/api/admin/events");
      const eventsData = await eventsRes.json();
      if (!eventsRes.ok || !eventsData.success) {
        throw new Error(eventsData.error || "Failed to load events");
      }

      // 2. Fetch join requests to count pending ones
      const requestsRes = await fetch("/api/admin/join-requests");
      const requestsData = await requestsRes.json();
      const pendingCount = requestsData.success 
        ? requestsData.requests.filter((r: any) => r.status === "pending").length 
        : 0;

      const eventsList: EventItem[] = eventsData.events || [];
      setEvents(eventsList);

      // Compute stats
      const totalRegs = eventsList.reduce((sum, e) => sum + e.registrations_count, 0);
      setStats({
        eventsCount: eventsList.length,
        registrationsCount: totalRegs,
        pendingRequests: pendingCount
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred loading dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "draft" | "published" | "closed") => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      // Update state locally
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err: any) {
      alert(err.message || "Error updating event status");
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete the event "${title}"? All submitted registrations for this event will be deleted as well.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete event");
      }

      // Update state locally
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setStats((prev) => ({
        ...prev,
        eventsCount: prev.eventsCount - 1
      }));
    } catch (err: any) {
      alert(err.message || "Error deleting event");
    }
  };

  const getStatusBadge = (status: "draft" | "published" | "closed") => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-2.5 py-1 border border-green-500/20 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-500 bg-red-500/10 px-2.5 py-1 border border-red-500/20 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]">
            <XCircle className="w-3 h-3" />
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-yellow-500 bg-yellow-500/10 px-2.5 py-1 border border-yellow-500/20 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]">
            <Clock className="w-3 h-3" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-10">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <span className="clay-badge px-2.5 py-1 mb-3 bg-background/50 text-foreground">
            Overview
          </span>
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl font-black uppercase tracking-tight">
            Events <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-xs font-semibold mt-2">
            Schedule and publish new entrepreneurship events, build sign-up forms, and export student responses.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="clay-btn clay-btn-primary flex items-center justify-center gap-2 px-6 py-3 text-xs w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Event</span>
        </Link>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 clay-card flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Events</p>
            <h3 className="font-[family-name:var(--font-outfit)] text-3xl font-black mt-1 text-foreground">
              {loading ? "..." : stats.eventsCount}
            </h3>
          </div>
          <CalendarDays className="w-8 h-8 text-[#D4AF37]" />
        </div>

        <div className="p-6 clay-card flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Registrations</p>
            <h3 className="font-[family-name:var(--font-outfit)] text-3xl font-black mt-1 text-foreground">
              {loading ? "..." : stats.registrationsCount}
            </h3>
          </div>
          <Users className="w-8 h-8 text-[#D4AF37]" />
        </div>

        <div className="p-6 clay-card flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Pending Join Requests</p>
            <h3 className="font-[family-name:var(--font-outfit)] text-3xl font-black mt-1 text-foreground">
              {loading ? "..." : stats.pendingRequests}
            </h3>
          </div>
          <Plus className="w-8 h-8 text-[#D4AF37]" />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 clay-card-red text-red-500 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Main events table */}
      <div className="overflow-hidden clay-card">
        <div className="p-4 border-b border-border bg-muted/40 font-black uppercase text-[10px] tracking-widest text-muted-foreground">
          Event Lists
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Synchronizing data files...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border m-4 bg-muted/10 rounded-2xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.02)]">
            <p className="text-muted-foreground text-xs font-black uppercase tracking-wider mb-6">
              No events found in the database.
            </p>
            <Link
              href="/admin/events/new"
              className="clay-btn clay-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              Create First Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground w-1/3">Event Detail</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Date & Venue</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground text-center">Entries</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-muted/10">
                    <td className="p-4 align-top">
                      <div className="font-[family-name:var(--font-outfit)] font-black uppercase text-foreground leading-tight">
                        {event.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {event.description || "No description provided."}
                      </div>
                    </td>
                    <td className="p-4 align-top text-xs font-semibold text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-foreground font-black">
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="mt-1 font-medium">{event.venue}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(event.status)}
                        
                        {/* Status togglers */}
                        <select
                          value={event.status}
                          onChange={(e) => handleUpdateStatus(event.id, e.target.value as any)}
                          className="text-[9px] font-bold border bg-background px-1.5 py-0.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer clay-input"
                        >
                          <option value="draft">Set to Draft</option>
                          <option value="published">Publish Event</option>
                          <option value="closed">Close Event</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 align-top text-center">
                      <Link
                        href={`/admin/events/${event.id}/entries`}
                        className="clay-btn clay-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>{event.registrations_count}</span>
                      </Link>
                    </td>
                    <td className="p-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/events/${event.id}/register`}
                          target="_blank"
                          className="clay-btn clay-btn-secondary p-2"
                          title="View Registration Form"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="clay-btn clay-btn-secondary p-2"
                          title="Edit Event"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="clay-btn clay-btn-secondary p-2 text-red-500 hover:bg-red-500/10"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
