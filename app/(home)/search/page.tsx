import { SearchFilters } from "@/components/frontend/SearchFilters";
import { SearchResults } from "@/components/frontend/SearchResults";
import { SearchSkeleton } from "@/components/frontend/SearchSkeleton";
import { Suspense } from "react"

export const metadata = {
  title: "Search Results",
  description: "Find products across our catalog",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; brand?: string; sort?: string; page?: string; [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  
  const query = resolvedParams.q || ""
  const category = resolvedParams.category || ""
  const brand = resolvedParams.brand || ""
  const sort = resolvedParams.sort || "relevance"
  const page = Number(resolvedParams.page) || 1
  
  const allSearchParams: Record<string, string> = Object.fromEntries(
    Object.entries(resolvedParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, value as string])
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{query ? `Search results for "${query}"` : "All Products"}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters 
            query={query} 
            selectedCategory={category} 
            selectedBrand={brand} 
            sort={sort}
            page={page}
            allSearchParams={allSearchParams}
          />
        </div>
        
        <div className="lg:col-span-3">
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults 
              query={query}
              category={category}
              brand={brand}
              sort={sort}
              page={page}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}