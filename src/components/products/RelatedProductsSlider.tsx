"use client"; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '@/components/shared/ProductCard';
import { Product } from '@/interfaces/products.interfsces';
import 'swiper/css';
import 'swiper/css/navigation';

interface RelatedProductsSliderProps {
  products: Product[];
}

export default function RelatedProductsSlider({ products }: RelatedProductsSliderProps) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={20}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
      }}
    >
      {products.map((p) => (
        <SwiperSlide key={p._id}>
          <ProductCard product={p} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}