"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, ChevronRight } from "lucide-react";

const CITIES = ["Bangalore", "Pune", "Delhi", "Mumbai", "Chennai", "Hyderabad", "Noida", "Pilani"];

export default function Hero() {
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?city=${encodeURIComponent(city)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81] via-[#0d3f6e] to-[#1a1a2e] min-h-[88vh] flex items-center">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
            <span className="w-2 h-2 bg-[#FF6B35] rounded-full pulse-dot" />
            <span className="text-white/90 text-sm font-medium">India&apos;s #1 Student Accommodation Platform</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Find Your{" "}
            <span className="relative">
              <span className="text-[#FF6B35]">Perfect Corner</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M1 10 Q75 2 150 10 Q225 18 299 10" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
              </svg>
            </span>{" "}
            in Every City
          </h1>

          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Verified PGs, hostels &amp; flats — handpicked for students. No broker fees, no surprises. Just your home away from home.
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
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City or locality..."
                  className="w-full pl-11 pr-4 py-3 min-h-[46px] rounded-xl border border-gray-200 outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 text-gray-800 text-sm font-medium bg-white"
                  required
                />
                <datalist id="cities">
                  {CITIES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>

              {/* Date */}
              <div className="relative w-full sm:w-44">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F4C81]" />
                <input
                  type="month"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label="Move-in month"
                  className="w-full pl-11 pr-3 py-3 min-h-[46px] rounded-xl border border-gray-200 outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 text-gray-700 text-sm bg-white cursor-pointer"
                />
              </div>

              <button
                type="submit"
                id="hero-search-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] bg-[#FF6B35] hover:bg-[#e85a22] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4">
              <span className="text-gray-500 text-xs font-medium">Popular:</span>
              {CITIES.slice(0, 5).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCity(c); router.push(`/search?city=${c}`); }}
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
              { num: "50,000+", label: "Verified Listings" },
              { num: "200+", label: "Cities Covered" },
              { num: "2 Lakh+", label: "Happy Students" },
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
        <span className="text-xs">Scroll</span>
        <ChevronRight className="w-4 h-4 rotate-90" />
      </div>
    </section>
  );
}
