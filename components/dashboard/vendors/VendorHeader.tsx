import Image from "next/image";
import { Check, AlertCircle } from "lucide-react";
import { fullVendorWithStore } from "@/actions/vendor";

export default function VendorHeader({ vendor }: { vendor: fullVendorWithStore }) {
  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden">
      {/* Banner Image */}
      <div className="absolute inset-0">
        {vendor.store?.bannerUrl ? (
          <Image
            src={vendor.store.bannerUrl}
            alt={vendor.store?.storeName || "Store Banner"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Store Info Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex items-end space-x-4">
        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-white shadow-lg">
          {vendor.store?.logo ? (
            <Image
              src={vendor.store.logo}
              alt={vendor.store?.storeName || "Store Logo"}
              fill
              className="object-contain p-1"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-yellow-500 text-white text-xl font-bold">
              {vendor.store?.storeName?.charAt(0) || vendor.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="text-white">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{vendor.store?.storeName || vendor.name}</h1>
            {vendor.store?.isVerified && (
              <span className="bg-green-500 p-1 rounded-full">
                <Check size={14} />
              </span>
            )}
          </div>
          <p className="text-gray-200 mt-1 flex items-center gap-2">
            {vendor.store ? (
              <>
                <span>
                  {vendor._count.products} Products
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span>Since {new Date(vendor.createdAt).getFullYear()}</span>
              </>
            ) : (
              <span className="flex items-center text-yellow-300">
                <AlertCircle size={16} className="mr-2" />
                This vendor has not set up a store yet
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
