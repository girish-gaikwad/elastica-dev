"use client";
import { useState } from "react";
import SectionLayout from "@/layouts/sectionLayout";
import Text from "../ui/text";
import Heading from "../ui/head";
import  Input  from "@/components/form/input";
import  Button  from "@/components/ui/button";
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
            <div className="space-y-10 px-8 py-10">
                <div className="space-y-4 text-center">
                    <Text weight={700} transform="uppercase" color="gray">
                        newsfeed
                    </Text>
                    <Heading as="h2" intent="base-section">
                        Instagram
                    </Heading>
                    <Text size="sm">
                        Follow us on social media for more discounts & promotions
                    </Text>
                    <Text size="xl" weight={500} family="poppins" color="gray">
                        @elastica_srkp
                    </Text>
                </div>

                {/* Email Subscription Form */}
                <div className="flex flex-col items-center space-y-4">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full max-w-md rounded-lg border p-3 text-gray-700"
                    />
                    <Button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full max-w-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {loading ? "Subscribing..." : "Subscribe"}
                    </Button>
                </div>
            </div>
        </SectionLayout>
    );
}

export default NewsFeed;
