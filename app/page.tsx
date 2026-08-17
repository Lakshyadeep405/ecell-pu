import HomePageClient from "./HomePageClient";
import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: "E-Cell JNCTPU | Entrepreneurship Cell — JNCT Professional University, Bhopal",
  description:
    "E-Cell JNCTPU is the official Entrepreneurship Cell of JNCT Professional University (formerly Jai Narain College of Technology, Bhopal). Fostering campus startup incubation, business ideation, student-run hackathons, and innovation programs.",
  keywords: [
    "ecell jnctpu",
    "jnctpu ecell",
    "jnctpu",
    "ecell jnct",
    "jnct ecell",
    "jnct professional university ecell",
    "jai narain college of technology ecell",
    "bhopal startup incubator",
    "student entrepreneurship club bhopal",
    "InnoHack JNCT",
    "startup summit bhopal",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "E-Cell JNCTPU",
    title: "E-Cell JNCTPU | Official Entrepreneurship Cell",
    description:
      "Empowering student founders at JNCT Professional University, Bhopal through mentorship, hackathons, incubation support, and early-stage capital.",
    images: [
      {
        url: "/og-image1.png",
        width: 1200,
        height: 630,
        alt: "E-Cell JNCTPU — Entrepreneurship Cell of JNCT Professional University",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Cell JNCTPU | Entrepreneurship Cell",
    description:
      "Fueling the startup spirit at JNCT Professional University. Hackathons, pitch events, mentorship & more.",
    images: ["/og-image1.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function Page() {
  return <HomePageClient />;
}
