"use client";

import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// ui
import Button from "@/components/ui/button";
import Text from "@/components/ui/text";

// form
import Input from "@/components/form/input";

// lib
import { cn } from "@/lib/utils";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleLogin = async () => {
    const res = await signIn("google", { redirect: false });
    if (res?.error) {
      toast.error("Google login failed. Please try again.");
    } else {
      router.push("/");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      toast.error(res.error || "Invalid credentials.");
    } else {
      toast.success("Login successful!");
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#158940] to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-[#166534]/30 rounded-full animate-pulse"></div>
          <div className="w-20 h-6 bg-[#166534]/30 rounded-full animate-pulse"></div>
          <div className="w-20 h-6 bg-[#166534]/30 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#158940] to-white">
      <div
        className={cn([
          "grid lg:grid-cols-2",
          "max-w-[1440px]",
          "bg-white",
          "overflow-hidden",
          "lg:rounded-2xl",
          "lg:shadow-[0_15px_50px_rgba(0,0,0,0.15)]",
          "lg:max-h-[720px]",
          "lg:absolute lg:inset-0 lg:m-auto",
          "border border-[#166534]/10",
        ])}
      >
        {/* Left Side - Image Section */}
        <div className="relative flex items-center justify-center bg-gradient-to-b from-[#158940]/5 to-[#158940]/10 p-8 pt-20 lg:h-full">
          <div className="absolute left-0 top-8 w-full text-center">
            <Text
              family="poppins"
              size="2xl"
              color="black/900"
              weight={600}
              className="relative inline-block text-[#158940]"
            >
              Welcome to Elastica.
              <div className="absolute -bottom-2 left-0 h-1 w-full transform bg-[#158940] scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            </Text>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-[#158940]/20 blur-3xl"></div>
            <Image
              src="/images/auth.png"
              width={2000}
              height={2000}
              alt="auth"
              priority
              className="relative w-full max-w-[420px] lg:h-[430px] lg:w-auto lg:max-w-none transform transition-transform duration-700 hover:scale-105 drop-shadow-2xl"
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-16 left-16 w-8 h-8 rounded-full bg-[#158940]/20 animate-pulse"></div>
          <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-[#158940]/30 animate-pulse"></div>
          <div className="absolute top-1/3 right-16 w-6 h-6 rounded-full bg-[#158940]/40 animate-pulse"></div>
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
                Sign In <span className="text-[#158940]">.</span>
              </h1>
              <Text weight={400} color="gray" className="text-base">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-[#158940] transition-colors hover:text-[#166534] hover:underline"
                >
                  Sign Up
                </Link>
              </Text>
            </div>
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-6">
                <div className="group relative">
                  <Input
                    intent="secondary"
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-[#158940]"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#158940] transition-all duration-300 group-focus-within:w-full"></div>
                </div>

                <div className="group relative">
                  <Input
                    intent="secondary"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-[#158940]"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#158940] transition-all duration-300 group-focus-within:w-full"></div>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-500 hover:text-[#158940] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                width="full"
                type="submit"
                className={cn(
                  "bg-[#46d279] py-4 text-base font-semibold text-white",
                  "transform transition-all duration-200",
                  "hover:bg-[#158940] hover:shadow-lg hover:shadow-[#158940]/30",
                  "active:scale-[0.98]",
                  "rounded-xl"
                )}
              >
                Sign In
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={cn(
                    "bg-white py-3.5 px-6 text-base font-medium text-[#121212]",
                    "rounded-xl border border-gray-200 shadow-sm",
                    "transform transition-all duration-200",
                    "hover:border-[#158940] hover:shadow-md hover:shadow-[#158940]/10",
                    "active:scale-[0.98]",
                    "w-full flex items-center justify-center space-x-3"
                  )}
                >
                  <Image src="/images/google.png" width={20} height={20} alt="google" />
                  <span>Google</span>
                </button>
              </div>
            </form>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-[#479e67] underline hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#479e67] underline hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}