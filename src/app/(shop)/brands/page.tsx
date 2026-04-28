import { Tags, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getBrands } from '@/services/brands.service';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";



export default async function BrandsPage() {
  const response = await getBrands();
  
  const brands = response.data || [];

  return (
    <main>
      <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-400 text-white">
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
                <BreadcrumbPage className="text-white font-medium">Brands</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <Tags className="text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Top Brands</h1>
              <p className="text-white/80 mt-1">Shop from your favorite brands</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50 min-h-screen">
        <div className=" mx-auto px-4">
          
          {brands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {brands.map((brand) => (
                <Link 
                  key={brand._id}
                  href={`/brands/${brand._id}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 hover:-translate-y-1 block"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 p-4 flex items-center justify-center">
                    <img 
                      alt={brand.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      src={brand.image}
                    />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-center text-sm group-hover:text-violet-600 transition-colors truncate">
                    {brand.name}
                  </h3>
                  
                  <div className="flex justify-center mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-violet-600 flex items-center gap-1">
                      View Products
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p>No brands found.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}