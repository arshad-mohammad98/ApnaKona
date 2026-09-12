"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  MapPin,
  Bus,
  ShoppingBag,
  Truck,
  Calculator,
  Star,
  Filter,
  Map as MapIcon,
  List,
  Search,
  LocateFixed,
  Loader2,
  X,
  Compass,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
} from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { CITIES, CITY_AREAS, AreaInfo, CityInfo, findClosestCity } from "@/lib/data/areas";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Listing } from "@/lib/types";
import GoogleMapView from "@/components/ui/GoogleMapView";

const LOCAL_HIGHLIGHTS = [
  { id: "safety", label: "High Safety Rating (4.5+)", icon: Shield },
  { id: "transport", label: "Metro / Bus (<500m)", icon: Bus },
  { id: "market", label: "Student Market Hub", icon: ShoppingBag },
  { id: "delivery", label: "Quick Delivery (10m)", icon: Truck },
];

export default function ExplorePage() {
  const [selectedCity, setSelectedCity] = useState<CityInfo>(CITIES[0]);
  const [selectedArea, setSelectedArea] = useState<AreaInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    label: string;
    distanceKm?: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Property Filters
  const [activeHighlights, setActiveHighlights] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");

  // Transit Calculator state
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [distResult, setDistResult] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"map" | "filters">("map");

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get areas for current city
  const currentCityAreas = CITY_AREAS[selectedCity.name] || [];

  // Reset area when city changes
  const handleSelectCity = (city: CityInfo) => {
    setSelectedCity(city);
    setSelectedArea(null);
    setUserLocation(null);
  };

  // Select area
  const handleSelectArea = (area: AreaInfo) => {
    setSelectedArea(area);
    setUserLocation(null);
    setSearchQuery(`${area.name}, ${selectedCity.name}`);
  };

  // Clear area filter
  const handleClearArea = () => {
    setSelectedArea(null);
  };

  // Reverse geocode lat/lng into a readable area/city string
  const fetchAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      if (response.ok) {
        const data = await response.json();
        const addr = data.address || {};
        const neighborhood =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.city_district ||
          addr.quarter ||
          addr.commercial ||
          "";
        const cityName =
          addr.city ||
          addr.town ||
          addr.municipality ||
          addr.state_district ||
          "";

        if (neighborhood && cityName) {
          return `${neighborhood}, ${cityName}`;
        }
        if (neighborhood) {
          return neighborhood;
        }
        if (cityName) {
          return cityName;
        }
        if (data.display_name) {
          const parts = data.display_name.split(",");
          return parts.slice(0, 2).join(",").trim();
        }
      }
    } catch {
      // Fallback below
    }

    const { city } = findClosestCity(lat, lng);
    return `${city.name}`;
  };

  // Auto-detect user geolocation and write exact location in the search box
  const handleAutoLocate = useCallback(() => {
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const { city: closestCity, distanceKm } = findClosestCity(latitude, longitude);

        // Fetch exact readable address
        const exactLocationText = await fetchAddressFromCoords(latitude, longitude);

        // WRITE EXACT LOCATION INTO SEARCH BOX
        setSearchQuery(exactLocationText);

        setSelectedCity(closestCity);

        // Check if detected text matches any known local area in closestCity
        const matchedArea = (CITY_AREAS[closestCity.name] || []).find((a) =>
          exactLocationText.toLowerCase().includes(a.name.toLowerCase())
        );

        if (matchedArea) {
          setSelectedArea(matchedArea);
        } else {
          setSelectedArea(null);
        }

        setUserLocation({
          lat: latitude,
          lng: longitude,
          label: exactLocationText,
          distanceKm,
        });

        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please allow location access in your browser.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError("Could not determine your location.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Search suggestions across all areas and cities
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      type: "area" | "city" | "college";
      title: string;
      subtitle: string;
      city: CityInfo;
      area?: AreaInfo;
    }> = [];

    // Match cities
    CITIES.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        results.push({
          type: "city",
          title: c.name,
          subtitle: `Hub City • ${c.colleges}`,
          city: c,
        });
      }
    });

    // Match areas & campuses
    Object.entries(CITY_AREAS).forEach(([cityName, areas]) => {
      const parentCity = CITIES.find((c) => c.name === cityName);
      if (!parentCity) return;

      areas.forEach((area) => {
        const matchesArea = area.name.toLowerCase().includes(q);
        const matchedCampus = area.campuses.find((camp) => camp.toLowerCase().includes(q));

        if (matchesArea) {
          results.push({
            type: "area",
            title: area.name,
            subtitle: `${cityName} • Near ${area.campuses.join(", ")}`,
            city: parentCity,
            area,
          });
        } else if (matchedCampus) {
          results.push({
            type: "college",
            title: matchedCampus,
            subtitle: `${area.name}, ${cityName} (${area.tag})`,
            city: parentCity,
            area,
          });
        }
      });
    });

    return results.slice(0, 7);
  }, [searchQuery]);

  // Handle selection from search dropdown
  const handleSelectSearchResult = (result: (typeof searchResults)[0]) => {
    setSelectedCity(result.city);
    if (result.area) {
      setSelectedArea(result.area);
      setSearchQuery(`${result.area.name}, ${result.city.name}`);
    } else {
      setSelectedArea(null);
      setSearchQuery(result.city.name);
    }
    setUserLocation(null);
    setIsSearching(false);
  };

  // Toggle highlight filter
  const toggleHighlight = (id: string) => {
    setActiveHighlights((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Commute distance calculator
  const calcDistance = () => {
    if (!fromPlace || !toPlace) return;
    const dist = (Math.random() * 8 + 0.5).toFixed(1);
    const time = Math.round((Number(dist) / 25) * 60);
    setDistResult(`~${dist} km • ~${time} min by auto/cab`);
  };

  // Filter listings based on city, selected area, budget, gender, highlights
  const cityListings = useMemo(() => {
    return DUMMY_LISTINGS.filter((listing: Listing) => {
      // City check
      if (listing.city.toLowerCase() !== selectedCity.name.toLowerCase()) {
        return false;
      }

      // Area / Locality check
      if (selectedArea) {
        const areaName = selectedArea.name.toLowerCase();
        const locality = (listing.locality || "").toLowerCase();
        const title = listing.title.toLowerCase();
        const address = listing.address.toLowerCase();

        const matchesArea =
          locality.includes(areaName) ||
          areaName.includes(locality) ||
          title.includes(areaName) ||
          address.includes(areaName);

        if (!matchesArea) return false;
      }

      // Gender filter
      if (selectedGender !== "all") {
        if (selectedGender === "Boys" && listing.genderPref !== "Boys") return false;
        if (selectedGender === "Girls" && listing.genderPref !== "Girls") return false;
        if (selectedGender === "Co-Ed" && listing.genderPref !== "Co-Ed") return false;
      }

      // Budget filter
      if (selectedBudget === "under10k" && listing.price > 10000) return false;
      if (selectedBudget === "10kTo16k" && (listing.price < 10000 || listing.price > 16000)) return false;
      if (selectedBudget === "above16k" && listing.price <= 16000) return false;

      // Highlights
      if (activeHighlights.includes("safety") && listing.rating < 4.5) return false;
      if (activeHighlights.includes("transport") && !listing.tags.some((t) => t.toLowerCase().includes("metro"))) return false;
      if (activeHighlights.includes("market") && !listing.amenities.includes("Parking") && !listing.tags.some((t) => t.toLowerCase().includes("food"))) return false;
      if (activeHighlights.includes("delivery") && !listing.amenities.includes("WiFi")) return false;

      return true;
    });
  }, [selectedCity, selectedArea, selectedGender, selectedBudget, activeHighlights]);

  // Determine dynamic map query and zoom
  const mapConfig = useMemo(() => {
    if (userLocation) {
      return {
        query: `${userLocation.lat},${userLocation.lng}`,
        zoom: 15,
        title: userLocation.label,
        sub: userLocation.distanceKm !== undefined ? `~${userLocation.distanceKm} km from ${selectedCity.name}` : undefined,
      };
    }
    if (selectedArea) {
      return {
        query: `${selectedArea.lat},${selectedArea.lng}`,
        zoom: 15,
        title: `${selectedArea.name}, ${selectedCity.name}`,
        sub: `Near ${selectedArea.campuses.join(", ")}`,
      };
    }
    return {
      query: `${selectedCity.lat},${selectedCity.lng}`,
      zoom: 13,
      title: `${selectedCity.name} Hub View`,
      sub: selectedCity.colleges,
    };
  }, [userLocation, selectedArea, selectedCity]);

  const hasActiveFilters =
    Boolean(selectedArea) ||
    Boolean(userLocation) ||
    selectedGender !== "all" ||
    selectedBudget !== "all" ||
    activeHighlights.length > 0;

  const resetAllFilters = () => {
    setSelectedArea(null);
    setUserLocation(null);
    setSelectedGender("all");
    setSelectedBudget("all");
    setActiveHighlights([]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white py-8 sm:py-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-[#E5EFF4] backdrop-blur-xs border border-white/20">
                  <Compass className="w-3.5 h-3.5 text-[#F09A57]" /> Neighborhood Navigator
                </span>
                {userLocation && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-[#D4ECE5] border border-emerald-400/30 animate-pulse">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GPS Active
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Explore Campus <span className="text-[#F09A57]">Neighborhoods</span>
              </h1>
              <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-xl font-normal">
                Discover listings, student hubs, transport routes, and safety ratings on the map.
              </p>
            </div>

            {/* Mobile View Toggle */}
            <div className="lg:hidden flex items-center bg-white/10 backdrop-blur-xs p-1 rounded-2xl w-full sm:w-auto border border-white/20">
              <button
                onClick={() => setMobileTab("map")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ease-out cursor-pointer min-h-[40px] ${
                  mobileTab === "map" ? "bg-white text-[#234C60] shadow-sm scale-[1.02] font-bold" : "text-white/80"
                }`}
              >
                <MapIcon className="w-4 h-4" /> Map View
              </button>
              <button
                onClick={() => setMobileTab("filters")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ease-out cursor-pointer min-h-[40px] ${
                  mobileTab === "filters" ? "bg-white text-[#2A556A] shadow-sm scale-[1.02] font-bold" : "text-white/80"
                }`}
              >
                <List className="w-4 h-4" /> Controls &amp; Listings ({cityListings.length})
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SEARCH PALETTE WITH AUTO-LOCATION MAP ICON
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-6 relative" ref={searchBoxRef}>
            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200/90 dark:border-slate-700 hover:border-[#0F4C81]/40 focus-within:border-[#0F4C81] dark:focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-[#0F4C81]/10 shadow-sm transition-all">
              {/* Search Icon */}
              <div className="pl-4 pr-2 text-gray-400 dark:text-slate-400">
                <Search className="w-5 h-5 text-gray-400 dark:text-slate-400" />
              </div>

              {/* Main Input - Shows Typed Query OR Auto-detected Location */}
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                }}
                placeholder="Search neighborhood, campus, or area (e.g. Koramangala, Powai, FC Road)..."
                className="w-full py-3.5 pr-2 text-xs sm:text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400 outline-none font-medium"
              />

              {/* Clear button if search query typed */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors mr-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mx-1" />

              {/* MAP / GEOLOCATION AUTO-DETECT BUTTON */}
              <button
                type="button"
                onClick={handleAutoLocate}
                disabled={isLocating}
                title="Automatically fetch my location and fill search"
                className={`group flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 my-1 mr-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  userLocation
                    ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                    : isLocating
                    ? "bg-[#D9E8EF] text-[#2A556A]"
                    : "bg-[#D9E8EF] hover:bg-[#2A556A] text-[#122733] hover:text-white"
                }`}
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#2A556A]" />
                    <span className="hidden sm:inline text-xs font-semibold">Detecting...</span>
                  </>
                ) : userLocation ? (
                  <>
                    <LocateFixed className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline text-xs font-semibold">Located</span>
                  </>
                ) : (
                  <>
                    <LocateFixed className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline text-xs font-semibold">Auto-Locate</span>
                  </>
                )}
              </button>
            </div>

            {/* Location Feedback / Error Banner */}
            {locationError && (
              <div className="mt-2.5 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{locationError}</span>
                </div>
                <button
                  onClick={() => setLocationError(null)}
                  className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {userLocation && !locationError && (
              <div className="mt-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <LocateFixed className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    <strong>Exact Location Detected:</strong> {userLocation.label} • Map centered on your coordinates
                  </span>
                </div>
                <button
                  onClick={() => {
                    setUserLocation(null);
                    setSearchQuery("");
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline shrink-0 cursor-pointer"
                >
                  Clear GPS
                </button>
              </div>
            )}

            {/* SEARCH SUGGESTIONS DROPDOWN PALETTE */}
            {isSearching && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3">
                  Matching Neighborhoods &amp; Campuses
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50/60 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 p-2 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-[#0F4C81] group-hover:text-white transition-colors">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#0F4C81]">
                            {res.title}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">{res.subtitle}</p>
                        </div>
                      </div>
                      <Badge variant="neutral" className="shrink-0 text-[10px]">
                        {res.city.name}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA (LISTINGS & INTERACTIVE MAP)
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & Listings Panel (5 cols) */}
          <div
            className={`lg:col-span-5 space-y-5 ${
              mobileTab === "filters" ? "block" : "hidden lg:block"
            }`}
          >
            {/* Filtered City & Area Listings */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-card border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-semibold text-sm sm:text-base text-[#0B132B] dark:text-white">
                  {selectedArea
                    ? `Properties in ${selectedArea.name}`
                    : `Properties in ${selectedCity.name}`}{" "}
                  <span className="text-[#234C60] dark:text-sky-400 font-bold">({cityListings.length})</span>
                </h2>
                {selectedArea && (
                  <button
                    onClick={handleClearArea}
                    className="text-[11px] text-[#234C60] dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                  >
                    Clear Area
                  </button>
                )}
              </div>

              {cityListings.length > 0 ? (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-slate-800">
                  {cityListings.map((l: Listing) => (
                    <div
                      key={l.id}
                      className="pt-3 first:pt-0 group"
                    >
                      <Link
                        href={`/hostels/${l.id}`}
                        className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 transition-all cursor-pointer group shadow-2xs"
                      >
                        <img
                          src={l.images[0]}
                          alt={l.title}
                          loading="lazy"
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-[#0D212D] dark:text-white group-hover:text-[#F09A57] dark:group-hover:text-[#F09A57] truncate transition-colors">
                            {l.title}
                          </p>
                          <p className="text-[11px] text-[#64748B] dark:text-slate-300 truncate flex items-center gap-1 mt-0.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400 shrink-0" />
                            {l.locality}, {l.city}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs sm:text-sm font-bold text-[#234C60] dark:text-sky-300">
                              ₹{l.price.toLocaleString("en-IN")}/mo
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-[#1E293B] dark:text-slate-200 font-semibold">
                                {l.genderPref}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FEF7F1] dark:bg-amber-950/60 text-[#F4A261] dark:text-amber-300 font-bold flex items-center gap-1 border border-[#F4A261]/20">
                                <Star className="w-3 h-3 fill-[#F4A261] text-[#F4A261]" />
                                {l.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
                    No properties match the selected criteria in {selectedArea ? selectedArea.name : selectedCity.name}.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="mt-3 px-4 py-2 bg-[#F09A57] hover:bg-[#e08945] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Reset Area &amp; Filters
                  </button>
                </div>
              )}
            </div>

            {/* Distance & Transit Calculator */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-card border border-gray-100 dark:border-slate-800">
              <h2 className="font-display font-semibold text-sm sm:text-base text-[#0B132B] dark:text-white mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#F09A57]" /> Transit &amp; Distance
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 dark:text-slate-300 mb-1 block font-medium">
                    From (Campus / Landmark)
                  </label>
                  <input
                    type="text"
                    value={fromPlace}
                    onChange={(e) => setFromPlace(e.target.value)}
                    placeholder="e.g. Christ University or IIT Bombay"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0D212D] dark:text-white rounded-xl text-xs sm:text-sm outline-none focus:border-[#F09A57] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-slate-300 mb-1 block font-medium">
                    To (PG / Locality)
                  </label>
                  <input
                    type="text"
                    value={toPlace}
                    onChange={(e) => setToPlace(e.target.value)}
                    placeholder="e.g. Koramangala 5th Block or Powai"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0D212D] dark:text-white rounded-xl text-xs sm:text-sm outline-none focus:border-[#F09A57] min-h-[44px]"
                  />
                </div>
                <button
                  onClick={calcDistance}
                  className="w-full py-3 bg-[#F09A57] hover:bg-[#e08945] text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] shadow-sm shadow-[#F09A57]/25"
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
          </div>

          {/* ─────────────────────────────────────────────────────────────
              INTERACTIVE MAP VIEW (7 cols)
          ───────────────────────────────────────────────────────────── */}
          <div className={`lg:col-span-7 ${mobileTab === "map" ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden lg:sticky lg:top-24 flex flex-col h-[480px] sm:h-[600px] lg:h-[760px]">
              {/* Map Header */}
              <div className="bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
                <div className="flex items-center gap-2.5 text-white min-w-0">
                  <div className="p-1.5 rounded-lg bg-white/15 backdrop-blur-xs">
                    {userLocation ? (
                      <LocateFixed className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <MapPin className="w-4 h-4 text-[#F09A57]" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-xs sm:text-sm truncate">
                      {mapConfig.title}
                    </p>
                    {mapConfig.sub && (
                      <p className="text-[11px] text-blue-100 truncate">{mapConfig.sub}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedArea && (
                    <button
                      onClick={handleClearArea}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      City View
                    </button>
                  )}
                  {userLocation && (
                    <button
                      onClick={() => {
                        setUserLocation(null);
                        setSearchQuery("");
                      }}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Exit GPS
                    </button>
                  )}
                  <Badge variant="cyan">
                    {cityListings.length} {cityListings.length === 1 ? "Listing" : "Listings"}
                  </Badge>
                </div>
              </div>

              {/* Map Frame with Google Maps API */}
              <div className="flex-1 w-full relative bg-gray-100 min-h-[450px]">
                <GoogleMapView
                  lat={userLocation ? userLocation.lat : selectedArea ? selectedArea.lat : selectedCity.lat}
                  lng={userLocation ? userLocation.lng : selectedArea ? selectedArea.lng : selectedCity.lng}
                  zoom={mapConfig.zoom}
                  title={mapConfig.title}
                  markers={cityListings.map((l) => ({
                    id: l.id,
                    lat: l.lat,
                    lng: l.lng,
                    title: l.title,
                    price: l.price,
                    locality: l.locality,
                  }))}
                  className="w-full h-full"
                />

                {/* Floating Map Hint Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs bg-white/95 backdrop-blur-xs p-3 rounded-2xl shadow-lg border border-gray-100 text-xs text-gray-700">
                  <div className="flex items-center gap-2 font-semibold text-gray-900 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>Live Location Focus</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Map auto-syncs with your search input, selected neighborhood, and GPS location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
