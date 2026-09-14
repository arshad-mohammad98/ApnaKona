"use client";

import Link from "next/link";
import { Star, Wifi, ShieldCheck, ArrowRight } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import ListingCard from "@/components/hostels/ListingCard";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function FeaturedListings() {
  const { t } = useLanguage();

  // Grab top 3 listings
  const featured = DUMMY_LISTINGS.filter((l) => l.featured).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white transition-colors relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Light fonts on dark background */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="inline-block px-3.5 py-1 bg-white/15 backdrop-blur-md text-[#F09A57] rounded-full text-sm sm:text-base font-semibold mb-2.5 border border-white/20">
              {t("featured", "badge")}
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-xs"
              style={{ color: "#FFFFFF" }}
            >
              {t("featured", "title")}
            </h2>
            <p
              className="text-white text-sm sm:text-base mt-1.5 max-w-xl font-normal drop-shadow-2xs"
              style={{ color: "#FFFFFF" }}
            >
              {t("featured", "subtitle")}
            </p>
          </div>
          <Link
            href="/hostels"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl transition-all text-sm sm:text-base font-bold min-h-[44px] shrink-0 w-full sm:w-auto shadow-sm"
            style={{ color: "#FFFFFF" }}
          >
            <span>{t("featured", "viewAll")}</span>
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
            { icon: ShieldCheck, labelKey: "verifiedListings", subKey: "verifiedListingsSub", bg: "bg-[#D4ECE5]", color: "text-[#144D37]" },
            { icon: Star, labelKey: "studentRated", subKey: "studentRatedSub", bg: "bg-[#FEF7F1]", color: "text-[#F4A261]" },
            { icon: Wifi, labelKey: "directInquiries", subKey: "directInquiriesSub", bg: "bg-[#D9E8EF]", color: "text-[#2A556A]" },
          ].map(({ icon: Icon, labelKey, subKey, bg, color }) => (
            <div key={labelKey} className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="font-bold text-base text-white" style={{ color: "#FFFFFF" }}>{t("featured", labelKey)}</p>
                <p className="text-sm text-white font-normal" style={{ color: "#FFFFFF" }}>{t("featured", subKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
