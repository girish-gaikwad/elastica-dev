import SectionLayout from '@/layouts/sectionLayout'
import React from 'react'
import { CallIcon, DeliveryIcon, LockIcon, MoneyIcon } from '../ui/assets/svg'
import Text from '../ui/text'

function Features() {
  return (
    <SectionLayout>
    <div className="grid grid-cols-2 gap-x-2 gap-y-6 p-8 md:grid-cols-4 lg:gap-6 lg:py-10">
      <div className="space-y-4 bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
        <DeliveryIcon className="h-12 w-12" />
        <div className="space-y-1 md:space-y-2">
          <Text
            size="sm"
            weight={600}
            family="poppins"
            color="black/800"
            className="lg:text-xl"
          >
            Free Shipping
          </Text>
          <Text size="sm" color="gray">
            Order above ₹600
          </Text>
        </div>
      </div>
      <div className="space-y-4 bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
        <MoneyIcon className="h-12 w-12" />
        <div className="space-y-1 md:space-y-2">
          <Text
            size="sm"
            weight={600}
            family="poppins"
            color="black/800"
            className="lg:text-xl"
          >
            Money-back
          </Text>
          <Text size="sm" color="gray">
            14 days guarantee
          </Text>
        </div>
      </div>
      <div className="space-y-4 bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
        <LockIcon className="h-12 w-12" />
        <div className="space-y-1 md:space-y-2">
          <Text
            size="sm"
            weight={600}
            family="poppins"
            color="black/800"
            className="lg:text-xl"
          >
            Full Tech & Security Support
          </Text>
          <Text size="sm" color="gray">
            Secured by Our techSupport
          </Text>
        </div>
      </div>
      <div className="space-y-4 bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
        <CallIcon className="h-12 w-12" />
        <div className="space-y-1 md:space-y-2">
          <Text
            size="sm"
            weight={600}
            family="poppins"
            color="black/800"
            className="lg:text-xl"
          >
            24/7 Support
          </Text>
          <Text size="sm" color="gray">
            Phone and Email support
          </Text>
        </div>
      </div>
    </div>
  </SectionLayout>
  )
}

export default Features
