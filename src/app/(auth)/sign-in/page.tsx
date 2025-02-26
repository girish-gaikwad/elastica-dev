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
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div
        className={cn([
          "grid lg:grid-cols-2",
          "max-w-[1440px]",
          "bg-white",
          "overflow-hidden",
          "lg:rounded-2xl",
          "lg:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
          "lg:max-h-[720px]",
          "lg:absolute lg:inset-0 lg:m-auto",
        ])}
      >
        {/* Left Side - Image Section */}
        <div className="relative flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/30 p-8 pt-20 lg:h-full">
          <div className="absolute left-0 top-8 w-full text-center">
            <Text
              family="poppins"
              size="2xl"
              color="black/900"
              weight={600}
              className="relative inline-block text-emerald-400"
            >
              SignIn to Your Elastica Account
              <div className="absolute -bottom-2 left-0 h-1 w-full transform bg-black/900 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            </Text>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-slate-200/20 blur-2xl"></div>
            <Image
              src="/images/auth.png"
              width={2000}
              height={2000}
              alt="auth"
              priority
              className="relative w-full max-w-[420px] lg:h-[430px] lg:w-auto lg:max-w-none transform transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex justify-center bg-white">
          <div
            className={cn([
              "w-full",
              "flex flex-col gap-8 lg:justify-center",
              "px-8 py-10 lg:px-[88px]",
              "sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px]",
            ])}
          >
            <div className="space-y-4">
              <h1 className="font-poppins text-[42px] font-medium text-[#121212] tracking-tight">
                Sign In
              </h1>
              <Text weight={400} color="gray" className="text-base">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-black/900 transition-colors hover:text-black/700 hover:underline"
                >
                  Sign Up
                </Link>
              </Text>
            </div>

            <div className="space-y-6">
              <div className="group relative">
                <Input
                  intent="secondary"
                  type="email"
                  placeholder="Email address"
                  className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-black/900"
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-black/900 transition-all duration-300 group-focus-within:w-full"></div>
              </div>

              <div className="group relative">
                <Input
                  intent="secondary"
                  type="password"
                  placeholder="Password"
                  className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-black/900"
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-black/900 transition-all duration-300 group-focus-within:w-full"></div>
              </div>

              {/* <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRememberMe(!rememberMe)}
                    className={cn(
                      "h-6 w-6 rounded-md border transition-all duration-200",
                      rememberMe 
                        ? "border-black/900 bg-black/900" 
                        : "border-[#6C7275] hover:border-black/900"
                    )}
                  >
                    {rememberMe && (
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
                    color="gray" 
                    size="sm" 
                    className="select-none"
                  >
                    Remember me
                  </Text>
                </div>

                <button 
                  className="text-sm font-semibold text-black/800 transition-colors hover:text-black/600"
                >
                  Forgot password?
                </button>
              </div> */}
            </div>

            <Button
              width="full"
              className={cn(
                "bg-emerald-500 py-3.5 text-base font-semibold text-white",
                "transform transition-all duration-200",
                "hover:bg-black/800 hover:shadow-lg hover:shadow-black/20",
                "active:scale-[0.98]"
              )}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}