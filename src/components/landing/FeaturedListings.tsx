"use client";

import Link from "next/link";
import { Star, Wifi, ShieldCheck, ArrowRight } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import ListingCard from "@/components/hostels/ListingCard";

export default function FeaturedListings() {
  // Grab top 3 listings
  const featured = DUMMY_LISTINGS.filter((l) => l.featured).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="inline-block px-3.5 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-xs sm:text-sm font-semibold mb-2.5">
              Top Rated Verified
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A2E]">
              Featured Listings
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1.5 max-w-xl">
              Hand-picked by our team — verified, safe, zero brokerage, and loved by students.
            </p>
          </div>
          <Link
            href="/hostels"
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81] hover:text-white transition-colors text-xs sm:text-sm font-semibold min-h-[44px] shrink-0 w-full sm:w-auto"
          >
            View All Listings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 sm:mt-16 pt-10 border-t border-gray-200">
          {[
            { icon: ShieldCheck, label: "Verified Owners", sub: "All listings are physically inspected" },
            { icon: Star, label: "4.8/5 Student Rating", sub: "Average rating across 2L+ authentic reviews" },
            { icon: Wifi, label: "Fast Owner Response", sub: "Direct connection within 24 hours" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3.5 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-gray-100 shadow-xs sm:shadow-none">
              <div className="w-12 h-12 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#0F4C81]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
