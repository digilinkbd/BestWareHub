import CTASection from '@/components/sell-page/CTASection'
import FeaturesSection from '@/components/sell-page/features'
import Header from '@/components/sell-page/Header'
import HeroSection from '@/components/sell-page/hero'
import ResourcesSection from '@/components/sell-page/ResourcesSection'
import TestimonialsSection from '@/components/sell-page/TestimonialsSection'
import Link from 'next/link'
import React from 'react'


export default function SellPage() {
  return (
    <div className="relative min-h-screen">
      <Header />
     
      <main className="overflow-hidden">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ResourcesSection />
        <CTASection />
      </main>
    </div>
  )
}