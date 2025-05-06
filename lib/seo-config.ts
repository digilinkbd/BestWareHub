/**
 * Centralized configuration for SEO settings
 */
export const seoConfig = {
  // Site details
  siteName: "BestWareHub",
  titleTemplate: "%s | BestWareHub",
  defaultTitle: "BestWareHub - Where variety sparks the opportunity",
  defaultDescription: "BestWareHub is your one-stop destination for all your shopping needs in Bangladesh.",

  // URLs and domains
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://bestwarehub.com",

  // Default images
  defaultOgImage: "/images/og-image.jpg",

  // Social media
  twitterHandle: "@bestwarehub",
  facebookPage: "bestwarehub",

  // Organization
  organizationName: "BestWareHub",
  organizationLogo: "/logo.png",

  // Default keywords
  defaultKeywords: ["e-commerce", "online shopping", "Bangladesh", "electronics", "marketplace"],
}

/**
 * Get the full URL including domain
 */
export function getFullUrl(path: string): string {
  const baseUrl = seoConfig.siteUrl
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}
