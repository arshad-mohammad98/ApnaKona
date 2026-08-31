"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { Listing } from "@/lib/types";
import { SlidersHorizontal, Star, MapPin, X, ChevronDown } from "lucide-react";

type SortOption = "price-asc" | "price-desc" | "rating" | "newest";

const AMENITIES_LIST = ["WiFi", "Laundry", "Power Backup", "Parking", "CCTV", "Security", "Elevator"];

function FilterSidebar({
  filters,
  onChange,
  onClose,
}: {
  filters: Record<string, unknown>;
  onChange: (k: string, v: unknown) => void;
  onClose?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-6">
      {onClose && (
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-gray-900">Filters</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Room Type */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Room Type</p>
        <div className="flex flex-wrap gap-2">
          {["PG", "Hostel", "Flat"].map((t) => (
            <button key={t} onClick={() => onChange("roomType", filters.roomType === t ? "" : t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filters.roomType === t ? "bg-[#0F4C81] text-white border-[#0F4C81]" : "border-gray-200 text-gray-600 hover:border-[#0F4C81]/50"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Sharing */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sharing Type</p>
        <div className="flex flex-wrap gap-2">
          {["Single", "Double", "Triple"].map((t) => (
            <button key={t} onClick={() => onChange("sharingType", filters.sharingType === t ? "" : t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filters.sharingType === t ? "bg-[#0F4C81] text-white border-[#0F4C81]" : "border-gray-200 text-gray-600 hover:border-[#0F4C81]/50"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gender Preference</p>
        <div className="flex flex-wrap gap-2">
          {["Boys", "Girls", "Co-Ed"].map((t) => (
            <button key={t} onClick={() => onChange("gender", filters.gender === t ? "" : t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filters.gender === t ? "bg-[#0F4C81] text-white border-[#0F4C81]" : "border-gray-200 text-gray-600 hover:border-[#0F4C81]/50"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Budget: ₹{(filters.maxPrice as number).toLocaleString("en-IN")}/mo
        </p>
        <input type="range" min={3000} max={30000} step={500}
          value={filters.maxPrice as number}
          onChange={(e) => onChange("maxPrice", Number(e.target.value))}
          className="w-full accent-[#0F4C81]" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>₹3,000</span><span>₹30,000</span>
        </div>
      </div>

      {/* AC Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">AC Only</p>
        <button onClick={() => onChange("acOnly", !filters.acOnly)}
          className={`relative w-11 h-6 rounded-full transition-colors ${filters.acOnly ? "bg-[#0F4C81]" : "bg-gray-200"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${filters.acOnly ? "translate-x-5" : ""}`} />
        </button>
      </div>

      {/* Mess / Tiffin */}
      <div className="space-y-2">
        {[["messIncluded", "Mess Included"], ["tiffinService", "Tiffin Service"]].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!filters[key]} onChange={(e) => onChange(key, e.target.checked)}
              className="rounded border-gray-300 accent-[#0F4C81]" />
            <span className="text-sm text-gray-600">{label}</span>
          </label>
        ))}
      </div>

      {/* Curfew */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">No Curfew</p>
        <button onClick={() => onChange("noCurfew", !filters.noCurfew)}
          className={`relative w-11 h-6 rounded-full transition-colors ${filters.noCurfew ? "bg-[#0F4C81]" : "bg-gray-200"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${filters.noCurfew ? "translate-x-5" : ""}`} />
        </button>
      </div>

      {/* Visitor Entry */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Visitors Allowed</p>
        <button onClick={() => onChange("visitorAllowed", !filters.visitorAllowed)}
          className={`relative w-11 h-6 rounded-full transition-colors ${filters.visitorAllowed ? "bg-[#0F4C81]" : "bg-gray-200"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${filters.visitorAllowed ? "translate-x-5" : ""}`} />
        </button>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amenities</p>
        <div className="space-y-1.5">
          {AMENITIES_LIST.map((a) => (
            <label key={a} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox"
                checked={((filters.amenities as string[]) || []).includes(a)}
                onChange={(e) => {
                  const cur = (filters.amenities as string[]) || [];
                  onChange("amenities", e.target.checked ? [...cur, a] : cur.filter((x: string) => x !== a));
                }}
                className="rounded border-gray-300 accent-[#0F4C81]" />
              <span className="text-sm text-gray-600">{a}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Furnishing */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Furnishing</p>
        <div className="flex flex-wrap gap-2">
          {["Fully Furnished", "Semi Furnished", "Unfurnished"].map((t) => (
            <button key={t} onClick={() => onChange("furnishing", filters.furnishing === t ? "" : t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filters.furnishing === t ? "bg-[#0F4C81] text-white border-[#0F4C81]" : "border-gray-200 text-gray-600"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const typeColor: Record<string, string> = { PG: "bg-blue-100 text-blue-700", Hostel: "bg-purple-100 text-purple-700", Flat: "bg-green-100 text-green-700" };
  return (
    <Link href={`/listing/${listing.id}`} className="block group card-hover">
      <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100 flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-52 h-48 sm:h-auto shrink-0 overflow-hidden">
          <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${typeColor[listing.roomType]}`}>{listing.roomType}</span>
        </div>
        {/* Info */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug">{listing.title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-gray-800">{listing.rating}</span>
              <span className="text-xs text-gray-400">({listing.reviewCount})</span>
            </div>
          </div>
          <p className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />{listing.locality}, {listing.city}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {listing.isAC && <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-xs rounded-full">AC</span>}
            {listing.hasMess && <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full">Mess ✓</span>}
            {!listing.hasCurfew && <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">No Curfew</span>}
            {listing.amenities.slice(0, 3).map((a) => <span key={a} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{a}</span>)}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-[#0F4C81]">₹{listing.price.toLocaleString("en-IN")}</span>
              <span className="text-gray-400 text-xs">/month</span>
            </div>
            <span className="text-xs text-gray-400">{listing.sharingType} • {listing.genderPref}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const DEFAULT_FILTERS = {
  roomType: "", sharingType: "", gender: "", maxPrice: 20000,
  acOnly: false, messIncluded: false, tiffinService: false,
  noCurfew: false, visitorAllowed: false, amenities: [] as string[],
  furnishing: "",
};

export default function SearchPage() {
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("rating");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

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
    if (filters.amenities.length > 0) lst = lst.filter((l) => (filters.amenities as string[]).every((a) => l.amenities.includes(a)));
    if (citySearch) lst = lst.filter((l) => l.city.toLowerCase().includes(citySearch.toLowerCase()) || l.locality.toLowerCase().includes(citySearch.toLowerCase()));

    if (sort === "price-asc") lst.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") lst.sort((a, b) => b.price - a.price);
    else if (sort === "rating") lst.sort((a, b) => b.rating - a.rating);
    else lst.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

    return lst;
  }, [filters, sort, citySearch]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search city or locality..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81] transition-colors max-w-sm"
          />
          <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-[#0F4C81]/50">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:block">{results.length} results</span>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
                className="pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm outline-none appearance-none bg-white cursor-pointer focus:border-[#0F4C81]">
                <option value="rating">Best Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-semibold text-gray-900">Filters</span>
                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-xs text-[#FF6B35] hover:underline">Reset All</button>
              </div>
              <FilterSidebar filters={filters} onChange={updateFilter} />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">🏠</p>
                <h3 className="font-display font-semibold text-gray-700 mb-2">No listings found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search for a different city.</p>
                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="mt-4 px-5 py-2 bg-[#0F4C81] text-white rounded-xl text-sm hover:bg-[#0d3f6e] transition-colors">Reset Filters</button>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-80 h-full bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterSidebar filters={filters} onChange={updateFilter} />
            <button onClick={() => setMobileFiltersOpen(false)} className="w-full mt-4 py-3 bg-[#0F4C81] text-white font-semibold rounded-xl">
              Show {results.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
