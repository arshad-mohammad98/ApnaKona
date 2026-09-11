"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { Listing } from "@/lib/types";
import { SlidersHorizontal, Star, MapPin, X, ChevronDown, RotateCcw, LayoutGrid, List } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

type SortOption = "price-asc" | "price-desc" | "rating" | "newest";

const AMENITIES_LIST = ["WiFi", "Laundry", "Power Backup", "Parking", "CCTV", "Security", "Elevator"];

function FilterSidebar({
  filters,
  onChange,
  onReset,
}: {
  filters: Record<string, unknown>;
  onChange: (k: string, v: unknown) => void;
  onReset?: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 space-y-6">
      {onReset && (
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="font-display font-semibold text-sm text-gray-900">Active Filters</span>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#FF6B35] hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      )}

      {/* Room Type */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Room Type</p>
        <div className="flex flex-wrap gap-2">
          {["PG", "Hostel", "Flat"].map((t) => (
            <button
              key={t}
              onClick={() => onChange("roomType", filters.roomType === t ? "" : t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px] ${
                filters.roomType === t
                  ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                  : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/50 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Sharing */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Sharing Type</p>
        <div className="flex flex-wrap gap-2">
          {["Single", "Double", "Triple"].map((t) => (
            <button
              key={t}
              onClick={() => onChange("sharingType", filters.sharingType === t ? "" : t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px] ${
                filters.sharingType === t
                  ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                  : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/50 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Gender Preference</p>
        <div className="flex flex-wrap gap-2">
          {["Boys", "Girls", "Co-Ed"].map((t) => (
            <button
              key={t}
              onClick={() => onChange("gender", filters.gender === t ? "" : t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px] ${
                filters.gender === t
                  ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                  : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/50 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Max Budget</p>
          <span className="text-xs font-bold text-[#0F4C81]">
            ₹{(filters.maxPrice as number).toLocaleString("en-IN")}/mo
          </span>
        </div>
        <input
          type="range"
          min={3000}
          max={30000}
          step={500}
          value={filters.maxPrice as number}
          onChange={(e) => onChange("maxPrice", Number(e.target.value))}
          className="w-full accent-[#0F4C81] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1.5 font-medium">
          <span>₹3,000</span>
          <span>₹30,000</span>
        </div>
      </div>

      {/* AC Toggle */}
      <div className="flex items-center justify-between py-1">
        <p className="text-sm font-medium text-gray-800">AC Rooms Only</p>
        <button
          onClick={() => onChange("acOnly", !filters.acOnly)}
          className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
            filters.acOnly ? "bg-[#0F4C81]" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              filters.acOnly ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {/* Mess / Tiffin */}
      <div className="space-y-2.5 pt-1">
        {[
          ["messIncluded", "Mess Included (3 Meals)"],
          ["tiffinService", "Tiffin Delivery Available"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!filters[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-[#0F4C81] cursor-pointer"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {/* Curfew */}
      <div className="flex items-center justify-between py-1">
        <p className="text-sm font-medium text-gray-800">No Curfew Restriction</p>
        <button
          onClick={() => onChange("noCurfew", !filters.noCurfew)}
          className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
            filters.noCurfew ? "bg-[#0F4C81]" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              filters.noCurfew ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {/* Visitor Entry */}
      <div className="flex items-center justify-between py-1">
        <p className="text-sm font-medium text-gray-800">Visitors Allowed</p>
        <button
          onClick={() => onChange("visitorAllowed", !filters.visitorAllowed)}
          className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
            filters.visitorAllowed ? "bg-[#0F4C81]" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              filters.visitorAllowed ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Amenities</p>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES_LIST.map((a) => {
            const checked = ((filters.amenities as string[]) || []).includes(a);
            return (
              <label key={a} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const cur = (filters.amenities as string[]) || [];
                    onChange("amenities", e.target.checked ? [...cur, a] : cur.filter((x: string) => x !== a));
                  }}
                  className="w-4 h-4 rounded border-gray-300 accent-[#0F4C81] cursor-pointer"
                />
                <span className="text-xs text-gray-700">{a}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Furnishing */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Furnishing</p>
        <div className="flex flex-wrap gap-2">
          {["Fully Furnished", "Semi Furnished", "Unfurnished"].map((t) => (
            <button
              key={t}
              onClick={() => onChange("furnishing", filters.furnishing === t ? "" : t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer min-h-[36px] ${
                filters.furnishing === t
                  ? "bg-[#0F4C81] text-white border-[#0F4C81]"
                  : "border-gray-200 text-gray-700 hover:border-[#0F4C81]/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchListingCard({ listing, isGrid }: { listing: Listing; isGrid: boolean }) {
  const badgeVariant: Record<string, "primary" | "purple" | "success"> = {
    PG: "primary",
    Hostel: "purple",
    Flat: "success",
  };

  return (
    <Link href={`/listing/${listing.id}`} className="block group card-hover">
      <div
        className={`bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100 ${
          isGrid
            ? "flex flex-col h-full"
            : "flex flex-col sm:flex-row"
        }`}
      >
        {/* Image */}
        <div
          className={`relative overflow-hidden bg-gray-100 shrink-0 ${
            isGrid
              ? "aspect-[16/10] sm:h-52 w-full"
              : "aspect-[16/10] sm:aspect-auto sm:w-64 h-52 sm:h-auto"
          }`}
        >
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
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-display font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2">
                {listing.title}
              </h3>
            </div>
            <p className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#0F4C81]" />
              <span className="truncate">{listing.locality}, {listing.city}</span>
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {listing.hasMess && (
                <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                  Mess Included
                </span>
              )}
              {!listing.hasCurfew && (
                <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  No Curfew
                </span>
              )}
              {listing.amenities.slice(0, 3).map((a) => (
                <span key={a} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
            <div>
              <span className="text-xl font-bold text-[#0F4C81]">
                ₹{listing.price.toLocaleString("en-IN")}
              </span>
              <span className="text-gray-400 text-xs">/month</span>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
              {listing.sharingType} • {listing.genderPref}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const DEFAULT_FILTERS = {
  roomType: "",
  sharingType: "",
  gender: "",
  maxPrice: 25000,
  acOnly: false,
  messIncluded: false,
  tiffinService: false,
  noCurfew: false,
  visitorAllowed: false,
  amenities: [] as string[],
  furnishing: "",
};

export default function SearchPage() {
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("rating");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [isGrid, setIsGrid] = useState(true);

  // Prevent background scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileFiltersOpen]);

  const updateFilter = (k: string, v: unknown) => setFilters((f) => ({ ...f, [k]: v }));

  const results = useMemo(() => {
    let lst = [...DUMMY_LISTINGS];
    if (filters.roomType) lst = lst.filter((l) => l.roomType === filters.roomType);
    if (filters.sharingType) lst = lst.filter((l) => l.sharingType === filters.sharingType);
    if (filters.gender) lst = lst.filter((l) => l.genderPref === filters.gender || l.genderPref === "Co-Ed");
    lst = lst.filter((l) => l.price <= filters.maxPrice);
    if (filters.acOnly) lst = lst.filter((l) => l.isAC);
    if (filters.messIncluded) lst = lst.filter((l) => l.hasMess);
    if (filters.tiffinService) lst = lst.filter((l) => l.hasTiffin);
    if (filters.noCurfew) lst = lst.filter((l) => !l.hasCurfew);
    if (filters.visitorAllowed) lst = lst.filter((l) => l.visitorAllowed);
    if (filters.furnishing) lst = lst.filter((l) => l.furnishingStatus === filters.furnishing);
    if (filters.amenities.length > 0)
      lst = lst.filter((l) => (filters.amenities as string[]).every((a) => l.amenities.includes(a)));
    if (citySearch)
      lst = lst.filter(
        (l) =>
          l.city.toLowerCase().includes(citySearch.toLowerCase()) ||
          l.locality.toLowerCase().includes(citySearch.toLowerCase())
      );

    if (sort === "price-asc") lst.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") lst.sort((a, b) => b.price - a.price);
    else if (sort === "rating") lst.sort((a, b) => b.rating - a.rating);
    else lst.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

    return lst;
  }, [filters, sort, citySearch]);

  const activeFiltersCount =
    (filters.roomType ? 1 : 0) +
    (filters.sharingType ? 1 : 0) +
    (filters.gender ? 1 : 0) +
    (filters.acOnly ? 1 : 0) +
    (filters.messIncluded ? 1 : 0) +
    (filters.tiffinService ? 1 : 0) +
    (filters.noCurfew ? 1 : 0) +
    (filters.visitorAllowed ? 1 : 0) +
    (filters.furnishing ? 1 : 0) +
    filters.amenities.length +
    (filters.maxPrice < 25000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Filter & Search Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search by city or locality..."
              className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 transition-all min-h-[44px]"
            />

            {/* Mobile / Tablet Filters Trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:border-[#0F4C81] min-h-[44px] cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#0F4C81]" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FF6B35] text-white text-xs flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Mode & Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500 hidden md:block">
                <strong>{results.length}</strong> listings
              </span>

              {/* Grid / List toggle (desktop & tablet) */}
              <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setIsGrid(true)}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isGrid ? "bg-white text-[#0F4C81] shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsGrid(false)}
                  title="List View"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    !isGrid ? "bg-white text-[#0F4C81] shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="pl-3.5 pr-8 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none appearance-none bg-white cursor-pointer focus:border-[#0F4C81] min-h-[44px] font-medium text-gray-700"
                >
                  <option value="rating">Best Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar (>1024px) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32">
              <FilterSidebar
                filters={filters}
                onChange={updateFilter}
                onReset={activeFiltersCount > 0 ? () => setFilters(DEFAULT_FILTERS) : undefined}
              />
            </div>
          </aside>

          {/* Results Grid / List */}
          <div className="flex-1 min-w-0">
            {results.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-card">
                <p className="text-4xl mb-3">🏠</p>
                <h3 className="font-display font-semibold text-lg text-gray-800 mb-1.5">No listings found</h3>
                <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
                  We couldn&apos;t find any properties matching all your filters. Try widening your price range or clearing some filters.
                </p>
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="px-6 py-3 bg-[#0F4C81] text-white rounded-xl text-sm font-semibold hover:bg-[#0d3f6e] transition-colors min-h-[44px] cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  isGrid
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5"
                    : "space-y-4"
                }
              >
                {results.map((l) => (
                  <SearchListingCard key={l.id} listing={l} isGrid={isGrid} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Slide-up Drawer / Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xl h-[88dvh] sm:h-[80vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-up">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#0F4C81]" />
                <h3 className="font-display font-bold text-base text-gray-900">Filter Properties</h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <FilterSidebar
                filters={filters}
                onChange={updateFilter}
                onReset={() => setFilters(DEFAULT_FILTERS)}
              />
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3 shrink-0 shadow-lg">
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="py-3 px-4 border border-gray-200 text-gray-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 min-h-[46px] cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 px-4 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white rounded-xl text-xs sm:text-sm font-bold min-h-[46px] transition-colors cursor-pointer shadow-md"
              >
                Show {results.length} Listings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
