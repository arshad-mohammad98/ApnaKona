"use client";

import Link from "next/link";
import { Star, MapPin, ShieldCheck, ArrowRight, UtensilsCrossed } from "lucide-react";
import { Listing } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface ListingCardProps {
  listing: Listing;
  viewMode?: "grid" | "list";
}

export default function ListingCard({ listing, viewMode = "grid" }: ListingCardProps) {
  const badgeVariant: Record<string, "primary" | "purple" | "success"> = {
    PG: "primary",
    Hostel: "purple",
    Flat: "success",
  };

  if (viewMode === "list") {
    return (
      <Link href={`/hostels/${listing.id}`} className="block group card-hover">
        <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100 flex flex-col sm:flex-row h-full">
          {/* Image */}
          <div className="relative sm:w-64 md:w-72 shrink-0 aspect-[16/10] sm:aspect-auto overflow-hidden bg-gray-100">
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
            {listing.verified && (
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#0F4C81] shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                Verified
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-display font-semibold text-gray-900 text-base group-hover:text-[#0F4C81] transition-colors line-clamp-1">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-gray-800">{listing.rating}</span>
                  <span className="text-[11px] text-gray-400">({listing.reviewCount})</span>
                </div>
              </div>

              <p className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-[#0F4C81]" />
                <span className="truncate">{listing.locality}, {listing.city}</span>
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {listing.sharingType} Sharing
                </span>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                  {listing.genderPref} Only
                </span>
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">
                  {listing.furnishingStatus}
                </span>
                {listing.hasMess && (
                  <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3" /> Mess Included
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Rent</p>
                <p className="text-base font-bold text-[#0F4C81]">
                  ₹{listing.price.toLocaleString("en-IN")}
                  <span className="text-xs font-normal text-gray-500">/mo</span>
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#0F4C81] group-hover:text-[#FF6B35] transition-colors">
                View Details <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/hostels/${listing.id}`} className="block group card-hover">
      <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100 flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
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
          {listing.verified && (
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#0F4C81] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              Verified
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-display font-semibold text-gray-900 text-sm sm:text-base leading-snug mb-1 group-hover:text-[#0F4C81] transition-colors line-clamp-2">
              {listing.title}
            </h3>
            <p className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#0F4C81]" />
              <span className="truncate">{listing.locality}, {listing.city}</span>
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded-full">
                {listing.sharingType}
              </span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] rounded-full">
                {listing.genderPref}
              </span>
              {listing.amenities.slice(0, 2).map((a) => (
                <span key={a} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded-full">
                  {a}
                </span>
              ))}
              {listing.hasMess && (
                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[11px] font-medium rounded-full">
                  Mess ✓
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-medium">Rent</p>
              <p className="text-base font-bold text-[#0F4C81]">
                ₹{listing.price.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-gray-500">/mo</span>
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#0F4C81] group-hover:text-[#FF6B35] transition-colors">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
