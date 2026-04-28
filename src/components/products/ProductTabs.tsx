"use client";

import { useState } from 'react';
import { 
  FaBox, FaStar, FaTruck, FaCheck, FaRegStar, 
  FaStarHalfAlt, FaUndo, FaShieldAlt
} from 'react-icons/fa';

interface ProductTabsProps {
  description: string;
  category?: string;
  brand?: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

export default function ProductTabs({ 
  description, 
  category, 
  brand,
  ratingsAverage = 0,
  ratingsQuantity = 0
}: ProductTabsProps) {
  
  const [activeTab, setActiveTab] = useState('details');

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.1 && rating % 1 <= 0.9;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xl" />); // تكبير حجم النجوم
      } else if (i === fullStars && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xl" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xl" />);
      }
    }
    return stars;
  };

  return (
    <section className="py-10"> 
      <div className=" mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-3 px-8 py-5 font-semibold whitespace-nowrap transition-all duration-200 text-lg ${activeTab === 'details' ? 'text-emerald-600 border-b-4 border-emerald-600 bg-emerald-50/50' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`} // تكبير الخط والـ padding
              >
                <FaBox className="text-xl" /> Product Details
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-3 px-8 py-5 font-semibold whitespace-nowrap transition-all duration-200 text-lg ${activeTab === 'reviews' ? 'text-emerald-600 border-b-4 border-emerald-600 bg-emerald-50/50' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`}
              >
                <FaStar className="text-xl" /> Reviews ({ratingsQuantity})
              </button>
              <button 
                onClick={() => setActiveTab('shipping')}
                className={`flex items-center gap-3 px-8 py-5 font-semibold whitespace-nowrap transition-all duration-200 text-lg ${activeTab === 'shipping' ? 'text-emerald-600 border-b-4 border-emerald-600 bg-emerald-50/50' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`}
              >
                <FaTruck className="text-xl" /> Shipping & Returns
              </button>
            </div>
          </div>

          <div className="p-8">
            

            {activeTab === 'details' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">About this Product</h3> {/* تكبير العنوان */}
                  <p className="text-gray-700 leading-relaxed text-lg">{description}</p> {/* تكبير حجم النص */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-xl">Product Information</h4>
                    <ul className="space-y-4"> 
                       <li className="flex justify-between text-base"> 
                         <span className="text-gray-600">Category</span>
                        <span className="text-gray-900 font-medium">{category || 'N/A'}</span>
                      </li>
                      <li className="flex justify-between text-base">
                        <span className="text-gray-600">Brand</span>
                        <span className="text-gray-900 font-medium">{brand || 'N/A'}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-xl">Key Features</h4>
                    <ul className="space-y-4">
                      <li className="flex items-center text-base text-gray-700">
                        <FaCheck className="text-emerald-600 mr-3 w-5" /> Premium Quality Product
                      </li>
                      <li className="flex items-center text-base text-gray-700">
                        <FaCheck className="text-emerald-600 mr-3 w-5" /> 100% Authentic Guarantee
                      </li>
                      <li className="flex items-center text-base text-gray-700">
                        <FaCheck className="text-emerald-600 mr-3 w-5" /> Fast & Secure Packaging
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
                        {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
                  <div className="text-center">
                    <div className="text-7xl font-bold text-gray-900 mb-2">{ratingsAverage.toFixed(1)}</div> {/* تكبير الرقم جداً */}
                    <div className="flex justify-center gap-1">
                      {renderRatingStars(ratingsAverage)}
                    </div>
                    <p className="text-base text-gray-500 mt-3">Based on {ratingsQuantity} reviews</p>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-base text-gray-600 w-10">5 star</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: '25%' }}></div></div>
                      <span className="text-base text-gray-500 w-12">25%</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-base text-gray-600 w-10">4 star</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: '60%' }}></div></div>
                      <span className="text-base text-gray-500 w-12">60%</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-base text-gray-600 w-10">3 star</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: '10%' }}></div></div>
                      <span className="text-base text-gray-500 w-12">10%</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-base text-gray-600 w-10">2 star</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: '5%' }}></div></div>
                      <span className="text-base text-gray-500 w-12">5%</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-8">
                  <div className="text-center py-10">
                    <FaStar className="text-5xl text-gray-300 mb-4 mx-auto" />
                    <p className="text-lg text-gray-500">Customer reviews will be displayed here.</p>
                    <button className="mt-5 text-lg text-emerald-600 hover:text-emerald-700 font-semibold">Write a Review</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                        <FaTruck className="text-3xl" /> 
                      </div>
                      <h4 className="font-bold text-gray-900 text-2xl">Shipping Information</h4>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <FaCheck className="text-emerald-600 mt-1" />
                        <span>Free shipping on orders over $50</span>
                      </li>
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <FaCheck className="text-emerald-600 mt-1" />
                        <span>Standard delivery: 3-5 business days</span>
                      </li>
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <FaCheck className="text-emerald-600 mt-1" />
                        <span>Express delivery available (1-2 business days)</span>
                      </li>
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <FaCheck className="text-emerald-600 mt-1" />
                        <span>Track your order in real-time</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 bg-green-600 text-white rounded-full flex items-center justify-center">
                        <FaUndo className="text-3xl" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-2xl">Returns & Refunds</h4>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <FaCheck className="text-green-600 mt-1" />
                        <span>30-day hassle-free returns</span>
                      </li>
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <FaCheck className="text-green-600 mt-1" />
                        <span>Full refund or exchange available</span>
                      </li>
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <FaCheck className="text-green-600 mt-1" />
                        <span>Free return shipping on defective items</span>
                      </li>
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <FaCheck className="text-green-600 mt-1" />
                        <span>Easy online return process</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 flex items-center gap-5">
                  <div className="h-16 w-16 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center shrink-0">
                    <FaShieldAlt className="text-3xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xl mb-1">Buyer Protection Guarantee</h4>
                    <p className="text-base text-gray-600">Get a full refund if your order doesn't arrive or isn't as described. We ensure your shopping experience is safe and secure.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}