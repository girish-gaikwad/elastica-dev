// package
import Link from "next/link";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import { CallIcon, InstagramIcon } from "@/components/ui/assets/svg";
import Text from "@/components/ui/text";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <SectionLayout bg="bg-[#141718]">
      <div className="space-y-10 px-8 py-14 lg:space-y-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          <div className="flex flex-col items-center gap-6 lg:items-start lg:gap-4">
            <div className="relative">
              <h3 className="font-poppins text-4xl font-medium text-white">
                Elastica
                {/* <span className="text-[#FFC156]">.</span> */}
              </h3>
              <div className="absolute -bottom-2 left-0 h-[2px] w-16 bg-[#FFC156] opacity-70"></div>
            </div>
            <Text size="sm" color="white/900" className="max-w-xs text-center lg:text-left">
              Discover the world of  recycled rubber products crafted with sustainability and elegance in mind.
            </Text>
            
            <div className="mt-4 flex items-center justify-center gap-6 lg:mt-6">
              <Link href="https://www.instagram.com/elastica_srkp/">
                <InstagramIcon
                  fill="#FFC156"
                  stroke="#FFC156"
                  className="h-5 w-5 transition-all hover:opacity-80"
                />
              </Link>
              <Link href="mailto:sales@elastica.co.in">
                <Mail stroke="#FFC156" className="h-5 w-5 transition-all hover:opacity-80" />
              </Link>
              <Link href="tel:+917598315432">
                <CallIcon stroke="#FFC156" className="h-5 w-5 transition-all hover:opacity-80" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:w-3/5 lg:grid-cols-3 lg:gap-6">
            <div className="flex flex-col items-center gap-5 lg:items-start">
              <Text weight={600} color="white" size="sm" className="tracking-wide">
                NAVIGATION
              </Text>
              <ul className="flex flex-col gap-4 text-center lg:text-left">
                <li className="font-inter text-sm font-normal text-[#FEFEFE] transition-all hover:text-[#FFC156]">
                  <Link href="/">Home</Link>
                </li>
                <li className="font-inter text-sm font-normal text-[#FEFEFE] transition-all hover:text-[#FFC156]">
                  <Link href="/aboutUs">About Us</Link>
                </li>
                <li className="font-inter text-sm font-normal text-[#FEFEFE] transition-all hover:text-[#FFC156]">
                  <Link href="/shop/all">Shop</Link>
                </li>
                <li className="font-inter text-sm font-normal text-[#FEFEFE] transition-all hover:text-[#FFC156]">
                  <Link href="/products">Products</Link>
                </li>
                <li className="font-inter text-sm font-normal text-[#FEFEFE] transition-all hover:text-[#FFC156]">
                  <Link href="/contactUs">Contact Us</Link>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center gap-5 lg:items-start">
              <Text weight={600} color="white" size="sm" className="tracking-wide">
                COLLECTIONS
              </Text>
              <ul className="flex flex-col gap-4 text-center lg:text-left">
                <li className="font-inter text-sm font-normal text-[#FEFEFE] transition-all hover:text-[#FFC156]">
                  <Link href="/shop/all">All Products</Link>
                </li>
                <li className="font-inter text-sm font-normal text-[#FEFEFE] transition-all hover:text-[#FFC156]">
                  <Link href="/shop/C1001">Home & Gardern</Link>
                </li>
                <li className="font-inter text-sm font-normal text-[#FEFEFE] transition-all hover:text-[#FFC156]">
                  <Link href="/shop/C1002">Sports & Fitness</Link>
                </li>
               
              </ul>
            </div>
            
            <div className="flex flex-col items-center gap-5 lg:items-start">
              <Text weight={600} color="white" size="sm" className="tracking-wide">
                CONTACT
              </Text>
              <div className="flex flex-col gap-4 text-center lg:text-left">
                <Text size="sm" color="white/900" className="transition-all hover:text-[#FFC156]">
                  <Link href="mailto:sales@elastica.co.in">sales@elastica.co.in</Link>
                </Text>
                <Text size="sm" color="white/900" className="transition-all hover:text-[#FFC156]">
                  <Link href="tel:+917598315432">+91 759 831 5432</Link>
                </Text>
                <Text size="sm" color="white/900">
                  Business Hours: 9:00 AM - 6:00 PM
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 border-t border-[#2A2C2D] py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:py-6">
          <Text
            family="poppins"
            size="xs"
            color="white/800"
            className="text-center lg:text-left"
          >
            Copyright © 2025 Elastica. All rights reserved
          </Text>

          <div className="flex justify-center gap-7">
            <Link href="/terms&policy">
              <Text size="xs" weight={400} family="poppins" color="white/900" className="transition-all hover:text-[#FFC156]">
                Privacy Policy
              </Text>
            </Link>
            <Link href="/terms&policy">
              <Text size="xs" weight={400} family="poppins" color="white/900" className="transition-all hover:text-[#FFC156]">
                Terms of Use
              </Text>
            </Link>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};

export default Footer;