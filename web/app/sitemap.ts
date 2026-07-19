import { MetadataRoute } from "next";

// Required for `output: export` (static export) — sitemap routes must opt in.
export const dynamic = "force-static";

const SITE_URL = "https://cairn.komatik.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  // cairn.komatik.xyz is a single-page marketing site (see app/page.tsx) —
  // there are no /seedlings, /problems, or /about routes to list.
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
