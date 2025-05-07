import { siteConfig } from "@/config/site"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url || process.env.NEXT_PUBLIC_SITE_URL || "https://bestwarehub.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/dashboard/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
