import { Layers, ArrowLeft, FolderOpen, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCategoryDetails, getSubcategories } from '@/services/categories.service';

export default async function CategoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [category, subcategoriesRes] = await Promise.all([
    getCategoryDetails(id),
    getSubcategories(id)
  ]);

  const subcategories = subcategoriesRes.data || [];

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
                  {category?.name || 'Category'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <Layers className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {category?.name || 'Category'}
              </h1>
              <p className="text-white/80 mt-1">
                {subcategories.length} Subcategories in {category?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50 min-h-screen">
        <div className=" mx-auto px-4">
          
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Categories</span>
          </Link>

          {subcategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {subcategories.map((sub: any) => (
                <Link 
                  key={sub._id}
                  href={`/subcategories/${sub._id}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 block"
                >
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                    <FolderOpen className="text-2xl text-emerald-600" />
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-600 transition-colors mb-2">
                    {sub.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Browse Products</span>
                    <ArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <Package className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Subcategories Found</h3>
              <p className="text-gray-500 mb-6">There are no subcategories in this section.</p>
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