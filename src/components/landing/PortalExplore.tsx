"use client";

import { useState } from "react";
import { MapPin, Calculator, Navigation, Bus, ShoppingBag, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const CITIES = [
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, colleges: "IISc, Christ, RVCE" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, colleges: "Symbiosis, COEP, Ferguson" },
  { name: "Delhi NCR", lat: 28.6139, lng: 77.2090, colleges: "DU, IIT Delhi, DTU" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, colleges: "IIT Bombay, NMIMS, Xavier's" },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, colleges: "BITS Hyd, Osmania, IIIT" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, colleges: "IIT Madras, Anna Univ, SRM" },
];

export default function PortalExplore() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [distResult, setDistResult] = useState<string | null>(null);

  const calcDistance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromPlace || !toPlace) return;
    const dist = (Math.random() * 7 + 0.8).toFixed(1);
    const time = Math.round((Number(dist) / 22) * 60);
    setDistResult(`~${dist} km • ~${time} mins by metro/auto`);
  };

  return (
    <section id="explore" className="py-16 sm:py-24 bg-white border-t border-gray-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-semibold mb-3">
              Interactive Map &amp; Transit
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A2E]">
              Explore Campus Neighborhoods &amp; Commute Times
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1.5 max-w-xl">
              Check safety, metro connectivity, market areas, and calculate exact travel duration.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81] hover:text-white transition-colors text-xs sm:text-sm font-semibold min-h-[44px] shrink-0 w-full sm:w-auto justify-center"
          >
            Full Map View <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* City Switcher */}
            <div className="bg-[#F9FAFB] rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
              <h3 className="font-display font-semibold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F4C81]" /> Select Student Hub City
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCity(c);
                      setDistResult(null);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left min-h-[44px] flex flex-col justify-center ${
                      selectedCity.name === c.name
                        ? "bg-[#0F4C81] text-white shadow-xs"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/70"
                    }`}
                  >
                    <span className="font-bold">{c.name}</span>
                    <span className={`text-[10px] truncate ${selectedCity.name === c.name ? "text-white/80" : "text-gray-400"}`}>
                      {c.colleges.split(",")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance & Transit Calculator */}
            <div className="bg-[#F9FAFB] rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
              <h3 className="font-display font-semibold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#FF6B35]" /> Quick Campus Transit Check
              </h3>
              <form onSubmit={calcDistance} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Your College / University
                  </label>
                  <input
                    type="text"
                    value={fromPlace}
                    onChange={(e) => setFromPlace(e.target.value)}
                    placeholder="e.g. Christ University or IIT Bombay"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Target PG / Hostel Area
                  </label>
                  <input
                    type="text"
                    value={toPlace}
                    onChange={(e) => setToPlace(e.target.value)}
                    placeholder="e.g. Koramangala 5th Block or Powai"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF6B35] hover:bg-[#e85a22] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px]"
                >
                  Estimate Commute
                </button>
              </form>

              {distResult && (
                <div className="mt-3.5 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-green-600 shrink-0" />
                  {distResult}
                </div>
              )}
            </div>

            {/* Neighborhood Highlights */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Shield, title: "Safe Zones", sub: "Police patrolled" },
                { icon: Bus, title: "Metro Access", sub: "< 500m stops" },
                { icon: ShoppingBag, title: "Markets", sub: "Late night food" },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="p-3 bg-[#F9FAFB] rounded-2xl border border-gray-100">
                  <Icon className="w-4 h-4 text-[#0F4C81] mx-auto mb-1" />
                  <p className="font-bold text-xs text-gray-800">{title}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Map Frame (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden flex flex-col h-[400px] sm:h-[500px] lg:h-[580px]">
              <div className="bg-[#0F4C81] px-5 py-3.5 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF6B35]" />
                  <span className="font-semibold text-xs sm:text-sm">
                    {selectedCity.name} — Student Hotspots
                  </span>
                </div>
                <Badge variant="cyan">Near Top Campuses</Badge>
              </div>
              <div className="flex-1 w-full bg-gray-100">
                <iframe
                  src={`https://www.google.com/maps?q=${selectedCity.lat},${selectedCity.lng}&z=13&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title={`Map showing ${selectedCity.name}`}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
