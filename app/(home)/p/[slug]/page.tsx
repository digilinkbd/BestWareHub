import ProductPage from '@/components/frontend/product-page';
import { getProductDetails } from '@/lib/api'; // Server-side fetcher

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductDetails(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist or has been removed.',
    };
  }

  return {
    title: product.title,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.title,
      description: product.seoDescription || product.description,
      images: [product.imageUrl],
    },
    alternates: {
      canonical: `/p/${product.slug}`,
    },
    other: {
      'application/ld+json': JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": product.imageUrl,
        "description": product.seoDescription,
        "brand": {
          "@type": "Brand",
          "name": product.brand?.title || 'Generic',
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": product.salePrice || product.productPrice,
          "availability": "https://schema.org/InStock",
          "url": `https://localhost:3000/p/${product.slug}`,
        },
      }),
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <ProductPage slug={params.slug} />
    </div>
  );
}



// export default async function page({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const slug = (await params).slug;
//   return (
//     <div>
//       <ProductPage slug={slug}/>
//     </div>
//   )
// }
