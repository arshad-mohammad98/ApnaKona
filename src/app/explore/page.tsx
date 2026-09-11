"use client";

import { useState } from "react";
import { MapPin, Bus, ShoppingBag, Truck, Calculator, Star, Filter, Map as MapIcon, List } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const CITIES = [
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
];

const FILTERS = [
  { id: "safety", label: "High Safety Rating", icon: Star },
  { id: "transport", label: "Metro / Bus Nearby", icon: Bus },
  { id: "market", label: "Market Area Nearby", icon: ShoppingBag },
  { id: "delivery", label: "Quick Delivery Zone", icon: Truck },
];

export default function ExplorePage() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [distResult, setDistResult] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"map" | "filters">("map");

  const toggleFilter = (id: string) =>
    setActiveFilters((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const calcDistance = () => {
    if (!fromPlace || !toPlace) return;
    const dist = (Math.random() * 8 + 0.5).toFixed(1);
    const time = Math.round((Number(dist) / 25) * 60);
    setDistResult(`~${dist} km • ~${time} min by auto/cab`);
  };

  const cityListings = DUMMY_LISTINGS.filter(
    (l) => l.city.toLowerCase() === selectedCity.name.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                Explore Campus Neighborhoods
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Discover listings, student hubs, transport routes, and safety ratings on the map.
              </p>
            </div>

            {/* Mobile View Toggle */}
            <div className="lg:hidden flex items-center bg-gray-100 p-1 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setMobileTab("map")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[40px] ${
                  mobileTab === "map" ? "bg-white text-[#0F4C81] shadow-xs" : "text-gray-600"
                }`}
              >
                <MapIcon className="w-4 h-4" /> Map View
              </button>
              <button
                onClick={() => setMobileTab("filters")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[40px] ${
                  mobileTab === "filters" ? "bg-white text-[#0F4C81] shadow-xs" : "text-gray-600"
                }`}
              >
                <List className="w-4 h-4" /> Controls &amp; Listings ({cityListings.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls & Listings Panel */}
          <div className={`space-y-5 ${mobileTab === "filters" ? "block" : "hidden lg:block"}`}>
            {/* City Selector */}
            <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F4C81]" /> Select City
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCity(c)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[40px] ${
                      selectedCity.name === c.name
                        ? "bg-[#0F4C81] text-white shadow-xs"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Neighborhood Filter Tags */}
            <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0F4C81]" /> Local Highlights
              </h2>
              <div className="space-y-2">
                {FILTERS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleFilter(id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                      activeFilters.includes(id)
                        ? "bg-[#0F4C81] text-white shadow-xs"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Calculator */}
            <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#0F4C81]" /> Transit &amp; Distance
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">From (Campus / Landmark)</label>
                  <input
                    type="text"
                    value={fromPlace}
                    onChange={(e) => setFromPlace(e.target.value)}
                    placeholder="e.g. Christ University or IIT Bombay"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">To (PG / Locality)</label>
                  <input
                    type="text"
                    value={toPlace}
                    onChange={(e) => setToPlace(e.target.value)}
                    placeholder="e.g. Koramangala 5th Block"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                  />
                </div>
                <button
                  onClick={calcDistance}
                  className="w-full py-3 bg-[#FF6B35] hover:bg-[#e85a22] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
                >
                  Calculate Transit Time
                </button>
                {distResult && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-green-700 font-semibold text-center">
                    📍 {distResult}
                  </div>
                )}
              </div>
            </div>

            {/* City Listings */}
            <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-sm sm:text-base text-gray-900 mb-3">
                Properties in {selectedCity.name} ({cityListings.length})
              </h2>
              {cityListings.length > 0 ? (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {cityListings.map((l) => (
                    <Link
                      key={l.id}
                      href={`/listing/${l.id}`}
                      className="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors cursor-pointer"
                    >
                      <img
                        src={l.images[0]}
                        alt={l.title}
                        loading="lazy"
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{l.title}</p>
                        <p className="text-[11px] text-gray-500 truncate">{l.locality}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-[#0F4C81]">
                            ₹{l.price.toLocaleString("en-IN")}/mo
                          </span>
                          <span className="text-[10px] text-gray-400">{l.sharingType}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs sm:text-sm text-center py-6">No listings in this city yet.</p>
              )}
            </div>
          </div>

          {/* Interactive Map View */}
          <div className={`lg:col-span-2 ${mobileTab === "map" ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden lg:sticky lg:top-24 flex flex-col h-[400px] sm:h-[520px] lg:h-[720px]">
              {/* Map Header */}
              <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6db5] px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold text-xs sm:text-sm truncate">
                    Interactive Map — {selectedCity.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {activeFilters.length > 0 && (
                    <Badge variant="accent">
                      {activeFilters.length} highlight{activeFilters.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Map Frame */}
              <div className="flex-1 w-full relative bg-gray-100">
                <iframe
                  src={`https://www.google.com/maps?q=${selectedCity.lat},${selectedCity.lng}&z=13&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title={`Map of ${selectedCity.name}`}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
