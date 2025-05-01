"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, ArrowRight } from 'lucide-react'

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for new sellers just getting started",
    features: [
      "Up to 100 product listings",
      "Basic analytics",
      "Standard support",
      "2.5% transaction fee",
      "Mobile app access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    description: "For growing businesses ready to scale",
    features: [
      "Unlimited product listings",
      "Advanced analytics",
      "Priority support",
      "1.5% transaction fee",
      "Marketing tools",
      "Inventory management",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    description: "For established businesses with high volume",
    features: [
      "Unlimited product listings",
      "Custom analytics dashboard",
      "Dedicated account manager",
      "0.5% transaction fee",
      "Advanced marketing suite",
      "API access",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const CTASection = () => {
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
      id="pricing" 
      ref={ref} 
      className="py-24 bg-black border-t border-gray-900"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1))",
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
            Ready to Start Selling?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Choose the plan that's right for your business and start selling online today.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants} className="flex">
              <Card className={`flex flex-col h-full w-full relative bg-black ${plan.popular ? 'border-2 border-yellow-400 shadow-xl' : 'border border-gray-700'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6 text-center border-b border-gray-800">
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-300">{plan.description}</p>
                </div>
                <CardContent className="flex-grow p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-gray-300">
                        <Check className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold' : 'border-yellow-400 text-black hover:bg-gray-800'}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                    {plan.popular && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-300 mb-6">
            Not sure which plan is right for you? Contact our sales team for a personalized recommendation.
          </p>
          <Button variant="outline" className="mx-auto border-yellow-400 text-yellow-400 hover:bg-gray-300 bg-black">
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection