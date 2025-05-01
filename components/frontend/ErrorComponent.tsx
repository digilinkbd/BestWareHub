"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ErrorComponent = () => {
  useEffect(() => {
    // Add floating particles effect
    const createParticles = () => {
      const particlesContainer = document.getElementById('particles-container');
      if (!particlesContainer) return;
      
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full';
        
        // Randomize size
        const size = Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Randomize color
        particle.style.backgroundColor = ['#FCD34D', '#FBBF24', '#F59E0B', '#FDBA74'][Math.floor(Math.random() * 4)];
        
        // Randomize position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Randomize opacity
        particle.style.opacity = `${Math.random() * 0.6 + 0.2}`;
        
        // Add floating animation
        particle.style.animation = `float ${Math.random() * 20 + 10}s linear infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
    
    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(${Math.random() * 30}px, ${Math.random() * 30}px) rotate(5deg); }
        50% { transform: translate(${Math.random() * -30}px, ${Math.random() * 30}px) rotate(-5deg); }
        75% { transform: translate(${Math.random() * -30}px, ${Math.random() * -30}px) rotate(10deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 min-h-screen overflow-hidden relative flex items-center justify-center">
      <div id="particles-container" className="absolute inset-0 pointer-events-none" />
      
      <div className="relative w-full max-w-4xl mx-auto px-4">
        <motion.div 
          className="rounded-2xl bg-white bg-opacity-70 backdrop-blur-sm p-8 shadow-xl border border-amber-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              className="w-full md:w-1/2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1 
              }}
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: [0, -3, 0, 3, 0],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 5
                  }}
                >
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64 mx-auto">
                    <path 
                      fill="#FCD34D" 
                      d="M47.1,-51.2C59.4,-35.1,67.2,-17.6,66.1,-1.1C65,15.3,55,30.7,42.7,45.9C30.3,61.2,15.2,76.3,-1.9,78.2C-18.9,80.1,-37.7,68.8,-50.6,53.5C-63.6,38.1,-70.5,19.1,-70.6,-0.1C-70.7,-19.3,-64,-38.5,-50.8,-54.6C-37.7,-70.7,-18.8,-83.6,-0.1,-83.5C18.7,-83.4,37.4,-70.3,47.1,-51.2Z" 
                      transform="translate(100 100)" 
                    />
                  </svg>
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <div className="text-center">
                    <motion.h1 
                      className="text-6xl md:text-7xl font-bold text-amber-600"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 2
                      }}
                    >
                      505
                    </motion.h1>
                    <motion.div
                      className="flex items-center justify-center mt-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 360] }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      <div className="bg-amber-500 rounded-full p-2">
                        <RefreshCw className="h-6 w-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="w-full md:w-1/2 text-center md:text-left"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="text-amber-600">Oops!</span> Server Error
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Something went wrong on our end. Our team has been notified and is working to fix the issue.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg px-6 py-5 w-full sm:w-auto"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    asChild
                    className="border-amber-400 text-amber-600 hover:bg-amber-50 px-6 py-5 w-full sm:w-auto"
                  >
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Return Home
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorComponent;