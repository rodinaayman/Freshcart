"use client";

import { useState } from "react";
import { formatePrice } from "@/lib/formatter";
import { FaMinus, FaPlus, FaCartPlus, FaBolt, FaHeart, FaShareAlt } from "react-icons/fa";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { addToCart, updateCartQuantity } from "@/services/cart.service";
import { addToWishlist } from "@/services/wishlist.service";
import { useAppContext } from "../shared/context/CartContext";
import { Product } from "@/interfaces/products.interfsces";

interface AddToCartSectionProps {
  product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const { data: session } = useSession();
  const { addToCart: addToCartContext } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = async () => {
    if (!session?.accessToken) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);
      
      await addToCart(product._id, session.accessToken);
      
      if (quantity > 1) {
        await updateCartQuantity(product._id, quantity, session.accessToken);
      }
      
      addToCartContext(product);
      toast.success("Added to cart successfully");
      
    } catch (error: any) {
      toast.error(error.message || "Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!session?.accessToken) {
      toast.error("Please login first");
      return;
    }

    try {
      await addToWishlist(product._id, session.accessToken);
      toast.success("Added to wishlist");
    } catch (error: any) {
      toast.error(error.message || "Error updating wishlist");
    }
  };

  const price = product.price;
  const priceAfterDiscount = product.priceAfterDiscount;
  const unitPrice = priceAfterDiscount || price;
  const totalPrice = unitPrice * quantity;

  return (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
            <button 
              onClick={handleDecrease} 
              disabled={quantity <= 1}
              className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaMinus size={12} />
            </button>
            <input 
              type="number" 
              readOnly 
              value={quantity} 
              className="w-16 text-center border-0 focus:ring-0 text-lg font-medium" 
            />
            <button 
              onClick={handleIncrease} 
              className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition"
            >
              <FaPlus size={12} />
            </button>
          </div>
          <span className="text-sm text-gray-500">Available</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Price:</span>
          <span className="text-2xl font-bold text-emerald-600">
            {formatePrice(totalPrice)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button 
          onClick={handleAddToCart} 
          disabled={loading}
          className="flex-1 bg-[#16a34a] text-white py-3.5 px-6 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm shadow-green-300 disabled:opacity-70"
        >
          <FaCartPlus size={18} /> {loading ? "Adding..." : "Add to Cart"}
        </button>
        <button className="flex-1 bg-gray-900 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2">
          <FaBolt size={18} /> Buy Now
        </button>
      </div>
      

      <div className="flex gap-3 mb-6">
        <button 
          onClick={handleAddToWishlist}
          className="flex-1 border-2 border-gray-200 py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 text-gray-700 hover:border-red-400 hover:text-red-500"
        >
          <FaHeart size={18} /> Add to Wishlist
        </button>
        <button className="border-2 border-gray-200 py-3 px-4 rounded-xl hover:border-green-400 hover:text-emerald-600 transition">
          <FaShareAlt size={18} />
        </button>
      </div>
    </>
  );
}