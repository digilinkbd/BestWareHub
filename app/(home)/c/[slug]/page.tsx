import CategoryDetailedPage from "@/components/frontend/category-detailed-page"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo-utils"
import { db } from "@/prisma/db"
import { getFullUrl } from "@/lib/seo-config"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Generate metadata for category pages
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    // Await the params object before accessing its properties
    const resolvedParams = await params
    const slug = resolvedParams.slug

    // Fetch category data
    const category = await db.category.findUnique({
      where: { slug: slug },
      include: {
        department: true,
        subCategories: {
          take: 5,
          where: { isActive: true },
        },
      },
    })

    if (!category) {
      return generateSeoMetadata({
        title: "Category Not Found",
        description: "The requested category could not be found.",
      })
    }

    // Count products in this category
    const productCount = await db.product.count({
      where: {
        categoryId: category.id,
        isActive: true,
        status: "ACTIVE",
      },
    })

    // Get subcategory names for keywords
    const subcategoryNames = category.subCategories.map((subCat) => subCat.title)

    // Generate SEO metadata
    return generateSeoMetadata({
      title: category.metaTitle || `${category.title} - Shop ${category.title} Products`,
      description:
        category.metaDescription ||
        `Explore our collection of ${category.title} products. Find the best ${category.title} items at great prices. ${productCount}+ products available in subcategories like ${subcategoryNames.join(", ")}.`,
      keywords: [
        category.title,
        ...(category.department ? [category.department.title] : []),
        `${category.title} products`,
        `buy ${category.title}`,
        `${category.title} online`,
        ...subcategoryNames,
        ...(category.metaKeywords || []),
      ],
      url: `/c/${category.slug}`,
      type: "website",
    })
  } catch (error) {
    console.error("Error generating category metadata:", error)

    // Fallback metadata
    return generateSeoMetadata({
      title: "Shop by Category",
      description: "Browse our product categories and find what you need.",
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

  // Fetch category data for structured data
  const category = await db.category.findUnique({
    where: { slug },
    include: {
      department: true,
      subCategories: {
        where: { isActive: true },
        take: 10,
      },
    },
  })

  // Handle case where category is not found
  if (!category) {
    notFound()
  }

  return (
    <div>
      <CategoryDetailedPage slug={slug} />

      {/* Add breadcrumb structured data */}
      {category && (
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
                ...(category.department
                  ? [
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: category.department.title,
                        item: getFullUrl(`/d/${category.department.slug}`),
                      },
                    ]
                  : []),
                {
                  "@type": "ListItem",
                  position: category.department ? 3 : 2,
                  name: category.title,
                  item: getFullUrl(`/c/${category.slug}`),
                },
              ],
            }),
          }}
        />
      )}

      {/* Add collection page structured data */}
      {category && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: category.title,
              description: category.description || `Shop ${category.title} products at BestWareHub`,
              url: getFullUrl(`/c/${category.slug}`),
              ...(category.subCategories.length > 0 && {
                hasPart: category.subCategories.map((subCat) => ({
                  "@type": "CollectionPage",
                  name: subCat.title,
                  url: getFullUrl(`/s-c/${subCat.slug}`),
                })),
              }),
            }),
          }}
        />
      )}
    </div>
  )
}
