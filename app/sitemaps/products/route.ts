import { db } from "@/prisma/db"
import { siteConfig } from "@/config/site"
import { XMLBuilder } from "fast-xml-parser"

export async function GET(): Promise<Response> {
  try {
    // Get all active products
    const products = await db.product.findMany({
      where: {
        isActive: true,
        status: "ACTIVE",
      },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      // Limit to a reasonable number for each sitemap
      take: 10000,
    })

    // Create sitemap XML
    const baseUrl = siteConfig.url || process.env.NEXT_PUBLIC_SITE_URL || "https://bestwarehub.com"

    const urlset = {
      urlset: {
        "@_xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        url: products.map((product) => ({
          loc: `${baseUrl}/p/${product.slug}`,
          lastmod: product.updatedAt.toISOString(),
          changefreq: "weekly",
          priority: "0.8",
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
    console.error("Error generating products sitemap:", error)
    return new Response("Error generating sitemap", { status: 500 })
  }
}
