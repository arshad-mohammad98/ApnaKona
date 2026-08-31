"use client";

import Link from "next/link";
import { Star, MapPin, Wifi, ShieldCheck, ArrowRight } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";

function ListingCard({ listing }: { listing: (typeof DUMMY_LISTINGS)[0] }) {
  const typeColor: Record<string, string> = {
    PG: "bg-blue-100 text-blue-700",
    Hostel: "bg-purple-100 text-purple-700",
    Flat: "bg-green-100 text-green-700",
  };

  return (
    <Link href={`/listing/${listing.id}`} className="block group card-hover">
      <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeColor[listing.roomType]}`}>
              {listing.roomType}
            </span>
            {listing.isAC && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700">AC</span>
            )}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-gray-800">{listing.rating}</span>
            <span className="text-xs text-gray-500">({listing.reviewCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
            {listing.title}
          </h3>
          <p className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {listing.locality}, {listing.city}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {listing.amenities.slice(0, 3).map((a) => (
              <span key={a} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {a}
              </span>
            ))}
            {listing.hasMess && (
              <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full">Mess ✓</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-[#0F4C81]">₹{listing.price.toLocaleString("en-IN")}</span>
              <span className="text-gray-500 text-xs">/month</span>
            </div>
            <span className="text-xs text-gray-400">{listing.sharingType} Sharing</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedListings() {
  const featured = DUMMY_LISTINGS.filter((l) => l.rating >= 4.4).slice(0, 6);

  return (
    <section className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-semibold mb-3">
              Top Rated
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A2E]">
              Featured Listings
            </h2>
            <p className="text-gray-500 mt-2">Hand-picked by our team — verified, safe, and loved by students.</p>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-2 px-5 py-2.5 border border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81] hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 pt-12 border-t border-gray-200">
          {[
            { icon: ShieldCheck, label: "Verified Owners", sub: "All listings are manually verified" },
            { icon: Star, label: "4.8/5 Rating", sub: "Average rating across 2L+ reviews" },
            { icon: Wifi, label: "Fast Response", sub: "Owners respond within 24 hrs" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0F4C81]/8 flex items-center justify-center">
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
