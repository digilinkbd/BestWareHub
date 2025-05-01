import ContentPage from '@/components/frontend/ContentPage';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Page",
  description: "Browse our products and categories",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ 
    type?: string; 

  }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);
  
  const slug = resolvedParams.slug;
  
  const contentType = resolvedSearchParams.type || "category";


  return (
    <div>
      <ContentPage 
        slug={slug}
        contentType={contentType}
      />
    </div>
  );
}