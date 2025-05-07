import { NextResponse } from "next/server"
import { db } from "@/prisma/db"
import { siteConfig } from "@/config/site"

export async function GET() {
  const baseUrl = siteConfig.url

  // Fetch all subcategories
  const subcategories = await db.subCategory.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      slug: true,
      updatedAt: true,
      title: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${subcategories
        .map(
          (subcategory) => `
        <url>
          <loc>${baseUrl}/s-c/${subcategory.slug}</loc>
          <lastmod>${subcategory.updatedAt.toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
