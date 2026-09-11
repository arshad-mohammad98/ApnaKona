"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { Listing } from "@/lib/types";
import {
  SlidersHorizontal,
  Search,
  MapPin,
  X,
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import ListingCard from "@/components/hostels/ListingCard";
import FilterSidebar, {
  FilterState,
  INITIAL_FILTERS,
} from "@/components/hostels/FilterSidebar";

type SortOption = "price-asc" | "price-desc" | "rating" | "newest";

const POPULAR_CITIES = ["All", "Bangalore", "Pune", "Delhi", "Mumbai", "Hyderabad", "Chennai"];

function HostelsContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortOption>("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync initial query params
  useEffect(() => {
    const cityParam = searchParams.get("city");
    const qParam = searchParams.get("q");
    const typeParam = searchParams.get("type");

    if (cityParam) {
      setFilters((prev) => ({ ...prev, city: cityParam }));
    }
    if (qParam) {
      setSearchTerm(qParam);
    }
    if (typeParam) {
      setFilters((prev) => ({ ...prev, roomType: typeParam }));
    }
  }, [searchParams]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm("");
  };

  // Filter and Sort listings
  const filteredListings = useMemo(() => {
    return DUMMY_LISTINGS.filter((l: Listing) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = l.title.toLowerCase().includes(query);
        const matchLoc = l.locality.toLowerCase().includes(query);
        const matchCity = l.city.toLowerCase().includes(query);
        const matchDesc = l.description.toLowerCase().includes(query);
        if (!matchTitle && !matchLoc && !matchCity && !matchDesc) return false;
      }

      // City
      if (filters.city && filters.city !== "All") {
        if (!l.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      }

      // Room Type
      if (filters.roomType && l.roomType !== filters.roomType) return false;

      // Sharing Type
      if (filters.sharingType && l.sharingType !== filters.sharingType) return false;

      // Gender
      if (filters.gender && l.genderPref !== filters.gender) return false;

      // Furnishing
      if (filters.furnishingStatus && l.furnishingStatus !== filters.furnishingStatus) return false;

      // Price
      if (l.price > filters.maxPrice) return false;

      // AC
      if (filters.acOnly && !l.isAC) return false;

      // Mess
      if (filters.messIncluded && !l.hasMess) return false;

      // Tiffin
      if (filters.tiffinService && !l.hasTiffin) return false;

      // Curfew
      if (filters.noCurfew && l.hasCurfew) return false;

      // Visitor
      if (filters.visitorAllowed && !l.visitorAllowed) return false;

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((a) => l.amenities.includes(a));
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "newest") return b.id.localeCompare(a.id);
      return 0;
    });
  }, [searchTerm, filters, sort]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city && filters.city !== "All") count++;
    if (filters.roomType) count++;
    if (filters.sharingType) count++;
    if (filters.gender) count++;
    if (filters.furnishingStatus) count++;
    if (filters.maxPrice < 25000) count++;
    if (filters.acOnly) count++;
    if (filters.messIncluded) count++;
    if (filters.tiffinService) count++;
    if (filters.noCurfew) count++;
    if (filters.visitorAllowed) count++;
    count += filters.amenities.length;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#0d3f6e] text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Find Student Hostels, PGs &amp; Flats
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mb-6">
              Browse thousands of verified student accommodations with zero brokerage fees.
            </p>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by city, college, or locality (e.g. Christ University, Koramangala, Powai)..."
                className="w-full pl-12 pr-10 py-3.5 bg-white text-gray-900 rounded-2xl shadow-lg text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Popular City Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-4 text-xs">
              <span className="text-white/70 font-medium">Quick Cities:</span>
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => updateFilter("city", c === "All" ? "" : c)}
                  className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    (c === "All" && !filters.city) || filters.city === c
                      ? "bg-[#FF6B35] text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-gray-900 text-lg sm:text-xl">
              {filteredListings.length} {filteredListings.length === 1 ? "Property" : "Properties"} Available
            </span>
            {filters.city && (
              <span className="text-xs bg-[#0F4C81]/10 text-[#0F4C81] px-2.5 py-0.5 rounded-full font-semibold">
                in {filters.city}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#0F4C81]" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-[#0F4C81] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 outline-none focus:border-[#0F4C81] cursor-pointer min-h-[40px]"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Listed</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* View Mode (Grid vs List) */}
            <div className="hidden sm:flex items-center bg-gray-200/70 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-[#0F4C81] shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list" ? "bg-white text-[#0F4C81] shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar (1 col) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={updateFilter}
              onReset={resetFilters}
            />
          </div>

          {/* Listings Grid / List (3 cols) */}
          <div className="lg:col-span-3">
            {filteredListings.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-card">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-display text-lg font-bold text-gray-800 mb-1">
                  No accommodations match your criteria
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto mb-6">
                  Try adjusting your budget, selecting another city, or relaxing your filter constraints.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#0F4C81] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#0d3f6e] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <span className="font-display font-bold text-base text-gray-900">Filter Options</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={updateFilter}
                onReset={resetFilters}
                className="shadow-none border-0 p-0"
              />
            </div>
            <div className="pt-4 mt-6 border-t border-gray-100">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#0F4C81] text-white font-bold rounded-xl text-sm cursor-pointer shadow-md"
              >
                Show {filteredListings.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HostelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
          <div className="w-10 h-10 border-4 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HostelsContent />
    </Suspense>
  );
}
