"use client"; 

import Link from 'next/link';
import { Heart, RefreshCw, Eye, Plus } from 'lucide-react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { formatePrice } from '@/lib/formatter';
import { useSession } from 'next-auth/react'; 
import { toast } from 'sonner'; 

import { addToCart as addToCartApi } from '@/services/cart.service';
import { addToWishlist as addToWishlistApi, removeFromWishlist as removeFromWishlistApi } from '@/services/wishlist.service'; 
import { Product } from '@/interfaces/products.interfsces';
import { useAppContext } from './context/CartContext';


export default function ProductCard({ product }: { product: Product }) {
  const { data: session } = useSession(); 
  const { wishlist, addToCart, addToWishlist, removeFromWishlist } = useAppContext(); 

  const isInWishlist = wishlist.some((item) => item._id === product._id);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-xs" />);
      }
    }
    return stars;
  };

  const handleAddToCart = async () => {
    if (!session?.accessToken) {
      toast.error("Please login first", { description: "You need to be logged in to add items to cart." });
      return;
    }

    try {
      await addToCartApi(product._id, session.accessToken);
      addToCart(product); 
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    }
  };

  const handleToggleWishlist = async () => {
    if (!session?.accessToken) {
      toast.error("Please login first");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlistApi(product._id, session.accessToken);
        removeFromWishlist(product._id);
      } else {
        await addToWishlistApi(product._id, session.accessToken);
        addToWishlist(product);
      }
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      
      <div className="relative flex-shrink-0">
        <Link href={`/products/${product._id}`}>
          <img
            className="w-full h-60 object-contain bg-white"
            alt={product.title}
            src={product.imageCover}
          />
        </Link>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          
          <button 
            onClick={handleToggleWishlist} 
            className={`bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-sm transition hover:scale-110
              ${isInWishlist ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500'}
            `}
          >
            <Heart 
              size={16} 
              className={isInWishlist ? 'fill-red-500 text-red-500' : ''} 
            />
          </button>
          
          <button className="bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-primary-600 transition hover:scale-110">
            <RefreshCw size={16} />
          </button>

          <Link 
            href={`/products/${product._id}`} 
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-primary-600 transition hover:scale-110"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">{product.category?.name || 'General'}</div>
        
        <h3 className="font-medium text-xl mb-2 cursor-pointer min-h-[48px] text-gray-800" title={product.title}>
          <Link href={`/products/${product._id}`} className="line-clamp-2 hover:text-primary-600 transition">
            {product.title}
          </Link>
        </h3>

        <div className="flex items-center mb-3 gap-1">
          <div className="flex items-center text-amber-400">
            {renderStars(product.ratingsAverage)}
          </div>
          <span className="text-xs text-gray-500">({product.ratingsQuantity})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            {product.priceAfterDiscount ? (
              <>
                <span className="text-lg font-bold text-gray-800">
                  {formatePrice(product.priceAfterDiscount)}
                </span>
                <span className="text-sm text-gray-400 line-through ml-2 block text-xs">
                  {formatePrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                {formatePrice(product.price)}
              </span>
            )}
          </div>
          
      
            <button 
              onClick={handleAddToCart} 
              className="h-10 w-10 rounded-full flex items-center justify-center transition bg-green-600 text-white hover:bg-green-700 shadow-md hover:scale-105"
            >
              <Plus size={18} />
            </button>

        </div>
      </div>
    </div>
  );
}