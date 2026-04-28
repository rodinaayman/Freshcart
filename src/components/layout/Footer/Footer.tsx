import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/freshcart-logo.svg'; 
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { MdPhone, MdEmail, MdLocationOn } from 'react-icons/md';



import { FaTruck, FaRedo, FaShieldAlt, FaHeadset } from 'react-icons/fa'; 

const featuresData = [
  {
    icon: FaTruck,
    title: 'Free Shipping',
    description: 'On orders over 500 EGP',
  },
  {
    icon: FaRedo, 
    title: 'Easy Returns',
    description: '14-day return policy',
  },
  {
    icon: FaShieldAlt, 
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: FaHeadset, 
       title: '24/7 Support',
    description: 'Contact us anytime',
  },
];
export default function Footer() {
  return (<>
         <section className="bg-green-50 py-14 border border-t-emerald-200">
      <div className=" mx-auto px-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {featuresData.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              
              <div className="w-14 h-14 rounded-xl bg-[#dcfce7] flex items-center justify-center shrink-0 shadow-sm border border-green-100">
                <feature.icon className="text-[#16a34a] w-7 h-7" /> 
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xl mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-500 ">
                  {feature.description}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  
    <footer className="bg-gray-900 text-white">
      <div className=" mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          
          <div className="md:col-span-2 space-y-6">
            <div className="relative w-40 h-20">
              <Image 
                src={logo} 
                alt="FreshCart Logo" 
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 text-xl max-w-sm leading-relaxed">
              FreshCart is your one-stop-shop for fresh groceries. We deliver quality products right to your doorstep with care and speed.
            </p>
            
            <div className="space-y-3 text-xl text-gray-300">
              <div className="flex items-center gap-3">
                <MdPhone className="text-[#25c95e]" />
                <span>+1 (800) 123 - 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MdEmail className="text-[#25c95e]" />
                <span>support@freshcart.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MdLocationOn className="text-[#25c95e]" />
                <span>123 Commerce Street, New York, NY 10001</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:bg-[#25c95e] hover:text-white transition-colors">
                <FaFacebookF size={25} />
              </Link>
              <Link href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:bg-[#25c95e] hover:text-white transition-colors">
                <FaTwitter size={25} />
              </Link>
              <Link href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:bg-[#25c95e] hover:text-white transition-colors">
                <FaInstagram size={25} />
              </Link>
              <Link href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:bg-[#25c95e] hover:text-white transition-colors">
                <FaYoutube size={25} />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            <div>
              <h3 className="text-2xl font-bold mb-5 text-white">Shop</h3>
              <ul className="space-y-3 text-xl text-gray-400">
                <li><Link href="/products" className="hover:text-[#25c95e] transition-colors">All Products</Link></li>
                <li><Link href="" className="hover:text-[#25c95e] transition-colors">Electronics</Link></li>
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">Groceries</Link></li>
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">Fashion</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-5 text-white">Account</h3>
              <ul className="space-y-3 text-xl text-gray-400">
                <li><Link href="/profile/addresses" className="hover:text-[#25c95e] transition-colors">My Account</Link></li>
                <li><Link href="/signin" className="hover:text-[#25c95e] transition-colors">Sign In</Link></li>
                <li><Link href="/orders" className="hover:text-[#25c95e] transition-colors">Orders</Link></li>
                <li><Link href="/wishlist" className="hover:text-[#25c95e] transition-colors">Wishlist</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-5 text-white">Support</h3>
              <ul className="space-y-3 text-xl text-gray-400">
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">FAQs</Link></li>
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">Track Order</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-5 text-white">Legal</h3>
              <ul className="space-y-3 text-xl text-gray-400">
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">Terms of Use</Link></li>
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-[#25c95e] transition-colors">Returns</Link></li>
              </ul>
            </div>

          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-xl text-gray-500">
            © 2026 FreshCart. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-3xl text-gray-400">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}