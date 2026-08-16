import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: "Our Team | E-Cell JNCTPU Squad — JNCT Professional University",
  description:
    "Meet the entire team behind E-Cell JNCTPU — the Entrepreneurship Cell of JNCT Professional University. Explore core team members, technical leads, creatives, marketing experts, and operations staff driving student entrepreneurship.",
  keywords: [
    "E-Cell JNCTPU team",
    "JNCTPU entrepreneurship team",
    "JNCT student leaders Bhopal",
    "JNCTPU core team members",
    "ecell jnctpu squad",
    "student innovators JNCT",
    "JNCT startup team",
  ],
  openGraph: {
    title: "Meet the Team | E-Cell JNCTPU",
    description:
      "The builders, designers, marketers, and leaders powering student entrepreneurship at JNCT Professional University.",
    url: `${siteUrl}/team`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/team`,
  },
};
