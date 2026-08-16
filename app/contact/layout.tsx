import React from "react";
import { metadata } from "./metadata";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export { metadata };

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us | E-Cell JNCTPU",
    "description": "Contact the Entrepreneurship Cell of JNCT Professional University (E-Cell JNCTPU), Bhopal. Support for startup incubation, sponsorship, and partnerships.",
    "url": `${siteUrl}/contact`,
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "E-Cell JNCT PU",
      "url": siteUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
