"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react';
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
        <div className="h-6 sm:h-8 bg-gray-200 rounded-lg animate-pulse w-20 sm:w-24 inline-block"></div>
      </div>
      <div className="h-10 sm:h-12 bg-gray-200 rounded-lg animate-pulse w-32 sm:w-40"></div>
    </div>
    <div className="flex h-auto w-full items-center justify-center lg:order-1 mt-8 lg:mt-0">
      <div className="w-full h-[280px] sm:h-[320px] md:h-[360px] bg-gray-200 rounded-xl animate-pulse max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[460px]"></div>
    </div>
  </div>
);

const ProgressBar = ({ currentIndex, totalSlides, timeRemaining }) => {
  return (
    <div className="absolute bottom-12 left-4 z-20 flex items-center gap-2 opacity-80">
      <div className="text-xs font-medium text-white bg-black bg-opacity-40 backdrop-blur-sm px-2 py-1 rounded-full">
        {currentIndex + 1}/{totalSlides}
      </div>
      <div className="w-16 sm:w-24 h-1 bg-black bg-opacity-20 backdrop-blur-sm rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "100%" }}
          animate={{ width: `${timeRemaining * 10}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/get_silderImg');
        const data = await res.json();

        const defaultProduct = {
          productId: "SP-00001",
          title: "customizable gift hampers",
          description: "Starting from ₹199 , Contact Us to customize gifting hampers for your celebrations!",
          category: "Gifting Hampers",
          imgUrl: "https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030363/Elastica/y0qznkahi7krsgv9d2a7.png",
          createdAt: "2024-02-07T14:30:00.000Z"
        };

        // Ensure the default product is always present
        const updatedProducts = [defaultProduct, ...data];

        setProducts(updatedProducts);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0 && !isPaused) {
      setTimeRemaining(10);
      const countdown = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(countdown);
            paginate(1);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [loading, currentIndex, isPaused, products.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      position: 'absolute'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      position: 'relative'
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      position: 'absolute'
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
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
    setTimeRemaining(10);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (error) return (
    <SectionLayout bg="bg-gradient-to-r from-green-500 to-green-600" className="relative overflow-hidden">
      <div className="min-h-[600px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <Text className="text-red-500 text-center font-medium">Error: {error}</Text>
        </div>
      </div>
    </SectionLayout>
  );

  if (loading) return (
    <SectionLayout bg="bg-gradient-to-r from-green-500 to-green-600" className="relative overflow-hidden">
      <div className="relative min-h-[600px] sm:min-h-[500px] lg:min-h-[600px] w-full">
        <HeroSkeleton />
      </div>
    </SectionLayout>
  );

  if (!products.length) return null;

  return (
    <SectionLayout
      bg="bg-gradient-to-r from-[#22c55e] to-[#22c55e]"
      className="relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik0wIDBoMXYxaC0xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+')] opacity-30 pointer-events-none"></div>

      <div
        className="relative min-h-[600px] sm:min-h-[500px] lg:min-h-[600px] w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 }
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
            className="w-full h-full flex flex-col-reverse lg:grid lg:grid-cols-2 lg:gap-8 px-4 sm:px-6 py-8 sm:py-12"
          >
            {/* Text content */}
            <div className="flex flex-col items-center gap-6 w-full sm:max-w-[600px] md:max-w-[600px] mt-8 lg:mt-0 md:py-8 lg:py-16 lg:order-2 lg:max-w-none lg:items-start">
              <motion.div
                className="space-y-6 sm:space-y-8 text-center lg:text-left w-full"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <motion.div variants={textVariants} custom={0}>
                  <div className="inline-flex items-center gap-2 bg-black bg-opacity-10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border border-white border-opacity-20">
                    <span className="text-white font-semibold">{products[currentIndex].category}</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={textVariants} custom={1}>
                  <Heading as="h2" className="text-2xl text-[#f6f6f6] sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                    {products[currentIndex].title}
                    {/* <span className="text-[#377DFF]">amazing</span> */}
                  </Heading>
                </motion.div>

                <motion.div variants={textVariants} custom={2}>
                  <Text className="text-sm sm:text-base md:text-lg lg:text-xl max-w-[90%] mx-auto lg:mx-0 text-gray-800">
                    {products[currentIndex].description}
                  </Text>
                </motion.div>

                <motion.div
                  variants={textVariants}
                  custom={3}
                  className="flex flex-col sm:flex-row items-center gap-4 pt-2"
                >
                  <Link href={`/purchase/${products[currentIndex].productId}`} className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="w-full sm:w-auto group relative px-6 py-3 sm:px-8 sm:py-4 text-white text-sm md:text-base font-medium 
                        bg-[#377DFF] border border-transparent 
                        hover:bg-[#2563EB] rounded-xl shadow-lg hover:shadow-xl
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                        transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        View Details
                        <ShoppingBag className="w-4 h-4" />
                      </span>
                      <span className="absolute inset-0 w-full h-full bg-white transform scale-x-0 group-hover:scale-x-100 
                        origin-left transition-transform duration-500 ease-out opacity-10"></span>
                    </motion.button>
                  </Link>

                  <div className="flex items-center gap-2 text-sm">
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="px-3 py-1 bg-black bg-opacity-5 rounded-full text-gray-800"
                    >
                      Premium Quality
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="px-3 py-1 bg-black bg-opacity-5 rounded-full text-gray-800"
                    >
                      Fast Delivery
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Image content */}
            <div className="flex h-auto w-full items-center justify-center lg:order-1 relative">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Decorative elements */}
                <div className="absolute -inset-4 rounded-full bg-white bg-opacity-30 blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 -right-6 top-1/3 bg-white/20 blur-2xl rounded-full"></div>

                <div className="relative z-10 rounded-2xl overflow-hidden p-2 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm shadow-xl">
                  <Image
                    src={products[currentIndex].imgUrl}
                    width={600}
                    height={600}
                    alt={products[currentIndex].title || "Luxury Product"}
                    className="w-full h-[280px] sm:h-[320px] md:h-[370px] rounded-xl object-cover 
                      max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[460px]
                      transition-transform duration-700 ease-in-out hover:scale-105"
                    priority
                  />
                </div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-[#377DFF] to-[#2563EB] 
                    text-white px-3 py-1 rounded-full text-xs font-semibold z-20 shadow-lg 
                    flex items-center gap-1"
                >
                  <span>Limited Edition</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <ProgressBar
          currentIndex={currentIndex}
          totalSlides={products.length}
          timeRemaining={timeRemaining}
        />

        {/* Navigation Buttons */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 
            bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg 
            hover:bg-white z-10 border border-gray-200"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-[#377DFF]" />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 
            bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg 
            hover:bg-white z-10 border border-gray-200"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-[#377DFF]" />
        </motion.button>

        {/* Dots navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 
            flex space-x-1.5 sm:space-x-2 z-10 bg-white/30 backdrop-blur-sm 
            px-3 py-2 rounded-full border border-white/20"
        >
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 
                ${index === currentIndex
                  ? 'bg-[#377DFF] scale-100'
                  : 'bg-gray-300 scale-75 hover:scale-90 hover:bg-gray-400'}`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            />
          ))}
        </motion.div>
      </div>
    </SectionLayout>
  );
};

export default HeroSection;