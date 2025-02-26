// package
import Link from "next/link";
import Image from "next/image";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import Button from "@/components/ui/button";
import Heading from "@/components/ui/head";
import Text from "@/components/ui/text";
import CatalogSlider from "@/components/ui/slider/catalogSlider";
import * as ProductCard from "@/components/ui/card/productCard";
import {
  ArrowRightIcon,
  CallIcon,
  DeliveryIcon,
  LockIcon,
  MoneyIcon,
} from "@/components/ui/assets/svg";

// data
import products from "@/data/product.json";
import HeroSection from "@/components/custom/hero";
import NewArraival from "@/components/custom/newArraival";
import Collection from "@/components/custom/collection";
import BestSeller from "@/components/custom/bestSeller";
import Promotion from "@/components/custom/promotion";
import Features from "@/components/custom/features";
import NewsFeed from "@/components/custom/newsfeed";

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
