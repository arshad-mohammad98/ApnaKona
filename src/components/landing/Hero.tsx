"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronRight, LocateFixed, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const CITIES = ["Bangalore", "Pune", "Delhi", "Mumbai", "Chennai", "Hyderabad", "Noida", "Pilani"];

// Reverse geocoding helper (Nominatim with BigDataCloud fallback)
async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  // 1. Primary: OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      { headers: { Accept: "application/json" } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality =
        addr.suburb || addr.neighbourhood || addr.residential || addr.subdivision || addr.city_district;
      const city =
        addr.city || addr.town || addr.municipality || addr.state_district || addr.county;

      if (locality && city && locality.toLowerCase() !== city.toLowerCase()) {
        return `${locality}, ${city}`;
      }
      if (city) return city;
      if (locality) return locality;
      if (data.name) return data.name;
    }
  } catch {
    // Fall back to secondary service
  }

  // 2. Secondary fallback: BigDataCloud
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality;
      const city = data.city || data.principalSubdivision;
      if (locality && city && locality.toLowerCase() !== city.toLowerCase()) {
        return `${locality}, ${city}`;
      }
      if (city) return city;
      if (locality) return locality;
    }
  } catch {
    // Both failed
  }

  throw new Error("Unable to resolve city name from your coordinates.");
}

export default function Hero() {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [geoSupported, setGeoSupported] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !navigator.geolocation) {
      setGeoSupported(false);
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const detectedCity = await reverseGeocode(latitude, longitude);
          setCity(detectedCity);
          setLocationError(null);
        } catch {
          setLocationError("Could not determine your locality — you can type it manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location access denied — you can type your city manually instead.");
        } else if (error.code === error.TIMEOUT) {
          setLocationError("Location request timed out — please type your city manually.");
        } else {
          setLocationError("Location unavailable — you can type your city manually instead.");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/hostels?city=${encodeURIComponent(city)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81] via-[#0d3f6e] to-[#1a1a2e] min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex items-center">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B35]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0F4C81]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 w-full">
        <div className="max-w-3xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
            <span className="w-2 h-2 bg-[#FF6B35] rounded-full pulse-dot" />
            <span className="text-white/90 text-sm font-medium">{t("hero.badge", "India's #1 Student Accommodation Platform")}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {t("hero.titlePre", "Find Your ")}
            <span className="relative">
              <span className="text-[#FF6B35]">{t("hero.titleHighlight", "Perfect Corner")}</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M1 10 Q75 2 150 10 Q225 18 299 10" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
              </svg>
            </span>
            {t("hero.titlePost", " in Every City")}
          </h1>

          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {t("hero.subtitle", "Verified PGs, hostels & flats — handpicked for students. No broker fees, no surprises. Just your home away from home.")}
          </p>

          {/* Search Card */}
          <div className="glass rounded-3xl p-4 sm:p-6 max-w-2xl animate-fade-up shadow-2xl" style={{ animationDelay: "0.3s" }}>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              {/* City */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F4C81]" />
                <input
                  list="cities"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (locationError) setLocationError(null);
                  }}
                  placeholder={t("hero.searchPlaceholder", "City or locality...")}
                  className={`w-full pl-11 ${geoSupported ? "pr-12" : "pr-4"} py-3 min-h-[46px] rounded-xl border border-gray-200 outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 text-gray-800 text-sm font-medium bg-white transition-all`}
                  required
                />
                <datalist id="cities">
                  {CITIES.map((c) => <option key={c} value={c} />)}
                </datalist>

                {/* Geolocation Button */}
                {geoSupported && (
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    title={t("hero.detectLocation", "Detect my current location")}
                    aria-label={t("hero.detectLocation", "Detect my current location")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-[#0F4C81] hover:bg-[#0F4C81]/8 active:scale-95 transition-all cursor-pointer disabled:cursor-wait min-h-[38px] min-w-[38px] flex items-center justify-center"
                  >
                    {isLocating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#FF6B35]" />
                    ) : (
                      <LocateFixed className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              <button
                type="submit"
                id="hero-search-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 min-h-[46px] bg-[#FF6B35] hover:bg-[#e85a22] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                {t("hero.searchBtn", "Search")}
              </button>
            </form>

            {/* Location Notice / Error */}
            {locationError && (
              <div className="flex items-center justify-between gap-2 mt-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs animate-fade-up">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{locationError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLocationError(null)}
                  className="text-amber-700 hover:text-amber-950 font-bold px-1 text-sm leading-none cursor-pointer"
                  aria-label="Dismiss message"
                >
                  ×
                </button>
              </div>
            )}

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4">
              <span className="text-gray-500 text-xs font-medium">{t("hero.popular", "Popular:")}</span>
              {CITIES.slice(0, 5).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCity(c);
                    if (locationError) setLocationError(null);
                    router.push(`/hostels?city=${c}`);
                  }}
                  className="text-xs px-2.5 py-1.5 min-h-[32px] bg-[#0F4C81]/8 text-[#0F4C81] rounded-full hover:bg-[#0F4C81] hover:text-white transition-colors cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { num: "50,000+", label: t("hero.statVerified", "Verified Listings") },
              { num: "200+", label: t("hero.statCities", "Cities Covered") },
              { num: "2 Lakh+", label: t("hero.statStudents", "Happy Students") },
            ].map(({ num, label }, idx) => (
              <div key={label} className={idx === 2 ? "col-span-2 sm:col-span-1" : ""}>
                <p className="text-2xl sm:text-3xl font-display font-bold text-white">{num}</p>
                <p className="text-white/60 text-xs sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <span className="text-xs">{t("hero.scroll", "Scroll")}</span>
        <ChevronRight className="w-4 h-4 rotate-90" />
      </div>
    </section>
  );
}
