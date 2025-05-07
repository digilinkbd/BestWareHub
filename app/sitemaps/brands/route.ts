import { db } from "@/prisma/db"
import { siteConfig } from "@/config/site"
import { XMLBuilder } from "fast-xml-parser"

export async function GET(): Promise<Response> {
  try {
    // Get all active brands
    const brands = await db.brand.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
        title: true, // Using title instead of name based on your schema
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Create sitemap XML
    const baseUrl = siteConfig.url || process.env.NEXT_PUBLIC_SITE_URL || "https://bestwarehub.com"

    const urlset = {
      urlset: {
        "@_xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        url: brands.map((brand) => ({
          loc: `${baseUrl}/b/${brand.slug}`,
          lastmod: brand.updatedAt.toISOString(),
          changefreq: "weekly",
          priority: "0.7",
        })),
      },
    }

    const builder = new XMLBuilder({
      attributeNamePrefix: "@_",
      format: true,
    })
    const xml = builder.build(urlset)

    // Return the sitemap as XML
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>${xml}`, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating brands sitemap:", error)
    return new Response("Error generating sitemap", { status: 500 })
  }
}
