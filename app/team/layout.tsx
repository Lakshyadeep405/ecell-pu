import { metadata } from "./metadata";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export { metadata };

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const coreMembers = [
    { name: "Aarav Sharma", role: "PRESIDENT" },
    { name: "Diya Mehra", role: "VICE PRESIDENT" },
    { name: "Kabir Singh", role: "TECHNICAL HEAD" },
    { name: "Riya Kapoor", role: "MARKETING & PR LEAD" },
    { name: "Aryan Verma", role: "EVENTS MANAGER" },
    { name: "Ananya Goel", role: "STARTUP RELATIONS" },
    { name: "Rohan Malhotra", role: "CREATIVE DIRECTOR" },
    { name: "Sanya Gupta", role: "OPERATIONS HEAD" },
  ];

  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Our Team | E-Cell JNCTPU Squad",
    "description": "Meet the team leading student startup incubation and entrepreneurship events at JNCT Professional University, Bhopal.",
    "url": `${siteUrl}/team`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": coreMembers.length,
      "itemListElement": coreMembers.map((member, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Person",
          "name": member.name,
          "jobTitle": member.role,
          "worksFor": {
            "@type": "EducationalOrganization",
            "name": "E-Cell JNCT PU",
            "url": siteUrl
          }
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      {children}
    </>
  );
}
