"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
// ui
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";

// form
import Input from "@/components/form/input";

// lib
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function Page() {
    const [checked, setChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password }),
        });

        if (res.ok) {
            toast.success("Signup successful! Please login.");
            router.push("/login");
        } else {
            toast.error("Error signing up.");
        }
    };

    // Add this function to handle checkbox click without submitting the form
    const handleCheckboxClick = (e) => {
        // Prevent the default form submission
        e.preventDefault();
        setChecked(!checked);
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#22c55e] to-white">
            <div className={cn([
                "grid lg:grid-cols-2",
                "max-w-[1440px]",
                "bg-white",
                "lg:rounded-2xl lg:shadow-[0_15px_50px_rgba(255,193,85,0.25)]",
                "lg:max-h-[800px]",
                "lg:absolute lg:inset-0 lg:m-auto",
                "overflow-hidden",
                "border border-[#22c55e]/10",
            ])}>
                {/* Left Side - Image Section */}
                <div className="relative flex items-center justify-center bg-gradient-to-b from-[#22c55e]/5 to-[#22c55e]/10 p-8 pt-20 lg:h-full lg:rounded-l-2xl">
                    <Text
                        family="poppins"
                        size="2xl"
                        weight={600}
                        className="absolute left-0 top-8 w-full text-center text-[#22c55e] tracking-wide"
                    >
                        Join Elastica 
                    </Text>

                    <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-[#22c55e]/20 blur-3xl"></div>
                        <Image
                            src="/images/auth.png"
                            width={2500}
                            height={2500}
                            alt="auth"
                            className="relative w-full max-w-[450px] lg:h-[500px] lg:w-auto lg:max-w-none transform transition-transform duration-700 hover:scale-105 drop-shadow-2xl"
                            priority
                        />
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-24 left-20 w-8 h-8 rounded-full bg-[#22c55e]/20 animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-12 h-12 rounded-full bg-[#22c55e]/30 animate-pulse"></div>
                    <div className="absolute top-1/3 right-20 w-6 h-6 rounded-full bg-[#22c55e]/40 animate-pulse"></div>
                </div>

                {/* Right Side - Form Section */}
                <div className="flex justify-center border-0 bg-white lg:rounded-r-2xl">
                    <form onSubmit={handleSignup} className="flex" >
                        <div className={cn([
                            "w-full",
                            "flex flex-col gap-8 lg:justify-center",
                            "px-8 py-10 lg:px-[88px]",
                            "sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px]",
                        ])}>
                            <div className="space-y-4">
                                <h1 className="font-poppins text-[42px] font-medium text-[#121212] tracking-tight">
                                    Sign Up <span className="text-[#22c55e]">.</span>
                                </h1>
                                <Text weight={400} color="gray" className="text-base">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="font-semibold text-[#22c55e] transition-colors hover:text-emerald-600 hover:underline"
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
                                        placeholder="Username"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-[#22c55e]"
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#22c55e] transition-all duration-300 group-focus-within:w-full"></div>
                                </div>

                                <div className="group relative">
                                    <Input
                                        intent="secondary"
                                        type="email"
                                        placeholder="Email address"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-[#22c55e]"
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#22c55e] transition-all duration-300 group-focus-within:w-full"></div>
                                </div>
                                <div className="group relative">
                                    <Input
                                        intent="secondary"
                                        type="tel"
                                        placeholder="Phone"
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-[#22c55e]"
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#22c55e] transition-all duration-300 group-focus-within:w-full"></div>
                                </div>

                                <div className="group relative">
                                    <Input
                                        intent="secondary"
                                        type="password"
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full border-b border-[#E8ECEF] pb-3 pt-2 outline-none transition-all focus:border-[#22c55e]"
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#22c55e] transition-all duration-300 group-focus-within:w-full"></div>
                                </div>

                                <div className="flex items-center gap-3 mt-6">
                                    <button
                                        type="button" 
                                        onClick={handleCheckboxClick}
                                        className={cn(
                                            "h-6 w-6 rounded-md border transition-all duration-200",
                                            checked
                                                ? "border-[#22c55e] bg-[#22c55e]"
                                                : "border-[#6C7275] hover:border-[#22c55e]"
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
                                        <button type="button" className="font-semibold text-[#141718] hover:text-[#22c55e] transition-colors">
                                            Privacy Policy
                                        </button>{" "}
                                        and{" "}
                                        <button type="button" className="font-semibold text-[#141718] hover:text-[#22c55e] transition-colors">
                                            Terms of Use
                                        </button>
                                    </Text>
                                </div>
                            </div>

                            <Button
                                width="full"
                                className={cn(
                                    "bg-[#22c55e] py-4 text-base font-semibold text-white",
                                    "transform transition-all duration-200",
                                    "hover:bg-emerald-600 hover:shadow-lg hover:shadow-[#22c55e]/30",
                                    "active:scale-[0.98]",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "rounded-xl"
                                )}
                                disabled={!checked}
                                type="submit"
                            >
                                Create Account
                            </Button>
                            
                           
                            
                            <div className="text-center mt-4">
                                <p className="text-xs text-gray-500">
                                    By creating an account, you agree to our{" "}
                                    <Link href="/terms" className="text-[#22c55e] hover:underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-[#22c55e] hover:underline">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}