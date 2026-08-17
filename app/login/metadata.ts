import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: "Student Portal & Admin Login | E-Cell JNCT PU",
  description:
    "Log in to the official Entrepreneurship Cell (E-Cell) portal at JNCT Professional University, Bhopal. Access event details and membership settings.",
  keywords: [
    "E-Cell JNCT PU login",
    "student portal JNCT Professional University",
    "E-Cell admin dashboard login",
  ],
  openGraph: {
    title: "Member & Admin Login | E-Cell JNCT PU",
    description:
      "Access the E-Cell student dashboard and administrative panel at JNCT Professional University, Bhopal.",
    url: `${siteUrl}/login`,
    images: [{ url: "/og-image1.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/login`,
  },
};
