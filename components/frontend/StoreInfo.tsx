import { MapPin, Mail, Phone } from "lucide-react"
import type { StoreDetails } from "@/actions/store"

interface StoreInfoProps {
  store: StoreDetails | null | undefined
}

export default function StoreInfo({ store }: StoreInfoProps) {
  if (!store) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">About {store.storeName}</h2>

      <p className="text-gray-600 mb-6">
        {store.description ||
          `Welcome to ${store.storeName}. We offer a wide range of quality products at competitive prices.`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {store.storeAddress && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-800">Address</h3>
              <p className="text-gray-600">{store.storeAddress}</p>
            </div>
          </div>
        )}

        {store.storeEmail && (
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-800">Email</h3>
              <p className="text-gray-600">{store.storeEmail}</p>
            </div>
          </div>
        )}

        {store.storePhone && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-800">Phone</h3>
              <p className="text-gray-600">{store.storePhone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

