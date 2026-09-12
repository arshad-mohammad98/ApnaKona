"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Star, MapPin, Search, ArrowRight } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { Badge } from "@/components/ui/Badge";

export default function PortalSearch() {
  const [citySearch, setCitySearch] = useState("");
  const [roomType, setRoomType] = useState<string>("");
  const [sharingType, setSharingType] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(22000);
  const [acOnly, setAcOnly] = useState<boolean>(false);
  const [messOnly, setMessOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<"rating" | "price-asc" | "price-desc">("rating");

  const results = useMemo(() => {
    let lst = [...DUMMY_LISTINGS];
    if (roomType) lst = lst.filter((l) => l.roomType === roomType);
    if (sharingType) lst = lst.filter((l) => l.sharingType === sharingType);
    if (acOnly) lst = lst.filter((l) => l.isAC);
    if (messOnly) lst = lst.filter((l) => l.hasMess);
    lst = lst.filter((l) => l.price <= maxPrice);

    if (citySearch) {
      const q = citySearch.toLowerCase();
      lst = lst.filter(
        (l) => l.city.toLowerCase().includes(q) || l.locality.toLowerCase().includes(q)
      );
    }

    if (sort === "price-asc") lst.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") lst.sort((a, b) => b.price - a.price);
    else lst.sort((a, b) => b.rating - a.rating);

    return lst;
  }, [roomType, sharingType, acOnly, messOnly, maxPrice, citySearch, sort]);

  const badgeVariant: Record<string, "primary" | "purple" | "success"> = {
    PG: "primary",
    Hostel: "purple",
    Flat: "success",
  };

  return (
    <section id="search" className="py-16 sm:py-24 bg-[#F7FAFC] dark:bg-[#0B1120] border-t border-[#E2E8F0] dark:border-slate-800 scroll-mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1 bg-[#D9E8EF] dark:bg-[#2A556A]/40 text-[#122733] dark:text-[#D9E8EF] rounded-full text-xs sm:text-sm font-semibold mb-3 border border-[#2A556A]/20">
              Live Property Search
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] dark:text-white">
              Find PGs, Hostels &amp; Flats Near Campus
            </h2>
            <p className="text-[#64748B] dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xl">
              Filter by budget, room sharing, AC, and food service with zero brokerage fees.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2A556A] dark:border-[#4A7C94] text-[#2A556A] dark:text-[#D9E8EF] rounded-xl hover:bg-[#2A556A] hover:text-white dark:hover:bg-[#2A556A] dark:hover:text-white transition-colors text-xs sm:text-sm font-semibold min-h-[44px] shrink-0 w-full sm:w-auto justify-center"
          >
            Open Full Search Page <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Filter Controls Card */}
        <div className="bg-white dark:bg-[#131D31] rounded-3xl p-5 sm:p-7 shadow-card border border-[#E2E8F0] dark:border-slate-800 mb-8 space-y-5">
          {/* Row 1: Search Input & Quick Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] dark:text-slate-500" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Search city, area, or college (e.g. Greater Noida, Bangalore, Knowledge Park)..."
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1F2937] dark:text-white placeholder-[#64748B] dark:placeholder-slate-500 rounded-xl outline-none focus:border-[#2A556A] dark:focus:border-[#4A7C94] min-h-[44px]"
              />
            </div>

            {/* Room Type Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-[#64748B] dark:text-slate-500 hidden sm:inline mr-1">Type:</span>
              {["", "PG", "Hostel", "Flat"].map((t) => (
                <button
                  key={t || "all"}
                  onClick={() => setRoomType(t)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[40px] whitespace-nowrap ${
                    roomType === t
                      ? "bg-[#2A556A] text-white border-[#2A556A] shadow-xs"
                      : "border-[#E2E8F0] dark:border-slate-700 text-[#1F2937] dark:text-slate-300 bg-white dark:bg-slate-900 hover:border-[#2A556A]/40"
                  }`}
                >
                  {t || "All Types"}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Secondary Filter Pills, Budget Slider, Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0] dark:border-slate-800">
            {/* Sharing Type */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-[#64748B] dark:text-slate-500 mr-1">Sharing:</span>
              {["", "Single", "Double", "Triple"].map((s) => (
                <button
                  key={s || "all-sharing"}
                  onClick={() => setSharingType(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer min-h-[36px] ${
                    sharingType === s
                      ? "bg-[#1F2937] text-white border-[#1F2937] dark:bg-white dark:text-[#1F2937] dark:border-white"
                      : "border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-400 hover:border-[#2A556A]/40"
                  }`}
                >
                  {s || "Any"}
                </button>
              ))}
            </div>

            {/* Toggles: AC & Mess */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAcOnly(!acOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[36px] ${
                  acOnly ? "bg-[#2A556A] text-white border-[#2A556A]" : "border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-400 hover:bg-[#D9E8EF]/50"
                }`}
              >
                ❄️ AC Rooms
              </button>
              <button
                onClick={() => setMessOnly(!messOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[36px] ${
                  messOnly ? "bg-[#F4A261] text-white border-[#F4A261]" : "border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-400 hover:bg-[#FEF7F1]"
                }`}
              >
                🍲 Mess Included
              </button>
            </div>

            {/* Budget & Sort */}
            <div className="flex items-center gap-4 w-full sm:w-auto ml-auto">
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <span className="text-xs text-[#64748B] dark:text-slate-400 whitespace-nowrap">
                  Under: <strong className="text-[#1F2937] dark:text-white">₹{maxPrice.toLocaleString("en-IN")}</strong>
                </span>
                <input
                  type="range"
                  min={4000}
                  max={30000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#2A556A] cursor-pointer"
                />
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="px-3 py-1.5 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-xs font-semibold text-[#1F2937] dark:text-slate-200 bg-white dark:bg-slate-900 outline-none focus:border-[#2A556A] min-h-[36px]"
              >
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Grid */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300">
            Showing <strong>{results.length}</strong> available properties
          </p>
          {(roomType || sharingType || acOnly || messOnly || citySearch || maxPrice < 22000) && (
            <button
              onClick={() => {
                setRoomType("");
                setSharingType("");
                setAcOnly(false);
                setMessOnly(false);
                setCitySearch("");
                setMaxPrice(22000);
              }}
              className="text-xs font-semibold text-[#F4A261] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.slice(0, 6).map((l) => (
              <Link key={l.id} href={`/listing/${l.id}`} className="block group card-hover">
                <div className="bg-white dark:bg-[#131D31] rounded-3xl overflow-hidden shadow-card border border-[#E2E8F0] dark:border-slate-800 flex flex-col h-full">
                  <div className="relative aspect-[16/10] sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={l.images[0]}
                      alt={l.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <Badge variant={badgeVariant[l.roomType] || "primary"}>
                        {l.roomType}
                      </Badge>
                      {l.isAC && <Badge variant="cyan">AC</Badge>}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-[#F4A261] fill-[#F4A261]" />
                      <span className="text-xs font-bold text-[#1F2937] dark:text-white">{l.rating}</span>
                      <span className="text-xs text-[#64748B] dark:text-slate-400">({l.reviewCount})</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-[#1F2937] dark:text-white text-sm sm:text-base leading-snug line-clamp-1 mb-1 group-hover:text-[#2A556A] transition-colors">
                        {l.title}
                      </h3>
                      <p className="flex items-center gap-1.5 text-[#64748B] dark:text-slate-400 text-xs mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#2A556A] dark:text-[#4A7C94] shrink-0" />
                        <span className="truncate">{l.locality}, {l.city}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {l.hasMess && (
                          <span className="px-2 py-0.5 bg-[#D4ECE5] text-[#144D37] text-xs font-medium rounded-full border border-[#A4DFCA]/50">
                            Mess ✓
                          </span>
                        )}
                        {!l.hasCurfew && (
                          <span className="px-2 py-0.5 bg-[#D4ECE5] text-[#144D37] text-xs font-medium rounded-full">
                            No Curfew
                          </span>
                        )}
                        {l.amenities.slice(0, 2).map((a) => (
                          <span key={a} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-300 text-xs rounded-full">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
                      <div>
                        <span className="text-xl font-bold text-[#2A556A] dark:text-[#D9E8EF]">
                          ₹{l.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[#64748B] dark:text-slate-500 text-xs">/mo</span>
                      </div>
                      <span className="text-xs font-medium text-[#64748B] dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {l.sharingType}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#131D31] rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-card">
            <p className="text-4xl mb-2">🏠</p>
            <h3 className="font-bold text-gray-800 dark:text-white text-base mb-1">No matching properties</h3>
            <p className="text-gray-400 dark:text-slate-500 text-xs sm:text-sm">Try relaxing your budget or filter toggles above.</p>
          </div>
        )}
      </div>
    </section>
  );
}
