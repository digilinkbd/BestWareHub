import { generateMetadata as generateSeoMetadata } from "@/lib/seo-utils"
import DepartmentPage from "@/components/frontend/department-page"
import { db } from "@/prisma/db"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

// Generate metadata for department pages
    export async function generateMetadata({
      params,
    }: {
      params: { slug: string }
    }): Promise<Metadata> {
      try {
    // Await the params object before accessing its properties
    const resolvedParams = await params
    const slug = resolvedParams.slug

    // Fetch department data
    const department = await db.department.findUnique({
      where: { slug: slug },
      include: {
        categories: {
          take: 5,
          where: { isActive: true },
        },
      },
    })

    if (!department) {
      return generateSeoMetadata({
        title: "Department Not Found",
        description: "The requested department could not be found.",
      })
    }

    // Get category names for keywords
    const categoryNames = department.categories.map((cat) => cat.title)

    // Generate SEO metadata
    return generateSeoMetadata({
      title: department.metaTitle || `${department.title} - Shop ${department.title}`,
      description:
        department.metaDescription ||
        `Explore our ${department.title} department. Find products in categories like ${categoryNames.join(
          ", ",
        )} and more.`,
      keywords: [
        department.title,
        `${department.title} products`,
        `buy ${department.title}`,
        `${department.title} online`,
        ...categoryNames,
        ...(department.metaKeywords || []),
      ],
      url: `/d/${department.slug}`,
      type: "website",
    })
  } catch (error) {
    console.error("Error generating department metadata:", error)

    // Fallback metadata
    return generateSeoMetadata({
      title: "Shop by Department",
      description: "Browse our departments and find what you need.",
    })
  }
}

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return (
    <div>
      <DepartmentPage slug={slug}/>
    </div>
  )
}
