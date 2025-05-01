"use client"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { fetchDepartmentsWithCategories } from "@/actions/footer"
import { useQuery } from "@tanstack/react-query"

const popularSearches = [
  "Gift Card",
  "Lenovo Tablets",
  "iPad Pro",
  "Samsung Tab A9 Series",
  "Huawei Tablets",
  "iPad Air",
  "iPad",
  "Remarkable Tablets",
  "Samsung Tablets",
  "Samsung Tab S9 Series",
  "Huawei Matepad",
  "Honor Tablets",
  "Honor Pad Series",
  "C Idea Tablets",
  "OnePlus Pad",
  "Atouch Tablets",
  "Oneplus Tablets",
  "Oppo Tablets",
  "Xiaomi Tablets",
  "Motorola Edge 50 Pro",
  "iPad Mini 7 256Gb",
  "Honor X7C",
  "Poco C75",
  "Power Bank For iPhone 15 Pro Max",
  "Realme C61",
  "Vivo X200 Mini",
  "Infinix Hot 50i",
  "iPhone 16 Pro Max 2 Sim",
  "Oppo Find X8",
  "Samsung A55",
  "Samsung Galaxy A57",
  "Infinix Hot 50 Pro Plus",
  "Moto G60S",
  "Samsung Galaxy A16 5G",
  "Xiaomi 14T Pro",
  "Realme 12 Plus 5G",
  "Redmi 13C 5G",
  "Moto G85",
  "Pocco F6",
  "Realme 12 Pro",
  "Samsung Galaxy J15",
  "Oppo Reno 12 F 5G",
]

// Keep these static sections as they are
const footerStaticSections = [
  {
    title: "Fashion",
    links: [
      "Women's Fashion",
      "Men's Fashion",
      "Girls' Fashion",
      "Boys' Fashion",
      "Watches",
      "Jewellery",
      "Women's Handbags",
      "Men's Eyewear",
    ],
  },
  {
    title: "Home and Kitchen",
    links: [
      "Bath",
      "Home Decor",
      "Kitchen & Dining",
      "Tools & Home Improvement",
      "Audio & Video",
      "Furniture",
      "Patio, Lawn & Garden",
      "Pet Supplies",
    ],
  },
  {
    title: "Beauty",
    links: [
      "Fragrance",
      "Make-up",
      "Haircare",
      "Skincare",
      "Bath & Body",
      "Electronic Beauty Tools",
      "Men's Grooming",
      "Health Care Essentials",
    ],
  },
  {
    title: "Baby & Toys",
    links: [
      "Diapering",
      "Baby Transport",
      "Nursing & Feeding",
      "Baby & Kids Fashion",
      "Baby & Toddler Toys",
      "Tricycles & Scooters",
      "Board Games & Cards",
      "Outdoor Play",
    ],
  },
  {
    title: "Top Brands",
    links: ["Pampers", "Apple", "Nike", "Samsung", "Tefal", "L'Oreal Paris", "Skechers", "BLACK+DECKER"],
  },
  {
    title: "Discover Now",
    links: [
      "bestwarehub Digest",
      "Brand Glossary",
      "Best Mobile Phones",
      "Supermall",
      "Trending Searches",
      "Ramadan Sale",
      "Samsung Galaxy S25",
      "Samsung Galaxy S25 Ultra",
    ],
  },
]

const appStores = [
  { name: "App Store", image: "https://f.nooncdn.com/s/app/com/common/images/logos/app-store.svg" },
  { name: "Google Play", image: "https://f.nooncdn.com/s/app/com/common/images/logos/google-play.svg" },
  { name: "Huawei AppGallery", image: "https://f.nooncdn.com/s/app/com/noon/images/Huawei-icon.png" },
]

const socialLinks = [
  { name: "Facebook", icon: Facebook },
  { name: "Twitter", icon: Twitter },
  { name: "Instagram", icon: Instagram },
  { name: "LinkedIn", icon: Linkedin },
]

const paymentMethods = [
  { name: "Mastercard", image: "https://f.nooncdn.com/s/app/com/noon/design-system/payment-methods-v2/card-mastercard.svg" },
  { name: "Visa", image: "https://f.nooncdn.com/s/app/com/noon/design-system/payment-methods-v2/card-visa.svg" },
  { name: "Tabby", image: "https://f.nooncdn.com/s/app/com/noon/design-system/payment-methods-v2/tabby_v2.svg" },
  { name: "Cash", image: "https://f.nooncdn.com/s/app/com/noon/design-system/payment-methods-v2/cod-en.svg" },
  { name: "AMX", image: "https://f.nooncdn.com/s/app/com/noon/design-system/payment-methods-v2/card-amex.svg" },
  { name: "Tamara", image: "https://f.nooncdn.com/s/app/com/noon/design-system/payment-methods-v2/tamara-en.svg" },
]

