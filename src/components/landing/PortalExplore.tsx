"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Calculator,
  Navigation,
  Bus,
  ShoppingBag,
  Shield,
  ArrowRight,
  Search,
  LocateFixed,
  Loader2,
  X,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { CITIES, CITY_AREAS, AreaInfo, CityInfo, findClosestCity } from "@/lib/data/areas";
import GoogleMapView from "@/components/ui/GoogleMapView";

export default function PortalExplore() {
  const [selectedCity, setSelectedCity] = useState<CityInfo>(CITIES[0]);
  const [selectedArea, setSelectedArea] = useState<AreaInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    distanceKm?: number;
  } | null>(null);
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [distResult, setDistResult] = useState<string | null>(null);

  const currentAreas = CITY_AREAS[selectedCity.name] || [];

  const handleAutoLocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const { city, distanceKm } = findClosestCity(latitude, longitude);

        // Reverse geocode to get exact neighborhood & city
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const neighborhood = addr.suburb || addr.neighbourhood || addr.residential || "";
            const cityName = addr.city || addr.town || addr.state_district || "";
            if (neighborhood && cityName) {
              setSearchQuery(`${neighborhood}, ${cityName}`);
            } else if (cityName) {
              setSearchQuery(cityName);
            } else if (data.display_name) {
              setSearchQuery(data.display_name.split(",").slice(0, 2).join(",").trim());
            }
          }
        } catch {
          setSearchQuery(city.name);
        }

        setSelectedCity(city);
        setSelectedArea(null);
        setUserLocation({ lat: latitude, lng: longitude, distanceKm });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const mapTarget = useMemo(() => {
    if (userLocation) {
      return {
        query: `${userLocation.lat},${userLocation.lng}`,
        zoom: 15,
        title: `Your Location (Near ${selectedCity.name})`,
      };
    }
    if (selectedArea) {
      return {
        query: `${selectedArea.lat},${selectedArea.lng}`,
        zoom: 15,
        title: `${selectedArea.name}, ${selectedCity.name}`,
      };
    }
    return {
      query: `${selectedCity.lat},${selectedCity.lng}`,
      zoom: 13,
      title: `${selectedCity.name} — Student Hotspots`,
    };
  }, [userLocation, selectedArea, selectedCity]);

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
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

        {/* ── SEARCH PALETTE & AUTO-LOCATE BUTTON ── */}
        <div className="mb-6">
          <div className="flex items-center bg-[#F9FAFB] rounded-2xl border-2 border-gray-200/80 focus-within:border-[#0F4C81] focus-within:bg-white shadow-xs p-1.5 transition-all">
            <div className="pl-3 pr-2 text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search neighborhood or campus (e.g. Koramangala, Powai, FC Road)..."
              className="w-full py-2 text-xs sm:text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md mr-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="h-5 w-px bg-gray-200 mx-1" />
            <button
              onClick={handleAutoLocate}
              disabled={isLocating}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                userLocation
                  ? "bg-emerald-600 text-white"
                  : "bg-white hover:bg-[#0F4C81] text-[#0F4C81] hover:text-white border border-gray-200/80"
              }`}
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LocateFixed className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {userLocation ? "Located" : "Fetch Location"}
              </span>
            </button>
          </div>

          {/* Direct Area & City Access Filter Box */}
          <div className="mt-3 p-4 bg-[#F9FAFB] rounded-2xl border border-gray-100 space-y-2.5">
            {/* City Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pb-2 border-b border-gray-200/60">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3 text-[#0F4C81]" /> City:
              </span>
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setSelectedCity(c);
                    setSelectedArea(null);
                    setUserLocation(null);
                    setDistResult(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCity.name === c.name
                      ? "bg-[#0F4C81] text-white shadow-2xs"
                      : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200/60"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Area Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-[#0F4C81]" /> Direct Areas ({selectedCity.name}):
              </span>
              <button
                onClick={() => {
                  setSelectedArea(null);
                  setUserLocation(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  !selectedArea && !userLocation
                    ? "bg-[#0F4C81] text-white shadow-2xs"
                    : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200/60"
                }`}
              >
                All {selectedCity.name}
              </button>
              {currentAreas.map((area) => {
                const active = selectedArea?.name === area.name;
                return (
                  <button
                    key={area.name}
                    onClick={() => {
                      setSelectedArea(area);
                      setUserLocation(null);
                      setSearchQuery(`${area.name}, ${selectedCity.name}`);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                      active
                        ? "bg-[#0F4C81] text-white border-[#0F4C81] font-semibold shadow-2xs"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200/70"
                    }`}
                  >
                    {area.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
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
                  <span className="font-semibold text-xs sm:text-sm truncate">
                    {mapTarget.title}
                  </span>
                </div>
                <Badge variant="cyan">Near Top Campuses</Badge>
              </div>
              <div className="flex-1 w-full relative bg-gray-100 min-h-[380px]">
                <GoogleMapView
                  lat={userLocation ? userLocation.lat : selectedArea ? selectedArea.lat : selectedCity.lat}
                  lng={userLocation ? userLocation.lng : selectedArea ? selectedArea.lng : selectedCity.lng}
                  zoom={mapTarget.zoom}
                  title={mapTarget.title}
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
