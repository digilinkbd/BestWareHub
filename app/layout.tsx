import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/frontend/ScrollToTop";
import { NextAuthProvider } from "@/providers/SessionProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
 
export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.title}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "buy online",
    "best deals",
    "discount shopping",
    "online marketplace",
    "shop now",
    "free shipping",
    "exclusive offers",
    "trendy products",
    "customer favorites",
    "latest arrivals",
  ],
  authors: [
    {
      name: "BestWareHub",
      url: "https://bestwarehub.com",
    },
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  creator: "@bestwarehub",
  publisher: "@bestwarehub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@bestwarehub",
    site: "@bestwarehub",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

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