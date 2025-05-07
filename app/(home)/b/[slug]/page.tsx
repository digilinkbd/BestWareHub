import { generateMetadata as generateSeoMetadata } from "@/lib/seo-utils"
import { db } from "@/prisma/db"
import { getFullUrl } from "@/lib/seo-config"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Generate metadata for brand pages
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const slug = params.slug

    // Fetch brand data
    const brand = await db.brand.findUnique({
      where: { slug },
    })

    if (!brand) {
      return generateSeoMetadata({
        title: "Brand Not Found",
        description: "The requested brand could not be found.",
      })
    }

    // Count products for this brand
    const productCount = await db.product.count({
      where: {
        brandId: brand.id,
        isActive: true,
        status: "ACTIVE",
      },
    })

    // Get top categories for this brand
    const topCategories = await db.product.findMany({
      where: {
        brandId: brand.id,
        isActive: true,
        status: "ACTIVE",
      },
      select: {
        category: {
          select: {
            title: true,
          },
        },
      },
      take: 5,
    })

    const categoryNames = [
      ...new Set(
        topCategories
          .map((product) => product.category?.title)
          .filter(Boolean)
          .slice(0, 3),
      ),
    ]

    // Generate SEO metadata
    return generateSeoMetadata({
      title: brand.metaTitle || `${brand.name} - Shop ${brand.name} Products`,
      description:
        brand.metaDescription ||
        `Explore our collection of ${brand.name} products. Find the best ${
          brand.name
        } items at great prices. ${productCount}+ products available${
          categoryNames.length > 0 ? ` in categories like ${categoryNames.join(", ")}` : ""
        }.`,
      keywords: [
        brand.name,
        `${brand.name} products`,
        `buy ${brand.name}`,
        `${brand.name} online`,
        ...(brand.metaKeywords || []),
        ...categoryNames.map((cat) => `${brand.name} ${cat}`),
      ],
      url: `/b/${brand.slug}`,
      type: "website",
    })
  } catch (error) {
    console.error("Error generating brand metadata:", error)

    // Fallback metadata
    return generateSeoMetadata({
      title: "Shop by Brand",
      description: "Browse our product brands and find what you need.",
    })
  }
}

export default async function Page({
  params,
}: {
  params: { slug: string }
}) {
  const slug = params.slug

  // Fetch brand data for structured data
  const brand = await db.brand.findUnique({
    where: { slug },
  })

  // Handle case where brand is not found
  if (!brand) {
    notFound()
  }

  return (
    <div>
      {/* Replace with your actual brand page component */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{brand.name}</h1>

        {brand.description && (
          <div className="mb-8">
            <p className="text-gray-700">{brand.description}</p>
          </div>
        )}

        {/* Your brand page content here */}
      </div>

      {/* Add breadcrumb structured data */}
      {brand && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: getFullUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Brands",
                  item: getFullUrl("/brands"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: brand.name,
                  item: getFullUrl(`/b/${brand.slug}`),
                },
              ],
            }),
          }}
        />
      )}

      {/* Add brand structured data */}
      {brand && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Brand",
              name: brand.name,
              url: getFullUrl(`/b/${brand.slug}`),
              logo: brand.logo || "/logo.png",
              description: brand.description || `Shop ${brand.name} products at BestWareHub`,
            }),
          }}
        />
      )}

      {/* Add collection page structured data */}
      {brand && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${brand.name} Products`,
              description: brand.description || `Shop ${brand.name} products at BestWareHub`,
              url: getFullUrl(`/b/${brand.slug}`),
              mainEntity: {
                "@type": "Brand",
                name: brand.name,
                logo: brand.logo || "/logo.png",
              },
            }),
          }}
        />
      )}
    </div>
  )
}
