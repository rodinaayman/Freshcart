'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/images/freshcart-logo.svg'; 
import MobileMenu from './MobileMenu'; 
import { useRouter } from 'next/navigation';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  FaHeadset, FaHeart, FaShoppingCart, FaUser, FaUserCircle, 
  FaBoxOpen, FaAddressBook, FaCog, FaSignOutAlt, FaSpinner 
} from 'react-icons/fa';
import { Search } from 'lucide-react'; 

import { useSession, signOut } from 'next-auth/react';
import { useAppContext } from '@/components/shared/context/CartContext';
import { getCategories } from '@/services/categories.service';

const desiredCategoryNames = [
  'Electronics',
  "Women's Fashion",
  "Men's Fashion",
  'Beauty & Health'
];

export default function Mainbar() {
  const { data: session } = useSession();
  const { cart, wishlist } = useAppContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res && res.data) {
          const filtered = res.data.filter((cat: any) => 
            desiredCategoryNames.includes(cat.name)
          );
          
          const sorted = desiredCategoryNames.map(name => 
            filtered.find((cat: any) => cat.name === name)
          ).filter(Boolean);
          
          setMenuCategories(sorted);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  const formatCount = (count: number) => {
    return count > 9 ? "9+" : count;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className=" mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4 lg:gap-8">
          
          <Link href="/" className="shrink-0">
            <Image src={logo} alt="FreshCart" width={160} height={31} className="h-6 lg:h-8 w-auto" priority />
          </Link>

          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full px-5 py-6 pr-14 rounded-full border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-[#25c95e]/20 focus:border-[#25c95e]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#25c95e] hover:bg-[#1ea04d] text-white">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <nav className="hidden xl:flex items-center gap-6">
            <Link href="/" className="text-gray-700 text-xl hover:text-[#25c95e] font-medium">Home</Link>
            <Link href="/products" className="text-gray-700 text-xl hover:text-[#25c95e] font-medium">Shop</Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent p-0 text-gray-700 text-xl hover:text-[#25c95e] font-medium">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2 bg-white border rounded-xl shadow-xl">
                      
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/categories" className="block select-none rounded-md p-3 leading-none hover:bg-green-50 hover:text-[#25c95e] text-gray-600 text-sm font-semibold">
                            All Categories
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      {loadingCats ? (
                        <li className="p-3 text-center text-gray-400 flex justify-center">
                           <FaSpinner className="animate-spin" />
                        </li>
                      ) : (
                        menuCategories.map((cat: any) => (
                          <li key={cat._id}>
                            <NavigationMenuLink asChild>
                              <Link 
                                href={`/products?category=${cat._id}`} 
                                className="block select-none rounded-md p-3 leading-none hover:bg-green-50 hover:text-[#25c95e] text-gray-600 text-sm"
                              >
                                {cat.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link href="/brands" className="text-gray-700 text-xl hover:text-[#25c95e] font-medium">Brands</Link>
          </nav>

          <div className="flex items-center gap-1 lg:gap-2">
            
            <Link href="#" className="hidden lg:flex items-center gap-2 pr-3 mr-2 border-r border-gray-200 hover:opacity-80">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <FaHeadset className="text-[#25c95e] text-lg" />
              </div>
              <div className="text-xs">
                <div className="text-gray-400">Support</div>
                <div className="font-semibold text-gray-700 text-xl">24/7 Help</div>
              </div>
            </Link>

            <Link href="/wishlist" className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
              <FaHeart className="text-xl text-gray-500 group-hover:text-[#25c95e]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center shadow-md px-1">
                  {formatCount(wishlist.length)}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
              <FaShoppingCart className="text-xl text-gray-500 group-hover:text-[#25c95e]" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#25c95e] text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center shadow-md px-1">
                  {formatCount(cart.length)}
                </span>
              )}
            </Link>

            {session ? (
              <div className="hidden lg:block relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
                      <FaUserCircle className="text-xl text-gray-500 group-hover:text-[#25c95e] transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent className="w-64 mt-2 p-0 rounded-2xl shadow-xl border-gray-100" align="end">
                    <DropdownMenuLabel className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <FaUserCircle className="text-xl text-[#25c95e]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{session.user?.name}</p>
                          <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <div className="py-2">
                      <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#25c95e] hover:bg-green-50 cursor-pointer">
                        <Link href="/profile" className="flex items-center gap-3 w-full">
                          <FaUser className="w-4 text-gray-400" /> My Profile
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#25c95e] hover:bg-green-50 cursor-pointer">
                        <Link href="/orders" className="flex items-center gap-3 w-full">
                          <FaBoxOpen className="w-4 text-gray-400" /> My Orders
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#25c95e] hover:bg-green-50 cursor-pointer">
                        <Link href="/wishlist" className="flex items-center gap-3 w-full">
                          <FaHeart className="w-4 text-gray-400" /> My Wishlist
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#25c95e] hover:bg-green-50 cursor-pointer">
                        <Link href="/profile/addresses" className="flex items-center gap-3 w-full">
                          <FaAddressBook className="w-4 text-gray-400" /> Addresses
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#25c95e] hover:bg-green-50 cursor-pointer">
                        <Link href="/profile/settings" className="flex items-center gap-3 w-full">
                          <FaCog className="w-4 text-gray-400" /> Settings
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="my-0" />

                    <div className="py-2">
                      <DropdownMenuItem 
                        onClick={() => signOut({ callbackUrl: '/' })} 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer w-full"
                      >
                        <FaSignOutAlt className="w-4" /> Sign Out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block">
                <Button className="ml-2 px-5 py-2.5 rounded-full bg-[#25c95e] hover:bg-[#1ea04d] text-white text-sm font-semibold shadow-sm">
                  <FaUser className="mr-2 text-xs" /> Sign In
                </Button>
              </Link>
            )}

            <MobileMenu />

          </div>
        </div>
      </div>
    </header>
  );
}