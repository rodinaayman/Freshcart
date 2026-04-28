"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { getCart } from '@/services/cart.service';
import { getWishlist } from '@/services/wishlist.service';
import { Product } from '@/interfaces/products.interfsces';

interface AppContextType {
  cart: Product[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromCart: (id: string) => void;
  removeFromWishlist: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (status === 'authenticated' && session?.accessToken) {
        try {
          const cartRes = await getCart(session.accessToken);
          if (cartRes?.data?.products) {
            const cartProducts = cartRes.data.products.map((item: any) => item.product || item);
            setCart(cartProducts);
          }
          const wishlistRes = await getWishlist(session.accessToken);
          if (wishlistRes?.data) {
             setWishlist(wishlistRes.data);
          }
        } catch (error) {
          console.error("Failed to fetch initial cart/wishlist", error);
          setCart([]);
          setWishlist([]);
        }
      } else if (status === 'unauthenticated') {
        setCart([]);
        setWishlist([]);
      }
    };

    fetchInitialData();
  }, [status, session]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (!exists) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.filter(item => item._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item._id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      cart, 
      wishlist, 
      addToCart, 
      addToWishlist, 
      removeFromCart, 
      removeFromWishlist 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};