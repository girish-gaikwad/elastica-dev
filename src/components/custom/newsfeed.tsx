"use client";
import { useState } from "react";
import SectionLayout from "@/layouts/sectionLayout";
import Text from "../ui/text";
import Heading from "../ui/head";
import Input from "@/components/form/input";
import Button from "@/components/ui/button";
import { toast } from "react-hot-toast";

function NewsFeed() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || "Successfully subscribed!");
                setEmail(""); // Clear input on success
            } else {
                toast.error(data.error || "Something went wrong.");
            }
        } catch (error) {
            toast.error("Failed to subscribe. Try again later.");
        }
        setLoading(false);
    };

    return (
        <SectionLayout>
            <div className="bg-gradient-to-b from-white to-amber-50 rounded-xl shadow-lg border border-amber-100 px-8 py-16 space-y-12">
                <div className="space-y-6 text-center">
                    <div className="inline-block relative">
                        <Text 
                            weight={700} 
                            transform="uppercase"
                            className="tracking-widest text-amber-800 relative z-10"
                        >
                            exclusive updates
                        </Text>
                        <div className="absolute h-2 w-full bg-amber-200 bottom-0 left-0 opacity-70"></div>
                    </div>
                    
                    <Heading as="h2" className="text-3xl md:text-4xl font-serif text-amber-900">
                        Join Our Collection Preview
                    </Heading>
                    
                    <div className="w-20 h-px bg-amber-400 mx-auto my-4"></div>
                    
                    <Text size="sm" className="max-w-xl mx-auto text-amber-700">
                        Be the first to discover new arrivals, exclusive offers, and curated content tailored to your refined taste.
                    </Text>
                    
                    <div className="flex items-center justify-center space-x-2 pt-6">
                        <div className="h-px w-12 bg-amber-300"></div>
                        <Text size="xl" weight={500} family="serif" className="text-amber-800">
                            @elastica_srkp
                        </Text>
                        <div className="h-px w-12 bg-amber-300"></div>
                    </div>
                </div>

                {/* Email Subscription Form */}
                <div className="flex flex-col items-center space-y-5 max-w-md mx-auto">
                    <div className="relative w-full">
                        <Input
                            type="email"
                            placeholder="Your Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border-amber-200 bg-white p-4 pl-5 text-amber-900 placeholder-amber-400 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                        />
                    </div>
                    <Button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                        style={{ backgroundColor: "#FFC156" }}
                    >
                        {loading ? "Processing..." : "Subscribe to Receive Updates"}
                    </Button>
                    <Text size="xs" className="text-amber-700 text-center opacity-75 mt-3">
                        By subscribing, you agree to our Privacy Policy and consent to receive our exclusive updates.
                    </Text>
                </div>
            </div>
        </SectionLayout>
    );
}

export default NewsFeed;