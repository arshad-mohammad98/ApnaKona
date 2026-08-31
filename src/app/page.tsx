import type { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedListings from "@/components/landing/FeaturedListings";
import Testimonials from "@/components/landing/Testimonials";
import OwnerCTA from "@/components/landing/OwnerCTA";

export const metadata: Metadata = {
  title: "ApnaKona — Find PG, Hostel & Flats Near Your College",
  description:
    "India's most trusted platform for students to find safe, affordable PGs, hostels, and flats. No broker fees. Verified listings across 200+ cities.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedListings />
      <Testimonials />
      <OwnerCTA />
    </>
  );
}
