import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecell-jnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: "Join E-Cell JNCT PU | Membership Registration",
  description:
    "Apply to become a member of the Entrepreneurship Cell (E-Cell) of JNCT Professional University, Bhopal. Gain access to startup resources, tech incubation, and business mentorship.",
  keywords: [
    "join E-Cell JNCT PU",
    "JNCT entrepreneurship cell membership",
    "student startup club Bhopal registration",
    "JNCT PU student organization",
  ],
  openGraph: {
    title: "Apply for E-Cell JNCT PU Membership",
    description:
      "Join the official student entrepreneurship community at JNCT Professional University, Bhopal. Build skills, network, and launch your startup.",
    url: `${siteUrl}/join`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/join`,
  },
};
