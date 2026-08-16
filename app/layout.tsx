import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // ── Primary ──────────────────────────────────────────────
  title: {
    default: "E-Cell JNCTPU | Entrepreneurship Cell — JNCT Professional University, Bhopal",
    template: "%s | E-Cell JNCTPU",
  },
  description:
    "E-Cell JNCTPU is the official Entrepreneurship Cell of JNCT Professional University (formerly Jai Narain College of Technology, Bhopal). Learn what is an E-Cell, access campus startup incubation, and join flagship events.",

  keywords: [
    "JNCT",
    "JNCTPU",
    "JNCT Professional University",
    "JNCT Bhopal",
    "Jai Narain College of Technology",
    "Jai Narain College of Technology Bhopal",
    "JNCT Group of Colleges",
    "JNCTPU Bhopal",
    "E-Cell",
    "what is ecell",
    "what is an e-cell",
    "E-Cell JNCT",
    "E-Cell JNCTPU",
    "ecell bhopal",
    "Entrepreneurship Cell",
    "Entrepreneurship Cell JNCT",
    "JNCT entrepreneurship",
    "JNCT startup",
    "startup culture JNCT",
    "innovation JNCT",
    "student entrepreneurship",
    "entrepreneurship club India",
    "pitch competition JNCT",
    "hackathon JNCT",
    "startup events JNCTPU",
    "business club JNCT",
    "student innovation cell",
    "startup ecosystem university",
    "ecell india",
    "entrepreneurship university India",
    "JNCT events",
    "JNCT startup summit",
    "InnoHack",
    "student business",
    "entrepreneurial mindset",
    "university startup club",
  ],

  authors: [{ name: "E-Cell JNCTPU", url: siteUrl }],
  creator: "E-Cell JNCTPU",
  publisher: "JNCT Professional University",
  category: "Education, Entrepreneurship",

  // ── Open Graph ────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "E-Cell JNCTPU",
    title: "E-Cell JNCTPU | Official Entrepreneurship Cell",
    description:
      "Empowering student entrepreneurs at JNCT Professional University through mentorship, hackathons, startup summits, and innovation programs. Be part of the movement.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "E-Cell JNCTPU — Entrepreneurship Cell of JNCT Professional University",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@ecell_jnctpu",
    creator: "@ecell_jnctpu",
    title: "E-Cell JNCTPU | Entrepreneurship Cell",
    description:
      "Fueling the startup spirit at JNCT Professional University. Hackathons, pitch events, mentorship & more.",
    images: ["/og-image.png"],
  },

  // ── Robots & Indexing ──────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Canonical & Alternates ──────────────────────────────────
  alternates: {
    canonical: siteUrl,
  },

  // ── Verification (add your actual tokens later) ─────────────
  verification: {
    // google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
    // yandex: "YOUR_YANDEX_VERIFICATION_TOKEN",
  },

  // ── App / Icons ────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

// ── JSON-LD Structured Data ────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "E-Cell JNCT PU",
  "alternateName": [
    "Entrepreneurship Cell JNCT PU",
    "E-Cell JNCT Professional University",
    "JNCT Entrepreneurship Cell",
    "Entrepreneurship Cell of JNCT Professional University"
  ],
  "url": siteUrl,
  "logo": `${siteUrl}/icon.jpg`,
  "image": `${siteUrl}/icon.jpg`,
  "description": "E-Cell JNCT PU is the official Entrepreneurship Cell of JNCT Professional University, Bhopal. We foster campus entrepreneurship, support student-run startups, and host hackathons, pitch events, and mentorship sessions.",
  "parentOrganization": {
    "@type": "CollegeOrUniversity",
    "name": "JNCT Professional University",
    "alternateName": ["JNCT PU", "JNCT Professional University Bhopal"],
    "url": "https://jnct.edu.in",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bhopal",
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN",
      "postalCode": "462022"
    }
  },
  "keywords": "JNCT, JNCT PU, E-Cell JNCT PU, Entrepreneurship Cell JNCT, startup Bhopal, hackathon Bhopal, student incubator Madhya Pradesh, business club Bhopal",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "New Bypass Road, Karond",
    "addressLocality": "Bhopal",
    "addressRegion": "Madhya Pradesh",
    "addressCountry": "IN",
    "postalCode": "462022"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "General Support & Incubation",
    "email": "ecell@jnctpu.ac.in",
    "url": `${siteUrl}/contact`
  },
  "knowsAbout": [
    "Entrepreneurship",
    "Startup Incubation",
    "Business Development",
    "Technology Innovation",
    "Venture Capital",
    "Mentorship",
    "Hackathons"
  ],
  "sameAs": [
    "https://www.instagram.com/ecell.jnctpu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    "https://www.linkedin.com/company/ecell-jnctpu",
    "https://twitter.com/ecell_jnctpu"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
