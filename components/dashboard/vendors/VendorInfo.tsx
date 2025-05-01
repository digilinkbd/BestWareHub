import { fullVendorWithStore } from "@/actions/vendor";
import { MapPin, Mail, Phone, Globe, Calendar, Briefcase } from "lucide-react";

export default function VendorInfo({ vendor }: { vendor: fullVendorWithStore }) {
  const store = vendor.store;
  
  if (!store) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold border-b border-gray-200 pb-3 mb-4 text-yellow-700">
        Store Information
      </h2>
      
      {store.description && (
        <div className="mb-4">
          <p className="text-gray-700">{store.description}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {(store.storeAddress || store.storeCity || store.storeState) && (
          <div className="flex items-start">
            <MapPin className="text-yellow-500 mr-3 flex-shrink-0 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-700">
                {[
                  store.storeAddress,
                  store.storeCity,
                  store.storeState,
                  store.storeCountry,
                  store.storeZip
                ].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        )}
        
        {store.storeEmail && (
          <div className="flex items-start">
            <Mail className="text-yellow-500 mr-3 flex-shrink-0 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-700">{store.storeEmail}</p>
            </div>
          </div>
        )}
        
        {store.storePhone && (
          <div className="flex items-start">
            <Phone className="text-yellow-500 mr-3 flex-shrink-0 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-700">{store.storePhone}</p>
            </div>
          </div>
        )}
        
        {store.storeWebsite && (
          <div className="flex items-start">
            <Globe className="text-yellow-500 mr-3 flex-shrink-0 mt-1" size={18} />
            <div>
              <a 
                href={store.storeWebsite.startsWith("http") ? store.storeWebsite : `https://${store.storeWebsite}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Visit Website
              </a>
            </div>
          </div>
        )}
        
        <div className="flex items-start">
          <Calendar className="text-yellow-500 mr-3 flex-shrink-0 mt-1" size={18} />
          <div>
            <p className="text-sm text-gray-700">
              Member since {new Date(vendor.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Briefcase className="text-yellow-500 mr-3 flex-shrink-0 mt-1" size={18} />
          <div>
            <p className="text-sm text-gray-700">
              {vendor._count.products} Products
            </p>
          </div>
        </div>
      </div>
      
      {/* Social Links could be added here if socialLinks data is structured */}
    </div>
  );
}
