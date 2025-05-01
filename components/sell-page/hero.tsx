"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <section 
      ref={ref} 
      className="relative md:min-h-screen h-[80vh] flex items-center overflow-hidden"
      style={{
        backgroundImage: "url('/sell-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
     
      
      {/* Content container */}
      <div className="relative z-10 container mx-auto md:pl-32 md:py-24 py-16 ">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-xl"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-5xl font-bold text-white mb-6 leading-tight"
          >
            start selling<br />on Kartify
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="md:text-lg text-base text-white mb-10"
          >
            Kartify was created to help businesses, no matter their size
            - grow. Being from the region, Kartify is especially
            passionate about helping local businesses thrive, we look
            forward to helping you take your venture to the next level.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
          >
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-6 text-base" asChild>
              <Link href="/onboarding?=vendor">
               Get Started now
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection