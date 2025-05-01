import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/frontend/ScrollToTop";
import { NextAuthProvider } from "@/providers/SessionProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",

});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} max-w-[1500px] mx-auto relative`}>
        <ReactQueryProvider>
          <NextAuthProvider>
            {children}
            <Toaster
              position="top-center"
              reverseOrder={false}
            />
            <ScrollToTop/>
          </NextAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}