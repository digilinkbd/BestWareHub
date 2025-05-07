import { siteConfig } from "@/config/site"

/**
 * Generate a sitemap URL entry with proper formatting
 */
export function generateSitemapEntry({
  url,
  lastModified,
  changeFrequency = "monthly",
  priority = 0.5,
}: {
  url: string
  lastModified: Date
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}) {
  // Ensure the URL is absolute
  const absoluteUrl = url.startsWith("http") ? url : `${siteConfig.url}${url.startsWith("/") ? url : `/${url}`}`

  return {
    url: absoluteUrl,
    lastModified,
    changeFrequency,
    priority,
  }
}

/**
 * Format a date for sitemap (ISO format)
 */
export function formatSitemapDate(date: Date): string {
  return date.toISOString()
}
