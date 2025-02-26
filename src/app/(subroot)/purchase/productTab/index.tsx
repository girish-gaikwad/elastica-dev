"use client";

import { useState } from "react";

// types
import { ProductTabs } from "@/types/product";

// ui
import Text from "@/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownIcon } from "@/components/ui/assets/svg";
import ProductTabAdditionalInfo from "@/app/(subroot)/purchase/productTab/productTabAdditionalInfo";
import QnASection from "@/app/(subroot)/purchase/productTab/productTabQuestions";
import ReviewSection from "@/app/(subroot)/purchase/productTab/productTabReviews";

const productTabs = [
  {
    value: "additional-info",
    name: "Additional Info",
  },
  {
    value: "questions",
    name: "Questions",
  },
  {
    value: "reviews",
    name: "Reviews",
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

  return (
    <Tabs
      defaultValue={productTabs[0].value}
      value={currentTab}
      onValueChange={(tab) => setCurrentTab(tab)}
      className="mx-auto w-full max-w-[420px] space-y-10 md:max-w-[520px] lg:max-w-none"
    >
      <TabsList className="flex w-full justify-between border-b border-gray-200">
        {productTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2 py-2"
          >
            <Text variant="body1">{tab.name}</Text>
            <DropdownIcon className={currentTab === tab.value ? "rotate-180" : ""} />
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="additional-info">
         <ProductTabAdditionalInfo 
          technicalDetails={technicalDetails} 
          description={description} 
        /> 
      </TabsContent>
      
      <TabsContent value="questions">
      <QnASection productId={id} />
        
      </TabsContent>
      
      <TabsContent value="reviews">
        <ReviewSection productId={id} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTab;