import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecelljnctpu.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/join`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const dynamicPaths: MetadataRoute.Sitemap = [];
  try {
    const { data: events } = await supabase
      .from("events")
      .select("id, created_at")
      .eq("status", "published");

    if (events) {
      events.forEach((event: { id: string; created_at?: string | null }) => {
        const lastMod = event.created_at ? new Date(event.created_at) : new Date();
        dynamicPaths.push({
          url: `${siteUrl}/events/${event.id}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: 0.7,
        });
        dynamicPaths.push({
          url: `${siteUrl}/events/${event.id}/register`,
          lastModified: lastMod,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap paths:", error);
  }

  return [...staticPaths, ...dynamicPaths];
}
