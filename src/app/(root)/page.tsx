import BestSeller from "@/components/custom/bestSeller";
import Collection from "@/components/custom/collection";
import Features from "@/components/custom/features";
import HeroSection from "@/components/custom/hero";
import NewArraival from "@/components/custom/newArraival";
import NewsFeed from "@/components/custom/newsfeed";
import Promotion from "@/components/custom/promotion";

export default function Home() {
  return (
    <>
      <HeroSection />

      <NewArraival />

      <Collection />

      <BestSeller />


      <Promotion />

      <Features />

      <NewsFeed />
    </>
  );
}
