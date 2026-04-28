"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; 
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Home, ShoppingBag, Grid3x3, Tag, Heart, 
  ShoppingCart, LogIn, UserPlus, Headset, Menu, LogOut 
} from 'lucide-react';
import { useAppContext } from '@/components/shared/context/CartContext';

export default function MobileMenu() {
  const { data: session } = useSession(); 
  const { cart, wishlist } = useAppContext();

  const formatCount = (count: number) => {
    return count > 9 ? "9+" : count;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="lg:hidden ml-1 w-10 h-10 rounded-full bg-[#25c95e] hover:bg-[#1ea04d] text-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 max-w-[85vw] p-0 flex flex-col h-full bg-white">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
           <Link href="/" className="text-2xl font-bold text-[#25c95e]">FreshCart</Link>
        </div>

        <div className="p-4 border-b border-gray-100">
          <form className="relative">
            <Input placeholder="Search products..." className="w-full px-4 py-3 pr-12 rounded-xl border-gray-200 bg-gray-50 focus:border-[#25c95e]" />
            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#25c95e] hover:bg-[#1ea04d] text-white">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <SheetClose asChild><Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#25c95e] hover:bg-green-50"><Home className="w-5 h-5" /> Home</Link></SheetClose>
            <SheetClose asChild><Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#25c95e] hover:bg-green-50"><ShoppingBag className="w-5 h-5" /> Shop</Link></SheetClose>
            <SheetClose asChild><Link href="/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#25c95e] hover:bg-green-50"><Grid3x3 className="w-5 h-5" /> Categories</Link></SheetClose>
            <SheetClose asChild><Link href="/brands" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#25c95e] hover:bg-green-50"><Tag className="w-5 h-5" /> Brands</Link></SheetClose>
          </div>

          <div className="my-4 border-t border-gray-100"></div>

          <div className="space-y-1">
            <SheetClose asChild>
              <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50">
                <div className="relative w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center shadow-md px-1">
                      {formatCount(wishlist.length)}
                    </span>
                  )}
                </div>
                <span className="font-medium text-gray-700">Wishlist</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/cart" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50">
                <div className="relative w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[#25c95e]" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#25c95e] text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center shadow-md px-1">
                      {formatCount(cart.length)}
                    </span>
                  )}
                </div>
                <span className="font-medium text-gray-700">Cart</span>
              </Link>
            </SheetClose>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          {session ? (
             <SheetClose asChild>
                <Button 
                    onClick={() => signOut({ callbackUrl: '/' })} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600"
                >
                    <LogOut className="w-4 h-4"/> Logout
                </Button>
             </SheetClose>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <SheetClose asChild><Link href="/login" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25c95e] text-white font-semibold hover:bg-[#1ea04d]"><LogIn className="w-4 h-4"/> Sign In</Link></SheetClose>
              <SheetClose asChild><Link href="/signup" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#25c95e] text-[#25c95e] font-semibold hover:bg-green-50"><UserPlus className="w-4 h-4"/> Sign Up</Link></SheetClose>
            </div>
          )}
          
          <SheetClose asChild>
            <Link href="/contact" className="block p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-green-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><Headset className="w-5 h-5 text-[#25c95e]" /></div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Need Help?</div>
                  <div className="text-sm text-[#25c95e]">Contact Support</div>
                </div>
              </div>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}