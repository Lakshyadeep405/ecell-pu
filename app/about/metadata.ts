import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecell-jnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: "Programs | E-Cell JNCTPU — Venture Incubation, Networking, Ideation & Scaling",
  description:
    "E-Cell JNCTPU's incubation program, networking, ideation, and scaling initiatives empower student entrepreneurs at JNCT Professional University, Bhopal.",
  keywords: [
    "E-Cell JNCTPU programs",
    "venture incubation Bhopal",
    "student startup incubator Bhopal",
    "JNCT entrepreneurship",
    "startup ideation Bhopal",
    "scaling ventures JNCT",
  ],
  openGraph: {
    title: "Programs & Initiatives | E-Cell JNCTPU",
    description:
      "Venture incubation, networking, ideation, and scaling initiatives for student entrepreneurs at JNCT Professional University, Bhopal.",
    url: `${siteUrl}/about`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};
