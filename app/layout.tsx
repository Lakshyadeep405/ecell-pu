import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecell-jnctpu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // ── Primary ──────────────────────────────────────────────
  title: {
    default: "E-Cell JNCT PU | Entrepreneurship Cell — JNCT Professional University",
    template: "%s | E-Cell JNCT PU",
  },
  description:
    "E-Cell JNCT PU is the official Entrepreneurship Cell of JNCT Professional University. We empower students with startup mentorship, hackathons, pitch competitions, and innovation events. Join India's next generation of entrepreneurs.",

  keywords: [
    "JNCT",
    "JNCT PU",
    "JNCT Professional University",
    "JCT PU",
    "E-Cell",
    "E-Cell JNCT",
    "E-Cell JNCT PU",
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
    "startup events JNCT PU",
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
    "JNCT PU college",
  ],

  authors: [{ name: "E-Cell JNCT PU", url: siteUrl }],
  creator: "E-Cell JNCT PU",
  publisher: "JNCT Professional University",
  category: "Education, Entrepreneurship",

  // ── Open Graph ────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "E-Cell JNCT PU",
    title: "E-Cell JNCT PU | Official Entrepreneurship Cell",
    description:
      "Empowering student entrepreneurs at JNCT Professional University through mentorship, hackathons, startup summits, and innovation programs. Be part of the movement.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "E-Cell JNCT PU — Entrepreneurship Cell of JNCT Professional University",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@ecell_jnctpu",
    creator: "@ecell_jnctpu",
    title: "E-Cell JNCT PU | Entrepreneurship Cell",
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
  name: "E-Cell JNCT PU",
  alternateName: [
    "Entrepreneurship Cell JNCT PU",
    "E-Cell JNCT Professional University",
    "JNCT Entrepreneurship Cell",
  ],
  url: siteUrl,
  logo: `${siteUrl}/og-image.png`,
  image: `${siteUrl}/og-image.png`,
  description:
    "E-Cell JNCT PU is the official Entrepreneurship Cell of JNCT Professional University, dedicated to fostering startup culture among students through mentorship, events, hackathons, and pitch competitions.",
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "JNCT Professional University",
    alternateName: ["JNCT PU", "JCT PU"],
    sameAs: [],
  },
  keywords:
    "JNCT, JNCT PU, entrepreneurship, startup, E-Cell, hackathon, innovation, student entrepreneur",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "General Enquiry",
    email: "ecell@jnctpu.ac.in",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme init script (no flash) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
