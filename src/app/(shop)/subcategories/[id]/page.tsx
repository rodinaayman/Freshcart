import { Package, Filter, FolderOpen, X } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/shared/ProductCard';
import { getSubcategoryDetails, getSubcategoryProducts } from '@/services/categories.service';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function SubcategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [subcategory, productsRes] = await Promise.all([
    getSubcategoryDetails(id),
    getSubcategoryProducts(id)
  ]);

  const products = productsRes.data || [];

  return (
    <main>
      <div className="bg-gradient-to-br from-[#169f49] via-[#22c55e] to-[#48dd7e] text-white">
        <div className=" mx-auto px-4 py-10 sm:py-14">
          
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-white/70 flex-wrap">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="hover:text-white transition-colors">
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="hover:text-white transition-colors">
                  <Link href="/categories">Categories</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">
                  {subcategory?.name || 'Subcategory'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <Package className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {subcategory?.name || 'Products'}
              </h1>
              <p className="text-white/80 mt-1">Explore products in this collection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50 min-h-screen">
        <div className=" mx-auto px-4">
          
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 text-sm text-gray-600">
              <Filter size={14} />
              Active Filters:
            </span>
            
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium hover:bg-emerald-200 transition-colors"
            >
              <FolderOpen size={12} />
              {subcategory?.name || 'Subcategory'}
              <X size={12} />
            </Link>
            
            <Link 
              href="/products" 
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </Link>
          </div>

          <div className="mb-6 text-sm text-gray-500">
            Showing {products.length} products
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
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