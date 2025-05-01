"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: "Switching to Kartify was the best business decision I've made. My sales have increased by 200% in just three months!",
    author: "Sarah Johnson",
    role: "Fashion Retailer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    initials: "SJ",
    stars: 5,
  },
  {
    quote: "The analytics tools have given me insights I never had before. Now I know exactly what products to focus on.",
    author: "Michael Chen",
    role: "Electronics Store Owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    initials: "MC",
    stars: 5,
  },
  {
    quote: "Customer support is incredible. Any time I've had an issue, they've resolved it within hours. Truly exceptional service.",
    author: "Emma Rodriguez",
    role: "Handmade Crafts Seller",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    initials: "ER",
    stars: 5,
  },
]

const TestimonialsSection = () => {
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
      id="testimonials" 
      ref={ref} 
      className="py-24 bg-gray-900 text-white border-t border-gray-900"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/warehouse-bg-blurred.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What Our Sellers Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Join thousands of satisfied sellers who have transformed their businesses with Kartify.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-black/40 backdrop-blur-sm border border-gray-800 text-white hover:bg-black/50 transition-colors duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4 border-2 border-yellow-400">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback className="bg-yellow-400 text-black">{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-yellow-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection