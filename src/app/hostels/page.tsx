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
import SearchWithSuggestions from "@/components/hostels/SearchWithSuggestions";
import FilterSidebar, {
  FilterState,
  INITIAL_FILTERS,
  FilterCounts,
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
      setFilters((prev) => ({ ...prev, roomTypes: [typeParam] }));
    }
  }, [searchParams]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm("");
  };

  // Real-time counts calculation for badges
  const filterCounts: FilterCounts = useMemo(() => {
    const counts: FilterCounts = {
      roomType: { PG: 0, Hostel: 0, Flat: 0 },
      sharingType: {
        "2 Seater": 0,
        "3 Seater": 0,
        "4 Seater": 0,
        "2 BHK": 0,
        "3 BHK": 0,
        "4 BHK": 0,
      },
      gender: { Boys: 0, Girls: 0, "Co-Ed": 0 },
      furnishingStatus: {
        "Fully Furnished": 0,
        "Semi Furnished": 0,
        Unfurnished: 0,
      },
      acTypes: { AC: 0, "Non-AC": 0 },
    };

    DUMMY_LISTINGS.forEach((l) => {
      // If city is selected, count within city
      if (filters.city && filters.city !== "All") {
        if (!l.city.toLowerCase().includes(filters.city.toLowerCase())) return;
      }

      if (counts.roomType[l.roomType] !== undefined) {
        counts.roomType[l.roomType]++;
      }

      if (counts.sharingType[l.sharingType] !== undefined) {
        counts.sharingType[l.sharingType]++;
      }

      if (counts.gender[l.genderPref] !== undefined) {
        counts.gender[l.genderPref]++;
      }

      if (counts.furnishingStatus[l.furnishingStatus] !== undefined) {
        counts.furnishingStatus[l.furnishingStatus]++;
      }

      if (l.isAC) {
        counts.acTypes["AC"]++;
      } else {
        counts.acTypes["Non-AC"]++;
      }
    });

    return counts;
  }, [filters.city]);

  // Filter and Sort listings
  const filteredListings = useMemo(() => {
    return DUMMY_LISTINGS.filter((l: Listing) => {
      // 1. Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = l.title.toLowerCase().includes(query);
        const matchLoc = l.locality.toLowerCase().includes(query);
        const matchCity = l.city.toLowerCase().includes(query);
        const matchDesc = l.description.toLowerCase().includes(query);
        if (!matchTitle && !matchLoc && !matchCity && !matchDesc) return false;
      }

      // 2. City
      if (filters.city && filters.city !== "All") {
        if (!l.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      }

      // 3. Room Type (Accommodation Type: multi-select)
      if (filters.roomTypes.length > 0) {
        if (!filters.roomTypes.includes(l.roomType)) return false;
      }

      // 4. Dynamic Sharing Type
      if (filters.sharingTypes.length > 0) {
        const isSeater = (s: string) => s.toLowerCase().includes("seater");
        const isBhk = (s: string) => s.toLowerCase().includes("bhk");

        const selectedSeaters = filters.sharingTypes.filter(isSeater);
        const selectedBhks = filters.sharingTypes.filter(isBhk);

        if (l.roomType === "PG" || l.roomType === "Hostel") {
          // Seater filters apply to PG/Hostel
          if (selectedSeaters.length > 0) {
            const match = selectedSeaters.some((s) => {
              if (l.sharingType === s) return true;
              if (s === "2 Seater" && (l.sharingType === "Double" || l.sharingType === "2 Seater")) return true;
              if (s === "3 Seater" && (l.sharingType === "Triple" || l.sharingType === "3 Seater")) return true;
              if (s === "4 Seater" && (l.sharingType === "Quad" || l.sharingType === "4 Seater")) return true;
              return false;
            });
            if (!match) return false;
          } else if (selectedBhks.length > 0) {
            // Only BHK was chosen, so PG/Hostel does not match
            return false;
          }
        } else if (l.roomType === "Flat") {
          // BHK filters apply to Flat
          if (selectedBhks.length > 0) {
            const match = selectedBhks.some((s) => {
              if (l.sharingType === s) return true;
              const sClean = s.toLowerCase().replace(/\s+/g, "");
              const titleClean = l.title.toLowerCase().replace(/\s+/g, "");
              return titleClean.includes(sClean);
            });
            if (!match) return false;
          } else if (selectedSeaters.length > 0) {
            // Only seater was chosen, so Flat does not match
            return false;
          }
        } else {
          if (!filters.sharingTypes.includes(l.sharingType)) return false;
        }
      }

      // 5. Gender Preference
      if (filters.gender && l.genderPref !== filters.gender) return false;

      // 6. Furnishing Status
      if (filters.furnishingStatuses.length > 0) {
        if (!filters.furnishingStatuses.includes(l.furnishingStatus)) return false;
      }

      // 7. Budget (Min & Max Range)
      if (l.price < filters.minPrice || l.price > filters.maxPrice) return false;

      // 8. AC / Non-AC
      if (filters.acTypes.length === 1) {
        if (filters.acTypes[0] === "AC" && !l.isAC) return false;
        if (filters.acTypes[0] === "Non-AC" && l.isAC) return false;
      }

      // 9. Meals & Policies
      if (filters.messIncluded && !l.hasMess) return false;
      if (filters.tiffinService && !l.hasTiffin) return false;
      if (filters.noCurfew && l.hasCurfew) return false;
      if (filters.visitorAllowed && !l.visitorAllowed) return false;

      // 11. Amenities
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

  // List of active filter chips
  const appliedChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    if (filters.city && filters.city !== "All") {
      chips.push({
        id: `city-${filters.city}`,
        label: `City: ${filters.city}`,
        onRemove: () => updateFilter("city", ""),
      });
    }

    filters.roomTypes.forEach((t) => {
      chips.push({
        id: `roomType-${t}`,
        label: t,
        onRemove: () =>
          updateFilter(
            "roomTypes",
            filters.roomTypes.filter((x) => x !== t)
          ),
      });
    });

    filters.sharingTypes.forEach((s) => {
      chips.push({
        id: `sharingType-${s}`,
        label: s,
        onRemove: () =>
          updateFilter(
            "sharingTypes",
            filters.sharingTypes.filter((x) => x !== s)
          ),
      });
    });

    if (filters.minPrice > 3000 || filters.maxPrice < 30000) {
      chips.push({
        id: "budget",
        label: `₹${(filters.minPrice / 1000).toFixed(0)}k – ₹${(filters.maxPrice / 1000).toFixed(0)}k`,
        onRemove: () => {
          updateFilter("minPrice", 3000);
          updateFilter("maxPrice", 30000);
        },
      });
    }

    filters.acTypes.forEach((ac) => {
      chips.push({
        id: `ac-${ac}`,
        label: ac,
        onRemove: () =>
          updateFilter(
            "acTypes",
            filters.acTypes.filter((x) => x !== ac)
          ),
      });
    });


    filters.furnishingStatuses.forEach((f) => {
      chips.push({
        id: `furnishing-${f}`,
        label: f,
        onRemove: () =>
          updateFilter(
            "furnishingStatuses",
            filters.furnishingStatuses.filter((x) => x !== f)
          ),
      });
    });

    if (filters.gender) {
      chips.push({
        id: `gender-${filters.gender}`,
        label: `${filters.gender} Only`,
        onRemove: () => updateFilter("gender", ""),
      });
    }

    if (filters.messIncluded) {
      chips.push({
        id: "mess",
        label: "Mess Included",
        onRemove: () => updateFilter("messIncluded", false),
      });
    }

    if (filters.tiffinService) {
      chips.push({
        id: "tiffin",
        label: "Tiffin Available",
        onRemove: () => updateFilter("tiffinService", false),
      });
    }

    if (filters.noCurfew) {
      chips.push({
        id: "curfew",
        label: "No Curfew",
        onRemove: () => updateFilter("noCurfew", false),
      });
    }

    if (filters.visitorAllowed) {
      chips.push({
        id: "visitor",
        label: "Visitors Allowed",
        onRemove: () => updateFilter("visitorAllowed", false),
      });
    }

    filters.amenities.forEach((a) => {
      chips.push({
        id: `amenity-${a}`,
        label: a,
        onRemove: () =>
          updateFilter(
            "amenities",
            filters.amenities.filter((x) => x !== a)
          ),
      });
    });

    return chips;
  }, [filters]);

  const activeFilterCount = appliedChips.length;

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

            {/* Search Box with Auto-Suggestions */}
            <SearchWithSuggestions
              value={searchTerm}
              onChange={(val) => setSearchTerm(val)}
              onSelectSuggestion={(item) => {
                setSearchTerm(item.value);
                if (item.category === "Cities") {
                  updateFilter("city", item.value);
                } else if (
                  item.city &&
                  filters.city &&
                  filters.city !== "All" &&
                  filters.city.toLowerCase() !== item.city.toLowerCase()
                ) {
                  // If current city filter conflicts with the selected item's city, align it
                  updateFilter("city", item.city);
                }
              }}
              placeholder="Search by city, college, or locality (e.g. Christ University, Koramangala, Powai)..."
            />

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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
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
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 shadow-xs cursor-pointer active:scale-95 transition-all"
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
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-[#0F4C81] shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
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

        {/* Applied Filters Chip Row */}
        {appliedChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-gray-100 shadow-xs animate-fade-up">
            <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1.5">
              <span>Applied Filters ({appliedChips.length}):</span>
            </span>
            {appliedChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F4C81]/8 border border-[#0F4C81]/15 text-[#0F4C81] text-xs font-semibold rounded-full transition-all"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:bg-[#0F4C81]/20 rounded-full p-0.5 transition-colors cursor-pointer"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-[#FF6B35] hover:text-[#e85a22] font-semibold ml-auto px-2 py-1 cursor-pointer transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar (1 col) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={updateFilter}
              onReset={resetFilters}
              counts={filterCounts}
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
                  Try adjusting your budget, selecting another accommodation type, or clearing some filters.
                </p>
                <button
                  type="button"
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

      {/* Mobile Filters Bottom Sheet Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative mt-auto w-full bg-white max-h-[88vh] rounded-t-3xl overflow-hidden shadow-2xl flex flex-col z-10 animate-slide-up">
            {/* Drawer Pull Bar & Header */}
            <div className="pt-3 pb-3 px-5 border-b border-gray-100 flex-shrink-0 bg-white">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base text-gray-900">
                    Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#0F4C81] text-white text-[10px] rounded-full font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {appliedChips.length > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs text-[#FF6B35] font-semibold hover:underline cursor-pointer"
                    >
                      Reset All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Sidebar Content */}
            <div className="overflow-y-auto p-5 flex-1 bg-white">
              <FilterSidebar
                filters={filters}
                onChange={updateFilter}
                onReset={resetFilters}
                counts={filterCounts}
                className="shadow-none border-0 p-0"
              />
            </div>

            {/* Sticky Bottom Apply Button */}
            <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex-shrink-0">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white font-bold rounded-xl text-sm cursor-pointer shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Apply Filters</span>
                <span className="w-1 h-1 rounded-full bg-white/60" />
                <span>Show {filteredListings.length} {filteredListings.length === 1 ? "Result" : "Results"}</span>
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
