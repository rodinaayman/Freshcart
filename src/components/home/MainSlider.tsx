'use client';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Mousewheel, Keyboard } from 'swiper/modules';
import { Button } from '@/components/ui/button';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



import SlideBg from '@/assets/images/home-slider-1.png';
import Link from 'next/link';

const slidesData = [
  {
    title: 'Fresh Products Delivered to your Door',
    subtitle: 'Get 20% off your first order',
    btn1: 'Shop Now',
    btn2: 'View Deals',
  },
  {
    title: 'Premium Quality Guaranteed',
    subtitle: 'Fresh from farm to your table',
    btn1: 'Shop Now',
    btn2: 'Learn More',
  },
  {
    title: 'Fast & Free Delivery',
    subtitle: 'Same day delivery available',
    btn1: 'Order Now',
    btn2: 'Delivery Info',
  },
];

const basicSwiperOptions = {
  spaceBetween: 0,
  slidesPerView: 1,
  loop: true,
  pagination: { clickable: true },
  navigation: true,
  autoplay: { delay: 4000, disableOnInteraction: false },
  modules: [Navigation, Pagination, Mousewheel, Keyboard],
};

export default function MainSlider() {
  return (
    <section className={`w-full `}>
      <Swiper {...basicSwiperOptions} className="h-[500px] md:h-[600px] w-full group">

        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">

              <Image
                src={SlideBg}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-[#25c95e]/70 z-10"></div>

              <div className="absolute inset-0 z-20 flex flex-col justify-center items-start text-left text-white px-8 md:px-20 lg:px-32 w-full lg:w-1/2">
                <h2 className="text-5xl  font-bold mb-4 drop-shadow-lg leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl mb-8 font-normal drop-shadow-sm text-gray-100">
                  {slide.subtitle}
                </p>

                <div className="flex gap-4">
               <Button
                    asChild
                    size="lg"
                    className="bg-white text-[#25c95e] hover:bg-white font-bold shadow-lg rounded-xl h-14 px-10 text-lg hover:scale-105 transition-transform duration-300"
                  >
                    <Link href="/products">
                      {slide.btn1}
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-transparent hover:text-white font-bold rounded-xl h-14 px-10 text-lg hover:scale-105 transition-transform duration-300"
                  >
                    <Link href="/products">
                      {slide.btn2}
                    </Link>
                  </Button>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}