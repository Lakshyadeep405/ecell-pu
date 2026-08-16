import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: "About Us | E-Cell JNCTPU — Entrepreneurship Cell of JNCT Professional University",
  description:
    "Learn about E-Cell JNCTPU, the official Entrepreneurship Cell of JNCT Professional University, Bhopal. Empowering student founders through venture incubation, networking, ideation, and scaling programs.",
  keywords: [
    "About E-Cell JNCTPU",
    "E-Cell JNCTPU programs",
    "venture incubation Bhopal",
    "student startup incubator Bhopal",
    "JNCT entrepreneurship cell history",
    "startup ideation Bhopal",
    "scaling ventures JNCT",
  ],
  openGraph: {
    title: "About Us | E-Cell JNCTPU — Entrepreneurship Cell",
    description:
      "About E-Cell JNCTPU: Venture incubation, networking, ideation, and scaling initiatives for student entrepreneurs at JNCT Professional University, Bhopal.",
    url: `${siteUrl}/about`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};
