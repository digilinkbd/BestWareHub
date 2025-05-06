import type { Metadata } from "next"
import { seoConfig } from "./seo-config"

type SeoProps = {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "product"
  publishedTime?: string
  modifiedTime?: string
  category?: string
  tags?: string[]
}

/**
 * Generate dynamic metadata for any page
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  category,
  tags = [],
}: SeoProps): Metadata {
  // Combine default keywords with page-specific ones
  const allKeywords = [...(seoConfig.defaultKeywords || []), ...keywords]

  // Use the provided image or fallback to the default OG image
  const ogImage = image || seoConfig.defaultOgImage

  // Construct the full URL for canonical and OG
  const baseUrl = seoConfig.baseUrl
  const pageUrl = url ? `${baseUrl}${url}` : baseUrl

  return {
    title: title,
    description: description || seoConfig.defaultDescription,
    keywords: allKeywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: title || seoConfig.defaultTitle,
      description: description || seoConfig.defaultDescription,
      url: pageUrl,
      siteName: seoConfig.organizationName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || seoConfig.organizationName,
        },
      ],
      locale: "en_US",
      type,
      ...(type === "article" && {
        article: {
          publishedTime,
          modifiedTime,
          section: category,
          tags,
        },
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: title || seoConfig.defaultTitle,
      description: description || seoConfig.defaultDescription,
      images: [ogImage],
      creator: seoConfig.twitterHandle,
      site: seoConfig.twitterHandle,
    },
  }
}

/**
 * Generate product structured data (JSON-LD)
 * With improved error handling for product pages
 */
export function generateProductJsonLd(product: any) {
  if (!product) return null

  try {
    const baseUrl = seoConfig.baseUrl

    // Safely extract values with fallbacks
    const price = product.salePrice || product.productPrice || 0
    const availability = product.productStock > 0 ? "InStock" : "OutOfStock"
    const reviewCount = product.reviews?.length || 0
    const ratingValue = product.rating || 0
    const productImage =
      product.imageUrl || (product.productImages && product.productImages[0]) || seoConfig.defaultOgImage
    const productDescription = product.shortDesc || product.description || seoConfig.defaultDescription || ""

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title || "Product",
      image: productImage,
      description: productDescription,
      sku: product.sku || "",
      mpn: product.productCode || "",
      brand: {
        "@type": "Brand",
        name: product.brand?.title || "BestWareHub",
      },
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/p/${product.slug || ""}`,
        priceCurrency: "BDT",
        price: price,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        availability: `https://schema.org/${availability}`,
        seller: {
          "@type": "Organization",
          name: product.store?.storeName || product.shopName || "BestWareHub",
        },
      },
      ...(reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue,
          reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
      ...(product.reviews?.length > 0 && {
        review: product.reviews.slice(0, 5).map((review: any) => ({
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating || 5,
            bestRating: 5,
            worstRating: 1,
          },
          author: {
            "@type": "Person",
            name: review.user?.name || "Customer",
          },
          reviewBody: review.comment || "",
          datePublished: review.createdAt || new Date().toISOString(),
        })),
      }),
    }
  } catch (error) {
    console.error("Error generating product JSON-LD:", error)
    // Return a minimal valid product schema to prevent errors
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product?.title || "Product",
      description: product?.description || "Product description",
    }
  }
}

/**
 * Generate breadcrumb structured data (JSON-LD)
 * With improved error handling
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  try {
    const baseUrl = seoConfig.baseUrl

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name || `Item ${index + 1}`,
        item: `${baseUrl}${item.url || ""}`,
      })),
    }
  } catch (error) {
    console.error("Error generating breadcrumb JSON-LD:", error)
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    }
  }
}

/**
 * Generate organization structured data (JSON-LD)
 */
export function generateOrganizationJsonLd() {
  const baseUrl = seoConfig.baseUrl

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.organizationName,
    url: baseUrl,
    logo: `${baseUrl}/apple-touch-icon.png`,
    sameAs: [
      seoConfig.socialLinks.facebook,
      seoConfig.socialLinks.twitter,
      // Add other social profiles
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: seoConfig.contactPhone,
      contactType: "customer service",
      availableLanguage: ["English", "Bengali"],
    },
  }
}

/**
 * Generate website structured data (JSON-LD)
 */
export function generateWebsiteSchema() {
  const baseUrl = seoConfig.baseUrl

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.organizationName,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}
