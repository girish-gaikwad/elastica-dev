// types
import { ProductAdditionalInfo } from "@/types/product";

// ui
import ProductTabDialog from "@/app/(subroot)/purchase/productTab/productTabDialog";

const ProductTabAdditionalInfo = ({ technicalDetails, description }) => {
  // Convert technical details dynamically into an array
  const specifications = Object.entries(technicalDetails).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()), // Format key names
    value: typeof value === "boolean" ? (value ? "Yes" : "No") : value, // Handle boolean values
  }));

  return (
    <div className="space-y-10">
      <p className="font-poppins text-2xl font-medium text-[#1A202C]">
        Additional Info
      </p>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="font-inter text-lg font-semibold text-[#1A202C]">
            Specifications
          </p>

          <ul className="relative space-y-4 after:absolute after:bottom-0 after:h-80 after:w-full after:bg-gradient-to-t after:from-white after:to-white/0">
            {specifications.map((spec, index) => (
              <li
                key={index}
                className="flex text-[#1A202C] justify-between bg-[#F8FAFC] py-2 font-inter text-sm font-normal odd:bg-white even:bg-[#F8FAFC]"
              >
                <span className="flex-1 font-semibold">{spec.label}</span>
                <span className="flex-1 text-right">{spec.value}</span>
              </li>
            ))}
          </ul>

          {/* Product dialog */}
          <div className="flex justify-center">
            <ProductTabDialog
              trigger={
                <button className="rounded-full border border-[#1A202C] px-10 py-2 font-inter text-base font-medium text-[#1A202C]">
                  Load more
                </button>
              }
            >
              <div className="space-y-6">
                {/* Specifications section */}
                <div className="space-y-2">
                  <p className="font-inter text-lg font-semibold text-[#1A202C]">
                    Specifications
                  </p>
                  <ul className="space-y-4">
                    {specifications.map((spec, index) => (
                      <li
                        key={index}
                        className="flex justify-between bg-[#F8FAFC] py-2 font-inter text-sm font-normal odd:bg-white even:bg-[#F8FAFC]"
                      >
                        <span className="flex-1 font-semibold">{spec.label}</span>
                        <span className="flex-1 text-right">{spec.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Description section */}
                <div className="space-y-2">
                  <p className="font-inter text-lg font-semibold text-[#1A202C]">
                    Details
                  </p>
                  <p className="font-inter text-sm font-normal text-[#1A202C]">
                    {description}
                  </p>
                </div>
              </div>
            </ProductTabDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTabAdditionalInfo;

