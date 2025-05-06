import type { Metadata } from "next"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo-utils"

export function generateMetadata(): Metadata {
  return generateSeoMetadata({
    title: "About BestWareHub - Our Story",
    description:
      "Learn about BestWareHub, our mission, vision, and the team behind Bangladesh's premier online marketplace. Discover how we're revolutionizing e-commerce in Bangladesh.",
    url: "/about",
  })
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About BestWareHub</h1>

      {/* About content goes here */}
      <div className="prose max-w-none">
        <p>
          BestWareHub is your one-stop destination for all your shopping needs in Bangladesh. From the latest gadgets to
          stylish home decor, electronics, appliances, fashion, tools, office supplies, kitchen supplies, furniture,
          groceries, beauty and care, baby care, and much more.
        </p>

        <h2>Our Mission</h2>
        <p>
          At BestWareHub, our mission is to provide a seamless shopping experience with a wide variety of high-quality
          products at competitive prices. We aim to connect customers with trusted vendors and brands, making online
          shopping accessible, convenient, and enjoyable for everyone in Bangladesh.
        </p>

        <h2>Our Vision</h2>
        <p>
          We envision becoming the leading e-commerce platform in Bangladesh, known for our product variety, customer
          service excellence, and innovative shopping solutions. We strive to empower local businesses and contribute to
          the growth of the digital economy in Bangladesh.
        </p>
      </div>
    </div>
  )
}
