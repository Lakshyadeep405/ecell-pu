import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: "Contact E-Cell JNCT PU | Support & Partnerships",
  description:
    "Get in touch with E-Cell JNCT PU at JNCT Professional University, Bhopal. Reach out for startup incubation support, sponsorship opportunities, or general queries.",
  keywords: [
    "contact E-Cell JNCT PU",
    "JNCT entrepreneurship cell address",
    "E-Cell Bhopal contact email",
    "JNCT startup incubation helpline",
  ],
  openGraph: {
    title: "Contact Us | E-Cell JNCT PU",
    description:
      "Reach out to the Entrepreneurship Cell of JNCT Professional University, Bhopal for business queries, incubation support, or partnership inquiries.",
    url: `${siteUrl}/contact`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};
