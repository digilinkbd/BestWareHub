"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Check, File, FileText, Globe, Info, Mail, Map, Phone, Store, User, X } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import type { VendorStatus } from '@prisma/client'
import { useStoreDetails } from '@/hooks/useStore'
import DocumentPreview from './DocumentPreview'
import StoreStatusDialog from './StoreStatusDialog'
import { StoreDetailSkeleton } from './StoreDetailSkeleton'
import { formatDate } from '@/lib/formatDate'

interface StoreDetailClientProps {
  storeId: string
}

const StoreDetailClient: React.FC<StoreDetailClientProps> = ({ storeId }) => {
  const { store, isLoading, error } = useStoreDetails(storeId)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT'>('APPROVE')

  if (isLoading) {
    return <StoreDetailSkeleton />
  }

  if (error || !store) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Store</CardTitle>
          <CardDescription>
            There was a problem loading the store details. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: VendorStatus | null) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const handleStatusAction = (type: 'APPROVE' | 'REJECT') => {
    setActionType(type)
    setStatusDialogOpen(true)
  }

  const socialLinks = store.socialLinks as { 
    facebook?: string;
    twitter?: string; 
    instagram?: string;
  } | null

  return (
    <div className="relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 z-0">
        <Image 
          src="/images/store-bg-pattern.svg" 
          alt="Background pattern"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10">
        {/* Store Banner */}
        <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6 bg-gray-100">
          {store.bannerUrl ? (
            <Image
              src={store.bannerUrl}
              alt={`${store.storeName} banner`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-yellow-50">
              <Store className="h-16 w-16 text-yellow-300" />
            </div>
          )}
        </div>

        {/* Store Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
          <div className="relative -mt-12 z-20 border-4 border-white rounded-lg overflow-hidden shadow-lg bg-white">
            <Avatar className="h-24 w-24">
              {store.logo ? (
                <AvatarImage src={store.logo} alt={store.storeName} />
              ) : (
                <AvatarFallback className="bg-yellow-100 text-yellow-700 text-2xl">
                  {store.storeName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-2xl font-bold">{store.storeName}</h1>
              {getStatusBadge(store.user.vendorStatus)}
              {store.isVerified && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  <Check className="h-3 w-3 mr-1" /> Verified
                </Badge>
              )}
            </div>
            {/* <p className="text-muted-foreground mt-1 line-clamp-2">{store.description || 'No description available'}</p> */}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {store.user.vendorStatus === 'PENDING' && (
              <>
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                  onClick={() => handleStatusAction('APPROVE')}
                >
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 md:flex-none"
                  onClick={() => handleStatusAction('REJECT')}
                >
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
              </>
            )}
            {store.user.vendorStatus === 'REJECTED' && (
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusAction('APPROVE')}
              >
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
            )}
            {store.user.vendorStatus === 'APPROVED' && (
              <Button 
                variant="destructive"
                onClick={() => handleStatusAction('REJECT')}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            )}
          </div>
        </div>

        {/* Store Details Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="info">Store Info</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="owner">Owner Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-yellow-500" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Store Name</span>
                      <span className="font-medium">{store.storeName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-yellow-500" />
                        <a href={`mailto:${store.storeEmail}`} className="font-medium text-yellow-600 hover:underline">
                          {store.storeEmail}
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-yellow-500" />
                        <a href={`tel:${store.storePhone}`} className="font-medium">
                          {store.storePhone}
                        </a>
                      </div>
                    </div>
                    {store.storeWebsite && (
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Website</span>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-yellow-500" />
                          <a 
                            href={store.storeWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-medium text-yellow-600 hover:underline"
                          >
                            {store.storeWebsite}
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Has GST</span>
                      <span className="font-medium">{store.hasGst ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-yellow-500" />
                        <span className="font-medium">{formatDate(store.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Map className="mr-2 h-5 w-5 text-yellow-500" />
                    Location & Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Address</span>
                      <span className="font-medium">{store.storeAddress || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">City</span>
                        <span className="font-medium">{store.storeCity || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">State</span>
                        <span className="font-medium">{store.storeState || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Country</span>
                        <span className="font-medium">{store.storeCountry || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Postal Code</span>
                        <span className="font-medium">{store.storeZip || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-yellow-500" />
                    Store Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">
                    {store.description || 'No description provided'}
                  </p>
                </CardContent>
              </Card>

              {socialLinks && Object.values(socialLinks).some(link => link) && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-yellow-500" />
                      Social Media Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      {socialLinks.facebook && (
                        <a 
                          href={socialLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 rounded-md bg-yellow-50 hover:bg-yellow-100 transition-colors"
                        >
                          <svg className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a 
                          href={socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 rounded-md bg-yellow-50 hover:bg-yellow-100 transition-colors"
                        >
                          <svg className="h-5 w-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.035 10.035 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                          Twitter
                        </a>
                      )}
                      {socialLinks.instagram && (
                        <a 
                          href={socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 rounded-md bg-yellow-50 hover:bg-yellow-100 transition-colors"
                        >
                          <svg className="h-5 w-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                          Instagram
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <File className="mr-2 h-5 w-5 text-yellow-500" />
                    Business License
                  </CardTitle>
                  <CardDescription>
                    Business registration and license document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentPreview fileUrl={store.licenseUrl} fileName="Business License" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <File className="mr-2 h-5 w-5 text-yellow-500" />
                    ID Proof
                  </CardTitle>
                  <CardDescription>
                    Owner identification document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentPreview fileUrl={store.idProofUrl} fileName="ID Proof" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="owner">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-yellow-500" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24">
                      {store.user.image ? (
                        <AvatarImage src={store.user.image} alt={store.user.name} />
                      ) : (
                        <AvatarFallback className="bg-yellow-100 text-yellow-700 text-2xl">
                          {store.user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Owner Name</span>
                      <span className="font-medium text-lg">{store.user.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <a href={`mailto:${store.user.email}`} className="font-medium text-yellow-600 hover:underline">
                        {store.user.email}
                      </a>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Vendor Status</span>
                      {getStatusBadge(store.user.vendorStatus)}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1">
                        <Mail className="mr-2 h-4 w-4" /> Contact Owner
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <User className="mr-2 h-4 w-4" /> View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>
                  Manage store verification and status settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Store Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Mark the store as verified after reviewing their documents
                      </p>
                    </div>
                    <Button variant={store.isVerified ? "outline" : "default"}>
                      {store.isVerified ? "Unverify Store" : "Verify Store"}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Store Activity</h3>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable this store on the platform
                      </p>
                    </div>
                    <Button variant={store.isActive ? "destructive" : "default"}>
                      {store.isActive ? "Disable Store" : "Enable Store"}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Featured Products</h3>
                      <p className="text-sm text-muted-foreground">
                        {store.featuredProducts.length} products set as featured
                      </p>
                    </div>
                    <Button variant="outline">
                      Manage Featured
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Update Dialog */}
      <StoreStatusDialog 
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        storeId={store.id}
        storeName={store.storeName}
        actionType={actionType}
      />
    </div>
  )
}

export default StoreDetailClient