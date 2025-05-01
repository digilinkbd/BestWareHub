"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { CheckCircle, Truck, Star, Info } from "lucide-react"; // Example icons from lucide-react



const AnimatedText = ({ options }: { options: string[] }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % options.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [options.length]);

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center h-full"
        >
          {<CheckCircle className="w-4 h-4 text-blue-400" />}
          <span className="ml-1 text-xs text-gray-600">{options[index]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;
