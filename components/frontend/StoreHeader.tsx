import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface StoreHeaderProps {
  storeName: string
  logo?: string | null
}

export default function StoreHeader({ storeName, logo }: StoreHeaderProps) {
  const router=useRouter()
  return (
    <header className="bg-yellow-400 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {logo ? (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-1">
              <Image 
                src={logo} 
                alt={storeName} 
                width={48} 
                height={48} 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
              <span className="text-yellow-600 text-lg font-bold">
                {storeName.charAt(0)}
              </span>
            </div>
          )}
          <h1 className="text-base md:text-2xl font-bold text-gray-800 md:block hidden">{storeName}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="bg-white text-yellow-500 px-4 py-2 rounded-full font-medium text-sm hover:bg-yellow-50 transition-colors">
            Follow
          </button>

          <button onClick={()=>router.back()} className="bg-green-500 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-green-600 transition-colors">
           Back
          </button>
        </div>
      </div>
    </header>
  )
}