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
    <section id="search" className="py-16 sm:py-24 bg-[#F9FAFB] border-t border-gray-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1 bg-[#0F4C81]/10 text-[#0F4C81] rounded-full text-xs sm:text-sm font-semibold mb-3">
              Live Property Search
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A2E]">
              Find PGs, Hostels &amp; Flats Near Campus
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1.5 max-w-xl">
              Filter by budget, room sharing, AC, and food service with zero brokerage fees.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81] hover:text-white transition-colors text-xs sm:text-sm font-semibold min-h-[44px] shrink-0 w-full sm:w-auto justify-center"
          >
            Open Full Search Page <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Filter Controls Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-gray-100 mb-8 space-y-5">
          {/* Row 1: Search Input & Quick Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Search city, area, or college (e.g. Bangalore, Koramangala)..."
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0F4C81] min-h-[44px]"
              />
            </div>

            {/* Room Type Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-gray-400 hidden sm:inline mr-1">Type:</span>
              {["", "PG", "Hostel", "Flat"].map((t) => (
                <button
                  key={t || "all"}
                  onClick={() => setRoomType(t)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[40px] whitespace-nowrap ${
                    roomType === t
                      ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                      : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/40"
                  }`}
                >
                  {t || "All Types"}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Secondary Filter Pills, Budget Slider, Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            {/* Sharing Type */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-gray-400 mr-1">Sharing:</span>
              {["", "Single", "Double", "Triple"].map((s) => (
                <button
                  key={s || "all-sharing"}
                  onClick={() => setSharingType(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer min-h-[36px] ${
                    sharingType === s
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
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
                  acOnly ? "bg-cyan-600 text-white border-cyan-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ❄️ AC Rooms
              </button>
              <button
                onClick={() => setMessOnly(!messOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[36px] ${
                  messOnly ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                🍲 Mess Included
              </button>
            </div>

            {/* Budget & Sort */}
            <div className="flex items-center gap-4 w-full sm:w-auto ml-auto">
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  Under: <strong>₹{maxPrice.toLocaleString("en-IN")}</strong>
                </span>
                <input
                  type="range"
                  min={4000}
                  max={30000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#0F4C81] cursor-pointer"
                />
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white outline-none focus:border-[#0F4C81] min-h-[36px]"
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
          <p className="text-xs sm:text-sm font-semibold text-gray-700">
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
              className="text-xs font-semibold text-[#FF6B35] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.slice(0, 6).map((l) => (
              <Link key={l.id} href={`/listing/${l.id}`} className="block group card-hover">
                <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100 flex flex-col h-full">
                  <div className="relative aspect-[16/10] sm:h-52 overflow-hidden bg-gray-100">
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
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-gray-800">{l.rating}</span>
                      <span className="text-xs text-gray-400">({l.reviewCount})</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-1 mb-1">
                        {l.title}
                      </h3>
                      <p className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#0F4C81] shrink-0" />
                        <span className="truncate">{l.locality}, {l.city}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {l.hasMess && (
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                            Mess ✓
                          </span>
                        )}
                        {!l.hasCurfew && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            No Curfew
                          </span>
                        )}
                        {l.amenities.slice(0, 2).map((a) => (
                          <span key={a} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-xl font-bold text-[#0F4C81]">
                          ₹{l.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-gray-400 text-xs">/mo</span>
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                        {l.sharingType}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-card">
            <p className="text-4xl mb-2">🏠</p>
            <h3 className="font-bold text-gray-800 text-base mb-1">No matching properties</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Try relaxing your budget or filter toggles above.</p>
          </div>
        )}
      </div>
    </section>
  );
}
