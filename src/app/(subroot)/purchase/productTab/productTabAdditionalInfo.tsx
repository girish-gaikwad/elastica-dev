// types

// ui
import ProductTabDialog from "@/app/(subroot)/purchase/productTab/productTabDialog";
import { motion } from "framer-motion";

const ProductTabAdditionalInfo = ({ technicalDetails, description }) => {
  // Convert technical details dynamically into an array
  const specifications = Object.entries(technicalDetails).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()), // Format key names
    value: typeof value === "boolean" ? (value ? "Yes" : "No") : value, // Handle boolean values
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-l-4 border-amber-400 pl-4"
      >
        <h2 className="font-poppins text-2xl font-medium text-gray-800">
          Additional Info
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-amber-300 to-amber-100 mt-2"></div>
      </motion.div>
      
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 text-xs">✦</span>
            </div>
            <h3 className="font-inter text-lg font-semibold text-gray-800">
              Specifications
            </h3>
          </div>

          <motion.ul 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-lg border border-gray-100 shadow-sm"
          >
            {specifications.slice(0, 5).map((spec, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex text-gray-800 justify-between py-3 px-4 font-inter text-sm font-normal border-b border-gray-50 odd:bg-white even:bg-gray-50/30 hover:bg-amber-50/30 transition-colors duration-200"
              >
                <span className="flex-1 font-medium text-gray-700">{spec.label}</span>
                <span className="flex-1 text-right text-gray-600">{spec.value}</span>
              </motion.li>
            ))}
            <div className="absolute bottom-0 h-20 w-full bg-gradient-to-t from-white to-transparent"></div>
          </motion.ul>

          {/* Product dialog */}
          <div className="flex justify-center pt-4">
            <ProductTabDialog
              trigger={
                <button className="group relative overflow-hidden rounded-full border border-amber-500 px-10 py-2.5 font-inter text-base font-medium text-gray-800 shadow-sm transition-all duration-300 hover:shadow-md hover:text-amber-700">
                  <span className="relative z-10">View All Specifications</span>
                  <span className="absolute inset-0 -z-0 bg-gradient-to-r from-amber-100/40 to-amber-200/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70"></span>
                </button>
              }
            >
              <div className="space-y-8 p-2">
                {/* Header with elegant styling */}
                <div className="text-center mb-6">
                  <h3 className="font-poppins text-xl font-medium text-gray-800">Complete Product Details</h3>
                  <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-2"></div>
                </div>
                
                {/* Specifications section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-600 text-xs">✦</span>
                    </div>
                    <h3 className="font-inter text-lg font-semibold text-gray-800">
                      Specifications
                    </h3>
                  </div>
                  
                  <ul className="space-y-2 rounded-lg border border-gray-100 overflow-hidden">
                    {specifications.map((spec, index) => (
                      <li
                        key={index}
                        className="flex justify-between py-3 px-4 font-inter text-sm font-normal border-b border-gray-50 odd:bg-white even:bg-gray-50/30"
                      >
                        <span className="flex-1 font-medium text-gray-700">{spec.label}</span>
                        <span className="flex-1 text-right text-gray-600">{spec.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Description section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-600 text-xs">★</span>
                    </div>
                    <h3 className="font-inter text-lg font-semibold text-gray-800">
                      Details
                    </h3>
                  </div>
                  
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="font-inter text-sm leading-relaxed text-gray-700">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </ProductTabDialog>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductTabAdditionalInfo;