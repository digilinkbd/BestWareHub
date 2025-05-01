"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Video, FileText, ArrowRight } from 'lucide-react'

const resourceCategories = [
  {
    id: "guides",
    label: "Seller Guides",
    icon: <BookOpen className="h-5 w-5" />,
    resources: [
      {
        title: "Getting Started Guide",
        description: "Learn the basics of setting up your store and listing your first products.",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Product Photography Tips",
        description: "Create stunning product images that convert browsers into buyers.",
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Pricing Strategy Guide",
        description: "Optimize your pricing to maximize profits while staying competitive.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ]
  },
  {
    id: "videos",
    label: "Video Tutorials",
    icon: <Video className="h-5 w-5" />,
    resources: [
      {
        title: "Store Customization Tutorial",
        description: "Learn how to customize your storefront to match your brand identity.",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Marketing Your Products",
        description: "Effective strategies to promote your products and reach more customers.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Inventory Management",
        description: "Keep track of your stock and never miss a sale due to inventory issues.",
        image: "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ]
  },
  {
    id: "templates",
    label: "Templates",
    icon: <FileText className="h-5 w-5" />,
    resources: [
      {
        title: "Product Description Templates",
        description: "Copy-and-paste templates to create compelling product descriptions.",
        image: "https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Email Marketing Templates",
        description: "Ready-to-use email templates for promotions, abandoned carts, and more.",
        image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Social Media Post Templates",
        description: "Professionally designed templates for your social media marketing.",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ]
  },
]

const ResourcesSection = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <section 
      id="resources" 
      ref={ref} 
      className="py-20 bg-black border-t border-gray-900"
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
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            Resources to Help You Grow
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Access our library of guides, tutorials, and templates to help you succeed as a seller.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-black">
              {resourceCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {resourceCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {category.resources.map((resource, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-black border-gray-800">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={resource.image} 
                            alt={resource.title} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-white">{resource.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300">{resource.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 hover:bg-gray-800 p-0 flex items-center">
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}

export default ResourcesSection