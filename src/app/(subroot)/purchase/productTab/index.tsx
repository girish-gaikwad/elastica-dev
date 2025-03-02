"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ui
import ProductTabAdditionalInfo from "@/app/(subroot)/purchase/productTab/productTabAdditionalInfo";
import QnASection from "@/app/(subroot)/purchase/productTab/productTabQuestions";
import ReviewSection from "@/app/(subroot)/purchase/productTab/productTabReviews";
import Text from "@/components/ui/text";

// Custom components
const LuxuryDivider = () => (
  <div className="relative h-px w-full my-1">
    <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
  </div>
);

const ChevronIcon = ({ isActive }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
  >
    <path 
      d="M6 9L12 15L18 9" 
      stroke={isActive ? "#FFC155" : "#333333"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const productTabs = [
  {
    value: "additional-info",
    name: "Additional Info",
    icon: "✦",
  },
  {
    value: "questions",
    name: "Questions",
    icon: "✧",
  },
  {
    value: "reviews",
    name: "Reviews",
    icon: "★",
  },
];

const ProductTab = ({ 
  technicalDetails, 
  description, 
  id 
}: { 
  technicalDetails: any; 
  description: string; 
  id: string;
}) => {
  const [currentTab, setCurrentTab] = useState(productTabs[0].value);
  const [isHovered, setIsHovered] = useState("");

  // Elegant animations for tab content
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] space-y-10 md:max-w-[520px] lg:max-w-none bg-white rounded-md shadow-sm overflow-hidden">
      {/* Background elegance */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
      
      <div className="relative z-10 p-6">
        {/* Tabs Header */}
        <div className="flex w-full justify-between border-b border-gray-200">
          {productTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setCurrentTab(tab.value)}
              onMouseEnter={() => setIsHovered(tab.value)}
              onMouseLeave={() => setIsHovered("")}
              className={`relative flex items-center gap-2 py-4 px-2 transition-all duration-300 ${
                currentTab === tab.value
                  ? "text-amber-600 font-medium"
                  : "text-gray-600 hover:text-amber-500"
              }`}
            >
              <span className="text-amber-500 mr-1 text-sm">
                {tab.icon}
              </span>
              <Text variant="body1">{tab.name}</Text>
              <ChevronIcon isActive={currentTab === tab.value} />
              
              {/* Active indicator - bottom border */}
              {currentTab === tab.value && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                  style={{ 
                    background: "linear-gradient(to right, transparent, #FFC155, transparent)" 
                  }}
                />
              )}
              
              {/* Hover indicator */}
              {isHovered === tab.value && currentTab !== tab.value && (
                <motion.div 
                  layoutId="hoverTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Fancy divider */}
        <LuxuryDivider />
        
        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[300px] pt-8"
          >
            {currentTab === "additional-info" && (
              <ProductTabAdditionalInfo 
                technicalDetails={technicalDetails} 
                description={description} 
              />
            )}
            
            {currentTab === "questions" && (
              <QnASection productId={id} />
            )}
            
            {currentTab === "reviews" && (
              <ReviewSection productId={id} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductTab;