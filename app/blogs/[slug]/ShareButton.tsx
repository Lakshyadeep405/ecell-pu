"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled or clipboard fallback
    }
  };

  return (
    <button
      onClick={handleShare}
      className="liquid-glass flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/70 hover:text-white border border-white/10 transition-colors"
      title="Share article"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[11px] text-[#D4AF37]">Link Copied</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">Share</span>
        </>
      )}
    </button>
  );
}
