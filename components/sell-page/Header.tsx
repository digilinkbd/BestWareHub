"use client"

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Logo from '../global/Logo'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { scrollY } = useScroll()
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.85)']
  )
  const textColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)']
  )
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ['none', '0 4px 20px rgba(0, 0, 0, 0.3)']
  )

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Resources', href: '#resources' },
    { name: 'Pricing', href: '#pricing' },
  ]

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300"
      style={{
        backgroundColor,
        boxShadow,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2 font-bold text-xl"
          style={{ color: textColor }}
        >
          <Logo />
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex items-center gap-8"
          style={{ color: textColor }}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-medium hover:text-yellow-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
      
            <Button  className="bg-mainPrimary hover:bg-yellow-500 text-black font-bold px-8 py-5 text-sm" asChild>
            <Link href="/onboarding?=vendor">
            Get Started
            </Link>
         </Button>
        </motion.nav>

        {/* Mobile Navigation Toggle */}
        <motion.button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          style={{ color: textColor }}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      {/* Mobile Navigation Menu */}
      <motion.div
        className={cn(
          "fixed inset-0 bg-black/95 z-40 pt-20 px-4",
          isOpen ? "block" : "hidden"
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-yellow-400 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-8 w-8" />
          </button>
        </div>
        
        <nav className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-lg font-medium text-white hover:text-yellow-400"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium w-full mt-4">
          <Link href="/onboarding?=vendor">
            Get Started
            </Link>
          </Button>
        </nav>
      </motion.div>
    </motion.header>
  )
}

export default Header