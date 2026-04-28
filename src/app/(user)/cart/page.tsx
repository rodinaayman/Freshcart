"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getCart, updateCartQuantity, removeFromCart, clearCart } from "@/services/cart.service";
import { toast } from "sonner";
import { formatePrice } from "@/lib/formatter";
import { FaMinus, FaPlus, FaTrash, FaShoppingCart, FaTag, FaLock, FaTruck, FaShieldAlt, FaBoxOpen, FaArrowRight } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useAppContext } from "@/components/shared/context/CartContext";

interface CartItem {
  _id: string; 
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category?: { name: string };
    priceAfterDiscount?: number;
    price: number;
  };
}

interface CartData {
  products: CartItem[];
  totalCartPrice: number;
}

export default function CartPage() {
  const { data: session, status } = useSession(); 
  const { removeFromCart: removeFromContext } = useAppContext();
  
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); 

  const fetchCart = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const res = await getCart(session.accessToken);
      if (res && res.data) {
        setCartData(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
      setCartData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    } 
    else if (status === 'unauthenticated') {
      setLoading(false);
      setCartData(null);
    }
  }, [status, session]);

  const handleUpdateQuantity = async (productId: string, newCount: number) => {
    if (newCount < 1) return; 
    
    setActionLoading(productId);
    try {
      await updateCartQuantity(productId, newCount, session!.accessToken);
      setCartData(prev => {
        if (!prev) return null;
        const updatedProducts = prev.products.map(item => 
          item.product._id === productId ? { ...item, count: newCount } : item
        );
        const newTotal = updatedProducts.reduce((acc, item) => acc + (item.price * item.count), 0);
        return { ...prev, products: updatedProducts, totalCartPrice: newTotal };
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setActionLoading(productId);
    try {
      await removeFromCart(productId, session!.accessToken);
      removeFromContext(productId); 
      
      setCartData(prev => {
        if (!prev) return null;
        const filteredProducts = prev.products.filter(item => item.product._id !== productId);
        const newTotal = filteredProducts.reduce((acc, item) => acc + (item.price * item.count), 0);
        return { ...prev, products: filteredProducts, totalCartPrice: newTotal };
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearCart = async () => {
    if(!session?.accessToken) return;
    
    try {
      await clearCart(session.accessToken);
      setCartData(null); 
      
      toast.success("Cart cleared successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to clear cart");
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (status === 'unauthenticated' || !cartData || cartData.products.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <FaBoxOpen className="text-5xl text-gray-300" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet.<br/>Start exploring our products!
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-[#25c95e] text-white py-3.5 px-8 rounded-xl font-semibold hover:bg-[#1ea04d] transition-all shadow-lg active:scale-[0.98]"
          >
            Start Shopping
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-primary-600 transition">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-[#25c95e] text-white w-12 h-12 rounded-xl flex items-center justify-center">
                  <FaShoppingCart size={20} />
                </span>
                Shopping Cart
              </h1>
              <p className="text-gray-500 mt-2">You have <span className="font-semibold text-primary-600">{cartData.products.length} items</span> in your cart</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartData.products.map((item) => {
                const product = item.product;
                const isUpdating = actionLoading === product._id;
                const itemTotal = item.price * item.count;
                
                return (
                  <div key={product._id} className="relative bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
                    <div className="p-4 sm:p-5">
                      <div className="flex gap-4 sm:gap-6">
                        
                        <Link href={`/products/${product._id}`} className="relative shrink-0 group">
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gray-50 p-3 border border-gray-100 overflow-hidden">
                            <img 
                              alt={product.title} 
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" 
                              src={product.imageCover} 
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            In Stock
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="mb-3">
                            <Link href={`/products/${product._id}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 text-base sm:text-lg">
                              {product.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                                {product.category?.name || 'General'}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                              <span className="text-primary-600 font-bold text-lg">{formatePrice(item.price)}</span>
                              <span className="text-xs text-gray-400">per unit</span>
                            </div>
                          </div>

                          <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                            
                            <div className="flex items-center">
                              <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                                <button 
                                  onClick={() => handleUpdateQuantity(product._id, item.count - 1)}
                                  disabled={isUpdating || item.count <= 1}
                                  className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-all"
                                >
                                  <FaMinus size={10} />
                                </button>
                                
                                <span className="w-12 text-center font-bold text-gray-900">
                                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : item.count}
                                </span>
                                
                                <button 
                                  onClick={() => handleUpdateQuantity(product._id, item.count + 1)}
                                  disabled={isUpdating}
                                  className="h-8 w-8 rounded-lg bg-[#25c95e] shadow-sm flex items-center justify-center text-white hover:bg-green-700 disabled:opacity-50 transition-all"
                                >
                                  <FaPlus size={10} />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xs text-gray-400 mb-0.5">Total</p>
                                <p className="text-xl font-bold text-gray-900">
                                  {formatePrice(itemTotal)}
                                </p>
                              </div>
                              <button 
                                onClick={() => handleRemoveItem(product._id)}
                                disabled={isUpdating}
                                className="h-10 w-10 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all duration-200"
                                title="Remove item"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
              <Link href="/products" className="text-green-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2">
                <span>←</span> Continue Shopping
              </Link>
              
              <button 
                onClick={handleClearCart}
                className="group flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <FaTrash className="text-xs group-hover:scale-110 transition-transform" />
                <span>Clear all items</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24 shadow-sm">
              
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 bg-[#25c95e]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">Order Summary</h2>
                <p className="text-green-100 text-sm mt-1">{cartData.products.length} items in your cart</p>
              </div>
              
              <div className="p-6 space-y-5">
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center gap-3 border border-green-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <FaTruck className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-700 text-sm">Free Shipping!</p>
                    <p className="text-xs text-green-600">You qualify for free delivery</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{formatePrice(cartData.totalCartPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-900 font-semibold">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{formatePrice(cartData.totalCartPrice)}</span>
                        <span className="text-sm text-gray-500 ml-1">EGP</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/50 transition-all">
                  <FaTag size={12} />
                  <span className="text-sm font-medium">Apply Promo Code</span>
                </button>

                <Link 
                  href="/checkout" 
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 bg-[#25c95e] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#1ea04d] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-600/20 active:scale-[0.98]"
                >
                  <FaLock size={12} />
                  <span>Secure Checkout</span>
                </Link>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FaShieldAlt className="text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FaTruck className="text-blue-500" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
                     <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center">
              <Link href="/products" className="text-green-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2">
                <span>←</span> Continue Shopping
              </Link>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}