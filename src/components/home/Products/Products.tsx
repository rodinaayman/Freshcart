"use client";

import ProductCard from '@/components/shared/ProductCard';
import { Product } from '@/interfaces/products.interfsces';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className=" mx-auto px-4">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Featured <span className="text-emerald-600">Products</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}