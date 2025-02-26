"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionLayout from '@/layouts/sectionLayout';
import Heading from '../ui/head';
import Text from '../ui/text';
import Image from 'next/image';
import Link from 'next/link';

const HeroSkeleton = () => (
  <div className="w-full flex flex-col items-center justify-between lg:grid lg:grid-cols-2 lg:gap-8 px-4 sm:px-6 py-8 sm:py-12">
    <div className="flex flex-col items-center gap-4 w-full sm:max-w-[600px] md:max-w-[600px] md:py-8 lg:py-16 lg:order-2 lg:max-w-none lg:items-start">
      <div className="space-y-4 text-center lg:text-left w-full">
        <div className="h-8 sm:h-12 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
        <div className="h-4 sm:h-6 bg-gray-200 rounded-lg animate-pulse w-full"></div>
        <div className="h-4 sm:h-6 bg-gray-200 rounded-lg animate-pulse w-2/3"></div>
        <div className="h-6 sm:h-8 bg-gray-200 rounded-full animate-pulse w-20 sm:w-24 inline-block"></div>
      </div>
      <div className="h-10 sm:h-12 bg-gray-200 rounded-lg animate-pulse w-32 sm:w-40"></div>
    </div>
    <div className="flex h-auto w-full items-center justify-center lg:order-1 mt-8 lg:mt-0">
      <div className="w-full h-[280px] sm:h-[320px] md:h-[360px] bg-gray-200 rounded-xl animate-pulse max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[460px]"></div>
    </div>
  </div>
);

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/get_silderImg');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      position: 'relative'
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute'
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = products.length - 1;
      if (nextIndex >= products.length) nextIndex = 0;
      return nextIndex;
    });
  };

  useEffect(() => {
    if (!loading && products.length > 0) {
      const timer = setInterval(() => {
        paginate(1);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [loading, products.length]);

  if (error) return (
    <SectionLayout bg="bg-[#ffc95c]" className="relative overflow-hidden">
      <div className="min-h-[600px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
        <Text className="text-red-500 px-4 text-center">Error: {error}</Text>
      </div>
    </SectionLayout>
  );

  if (loading) return (
    <SectionLayout bg="bg-[#ffc95c]" className="relative overflow-hidden">
      <div className="relative min-h-[600px] sm:min-h-[500px] lg:min-h-[600px] w-full">
        <HeroSkeleton />
      </div>
    </SectionLayout>
  );

  if (!products.length) return null;

  return (
    <SectionLayout
      bg="bg-[#ffc95c]"
      className="relative overflow-hidden"
    >
      <div className="relative min-h-[600px] sm:min-h-[500px] lg:min-h-[600px] w-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="w-full flex flex-col-reverse lg:grid lg:grid-cols-2 lg:gap-8 px-4 sm:px-6 py-8 sm:py-12"
          >
            {/* Text content */}
            <div className="flex flex-col items-center gap-4 w-full sm:max-w-[600px] md:max-w-[600px] mt-8 lg:mt-0 md:py-8 lg:py-16 lg:order-2 lg:max-w-none lg:items-start">
              <div className="space-y-5 sm:space-y-7 text-center lg:text-left w-full">
                <Text className="inline-block bg-[#377DFF] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                  {products[currentIndex].category}
                </Text>
                <Heading as="h2" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl ">
                  {products[currentIndex].title} <span className="text-[#377DFF]">amazing</span>
                </Heading>
                <Text className="text-sm sm:text-base md:text-lg lg:text-xl max-w-[90%] mx-auto lg:mx-0">
                  {products[currentIndex].description}
                </Text>
              </div>
              <Link href={`/purchase/${products[currentIndex].productId}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 text-white text-sm md:text-base font-medium 
                    bg-gradient-to-r from-blue-600 to-blue-500 border border-transparent 
                    hover:from-blue-700 hover:to-blue-600 hover:border-blue-700 
                    rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
                >
                  View Details ➜
                </motion.button>
              </Link>
            </div>

            {/* Image content */}
            <div className="flex h-auto w-full items-center  justify-center lg:order-1">
              <Image
                src={products[currentIndex].imgUrl}
                width={600}
                height={600}
                alt={products[currentIndex].title}
                className="w-full h-[280px] sm:h-[320px] md:h-[370px] rounded-xl  object-cover  
                  max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[460px]"
                priority
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-100 z-10"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-[#377DFF]" />
        </button>
        <button
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-100 z-10"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-[#377DFF]" />
        </button>

        {/* Dots navigation */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-10">
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 
                ${index === currentIndex ? 'bg-[#377DFF]' : 'bg-gray-300'}`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    </SectionLayout>
  );
};

export default HeroSection;