import Categories from '@/components/home/Categories/Categories'
import Features from '@/components/home/Features'
import MainSlider from '@/components/home/MainSlider'
import NewsletterSection from '@/components/home/NewsletterSection'
import FeaturedProducts from '@/components/home/Products/Products'
import { getProducts } from '@/services/products.service'

export const dynamic = 'force-dynamic';

export default async function Homepage() {
  const data = await getProducts(20);
  const products = data.data || [];
  return (
    <>
      <MainSlider />
      <Features />
      <Categories />
      <FeaturedProducts products={products} />
      <NewsletterSection />
    </>
  )
}
