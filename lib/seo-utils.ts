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
  const allKeywords = [...(seoConfig.defaultKeywords || []), ...keywords]
  const ogImage = image || seoConfig.defaultOgImage
  const baseUrl = seoConfig.siteUrl
  const pageUrl = url ? `${baseUrl}${url}` : baseUrl

  // Restrict OpenGraph type to only allowed values
  const validOgTypes = ["article", "website", "product"] as const
  type OpenGraphType = (typeof validOgTypes)[number]
  const ogType: OpenGraphType = validOgTypes.includes(type as OpenGraphType) ? (type as OpenGraphType) : "website"

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
      type: ogType,
      ...(ogType === "article" && {
        article: {
          publishedTime,
          modifiedTime,
          section: category,
          tags,
        },
      }),
      ...(ogType === "product" && {
        product: {
          category,
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
