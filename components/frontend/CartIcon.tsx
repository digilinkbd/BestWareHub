import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/hooks/cart-store';

const CartIcon = () => {
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();
  
  return (
    <div className="relative">
      <ShoppingCart size={24} />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartIcon;