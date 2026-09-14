"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, LocateFixed, Loader2, Bot, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { openRoomie } from "@/lib/roomie";
import { useLanguage } from "@/lib/context/LanguageContext";

import { resolveLocationQuery } from "@/lib/constants";

const POPULAR_CITIES = ["Bangalore", "Pune", "Delhi", "Greater Noida", "Mumbai", "Hyderabad"];

export default function Hero() {
  const [city, setCity] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleAutoLocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const neighborhood = addr.suburb || addr.neighbourhood || addr.residential || "";
            const cityName = addr.city || addr.town || addr.state_district || "";
            if (neighborhood && cityName) {
              setCity(`${neighborhood}, ${cityName}`);
              setIsLocating(false);
              return;
            }
            if (cityName) {
              setCity(cityName);
              setIsLocating(false);
              return;
            }
          }
        } catch {
          // fallback
        }
        setCity("Bangalore");
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCity = city.trim();
    if (cleanCity) {
      try {
        localStorage.setItem("apnakona_last_location", cleanCity);
      } catch {}

      const { city: targetCity, search: targetSearch } = resolveLocationQuery(cleanCity);
      const params = new URLSearchParams();
      if (targetCity) params.set("city", targetCity);
      if (targetSearch) params.set("q", targetSearch);
      router.push(`/hostels?${params.toString()}`);
    } else {
      router.push("/hostels");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      {/* Ambient lighting accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-12 right-10 w-80 h-80 bg-[#F09A57]/15 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust badge (Light text on translucent dark surface) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-xs mb-6 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-semibold text-white" style={{ color: "#FFFFFF" }}>
            {t("hero", "badge")}
          </span>
          <span className="text-[11px] text-white/70 hidden sm:inline">•</span>
          <span className="text-[11px] font-medium text-white/95 hidden sm:inline" style={{ color: "#F1F5F9" }}>
            {t("hero", "badgeSub")}
          </span>
        </div>

        {/* Headline: Brilliant white headline with radiant warm gold/orange accent */}
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5 drop-shadow-sm"
          style={{ color: "#FFFFFF" }}
        >
          {t("hero", "headlinePart1")} <br className="hidden sm:inline" />
          <span className="text-[#F09A57]" style={{ color: "#F09A57" }}>
            {t("hero", "headlinePart2")}
          </span>
        </h1>

        {/* Supporting text: Radiant light font on dark gradient */}
        <p
          className="text-base sm:text-lg text-white max-w-2xl mx-auto mb-10 font-normal leading-relaxed drop-shadow-2xs"
          style={{ color: "#FFFFFF" }}
        >
          {t("hero", "subtitle")}
        </p>

        {/* Main Search Card: Crisp card with high-contrast readable text in both light and dark modes */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#131D31] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl border border-white/80 dark:border-slate-700/80 text-left">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            {/* Input field */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#234C60] dark:text-[#F09A57] pointer-events-none transition-colors" />
              <input
                type="text"
                list="popular-hero-cities"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("hero", "searchPlaceholder")}
                className="w-full pl-11 pr-11 py-3.5 text-sm font-semibold bg-[#F8FAFC] dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0D212D] dark:text-white placeholder-[#64748B] dark:placeholder-slate-400 outline-none focus:border-[#F09A57] dark:focus:border-[#F09A57] focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#F09A57]/20 transition-all min-h-[48px]"
              />
              <button
                type="button"
                onClick={handleAutoLocate}
                disabled={isLocating}
                title="Detect my current location"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 text-[#234C60] dark:text-sky-400 hover:bg-[#E5EFF4] dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#234C60] dark:text-sky-400" />
                ) : (
                  <LocateFixed className="w-4 h-4" />
                )}
              </button>
              <datalist id="popular-hero-cities">
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {/* Primary Search Button: Warm Orange with bright white text */}
            <button
              type="submit"
              id="hero-search-btn"
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#F09A57] hover:bg-[#e08945] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-[#F09A57]/30 active:scale-[0.98] cursor-pointer shrink-0 min-h-[48px]"
              style={{ color: "#FFFFFF" }}
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>{t("hero", "searchButton")}</span>
            </button>
          </form>

          {/* Popular Cities Chips */}
          <div className="flex flex-wrap items-center justify-start sm:justify-center gap-1.5 sm:gap-2 mt-3.5 pt-3 border-t border-[#F1F5F9] dark:border-slate-800 text-xs">
            <span className="text-[#64748B] dark:text-slate-400 font-bold mr-1">
              {t("hero", "popular")}
            </span>
            {POPULAR_CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCity(c);
                  try {
                    localStorage.setItem("apnakona_last_location", c);
                  } catch {}
                  router.push(`/hostels?city=${encodeURIComponent(c)}`);
                }}
                className="px-2.5 py-1 bg-[#E5EFF4] dark:bg-slate-800 hover:bg-[#234C60] hover:text-white dark:hover:bg-[#F09A57] dark:hover:text-white text-[#0D212D] dark:text-slate-200 font-semibold rounded-lg transition-colors cursor-pointer text-xs"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary AI CTA: Vibrant light font on dark background */}
        <div className="mt-6 inline-flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-white">
          <span className="font-medium text-white" style={{ color: "#FFFFFF" }}>
            {t("hero", "notSure")}
          </span>
          <button
            type="button"
            onClick={() => openRoomie("Hi Roomie! Can you help me find a verified place that matches my budget and preferences?")}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/30 backdrop-blur-md transition-all shadow-sm hover:shadow-md cursor-pointer group"
            style={{ color: "#FFFFFF" }}
          >
            <Bot className="w-3.5 h-3.5 text-sky-200 group-hover:rotate-12 transition-transform" />
            <span>{t("hero", "askRoomie")}</span>
            <Sparkles className="w-3 h-3 text-[#F09A57]" />
          </button>
        </div>

        {/* Quick Context / Trust Cues: Light text on glass cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-10 pt-8 border-t border-white/20 text-left">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                {t("hero", "whatItIs")}
              </p>
              <p className="text-[11px] text-white font-medium" style={{ color: "#FFFFFF" }}>
                {t("hero", "whatItIsDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
            <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                {t("hero", "whoItIsFor")}
              </p>
              <p className="text-[11px] text-white font-medium" style={{ color: "#FFFFFF" }}>
                {t("hero", "whoItIsForDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
            <Search className="w-4 h-4 text-[#F09A57] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                {t("hero", "whatYouCanDo")}
              </p>
              <p className="text-[11px] text-white font-medium" style={{ color: "#FFFFFF" }}>
                {t("hero", "whatYouCanDoDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
            <Bot className="w-4 h-4 text-[#F09A57] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                {t("hero", "roomieAI")}
              </p>
              <p className="text-[11px] text-white font-medium" style={{ color: "#FFFFFF" }}>
                {t("hero", "roomieAIDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
