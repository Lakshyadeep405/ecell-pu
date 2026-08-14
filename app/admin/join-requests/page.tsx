"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  Users2,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JoinRequest {
  id: string;
  name: string;
  phone: string;
  college: string;
  year: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function JoinRequestsAdminPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/join-requests");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch join requests");
      }
      setRequests(data.requests || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred loading join requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/join-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update request status");
      }

      // Update locally
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err: any) {
      alert(err.message || "Error updating request status.");
    }
  };

  const handleQuickAddMember = async (req: JoinRequest) => {
    const role = prompt("Specify this member's role (e.g. CORE MEMBER, DEVELOPER, DESIGNER):", "CORE MEMBER");
    if (role === null) return; // cancelled

    const domainInput = prompt("Specify department domain (core / technical / creatives / marketing / operations):", "core");
    if (domainInput === null) return;
    const domain = ["core", "technical", "creatives", "marketing", "operations"].includes(domainInput.trim().toLowerCase())
      ? domainInput.trim().toLowerCase()
      : "core";

    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: req.name,
          role,
          domain,
          display_order: 10,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add member to team");
      }

      // Automatically approve their join request since they've been added to team
      await handleUpdateStatus(req.id, "approved");
      alert(`${req.name} has been successfully added to the official squad and approved!`);
    } catch (err: any) {
      alert("Failed to add member to squad: " + err.message);
    }
  };

  const getStatusBadge = (status: JoinRequest["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-0.5 border border-green-500/20">
            <Check className="w-2.5 h-2.5" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-0.5 border border-red-500/20">
            <X className="w-2.5 h-2.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-yellow-500 bg-yellow-500/10 px-2 py-0.5 border border-yellow-500/20">
            <Clock className="w-2.5 h-2.5" />
            Pending
          </span>
        );
    }
  };

  const filteredRequests = requests.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.year.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Page Header */}
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
            Join <span className="gradient-text">Requests</span>
          </h1>
          <p className="text-muted-foreground text-xs font-semibold">
            Track student sign-ups requesting to join the E-Cell JNCTPU community network.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 border-2 border-red-500 bg-red-500/10 text-red-500 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Main requests queue table */}
      <div className="bg-card border-2 border-border shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F9FAFB] overflow-hidden">
        <div className="p-4 border-b-2 border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Applications ({filteredRequests.length})
          </span>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-background border-2 border-border text-foreground font-semibold placeholder-muted-foreground/50 focus:outline-none focus:border-[#D4AF37] text-xs rounded-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Retrieving queue items...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-24 m-4 border-dashed border-2 border-border bg-muted/10">
            <AlertCircle className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
            <p className="text-muted-foreground text-xs font-black uppercase tracking-wider">
              No join requests received yet.
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-24 m-4 border-dashed border-2 border-border bg-muted/10">
            <p className="text-muted-foreground text-xs font-semibold">
              No applications match your filter query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-border bg-muted/10">
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Applicant Info</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">College Details</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Submitted At</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground text-right">Approve / Reject Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/10">
                    <td className="p-4 align-middle">
                      <div className="font-[family-name:var(--font-outfit)] font-black uppercase text-foreground">
                        {req.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                        <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
                        <span>{req.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle font-semibold text-muted-foreground">
                      <div className="text-foreground font-black">{req.college}</div>
                      <div className="mt-0.5 text-[10px]">{req.year} Year of study</div>
                    </td>
                    <td className="p-4 align-middle">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground font-semibold">
                      {new Date(req.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req.id, "approved")}
                              className="p-1.5 border-2 border-border bg-[#00FF66]/10 text-green-500 hover:bg-[#00FF66] hover:text-black cursor-pointer transition-all"
                              title="Approve Applicant"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, "rejected")}
                              className="p-1.5 border-2 border-border bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer transition-all"
                              title="Reject Applicant"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {req.status === "approved" && (
                          <button
                            onClick={() => handleQuickAddMember(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-border bg-background hover:bg-[#D4AF37] hover:text-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] cursor-pointer transition-all"
                            title="Add to Official Team"
                          >
                            <Users2 className="w-3.5 h-3.5" />
                            <span>Add to Team</span>
                          </button>
                        )}
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
