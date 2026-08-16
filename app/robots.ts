import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
  const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
    ? rawSiteUrl
    : `https://${rawSiteUrl}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/members/", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/members/", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin/", "/members/", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin/", "/members/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