const legalLinks = [
  { name: "Careers", url: "/careers" },
  { name: "Warranty Policy", url: "/warranty-policy" },
  { name: "Sell with us", url: "/sell-with-us" },
  { name: "Terms of Use", url: "/terms-of-use" },
  { name: "Terms of Sale", url: "/terms-of-sale" },
  { name: "Privacy Policy", url: "/privacy-policy" },
  { name: "Consumer Rights", url: "/consumer-rights" },
]

// Category Skeleton for loading state
const CategorySkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-32" />
    <ul className="space-y-2">
      {Array(6).fill(0).map((_, i) => (
        <li key={i}>
          <Skeleton className="h-4 w-24" />
        </li>
      ))}
    </ul>
  </div>
)

export default function Footer() {
  // Use React Query to fetch and cache departments and categories
  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments-categories"],
    queryFn: async () => {
      return fetchDepartmentsWithCategories()
    }
  })

  // Function to prepare categories for display
  const getCategoriesForDisplay = () => {
    if (isLoading || !departments) {
      return null
    }
    
    // Only take up to 7 departments to match the layout
    const displayableDepartments = departments.slice(0, 7)
    
    return displayableDepartments.map(department => ({
      title: department.title,
      links: department.categories.map(category => category.title),
      slugs: department.categories.map(category => category.slug),
    }))
  }

  const categoriesForDisplay = getCategoriesForDisplay()

  return (
    <footer className="w-full border-t border-gray-200">
      {/* Popular Categories - Now using actual data */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-sm font-semibold mb-3">Popular Categories</h2>
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              Array(20).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-8 w-32 rounded-full" />
              ))
            ) : (
              departments?.flatMap(department => 
                department.categories.map(category => (
                  <Link
                    key={category.slug}
                    href={`/c/${category.slug}`}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-700 hover:bg-gray-900 hover:text-white transition-colors duration-200"
                  >
                    {category.title}
                  </Link>
                ))
              ) || popularSearches.map((search, index) => (
                <Link
                  key={index}
                  href="#"
                  className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-700 hover:bg-gray-900 hover:text-white transition-colors duration-200"
                >
                  {search}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Support Section - Keeping as is */}
      <div className="border-b border-gray-200 bg-[#f7f7fa]">
        <div className="container mx-auto px-4 py-6 flex flex-wrap justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">We're Always Here To Help</h2>
            <p className="text-sm text-gray-600">Reach out to us through any of these support channels</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-xl">ⓘ</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">CUSTOMER HAPPINESS CENTER</p>
                <Link href="#" className="text-sm font-medium">
                  help.bestwarehub.com
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-xl">✉</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">EMAIL SUPPORT</p>
                <Link href="#" className="text-sm font-medium">
                  care@bestwarehub.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Dynamic categories mixed with static sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {/* Dynamic categories section */}
          {isLoading ? (
            // Show skeletons while loading
            Array(7).fill(0).map((_, i) => (
              <CategorySkeleton key={i} />
            ))
          ) : (
            // Combine dynamic categories with static sections
            <>
              {/* First, show the departments and their categories */}
              {categoriesForDisplay ? (
                categoriesForDisplay.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-4 uppercase text-sm">{category.title}</h3>
                    <ul className="space-y-2 text-sm">
                      {category.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link href={`/c/${category.slugs[linkIndex]}`} className="text-gray-600 hover:text-gray-900">
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                // Fallback to static sections if no data
                footerStaticSections.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-4 uppercase text-sm">{category.title}</h3>
                    <ul className="space-y-2 text-sm">
                      {category.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link href="#" className="text-gray-600 hover:text-gray-900">
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Shop on the go section - Unchanged */}
        <div className="mt-12 flex flex-col md:flex-row justify-around items-center border-t border-gray-200 pt-8">
          <div className="mb-6 md:mb-0">
            <h3 className="text-sm font-semibold mb-4 text-center">SHOP ON THE GO</h3>
            <div className="flex gap-4 items-center justify-center">
              {appStores.map((store, index) => (
                <Link key={index} href="#">
                  <Image
                    src={store.image || "/placeholder.jpg"}
                    alt={store.name}
                    width={120}
                    height={40}
                    className="h-10"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-sm font-semibold mb-4 text-center md:text-right ">CONNECT WITH US</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-mainPrimary rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-yellow-500 shadow"
                >
                  <social.icon className="w-5 h-5 text-black" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section - Unchanged */}
        <div className="mt-8 py-8 border-t border-gray-200 bg-[#f7f7fa]">
          <div className="flex flex-wrap flex-row-reverse justify-between items-center">
          
            <div className="flex gap-4 mt-4 md:mt-0">
              {paymentMethods.map((method, index) => (
                <Image key={index} src={method.image || "/placeholder.jpg"} alt={method.name} width={40} height={30} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4 md:mt-0 pl-4 md:text-center md:items-center ">
              {legalLinks.map((link, index) => (
                <Link key={index} href={link.url} className="hover:text-gray-900 text-sm  ">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}