'use client';

import toast from 'react-hot-toast';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  quantity: number;
  isBestSeller?: boolean;
  deliveryOptions?: string[];
  promotionType?: 'express' | 'super-mart';
  seller?: string;
  freeDelivery?: boolean;
  deliveryDate?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id.toString());
        
        if (existingItem) {
          // If item exists, increment quantity
          set({
            items: currentItems.map(item => 
              item.id === product.id.toString() 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: product.id.toString(),
            title: product.title,
            price: product.price,
            oldPrice: product.oldPrice,
            discount: product.discount,
            image: product.image,
            quantity: 1,
            isBestSeller: product.isBestSeller,
            deliveryOptions: product.deliveryOptions,
            promotionType: product.promotionType,
            seller: product.seller || "Marketplace",
            freeDelivery: true,
            deliveryDate: "Tomorrow"
          };
          
          set({ items: [...currentItems, newItem] });
          toast.success('Item Add successfully Added');

        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });

      },
      
      incrementQuantity: (id) => {
        set({
          items: get().items.map(item => 
            item.id === id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        });
      },
      
      decrementQuantity: (id) => {
        const item = get().items.find(item => item.id === id);
        
        if (item && item.quantity > 1) {
          set({
            items: get().items.map(item => 
              item.id === id 
                ? { ...item, quantity: item.quantity - 1 } 
                : item
            )
          });
        } else {
          // Remove item if quantity would be 0
          get().removeItem(id);
        }
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity, 
          0
        );
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);