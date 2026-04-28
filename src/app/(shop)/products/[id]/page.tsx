import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatePrice } from '@/lib/formatter';
import ProductGallery from '@/components/products/ProductGallery';
import AddToCartSection from '@/components/products/AddToCartSection';
import ProductTabs from '@/components/products/ProductTabs';
import RelatedProductsSection from '@/components/products/RelatedProductsSection';
import { getProductDetails, getRelatedProducts } from '@/services/products.service';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { FaHome, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa';
import { FaStar, FaRegStar } from 'react-icons/fa';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductDetails(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category?._id || '', product._id);

  const discount = product.priceAfterDiscount 
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100) 
    : 0;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  return (
    <main className="bg-white min-h-screen pb-16">
      
      <nav className="bg-white py-4 ">
        <div className=" mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList className="flex-wrap">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600">
                    <FaHome size={14} /> Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              
              {product.category && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/categories/${product.category._id}`} className="text-gray-500 hover:text-emerald-600">
                        {product.category.name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}

              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 font-medium truncate max-w-xs">
                  {product.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>

      <section className="py-6">
        <div className=" mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="lg:w-1/4">
              <ProductGallery images={product.images || [product.imageCover]} />
            </div>

            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.category && (
                    <Link href={`/categories/${product.category._id}`} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full hover:bg-emerald-100 transition">
                      {product.category.name}
                    </Link>
                  )}
                  {product.brand && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                      {product.brand.name}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {renderStars(product.ratingsAverage)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.ratingsAverage} ({product.ratingsQuantity} reviews)
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-3 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatePrice(product.priceAfterDiscount || product.price)}
                  </span>
                  {product.priceAfterDiscount && (
                    <>
                      <span className="text-lg text-gray-400 line-through">{formatePrice(product.price)}</span>
                      <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-green-50 text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    In Stock
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-5 mb-6">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

       
                <AddToCartSection product={product} /> 

                <div className="border-t border-gray-100 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                        <FaTruck size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Free Delivery</h4>
                        <p className="text-xs text-gray-500">Orders over $50</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                        <FaUndo size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">30 Days Return</h4>
                        <p className="text-xs text-gray-500">Money back</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                        <FaShieldAlt size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Secure Payment</h4>
                        <p className="text-xs text-gray-500">100% Protected</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductTabs 
        description={product.description} 
        category={product.category?.name} 
        brand={product.brand?.name} 
        ratingsAverage={product.ratingsAverage}
        ratingsQuantity={product.ratingsQuantity}
      />

      {relatedProducts.length > 0 && (
        <RelatedProductsSection products={relatedProducts} />
      )}
    </main>
  );
}