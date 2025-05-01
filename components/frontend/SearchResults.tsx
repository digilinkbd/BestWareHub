import { searchProducts } from "@/actions/search"
import { Suspense } from "react"
import { SearchSorting } from "./SearchSorting"
import { ProductsGridSkeleton } from "./ProductSkeleton"
import { SearchPagination } from "./SearchPagination"
import { ProductGrid } from "./ProductGrid"
import { ProductGridSkeleton } from "./ProductGridSkeleton"

export async function SearchResults({
  query,
  category,
  brand,
  sort,
  page,
}: {
  query: string
  category: string
  brand: string
  sort: string
  page: number
}) {
  const { products, categories, totalProducts, totalPages } = await searchProducts({
    query,
    category,
    brand,
    sort,
    page,
    limit: 12,
  })
  
  // Create search params string for pagination
  const searchParamsObj: Record<string, string> = {}
  if (query) searchParamsObj.q = query
  if (category) searchParamsObj.category = category
  if (brand) searchParamsObj.brand = brand
  if (sort && sort !== "relevance") searchParamsObj.sort = sort
  
  const searchParamsString = new URLSearchParams(searchParamsObj).toString()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No products found</h2>
        <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{products.length}</span> of{" "}
          <span className="font-medium">{totalProducts}</span> products
        </p>
        <SearchSorting currentSort={sort} 
         searchParamsString={searchParamsString}
        />
      </div>

      {categories.length > 1 && !category ? (
        <>
          {categories.map((cat) => {
            const categoryProducts = products.filter((p) => p.category === cat.title)
            if (categoryProducts.length === 0) return null

            return (
              <div key={cat.id} className="mb-10">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b">{cat.title}</h2>
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <Suspense fallback={<ProductsGridSkeleton count={categoryProducts.length} />}>
                    <ProductGrid products={categoryProducts} />
                  </Suspense>
                </div>
              </div>
            )
          })}
        </>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2">
          <Suspense fallback={<ProductGridSkeleton count={products.length} />}>
            <ProductGrid products={products} />
          </Suspense>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <SearchPagination 
            currentPage={page} 
            totalPages={totalPages} 
            searchParamsString={searchParamsString}
          />
        </div>
      )}
    </div>
  )
}