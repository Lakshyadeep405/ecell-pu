import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: "Contact E-Cell JNCTPU | Support & Partnerships — JNCT Professional University",
  description:
    "Get in touch with E-Cell JNCTPU at JNCT Professional University, Bhopal. Reach out for startup incubation support, sponsorship opportunities, or general queries.",
  keywords: [
    "contact E-Cell JNCTPU",
    "JNCTPU entrepreneurship cell address",
    "E-Cell Bhopal contact email",
    "JNCTPU startup incubation helpline",
    "ecell jnctpu email",
  ],
  openGraph: {
    title: "Contact Us | E-Cell JNCTPU",
    description:
      "Reach out to the Entrepreneurship Cell of JNCT Professional University, Bhopal for business queries, incubation support, or partnership inquiries.",
    url: `${siteUrl}/contact`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};
