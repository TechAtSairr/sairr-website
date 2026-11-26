import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/terms-and-conditions",
        "/privacy-policy",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
