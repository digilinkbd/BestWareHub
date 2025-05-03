import React from 'react'
import { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "About BestWareHub",
  description:
    "BestWareHub is your one-stop destination, from the latest Gadgets, Stylish Home Decor, Electronics,Appliances, Fashion, Tools, Office Supplies, Kitchen Supplies, Furniture, Groceries, Beauty and Care, Baby Care, and much more in Bangladesh. Explore our collection and discover the perfect items to enhance your lifestyle.",
    alternates: {
        canonical: "/about",
        languages: {
            "en-US": "/en-US",
        },
    }
};
export default function page() {
  return (
    <div>
    <h1>About</h1>
    </div>
  )
}
