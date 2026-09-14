import type { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import TrustHighlights from "@/components/landing/TrustHighlights";
import TrustProcess from "@/components/landing/TrustProcess";
import WelcomeSection from "@/components/landing/WelcomeSection";
import ProductShowcase from "@/components/landing/ProductShowcase";
import FeaturedListings from "@/components/landing/FeaturedListings";
import FinalCTA from "@/components/landing/FinalCTA";

export const metadata: Metadata = {
  title: "ApnaKona — All-in-One Student Housing Portal",
  description:
    "Discover verified student PGs, hostels and shared flats with zero brokerage fees. Filter by budget, explore commute times, and get guidance from Roomie AI.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white">
      {/* SECTION 1 — HERO / COMING TO A NEW CITY */}
      <Hero />

      {/* SECTION 2 — WHY TRUST APNAKONA? */}
      <TrustHighlights />

      {/* SECTION 3 — OUR VERIFICATION / TRUST PROCESS */}
      <TrustProcess />

      {/* SECTION 4 — WELCOME TO APNAKONA */}
      <WelcomeSection />

      {/* SECTION 5 — EXPLORE / VISUAL PRODUCT SECTION */}
      <ProductShowcase />

      {/* FEATURED REAL LISTINGS (AUTHENTIC PROJECT DATA) */}
      <FeaturedListings />

      {/* SECTION 6 — FINAL CATCHY CTA */}
      <FinalCTA />
    </main>
  );
}
