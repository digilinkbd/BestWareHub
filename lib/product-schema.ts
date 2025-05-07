import { getFullUrl } from "./seo-config"

/**
 * Generate JSON-LD structured data for a product
 */
export function generateProductSchema(product: any) {
  if (!product) return null

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.shortDesc,
    image: product.productImages?.length > 0 ? product.productImages.map((img) => img) : [product.imageUrl],
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
      priceCurrency: "BDT",
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
          currency: "BDT",
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
  }
}

/**
 * Generate breadcrumb structured data that matches UI breadcrumbs
 */
export function generateBreadcrumbSchema(product: any) {
  if (!product) return null

  return {
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
        position: product.department ? 6 : product.category ? 5 : product.subCategory ? 5 : product.brand ? 3 : 2,
        name: product.title,
        item: getFullUrl(`/p/${product.slug}`),
      },
    ],
  }
}
