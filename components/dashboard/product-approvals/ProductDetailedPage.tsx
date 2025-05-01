"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import {
  ChevronLeft,
  Edit,
  Trash2,
  Star,
  Check,
  X,
  Clock,
  ShoppingBag,
  AlertTriangle,
  ImagePlus
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { 
  getProductById, 
  updateProductStatus, 
  deleteProduct 
} from '@/actions/products'
import ProductDetailsSkeleton from '@/components/dashboard/product-approvals/ProductDetailsSkeleton'
import ProductStatusBadge from '@/components/dashboard/product-approvals/ProductStatusBadge'

import Link from 'next/link'
import { Role } from '@/next-auth'

interface ProductDetailPageProps {
    productId: string;
    userRoles?: Role[];

  }

export default function ProductDetailPage({ productId ,userRoles = [] }: ProductDetailPageProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('details')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const data = await getProductById(productId)
      return data
    }
  })
  
  // Update product status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ 
      productId, 
      status 
    }: { 
      productId: string; 
      status: string
    }) => {
      return await updateProductStatus(productId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] })
      toast.success('Product status updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update product status: ${error.message}`)
    }
  })
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await deleteProduct(productId)
    },
    onSuccess: () => {
      toast.success('Product deleted successfully')
      router.push('/dashboard/products')
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`)
    }
  })
  
  // Handle status change
  const handleStatusChange = (status: string) => {
    if (product) {
      updateStatusMutation.mutate({ 
        productId: product.id, 
        status 
      })
    }
  }
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (product) {
      deleteProductMutation.mutate(product.id)
      setDeleteDialogOpen(false)
    }
  }
  
  if (isLoading) {
    return <ProductDetailsSkeleton />
  }
  const isAdmin = () => {
    return userRoles.some(role => role.roleName === 'admin');
  };
  if (error || !product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the product you're looking for. It may have been removed or you might have followed an invalid link.
        </p>
        <Button
          onClick={() => router.push('/dashboard/products')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Go Back to Products
        </Button>
      </div>
    )
  }
  return (
    <div className="container mx-auto nd:p-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="truncate max-w-[200px]">
              {product.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <ProductStatusBadge status={product.status} />
        </div>
        
        <div className="flex gap-2">
            <Link href={`/dashboard/products/update/${product.id}`}>
            <Button
            variant="outline"
            
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
            </Link>
       
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardContent className="p-0">
            {product.productImages && product.productImages.length > 0 ? (
              <div>
                <div className="relative aspect-square">
                  <Image
                    src={product.productImages[currentImageIndex]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {product.productImages.length > 1 && (
                  <div className="flex overflow-x-auto p-2 gap-2">
                    {product.productImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative w-16 h-16 cursor-pointer rounded-md overflow-hidden border-2 ${
                          currentImageIndex === idx
                            ? 'border-yellow-500'
                            : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <Image
                          src={img}
                          alt={`${product.title} - ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 flex flex-col items-center justify-center">
                <ImagePlus className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Product Details */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger 
                  value="details"
                  className={activeTab === 'details' ? 'bg-yellow-500 text-white' : ''}
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="pricing"
                  className={activeTab === 'pricing' ? 'bg-yellow-500 text-white' : ''}
                >
                  Pricing
                </TabsTrigger>
                <TabsTrigger 
                  value="status"
                  className={activeTab === 'status' ? 'bg-yellow-500 text-white' : ''}
                >
                  Status
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Product Information</h3>
                  <Separator className="mb-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Department</h4>
                      <p>{product.department?.title || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category</h4>
                      <p>{product.category?.title || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">ID</h4>
                      <p className="font-mono text-sm">{product.id}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Slug</h4>
                      <p className="font-mono text-sm">{product.slug}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Created</h4>
                      <p>{new Date(product.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Rating</h4>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{product.rating || 'No ratings yet'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Description</h3>
                  <Separator className="mb-4" />
                  <p className="whitespace-pre-line">{product.description || 'No description available'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Short Description</h3>
                  <Separator className="mb-4" />
                  <p>{product.shortDesc || 'No short description available'}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Regular Price</h4>
                    <p className="text-xl font-medium">${product.productPrice.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Sale Price</h4>
                    {product.isDiscount && product.salePrice ? (
                      <p className="text-xl font-medium text-yellow-600">
                        ${product.salePrice.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-gray-500">No sale price</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Discount</h4>
                    {product.isDiscount && product.discount ? (
                      <Badge className="bg-yellow-500 text-white">
                        {product.discount}% OFF
                      </Badge>
                    ) : (
                      <p className="text-gray-500">No discount applied</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Discount Status</h4>
                    {product.isDiscount ? (
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-500 text-white">Inactive</Badge>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="status" className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Current Status</h3>
                  <Separator className="mb-4" />
                  
                  <div className="flex items-center space-x-2">
                    <ProductStatusBadge status={product.status} size="lg" />
                    <p className="text-gray-600">
                      {product.status === 'DRAFT' && 'This product is in draft mode and not visible to customers.'}
                      {product.status === 'PENDING' && 'This product is awaiting approval.'}
                      {product.status === 'ACTIVE' && 'This product is live and visible to customers.'}
                      {product.status === 'INACTIVE' && 'This product is not currently visible to customers.'}
                    </p>
                  </div>
                </div>
                
                
     {isAdmin() && (
    <div>
      <h3 className="font-medium text-gray-500 mb-1">Update Status</h3>
      <Separator className="mb-4" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {product.status !== 'DRAFT' && (
          <Button
            onClick={() => handleStatusChange('DRAFT')}
            variant="outline"
            className="justify-start"
          >
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            Move to Draft
          </Button>
        )}
        
        {product.status !== 'PENDING' && (
          <Button
            onClick={() => handleStatusChange('PENDING')}
            variant="outline"
            className="justify-start"
          >
            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
            Change Product To pending
          </Button>
        )}
        
        {product.status !== 'ACTIVE' && (
          <Button
            onClick={() => handleStatusChange('ACTIVE')}
            variant="outline"
            className="justify-start"
          >
            <Check className="mr-2 h-4 w-4 text-green-500" />
            Activate Product
          </Button>
        )}
        
        {product.status !== 'INACTIVE' && (
          <Button
            onClick={() => handleStatusChange('INACTIVE')}
            variant="outline"
            className="justify-start"
          >
            <X className="mr-2 h-4 w-4 text-red-500" />
            Deactivate Product
          </Button>
        )}
      </div>
    </div>
  )}
                
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Inventory</h3>
                  <Separator className="mb-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Current Stock</h4>
                      <p className="text-xl font-medium">
                        {product.productStock !== null && product.productStock !== undefined
                          ? product.productStock
                          : 'Not tracked'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Low Stock Alert</h4>
                      <p className="text-xl font-medium">
                        {product.lowStockAlert || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">SKU</h4>
                      <p>{product.sku || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Barcode</h4>
                      <p>{product.barcode || 'Not set'}</p>
                    </div>
                  </div>
                </div>
                
                {product.isWholesale && (
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Wholesale Information</h3>
                    <Separator className="mb-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Wholesale Price</h4>
                        <p className="text-xl font-medium">
                          {product.wholesalePrice?.toFixed(2) || 'Not set'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Minimum Quantity</h4>
                        <p className="text-xl font-medium">
                          {product.wholesaleQty || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}