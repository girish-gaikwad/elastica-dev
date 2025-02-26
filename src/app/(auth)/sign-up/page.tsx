"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// ui
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";

// form
import Input from "@/components/form/input";

// lib
import { cn } from "@/lib/utils";

export default function Page() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <div className={cn([
        "grid lg:grid-cols-2",
        "max-w-[1440px]",
        "bg-white",
        "lg:rounded-2xl lg:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        "lg:max-h-[800px]",
        "lg:absolute lg:inset-0 lg:m-auto",
        "overflow-hidden",
      ])}>
        {/* Left Side - Image Section */}
        <div className="relative flex items-center justify-center bg-gradient-to-b from-emerald-50 to-emerald-100/30 p-8 pt-20 lg:h-full lg:rounded-l-2xl">
          <Text
            family="poppins"
            size="2xl"
            weight={600}
            className="absolute left-0 top-8 w-full text-center text-emerald-600 tracking-wide"
          >
            Welcome to Elastica
          </Text>

          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-emerald-200/20 blur-2xl"></div>
            <Image
              src="/images/auth.png"
              width={2500}
              height={2500}
              alt="auth"
              className="relative w-full max-w-[450px] lg:h-[500px] lg:w-auto lg:max-w-none transform transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex justify-center bg-white lg:rounded-r-2xl">
          <div className={cn([
            "w-full",
            "flex flex-col gap-8 lg:justify-center",
            "px-8 py-10 lg:px-[88px]",
            "sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px]",
          ])}>
            <div className="space-y-4">
              <h1 className="font-poppins text-[42px] font-medium text-[#121212] tracking-tight">
                Sign Up
              </h1>
              <Text weight={400} color="gray" className="text-base">
                Already have an account?{" "}
                <Link 
                  href="/sign-in" 
                  className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
                >
                  Sign In
                </Link>
              </Text>
            </div>

            <div className="space-y-6">
              <div className="group relative">
                <Input 
                  intent="secondary" 
                  type="text" 
                  placeholder="Your name"
                  className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-emerald-600"
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-600 transition-all duration-300 group-focus-within:w-full"></div>
              </div>

              <div className="group relative">
                <Input 
                  intent="secondary" 
                  type="text" 
                  placeholder="Username"
                  className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-emerald-600"
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-600 transition-all duration-300 group-focus-within:w-full"></div>
              </div>

              <div className="group relative">
                <Input 
                  intent="secondary" 
                  type="email" 
                  placeholder="Email address"
                  className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-emerald-600"
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-600 transition-all duration-300 group-focus-within:w-full"></div>
              </div>

              <div className="group relative">
                <Input 
                  intent="secondary" 
                  type="password" 
                  placeholder="Password"
                  className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-emerald-600"
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-600 transition-all duration-300 group-focus-within:w-full"></div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setChecked(!checked)}
                  className={cn(
                    "h-6 w-6 rounded-md border transition-all duration-200",
                    checked 
                      ? "border-emerald-600 bg-emerald-600" 
                      : "border-[#6C7275] hover:border-emerald-600"
                  )}
                >
                  {checked && (
                    <svg 
                      className="h-full w-full text-white" 
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  )}
                </button>
                <Text
                  size="sm"
                  weight={400}
                  color="gray"
                  className="select-none"
                >
                  I agree with{" "}
                  <button className="font-semibold text-[#141718] hover:text-emerald-600 transition-colors">
                    Privacy Policy
                  </button>{" "}
                  and{" "}
                  <button className="font-semibold text-[#141718] hover:text-emerald-600 transition-colors">
                    Terms of Use
                  </button>
                </Text>
              </div>
            </div>

            <Button 
              width="full" 
              className={cn(
                "bg-emerald-600 py-3.5 text-base font-semibold text-white",
                "transform transition-all duration-200",
                "hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20",
                "active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={!checked}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}