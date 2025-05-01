"use client";

import { Store } from 'lucide-react';
import Link from "next/link";
import { motion } from "framer-motion";

export function OnboardingHeader() {
  return (
    <motion.header 
      className="w-full md:py-6 py-2 md:px-4 px-1"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Store className="h-6 w-6 text-white" />
          </motion.div>
          <span className="text-xl font-bold text-white">BESTWAREHUB</span>
        </Link>
        
        <div className=" items-center space-x-4 md:flex hidden">
          <span className="text-white/80">Need help?</span>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/support" 
              className="text-white hover:text-white/80 transition-colors"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
