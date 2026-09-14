"use client";

import Link from "next/link";
import { Star, MapPin, ShieldCheck, ArrowRight, UtensilsCrossed } from "lucide-react";
import { Listing } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/lib/context/LanguageContext";

interface ListingCardProps {
  listing: Listing;
  viewMode?: "grid" | "list";
}

export default function ListingCard({ listing, viewMode = "grid" }: ListingCardProps) {
  const { t } = useLanguage();
  const badgeVariant: Record<string, "primary" | "purple" | "success"> = {
    PG: "primary",
    Hostel: "purple",
    Flat: "success",
  };

  if (viewMode === "list") {
    return (
      <Link href={`/hostels/${listing.id}`} className="block group card-hover">
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl overflow-hidden shadow-card border border-[#E2E8F0] dark:border-slate-700/80 flex flex-col sm:flex-row h-full">
          {/* Image */}
          <div className="relative sm:w-64 md:w-72 shrink-0 aspect-[16/10] sm:aspect-auto overflow-hidden bg-slate-100 dark:bg-slate-800">
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
              <div className="absolute bottom-3 left-3 bg-[#DDF3EA] border border-[#A4DFCA] rounded-full px-2.5 py-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#1F634A] shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1F634A]" />
                {t("listingCard", "verified")}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-display font-bold text-[#0B132B] dark:text-white text-base group-hover:text-[#3B82A0] dark:group-hover:text-sky-300 transition-colors line-clamp-1">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0 bg-[#FEF7F1] dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-[#F4A261]/20">
                  <Star className="w-3.5 h-3.5 text-[#F4A261] fill-[#F4A261]" />
                  <span className="text-xs font-bold text-[#0B132B] dark:text-amber-200">{listing.rating}</span>
                  <span className="text-[11px] text-[#334155] dark:text-slate-400 font-medium">({listing.reviewCount})</span>
                </div>
              </div>

              <p className="flex items-center gap-1.5 text-[#334155] dark:text-slate-300 text-xs mb-3 font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-[#3B82A0] dark:text-sky-400" />
                <span className="truncate">{listing.locality}, {listing.city}</span>
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700/80 text-[#1E293B] dark:text-slate-200 text-xs font-semibold rounded-full">
                  {listing.sharingType} {t("listingCard", "sharing")}
                </span>
                <span className="px-2.5 py-0.5 bg-[#DCEFF5] text-[#164355] dark:bg-sky-950/60 dark:text-sky-300 text-xs font-semibold rounded-full">
                  {listing.genderPref} {t("listingCard", "only")}
                </span>
                <span className="px-2.5 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 text-xs font-semibold rounded-full">
                  {listing.furnishingStatus}
                </span>
                {listing.hasMess && (
                  <span className="px-2.5 py-0.5 bg-[#DDF3EA] text-[#144D37] text-xs font-bold rounded-full flex items-center gap-1 border border-[#A4DFCA]/60">
                    <UtensilsCrossed className="w-3 h-3 text-[#144D37]" /> {t("listingCard", "messIncluded")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#CBD5E1] dark:border-slate-700/60">
              <div>
                <p className="text-[10px] text-[#334155] dark:text-slate-400 uppercase font-bold tracking-wider">{t("listingCard", "rent")}</p>
                <p className="text-base font-bold text-[#1F4354] dark:text-sky-300">
                  ₹{listing.price.toLocaleString("en-IN")}
                  <span className="text-xs font-semibold text-[#334155] dark:text-slate-400">{t("listingCard", "perMonth")}</span>
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-[#1F4354] dark:text-sky-300 group-hover:text-[#F4A261] dark:group-hover:text-[#F4A261] transition-colors">
                {t("listingCard", "viewDetails")} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/hostels/${listing.id}`} className="block group card-hover">
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl overflow-hidden shadow-card border border-[#CBD5E1] dark:border-slate-700/80 flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
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
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-[#F4A261] fill-[#F4A261]" />
            <span className="text-xs font-bold text-[#0B132B] dark:text-amber-200">{listing.rating}</span>
            <span className="text-xs text-[#334155] dark:text-slate-400 font-medium">({listing.reviewCount})</span>
          </div>
          {listing.verified && (
            <div className="absolute bottom-3 left-3 bg-[#DDF3EA] border border-[#A4DFCA] rounded-full px-2.5 py-0.5 flex items-center gap-1 text-[11px] font-bold text-[#144D37] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#144D37]" />
              {t("listingCard", "verified")}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-display font-bold text-[#0B132B] dark:text-white text-sm sm:text-base leading-snug mb-1 group-hover:text-[#3B82A0] dark:group-hover:text-sky-300 transition-colors line-clamp-2">
              {listing.title}
            </h3>
            <p className="flex items-center gap-1.5 text-[#334155] dark:text-slate-300 text-xs mb-3 font-medium">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#3B82A0] dark:text-sky-400" />
              <span className="truncate">{listing.locality}, {listing.city}</span>
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/80 text-[#1E293B] dark:text-slate-200 text-[11px] font-semibold rounded-full">
                {listing.sharingType}
              </span>
              <span className="px-2 py-0.5 bg-[#DCEFF5] text-[#164355] dark:bg-sky-950/60 dark:text-sky-300 text-[11px] font-semibold rounded-full">
                {listing.genderPref}
              </span>
              {listing.amenities.slice(0, 2).map((a) => (
                <span key={a} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/80 text-[#1E293B] dark:text-slate-200 text-[11px] font-semibold rounded-full">
                  {a}
                </span>
              ))}
              {listing.hasMess && (
                <span className="px-2 py-0.5 bg-[#DDF3EA] text-[#144D37] text-[11px] font-bold rounded-full border border-[#A4DFCA]/50">
                  {t("listingCard", "messIncluded")} ✓
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#CBD5E1] dark:border-slate-700/60">
            <div>
              <p className="text-[10px] text-[#334155] dark:text-slate-400 uppercase font-bold tracking-wider">{t("listingCard", "rent")}</p>
              <p className="text-base font-bold text-[#1F4354] dark:text-sky-300">
                ₹{listing.price.toLocaleString("en-IN")}
                <span className="text-xs font-semibold text-[#334155] dark:text-slate-400">{t("listingCard", "perMonth")}</span>
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-[#1F4354] dark:text-sky-300 group-hover:text-[#F4A261] dark:group-hover:text-[#F4A261] transition-colors">
              {t("listingCard", "viewDetails")} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
