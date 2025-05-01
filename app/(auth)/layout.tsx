import HomeHeader from "@/components/Forms/home-header";
import MobileFooter from "@/components/frontend/mobile-footer";
import Footer from "@/components/frontend/site-footer";
import React, { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div>
      {/* <HomeHeader /> */}
    {children}
   {/* <Footer/> */}
  <MobileFooter /> 
    </div>;
}
