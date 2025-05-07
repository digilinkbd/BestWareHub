import CategoryDetailedPage from "@/components/frontend/category-detailed-page"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo-utils"
import { db } from "@/prisma/db"
import { getFullUrl } from "@/lib/seo-config"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Generate metadata for subcategory pages
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    // Await the params object before accessing its properties
    const resolvedParams = await params
    const slug = resolvedParams.slug

    // Fetch subcategory data
    const subCategory = await db.subCategory.findUnique({
      where: { slug: slug },
      include: {
        category: {
          include: {
            department: true,
          },
        },
      },
    })

    if (!subCategory) {
      return generateSeoMetadata({
        title: "Subcategory Not Found",
        description: "The requested subcategory could not be found.",
      })
    }

    // Count products in this subcategory
    const productCount = await db.product.count({
      where: {
        subCategoryId: subCategory.id,
        isActive: true,
        status: "ACTIVE",
      },
    })

    // Generate SEO metadata
    return generateSeoMetadata({
      title: subCategory.metaTitle || `${subCategory.title} - Shop ${subCategory.title} Products`,
      description:
        subCategory.metaDescription ||
        `Explore our collection of ${subCategory.title} products. Find the best ${subCategory.title} items at great prices. ${productCount}+ products available.`,
      keywords: [
        subCategory.title,
        ...(subCategory.category ? [subCategory.category.title] : []),
        ...(subCategory.category?.department ? [subCategory.category.department.title] : []),
        `${subCategory.title} products`,
        `buy ${subCategory.title}`,
        `${subCategory.title} online`,
        ...(subCategory.metaKeywords || []),
      ],
      url: `/s-c/${subCategory.slug}`,
      type: "website",
    })
  } catch (error) {
    console.error("Error generating subcategory metadata:", error)

    // Fallback metadata
    return generateSeoMetadata({
      title: "Shop by Subcategory",
      description: "Browse our product subcategories and find what you need.",
    })
  }
}

export default async function Page({
  params,
}: {
  params: { slug: string }
}) {
  // Await the params object before accessing its properties
  const resolvedParams = await params
  const slug = resolvedParams.slug

  // Fetch subcategory data for structured data
  const subCategory = await db.subCategory.findUnique({
    where: { slug },
    include: {
      category: {
        include: {
          department: true,
        },
      },
    },
  })

  // Handle case where subcategory is not found
  if (!subCategory) {
    notFound()
  }

  return (
    <div>
      <CategoryDetailedPage slug={slug} isSubCategory={true} />

      {/* Add breadcrumb structured data */}
      {subCategory && subCategory.category && (
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
                ...(subCategory.category.department
                  ? [
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: subCategory.category.department.title,
                        item: getFullUrl(`/d/${subCategory.category.department.slug}`),
                      },
                    ]
                  : []),
                {
                  "@type": "ListItem",
                  position: subCategory.category.department ? 3 : 2,
                  name: subCategory.category.title,
                  item: getFullUrl(`/c/${subCategory.category.slug}`),
                },
                {
                  "@type": "ListItem",
                  position: subCategory.category.department ? 4 : 3,
                  name: subCategory.title,
                  item: getFullUrl(`/s-c/${subCategory.slug}`),
                },
              ],
            }),
          }}
        />
      )}

      {/* Add collection page structured data */}
      {subCategory && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: subCategory.title,
              description: subCategory.description || `Shop ${subCategory.title} products at BestWareHub`,
              url: getFullUrl(`/s-c/${subCategory.slug}`),
            }),
          }}
        />
      )}
    </div>
  )
}
