"use client";

import { useState } from "react";
import { MapPin, Bus, ShoppingBag, Truck, Calculator, Star, Filter } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import Link from "next/link";

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
  { id: "delivery", label: "Delivery Accessible", icon: Truck },
];

export default function ExplorePage() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [distResult, setDistResult] = useState<string | null>(null);

  const toggleFilter = (id: string) =>
    setActiveFilters((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const calcDistance = () => {
    if (!fromPlace || !toPlace) return;
    const dist = (Math.random() * 8 + 0.5).toFixed(1);
    const time = Math.round(Number(dist) / 25 * 60);
    setDistResult(`~${dist} km • ~${time} min by auto`);
  };

  const cityListings = DUMMY_LISTINGS.filter((l) =>
    l.city.toLowerCase() === selectedCity.name.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">Explore the City</h1>
          <p className="text-gray-500 text-sm">Discover listings, markets, and transit routes on an interactive map.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="space-y-5">
            {/* City Selector */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F4C81]" /> Select City
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCity(c)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                      selectedCity.name === c.name
                        ? "bg-[#0F4C81] text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0F4C81]" /> Filter Nearby
              </h2>
              <div className="space-y-2">
                {FILTERS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleFilter(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeFilters.includes(id)
                        ? "bg-[#0F4C81] text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Calculator */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#0F4C81]" /> Distance Calculator
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">From (College / Landmark)</label>
                  <input
                    type="text"
                    value={fromPlace}
                    onChange={(e) => setFromPlace(e.target.value)}
                    placeholder="e.g. IIT Bombay"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">To (PG / Area)</label>
                  <input
                    type="text"
                    value={toPlace}
                    onChange={(e) => setToPlace(e.target.value)}
                    placeholder="e.g. Koramangala"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81]"
                  />
                </div>
                <button
                  onClick={calcDistance}
                  className="w-full py-2.5 bg-[#FF6B35] text-white rounded-xl text-sm font-medium hover:bg-[#e85a22] transition-colors"
                >
                  Calculate Distance
                </button>
                {distResult && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium text-center">
                    📍 {distResult}
                  </div>
                )}
              </div>
            </div>

            {/* City Listings */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-gray-900 mb-3">
                Listings in {selectedCity.name} ({cityListings.length})
              </h2>
              {cityListings.length > 0 ? (
                <div className="space-y-3">
                  {cityListings.map((l) => (
                    <Link key={l.id} href={`/listing/${l.id}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img src={l.images[0]} alt={l.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{l.title}</p>
                        <p className="text-xs text-gray-500">{l.locality}</p>
                        <p className="text-sm font-bold text-[#0F4C81] mt-0.5">₹{l.price.toLocaleString("en-IN")}/mo</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">No listings in this city yet.</p>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden sticky top-24" style={{ height: 680 }}>
              <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6db5] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium text-sm">Map View — {selectedCity.name}</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  {activeFilters.length > 0 && (
                    <span className="bg-[#FF6B35] text-white px-2.5 py-1 rounded-full text-xs font-medium">
                      {activeFilters.length} filter{activeFilters.length > 1 ? "s" : ""} active
                    </span>
                  )}
                </div>
              </div>
              <iframe
                src={`https://www.google.com/maps?q=${selectedCity.lat},${selectedCity.lng}&z=13&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title={`Map of ${selectedCity.name}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
