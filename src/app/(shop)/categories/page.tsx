import { Layers, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import { getCategories } from '@/services/categories.service';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const dynamic = 'force-dynamic';


export default async function CategoriesPage() {
  const data = await getCategories();
  const categories = data.data || [];

  return (
    <main>
      <div className="bg-gradient-to-br from-[#169f49] via-[#22c55e] to-[#48dd7e] text-white">
        <div className=" mx-auto px-4 py-12 sm:py-16">
          
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-white/70 flex-wrap">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="hover:text-white transition-colors">
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <Layers className="text-3xl" /> 
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">All Categories</h1>
              <p className="text-white/80 mt-1">Browse our wide range of product categories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50 min-h-screen">
        <div className=" mx-auto px-4">
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {categories.map((category) => (
                <Link 
                  key={category._id}
                  href={`/categories/${category._id}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 block"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                    <img 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={category.image}
                    />
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-center group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                      View Subcategories
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ): (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <Package className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">No products match your current filters.</p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}