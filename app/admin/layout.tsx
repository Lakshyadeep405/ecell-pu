"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  CalendarDays, 
  Users2, 
  UserCheck, 
  LogOut, 
  Globe, 
  LayoutDashboard, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If we are on the login page, render children directly without the sidebar layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: "Events Dashboard", href: "/admin", icon: CalendarDays },
    { name: "Manage Team", href: "/admin/members", icon: Users2 },
    { name: "Join Requests", href: "/admin/join-requests", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row select-none">
      {/* Mobile Header Bar */}
      <header className="md:hidden border-b border-border p-4 bg-card flex justify-between items-center z-50 sticky top-0">
        <div className="font-[family-name:var(--font-outfit)] text-base font-black tracking-tight flex items-center gap-1.5">
          <span className="text-[#D4AF37]">E-Cell</span>
          <span className="text-black bg-[#D4AF37] text-[9px] font-black border border-border px-1.5 py-0.5 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]">ADMIN</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="clay-btn clay-btn-secondary p-2"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar navigation */}
      <aside
        className={cn(
          "w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border flex flex-col justify-between flex-shrink-0 z-40",
          "fixed md:sticky top-[61px] md:top-0 h-[calc(100vh-61px)] md:h-screen transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col p-6">
          {/* Logo */}
          <div className="hidden md:flex font-[family-name:var(--font-outfit)] text-xl font-black tracking-tight flex-col gap-1 mb-8">
            <span className="text-foreground">E-CELL JNCTPU</span>
            <span className="w-fit text-[9px] font-black text-black bg-[#D4AF37] border border-border px-2 py-0.5 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]">
              CONTROL PANEL
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "clay-btn flex items-center gap-3.5 px-4.5 py-3 text-xs transition-all duration-150",
                    isActive
                      ? "clay-btn-primary"
                      : "clay-btn-secondary"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-border space-y-3 bg-muted/20">
          <Link
            href="/"
            className="clay-btn clay-btn-secondary flex items-center justify-center gap-2 w-full py-2.5 text-xs"
          >
            <Globe className="w-4 h-4" />
            <span>Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="clay-btn clay-btn-secondary flex items-center justify-center gap-2 w-full py-2.5 text-xs text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main dashboard content */}
      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow p-6 sm:p-10 max-w-6xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="py-6 px-10 border-t border-border text-center md:text-left bg-card mt-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
            E-Cell JNCT PU • Entrepreneurship Panel
          </p>
          <p className="text-[10px] text-muted-foreground font-semibold">
            © 2026 E-Cell JNCTPU. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
