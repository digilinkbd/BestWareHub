import ProductPage from "@/components/frontend/product-page"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo-utils"
import { getProductBySlug } from "@/actions/products"
import type { Metadata } from "next"
import { getFullUrl } from "@/lib/seo-config"
import { notFound } from "next/navigation"

// Generate metadata for the product page
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    // Await the params object before accessing its properties
    const resolvedParams = await params
    const slug = resolvedParams.slug

    // Fetch product data using your existing function
    const product = await getProductBySlug(slug)

    if (!product) {
      return generateSeoMetadata({
        title: "Product Not Found",
        description: "The requested product could not be found.",
      })
    }

    // Extract product details for SEO
    const productKeywords = [
      product.category?.title || "",
      product.subCategory?.title || "",
      product.brand?.name || "",
      ...(product.tags || []),
      ...(product.metaKeywords || []),
      "buy online",
      "best price",
    ].filter(Boolean)

    // Generate SEO metadata using your existing utility
    return generateSeoMetadata({
      title: product.metaTitle || product.title,
      description: product.metaDescription || product.shortDesc || product.description?.substring(0, 160) || "",
      keywords: productKeywords,
      image: product.imageUrl || product.productImages?.[0] || "",
      url: `/p/${product.slug}`,
      type: "website", // Changed from "product" to "website" to fix OpenGraph type error
      // Additional product-specific metadata
      publishedTime: product.createdAt?.toISOString(),
      modifiedTime: product.updatedAt?.toISOString(),
      category: product.category?.title,
      tags: product.tags,
    })
  } catch (error) {
    console.error("Error generating product metadata:", error)

    // Fallback metadata
    return generateSeoMetadata({
      title: "Product Details",
      description: "View our product details and specifications.",
    })
  }
}

// Add viewport settings
export function generateViewport() {
  return {
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
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

  // Fetch product data
  const product = await getProductBySlug(slug)

  // Handle case where product is not found
  if (!product) {
    notFound()
  }

  return (
    <div>
      <ProductPage slug={slug} />

      {/* Add JSON-LD structured data */}
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              description: product.description || product.shortDesc,
              image: product.productImages?.length > 0 ? product.productImages : [product.imageUrl],
              sku: product.sku || product.id,
              mpn: product.productCode || product.sku || product.id,
              brand: {
                "@type": "Brand",
                name: product.brand?.name || "BestWareHub",
              },
              offers: {
                "@type": "Offer",
                url: getFullUrl(`/p/${product.slug}`),
                price: product.salePrice || product.productPrice,
                priceCurrency: "bdt",
                availability:
                  product.productStock && product.productStock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                seller: {
                  "@type": "Organization",
                  name: product.store?.storeName || product.vendor?.name || "BestWareHub",
                },
                // Add delivery information
                deliveryLeadTime: {
                  "@type": "QuantitativeValue",
                  minValue: 1,
                  maxValue: 3,
                  unitCode: "DAY",
                },
                shippingDetails: {
                  "@type": "OfferShippingDetails",
                  shippingRate: {
                    "@type": "MonetaryAmount",
                    value: 0,
                    currency: "bdt",
                  },
                  deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: {
                      "@type": "QuantitativeValue",
                      minValue: 0,
                      maxValue: 1,
                      unitCode: "DAY",
                    },
                    transitTime: {
                      "@type": "QuantitativeValue",
                      minValue: 1,
                      maxValue: 3,
                      unitCode: "DAY",
                    },
                  },
                },
              },
              ...(product.rating && {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: product.rating,
                  reviewCount: product.reviews?.length || 1,
                  bestRating: 5,
                  worstRating: 1,
                },
              }),
              ...(product.reviews &&
                product.reviews.length > 0 && {
                  review: product.reviews.slice(0, 5).map((review) => ({
                    "@type": "Review",
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: review.rating,
                      bestRating: 5,
                    },
                    author: {
                      "@type": "Person",
                      name: review.user?.name || "Customer",
                    },
                    datePublished: review.createdAt.toISOString().split("T")[0],
                    reviewBody: review.comment,
                  })),
                }),
            }),
          }}
        />
      )}

      {/* Add breadcrumb structured data that matches your UI */}
      {product && (
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
                ...(product.department
                  ? [
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: product.department.title,
                        item: getFullUrl(`/d/${product.department.slug}`),
                      },
                    ]
                  : []),
                ...(product.category
                  ? [
                      {
                        "@type": "ListItem",
                        position: product.department ? 3 : 2,
                        name: product.category.title,
                        item: getFullUrl(`/c/${product.category.slug}`),
                      },
                    ]
                  : []),
                ...(product.subCategory
                  ? [
                      {
                        "@type": "ListItem",
                        position: product.department ? 4 : product.category ? 3 : 2,
                        name: product.subCategory.title,
                        item: getFullUrl(`/s-c/${product.subCategory.slug}`),
                      },
                    ]
                  : []),
                ...(product.brand
                  ? [
                      {
                        "@type": "ListItem",
                        position: product.department ? 5 : product.category ? 4 : product.subCategory ? 4 : 2,
                        name: product.brand.name,
                        item: getFullUrl(`/b/${product.brand.slug}`),
                      },
                    ]
                  : []),
                {
                  "@type": "ListItem",
                  position: product.department
                    ? 6
                    : product.category
                      ? 5
                      : product.subCategory
                        ? 5
                        : product.brand
                          ? 3
                          : 2,
                  name: product.title,
                  item: getFullUrl(`/p/${product.slug}`),
                },
              ],
            }),
          }}
        />
      )}

      {/* Add organization schema */}
      {product && product.vendor && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: product.store?.storeName || product.vendor?.name || "BestWareHub",
              url: getFullUrl(product.store ? `/store/${product.store.slug}` : "/"),
              logo: product.store?.logo || "/logo.png",
              ...(product.vendor?.store?.address && {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: product.vendor.store.address,
                  addressRegion: product.vendor.store.city || "Dhaka",
                  addressCountry: "Bangladesh",
                },
              }),
            }),
          }}
        />
      )}
    </div>
  )
}
