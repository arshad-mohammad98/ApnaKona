"use client";

import Link from "next/link";
import { Star, MapPin, Wifi, ShieldCheck, ArrowRight } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { Badge } from "@/components/ui/Badge";

function ListingCard({ listing }: { listing: (typeof DUMMY_LISTINGS)[0] }) {
  const badgeVariant: Record<string, "primary" | "purple" | "success"> = {
    PG: "primary",
    Hostel: "purple",
    Flat: "success",
  };

  return (
    <Link href={`/listing/${listing.id}`} className="block group card-hover">
      <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100 flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[16/10] sm:h-52 overflow-hidden bg-gray-100 shrink-0">
          <img
            src={listing.images[0]}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant={badgeVariant[listing.roomType] || "primary"}>
              {listing.roomType}
            </Badge>
            {listing.isAC && <Badge variant="cyan">AC</Badge>}
          </div>
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-gray-800">{listing.rating}</span>
            <span className="text-xs text-gray-400">({listing.reviewCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-display font-semibold text-gray-900 text-sm sm:text-base leading-snug mb-1 line-clamp-2">
              {listing.title}
            </h3>
            <p className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#0F4C81]" />
              <span className="truncate">{listing.locality}, {listing.city}</span>
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {listing.amenities.slice(0, 3).map((a) => (
                <span key={a} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {a}
                </span>
              ))}
              {listing.hasMess && (
                <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                  Mess ✓
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
            <div>
              <span className="text-xl font-bold text-[#0F4C81]">
                ₹{listing.price.toLocaleString("en-IN")}
              </span>
              <span className="text-gray-400 text-xs">/month</span>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
              {listing.sharingType} Sharing
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedListings() {
  const featured = DUMMY_LISTINGS.filter((l) => l.rating >= 4.4).slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            href="/search"
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81] hover:text-white transition-colors text-xs sm:text-sm font-semibold min-h-[44px] shrink-0 w-full sm:w-auto"
          >
            View All Listings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
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
