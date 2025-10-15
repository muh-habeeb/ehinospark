'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';

interface HeroImage {
  url: string;
  alt: string;
}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  images: HeroImage[];
}

export default function HeroSection({ title, subtitle, images }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [images.length]);

  /* Commented navigation functions for future use
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  */

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image Carousel - Simple Slider */}
      <div className="absolute inset-0 z-0">
        <div className="carousel-container w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              style={{ pointerEvents: 'none' }} // Non-draggable
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url(${image.url})`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Commented Navigation Arrows for future use
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
      */}

      {/* Commented Dots Indicator for future use
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
      */}

      {/* Static Content Overlay */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4  bg-black/20  p-8 ">
        <div className="backdrop-blur-[3px] bg-black/20 rounded-2xl p-8 border border-white/20">
          {/* <div className=""> */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[35px] sm:text-4xl md:text-5xl lg:text-5xl xl:text-8xl font-bold mb-4 tracking-wider   drop-shadow-xl drop-shadow-[#c46628]  font-anurati relative uppercase"

          // className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-wider drop-shadow-lg font-dune"
          >
            {title}
            <br />
            {/* <span className='font-semibold text-[12px] absolute sm:text-[14px] md:text-[16px] lg:text-[20px] xl:text-[30px] right-1'>2025</span> */}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            // className="text-lg md:text-xl lg:text-2xl  drop-shadow-md font-olivia mt-14"
            className="text-[12px] sm:text-sm md:text-xl lg:text-2xl tracking-[2px] drop-shadow-md font-olivia"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  );
}