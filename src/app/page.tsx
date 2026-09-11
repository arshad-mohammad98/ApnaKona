import type { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedListings from "@/components/landing/FeaturedListings";
import Testimonials from "@/components/landing/Testimonials";
import OwnerCTA from "@/components/landing/OwnerCTA";

export const metadata: Metadata = {
  title: "ApnaKona — All-in-One Student Housing Portal",
  description:
    "India's all-in-one student housing platform: search verified PGs, explore transit maps, connect with college roommates, and resolve grievances with zero broker fees.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <FeaturedListings />
      <Testimonials />
      <OwnerCTA />
    </div>
  );
}
