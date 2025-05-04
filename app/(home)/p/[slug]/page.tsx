
import { getProductBySlug } from '@/actions/products';
import ProductPage from '@/components/frontend/product-page';
import React from 'react'

//app/products/[slug]
export async function generateMetadata({ params: { slug },
  }: {
    params: { slug: string };
  }
) {
  const product = await getProductBySlug(slug);
  //const { product } = await import('@/hooks/useProduct').then((mod) => mod.useProductDetails(slug))
  return {
    title: product?.title,
    description: product?.description,
    alternates: {
      canonical: `/products/${product?.slug}`,
    },
    openGraph: {
      title: product?.title,
      description: product?.description,
      images: [product?.productImages],
    },
  };
}
export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return (
    <div>
      <ProductPage slug={slug}/>
    </div>
  )
}
