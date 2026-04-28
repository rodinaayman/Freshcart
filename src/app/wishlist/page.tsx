"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { removeFromWishlist as removeFromWishlistApi } from '@/services/wishlist.service';
import { addToCart as addToCartApi } from '@/services/cart.service';
import { toast } from 'sonner';
import { formatePrice } from '@/lib/formatter';

import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Heart, Trash2, ShoppingCart, Loader2, Check } from 'lucide-react';
import { FaShoppingCart } from 'react-icons/fa'; 
import { useState } from 'react';
import { useAppContext } from '@/components/shared/context/CartContext';
import { Product } from '@/interfaces/products.interfsces';

export default function WishPage() {
  const { data: session } = useSession();
  const { wishlist, cart, removeFromWishlist, addToCart } = useAppContext();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRemove = async (id: string) => {
    if (!session?.accessToken) return;
    
    setLoadingId(id);
    try {
      await removeFromWishlistApi(id, session.accessToken);
      removeFromWishlist(id);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!session?.accessToken) {
      toast.error("Please login first");
      return;
    }

    setLoadingId(product._id);
    try {
      await addToCartApi(product._id, session.accessToken);
      addToCart(product);
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className=" mx-auto px-4 py-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Wishlist</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <Heart className="text-xl fill-red-500  text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-500 text-sm">{wishlist.length} items saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 py-8">
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Heart className="mx-auto w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Start adding products you love!</p>
            <Link href="/products">
              <Button className="bg-[#25c95e] hover:bg-[#1ea04d] rounded-full px-8">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>

            <div className="divide-y divide-gray-100">
              {wishlist.map((product) => {
                const isLoading = loadingId === product._id;
                const isInCart = cart.some(item => item._id === product._id);
     
                return (
                  <div key={product._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:px-6 md:py-5 items-center hover:bg-gray-50/50 transition-colors">
                    
                    <div className="md:col-span-6 flex items-center gap-4">
                      <Link href={`/products/${product._id}`} className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        <img 
                          alt={product.title} 
                          className="w-full h-full object-contain p-2" 
                          src={product.imageCover} 
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link href={`/products/${product._id}`} className="font-medium text-gray-900 hover:text-[#25c95e] transition-colors line-clamp-2">
                          {product.title}
                        </Link>
                        <p className="text-sm text-gray-400 mt-1">{product.category?.name || 'General'}</p>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex md:justify-center items-center gap-2">
                      <span className="md:hidden text-sm text-gray-500">Price:</span>
                      <div className="text-right md:text-center">
                        <div className="font-semibold text-gray-900">
                          {formatePrice(product.priceAfterDiscount || product.price)}
                        </div>
                        {product.priceAfterDiscount && (
                          <div className="text-sm text-gray-400 line-through">
                            {formatePrice(product.price)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2 flex md:justify-center items-center">
                      <span className="md:hidden text-sm text-gray-500 mr-2">Status:</span>
                      
                      {isInCart ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                           <FaShoppingCart className="text-[10px]" /> 
                           In Cart
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          In Stock
                        </span>
                      )}

                    </div>

                    <div className="md:col-span-2 flex items-center gap-2 md:justify-center">
                      
                      {isInCart ? (
                        <Link 
                          href="/cart" 
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="md:hidden lg:inline">View Cart</span>
                        </Link>
                      ) : (
                        <Button 
                          onClick={() => handleAddToCart(product)} 
                          disabled={isLoading}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-[#25c95e] text-white hover:bg-[#1ea04d]"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShoppingCart className="h-4 w-4" />
                          )}
                          <span className="md:hidden lg:inline">Add to Cart</span>
                        </Button>
                      )}

                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleRemove(product._id)} 
                        disabled={isLoading}
                        className="w-10 h-10 rounded-lg border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Link href="/products" className="text-gray-500 hover:text-[#25c95e] text-sm font-medium transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}