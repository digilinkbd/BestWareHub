import MobileFooter from "@/components/frontend/mobile-footer"
import Nav from "@/components/frontend/Nav"
import Footer from "@/components/frontend/site-footer"
import type { ReactNode } from "react"

export default async function HomeLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="bg-white min-h-screen pb-16 md:pb-0 overflow-hidden">
    <Nav />
     <div className="bg-[#f7f7fa]">
     {children}
     </div>
      <Footer/>
      <MobileFooter />
    </div>
  )
}

