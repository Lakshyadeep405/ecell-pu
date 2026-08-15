"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { usePathname } from "next/navigation"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Sync active tab with current pathname
  useEffect(() => {
    const currentItem = items.find((item) => {
      if (item.url === "/" && pathname === "/") return true;
      if (item.url !== "/" && pathname.startsWith(item.url)) return true;
      return false;
    })
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [pathname, items])

  // ─── Scroll Spy (Intersection Observer) — only active on single page routes ───
  useEffect(() => {
    const sections = items
      .map((item) => {
        if (item.url.startsWith("#")) {
          const id = item.url.slice(1)
          return id ? document.getElementById(id) : null
        }
        return null
      })
      .filter(Boolean) as HTMLElement[]

    if (sections.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id")
          const matchingItem = items.find((item) => item.url === `#${id}`)
          if (matchingItem) {
            setActiveTab(matchingItem.name)
          }
        }
      })
    }, observerOptions)

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [items])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 sm:px-6 pb-4 sm:pb-6",
        className,
      )}
    >
      <div className="liquid-glass navbar-darken flex items-center justify-between rounded-full px-4 sm:px-6 py-2.5 sm:py-3 w-full">
        {/* Brand Logo on Left */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-white tracking-wider hover:opacity-90 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt="E-Cell JNCT PU Logo"
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/10"
          />
          <span className="font-[family-name:var(--font-outfit)] uppercase tracking-widest text-[9px] sm:text-xs">E-Cell JNCT PU</span>
        </Link>

        {/* Navigation Items on Right */}
        <div className="flex items-center gap-0.5 sm:gap-1.5">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            const linkContent = (
              <>
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={14} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-white/10 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </>
            )

            const linkClass = cn(
              "relative cursor-pointer text-[10px] sm:text-xs font-semibold px-2.5 sm:px-4 py-1.5 rounded-full transition-colors",
              "text-white/60 hover:text-white",
              isActive && "text-white",
            )

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={linkClass}
              >
                {linkContent}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
