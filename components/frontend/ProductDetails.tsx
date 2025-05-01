"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import ProductReviews from "./ProductReviews"
import type { ProductWithRelations3 } from "@/types/types"

interface ProductDetailsProps {
  product: ProductWithRelations3
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const attributes = product.attributes ? JSON.parse(JSON.stringify(product.attributes)) : {}

  return (
    <div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="overview"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4"
          >
            Reviews ({product.reviews.length})
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4"
          >
            Specifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Highlights</h2>
              {product.shortDesc ? (
                <div className="space-y-4 text-base" dangerouslySetInnerHTML={{ __html: product.shortDesc }} />
              ) : (
                <ul className="space-y-4 list-disc pl-5 text-base">
                  {Object.entries(attributes)
                    .slice(0, 6)
                    .map(([key, value], index) => (
                      <li key={index}>
                        <p>
                          <strong>{key}:</strong> {String(value)}
                        </p>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(attributes)
                    .slice(0, 6)
                    .map(([key, value], index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded">
                        <p className="text-sm text-muted-foreground">{key}</p>
                        <p>{String(value)}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="text-gray-700 leading-relaxed text-sm">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p>No detailed description available for this product.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specifications">
          <div className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Product Specifications</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(attributes).map(([key, value], index) => (
                    <tr key={index} className={index < Object.entries(attributes).length - 1 ? "border-b" : ""}>
                      <td className="bg-gray-50 p-3 w-1/3 text-sm">{key}</td>
                      <td className="p-3 text-sm">{String(value)}</td>
                    </tr>
                  ))}
                  {/* Add basic product info if attributes are empty */}
                  {Object.keys(attributes).length === 0 && (
                    <>
                      <tr className="border-b">
                        <td className="bg-gray-50 p-3 w-1/3 text-sm">Brand</td>
                        <td className="p-3 text-sm">{product.brand?.title || "Generic"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="bg-gray-50 p-3 w-1/3 text-sm">Category</td>
                        <td className="p-3 text-sm">
                          {product.subCategory?.title || product.category?.title || "Uncategorized"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="bg-gray-50 p-3 w-1/3 text-sm">SKU</td>
                        <td className="p-3 text-sm">{product.sku || "N/A"}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <ProductReviews productId={product.id} productSlug={product.slug} reviews={product.reviews} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

