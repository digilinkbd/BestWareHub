import { seoConfig } from "@/lib/seo-config"

// Replace these with your actual data fetching functions
async function getAllProducts() {
  return [
    { slug: "product-1", updatedAt: new Date().toISOString() },
    { slug: "product-2", updatedAt: new Date().toISOString() },
  ]
}

async function getAllCategories() {
  return [{ slug: "category-1" }, { slug: "category-2" }]
}

export default async function sitemap() {
  const baseUrl = seoConfig.siteUrl

  // Get dynamic data
  const products = await getAllProducts()
  const categories = await getAllCategories()

  // Product URLs
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/p/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Category URLs
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/c/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  return [...staticPages, ...categoryUrls, ...productUrls]
}
