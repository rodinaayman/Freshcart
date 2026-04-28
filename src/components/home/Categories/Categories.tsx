import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Category } from '@/interfaces/categories.interface'
import { CategoriesResponse } from '@/types/respones.type'
import PromoSection from './PromoSection'
import { getCategories } from '@/services/categories.service'

export default async function Categories() {

  const response: CategoriesResponse = await getCategories();

  const categories: Category[] = response.data || [];

  return (
    <>
     <section id="categories" className="py-10">
      <div className=" mx-auto px-4">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
          <div className="flex items-center gap-3 my-4 sm:my-0">
            <div className="h-8 w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Shop By <span className="text-emerald-600">Category</span>
            </h2>
          </div>

          <Link 
            href="/categories" 
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center cursor-pointer group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-transparent hover:border-emerald-100"
            >
              <div className="h-20 w-20 overflow-hidden bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 transition-colors">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}

        </div>

      </div>
    </section>
    <PromoSection/>
    </>
   
  )
}