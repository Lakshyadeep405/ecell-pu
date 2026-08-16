import { metadata } from "./metadata";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export { metadata };

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Us | E-Cell JNCTPU",
    "description": "Learn about E-Cell JNCTPU, the official Entrepreneurship Cell of JNCT Professional University, Bhopal. Venture incubation, networking, ideation, and scaling programs.",
    "url": `${siteUrl}/about`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}
