import SectionLayout from '@/layouts/sectionLayout'
import React from 'react'
import { CallIcon, DeliveryIcon, LockIcon, MoneyIcon } from '../ui/assets/svg'
import Text from '../ui/text'

function Features() {
  return (
    <SectionLayout>
      <div className="py-16 px-6 sm:px-8">
        <div className="mb-10 text-center">
          <div className="mb-2 h-1 w-16 bg-[#FFC156] mx-auto"></div>
          <Text 
            size="lg"
            weight={600}
            family="poppins"
            color="black/800"
            className="text-3xl mb-3"
          >
            Our Premium Services
          </Text>
          <Text size="sm" color="gray" className="max-w-md mx-auto">
            Experience exceptional care with our curated suite of premium services
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="group flex flex-col items-center text-center space-y-4 bg-white p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:border-[#FFC156]/20 hover:shadow-md">
            <div className="h-16 w-16 flex items-center justify-center bg-[#FFC156]/5 rounded-none border border-[#FFC156]/10 mb-2 transition-all duration-300 group-hover:bg-[#FFC156]/10">
              <DeliveryIcon className="h-8 w-8 text-[#15273e]" />
            </div>
            <div className="space-y-2">
              <Text
                size="sm"
                weight={500}
                family="poppins"
                color="black/800"
                className="text-lg uppercase tracking-wide"
              >
                Complimentary Shipping
              </Text>
              <Text size="sm" color="gray" className="text-sm">
                On all orders above ₹600
              </Text>
            </div>
          </div>

          <div className="group flex flex-col items-center text-center space-y-4 bg-white p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:border-[#FFC156]/20 hover:shadow-md">
            <div className="h-16 w-16 flex items-center justify-center bg-[#FFC156]/5 rounded-none border border-[#FFC156]/10 mb-2 transition-all duration-300 group-hover:bg-[#FFC156]/10">
              <MoneyIcon className="h-8 w-8 text-[#15273e]" />
            </div>
            <div className="space-y-2">
              <Text
                size="sm"
                weight={500}
                family="poppins"
                color="black/800"
                className="text-lg uppercase tracking-wide"
              >
                Satisfaction Guaranteed
              </Text>
              <Text size="sm" color="gray" className="text-sm">
                14-day money-back promise
              </Text>
            </div>
          </div>

          <div className="group flex flex-col items-center text-center space-y-4 bg-white p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:border-[#FFC156]/20 hover:shadow-md">
            <div className="h-16 w-16 flex items-center justify-center bg-[#FFC156]/5 rounded-none border border-[#FFC156]/10 mb-2 transition-all duration-300 group-hover:bg-[#FFC156]/10">
              <LockIcon className="h-8 w-8 text-[#15273e]" />
            </div>
            <div className="space-y-2">
              <Text
                size="sm"
                weight={500}
                family="poppins"
                color="black/800"
                className="text-lg uppercase tracking-wide"
              >
                Secure Transactions
              </Text>
              <Text size="sm" color="gray" className="text-sm">
                Protected by advanced security
              </Text>
            </div>
          </div>

          <div className="group flex flex-col items-center text-center space-y-4 bg-white p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:border-[#FFC156]/20 hover:shadow-md">
            <div className="h-16 w-16 flex items-center justify-center bg-[#FFC156]/5 rounded-none border border-[#FFC156]/10 mb-2 transition-all duration-300 group-hover:bg-[#FFC156]/10">
              <CallIcon className="h-8 w-8 text-[#15273e]" />
            </div>
            <div className="space-y-2">
              <Text
                size="sm"
                weight={500}
                family="poppins"
                color="black/800"
                className="text-lg uppercase tracking-wide"
              >
                Dedicated Assistance
              </Text>
              <Text size="sm" color="gray" className="text-sm">
                Complete Customer Care Support
              </Text>
            </div>
          </div>
        </div>
      </div>
    </SectionLayout>
  )
}

export default Features