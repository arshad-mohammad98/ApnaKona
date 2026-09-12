"use client";

import Link from "next/link";
import { Star, Wifi, ShieldCheck, ArrowRight } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import ListingCard from "@/components/hostels/ListingCard";

export default function FeaturedListings() {
  // Grab top 3 listings
  const featured = DUMMY_LISTINGS.filter((l) => l.featured).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white transition-colors relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Light fonts on dark background */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="inline-block px-3.5 py-1 bg-white/15 backdrop-blur-md text-[#F09A57] rounded-full text-sm sm:text-base font-semibold mb-2.5 border border-white/20">
              Top Rated Verified
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-xs"
              style={{ color: "#FFFFFF" }}
            >
              Featured Listings
            </h2>
            <p
              className="text-white text-sm sm:text-base mt-1.5 max-w-xl font-normal drop-shadow-2xs"
              style={{ color: "#FFFFFF" }}
            >
              Hand-picked by our team — verified, safe, zero brokerage, and loved by students.
            </p>
          </div>
          <Link
            href="/hostels"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl transition-all text-sm sm:text-base font-bold min-h-[44px] shrink-0 w-full sm:w-auto shadow-sm"
            style={{ color: "#FFFFFF" }}
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Responsive Grid: Crisp white cards with dark fonts inside */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        {/* Trust badges row: Glassmorphism badges on dark background */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 sm:mt-16 pt-10 border-t border-white/20">
          {[
            { icon: ShieldCheck, label: "Verified Listings", sub: "Listing details and photos checked transparently", bg: "bg-[#D4ECE5]", color: "text-[#144D37]" },
            { icon: Star, label: "Student-Rated Accommodations", sub: "Real feedback from verified student residents", bg: "bg-[#FEF7F1]", color: "text-[#F4A261]" },
            { icon: Wifi, label: "Direct Inquiries", sub: "Connect with owners without broker markups", bg: "bg-[#D9E8EF]", color: "text-[#2A556A]" },
          ].map(({ icon: Icon, label, sub, bg, color }) => (
            <div key={label} className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="font-bold text-base text-white" style={{ color: "#FFFFFF" }}>{label}</p>
                <p className="text-sm text-white font-normal" style={{ color: "#FFFFFF" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
