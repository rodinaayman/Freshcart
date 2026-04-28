"use client";

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Keyboard } from 'swiper/modules'; 
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/thumbs';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mainSwiperRef.current) return;

      if (e.key === 'ArrowLeft') {
        mainSwiperRef.current.slidePrev();
      } else if (e.key === 'ArrowRight') {
        mainSwiperRef.current.slideNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
      <Swiper
        modules={[Thumbs, Keyboard]} 
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        spaceBetween={10}
        className="mb-4 rounded-lg overflow-hidden"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img 
              src={img} 
              alt={`Product image ${index + 1}`} 
              className="w-full h-auto object-contain bg-gray-50" 
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        watchSlidesProgress
        className="thumbs-swiper cursor-pointer"
      >
        {images.map((img, index) => (
          <SwiperSlide 
            key={index} 
            className="border border-gray-200 rounded-md overflow-hidden hover:border-emerald-500 transition"
          >
            <img src={img} alt={`Thumb ${index + 1}`} className="w-full h-20 object-contain bg-gray-50" />
          </SwiperSlide>
        ))}
      </Swiper>
      
    </div>
  );
}