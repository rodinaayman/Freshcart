'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FaTruck, FaGift, FaPhone, FaEnvelope, FaUser, FaUserPlus } from 'react-icons/fa';

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <div className="hidden lg:block text-sm border-b border-gray-100 bg-white">
      <div className=" mx-auto px-4">
        <div className="flex justify-between items-center h-10">
          
          <div className="flex items-center gap-6 text-gray-500">
            <span className="flex items-center gap-2">
              <FaTruck className="text-[#25c95e]" /> 
              <span>Free Shipping on Orders 500 EGP</span>
            </span>
            <span className="flex items-center gap-2">
              <FaGift className="text-[#25c95e]" /> 
              <span>New Arrivals Daily</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            
            <div className="flex items-center gap-4 text-gray-500">
              <a href="tel:+18001234567" className="flex items-center gap-1.5 hover:text-[#25c95e] transition-colors">
                <FaPhone className="text-[#25c95e]" />
                <span>+1 (800) 123-4567</span>
              </a>
              <a href="mailto:support@freshcart.com" className="flex items-center gap-1.5 hover:text-[#25c95e] transition-colors">
                <FaEnvelope className="text-[#25c95e]" />
                <span>support@freshcart.com</span>
              </a>
            </div>

            <span className="w-px h-4 bg-gray-200"></span>

            <div className="flex items-center gap-4">
              {session ? (
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <FaUser />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link href="/login" className="flex items-center gap-1.5 text-gray-600 hover:text-[#25c95e] transition-colors">
                    <FaUser />
                    <span>Sign In</span>
                  </Link>
                  <Link href="/signup" className="flex items-center gap-1.5 text-gray-600 hover:text-[#25c95e] transition-colors">
                    <FaUserPlus />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}