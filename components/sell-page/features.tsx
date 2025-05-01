"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, BarChart3, Globe, Shield, Zap, Users } from 'lucide-react'

const features = [
  {
    icon: <ShoppingCart className="h-8 w-8 text-yellow-400" />,
    title: 'Easy Store Setup',
    description: 'Get your online store up and running in minutes with our intuitive setup process.',
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-yellow-400" />,
    title: 'Sales Analytics',
    description: 'Track your performance with detailed analytics and insights to grow your business.',
  },
  {
    icon: <Globe className="h-8 w-8 text-yellow-400" />,
    title: 'Global Reach',
    description: 'Sell to customers worldwide with multi-currency and language support.',
  },
  {
    icon: <Shield className="h-8 w-8 text-yellow-400" />,
    title: 'Secure Payments',
    description: 'Accept payments securely with our PCI-compliant payment processing system.',
  },
  {
    icon: <Zap className="h-8 w-8 text-yellow-400" />,
    title: 'Fast Performance',
    description: 'Provide a lightning-fast shopping experience for your customers.',
  },
  {
    icon: <Users className="h-8 w-8 text-yellow-400" />,
    title: 'Customer Management',
    description: 'Build relationships with your customers through our CRM tools.',
  },
]

const FeaturesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <section 
      id="features" 
      ref={ref} 
      className="py-24 bg-black border-t border-gray-900"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 1))",
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-3 text-white"
          >
            Everything You Need to Succeed
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            <span className="text-yellow-400">bestwarehub</span> provides all the tools and features you need to build and grow your online business.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl font-bold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection