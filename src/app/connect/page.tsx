"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Users,
  Heart,
  MessageCircle,
  MapPin,
  DollarSign,
  SlidersHorizontal,
  CheckCircle,
  CheckCircle2,
  LocateFixed,
  Loader2,
  X,
  Sparkles,
  History,
  BellRing,
  Clock,
} from "lucide-react";
import { DUMMY_ROOMMATES } from "@/lib/data/users";
import { RoommateProfile } from "@/lib/types";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useAuth } from "@/lib/context/AuthContext";
import { createAccommodationRequest } from "@/lib/supabase";

function RoommateCard({
  profile,
  onConnect,
}: {
  profile: RoommateProfile;
  onConnect: (profile: RoommateProfile) => void;
}) {
  const { t } = useLanguage();
  const [liked, setLiked] = useState(false);
  const [notified, setNotified] = useState(false);

  const handleConnectClick = () => {
    setNotified(true);
    onConnect(profile);
  };

  const compatColor =
    profile.compatibility >= 90
      ? "text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60"
      : profile.compatibility >= 75
      ? "text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/60"
      : "text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60";

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-card border border-gray-100 dark:border-slate-700/80 p-5 sm:p-6 card-hover flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                loading="lazy"
                className="w-13 h-13 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white font-bold text-lg shrink-0">
                {profile.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-display font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                {profile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {profile.age} {t("connectPage", "yrs")} • {profile.gender}
              </p>
              <p className="text-xs text-[#0F4C81] dark:text-sky-400 font-semibold truncate mt-0.5">
                {profile.college}
              </p>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${compatColor}`}>
            {profile.compatibility}% {t("connectPage", "match")}
          </div>
        </div>

        {/* Location & Budget Pills */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-700 dark:text-slate-200">
          <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-slate-700/80 px-2.5 py-1 rounded-lg font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0F4C81] dark:text-sky-400" />
            {profile.city}
          </span>
          <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-slate-700/80 px-2.5 py-1 rounded-lg font-medium">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ₹{profile.budget.toLocaleString("en-IN")}{t("connectPage", "perMonth")}
          </span>
          <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 px-2.5 py-1 rounded-lg font-semibold">
            {t("connectPage", "lookingFor")} {profile.lookingFor}
          </span>
        </div>

        {/* Bio */}
        <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
          {profile.bio}
        </p>

        {/* Habit tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {profile.habits.map((h) => (
            <span key={h} className="px-2.5 py-0.5 bg-gray-100 dark:bg-slate-700/80 text-gray-700 dark:text-slate-200 text-xs font-medium rounded-full">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5 pt-3 border-t border-gray-100">
        <button
          onClick={handleConnectClick}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
            notified
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 font-bold shadow-xs"
              : "bg-[#234C60] text-white hover:bg-[#193747] shadow-xs active:scale-[0.98]"
          }`}
        >
          {notified ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Notified (&lt;12h)
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4 text-[#F09A57]" /> {t("connectPage", "connect")}
            </>
          )}
        </button>
        <button
          onClick={() => setLiked(!liked)}
          aria-label={liked ? "Unlike roommate" : "Like roommate"}
          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors cursor-pointer min-h-[44px] min-w-[44px] shrink-0 ${
            liked
              ? "bg-red-50 border-red-200 text-red-500"
              : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
        </button>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [previousLocation, setPreviousLocation] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);
  const [notifiedModalProfile, setNotifiedModalProfile] = useState<RoommateProfile | null>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const handleConnectRoommate = async (profile: RoommateProfile) => {
    setNotifiedModalProfile(profile);
    setIsSubmittingRequest(true);
    try {
      const res = await createAccommodationRequest({
        senderId: user?.id,
        senderName: user?.name || "Student Seeker",
        senderContact: user?.phone || user?.email || "+91 98180 76543",
        receiverId: profile.id,
        receiverName: profile.name,
        receiverCollege: profile.college,
        receiverCity: profile.city,
        notes: `Accommodation & roommate connection request for ${profile.lookingFor} in ${profile.city}.`,
      });
      if (res.requestId) {
        setActiveRequestId(res.requestId);
      }
    } catch (e) {
      console.warn("Accommodation request saved locally:", e);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Sync initial location from previous bar (Hero search, Hostels search, URL parameters, or profile)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // 1. Check URL parameters
      const params = new URLSearchParams(window.location.search);
      const urlCity = params.get("city") || params.get("location") || params.get("q");
      if (urlCity) {
        setSearch(urlCity);
        setPreviousLocation(urlCity);
        return;
      }

      // 2. Fetch from previous search bar via localStorage
      const stored =
        localStorage.getItem("apnakona_last_location") ||
        localStorage.getItem("apnakona_search_city");

      if (stored) {
        setPreviousLocation(stored);
      } else if (user?.preferredCity) {
        setPreviousLocation(user.preferredCity);
      }
    } catch {
      // ignore storage access errors
    }
  }, [user?.preferredCity]);

  // Apply chosen location helper
  const applyLocation = (loc: string) => {
    setSearch(loc);
    try {
      localStorage.setItem("apnakona_last_location", loc);
    } catch {}
    setLocationToast(`Applied location: "${loc}"`);
    setTimeout(() => setLocationToast(null), 2500);
  };

  // GPS auto-locate
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
            const cityName = addr.city || addr.town || addr.state_district || addr.state || "";
            if (cityName) {
              applyLocation(cityName);
              setPreviousLocation(cityName);
              setIsLocating(false);
              return;
            }
          }
        } catch {
          // fallback
        }
        applyLocation("Bangalore");
        setPreviousLocation("Bangalore");
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const filtered = DUMMY_ROOMMATES.filter((r) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.college.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.habits.some((h) => h.toLowerCase().includes(q));
    const matchGender = !genderFilter || r.gender === genderFilter;
    const matchCity = !cityFilter || r.city === cityFilter;
    const matchType = !typeFilter || r.lookingFor === typeFilter;
    return matchSearch && matchGender && matchCity && matchType;
  });

  const cities = [...new Set(DUMMY_ROOMMATES.map((r) => r.city))];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white py-10 sm:py-14 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
              <Users className="w-5 h-5 text-[#F09A57]" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {t("connectPage", "title")} <span className="text-[#F09A57]">{t("connectPage", "titleHighlight")}</span>
            </h1>
          </div>
          <p className="text-white/90 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
            {t("connectPage", "subtitle")}
          </p>

          <div className="mt-6 flex flex-col gap-3 max-w-2xl">
            {/* Search Bar Container with Integrated Shortcut Buttons */}
            <div className="relative flex items-center gap-2 bg-white/15 border border-white/25 rounded-2xl px-3.5 sm:px-4 py-2 backdrop-blur-md shadow-lg transition-all focus-within:bg-white/25 focus-within:border-white/40 focus-within:ring-2 focus-within:ring-[#F09A57]/30">
              <Search className="w-5 h-5 text-white/80 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("connectPage", "searchPlaceholder")}
                className="flex-1 bg-transparent text-white placeholder-white/70 outline-none text-xs sm:text-sm min-h-[38px] font-medium min-w-0"
              />

              {/* Clear button */}
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* In-bar Shortcut: Fetch location from previous search bar */}
              {previousLocation && search.toLowerCase().trim() !== previousLocation.toLowerCase().trim() && (
                <button
                  type="button"
                  onClick={() => applyLocation(previousLocation)}
                  title={`Click to fill with previous search location: ${previousLocation}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F09A57] hover:bg-[#e08945] text-white text-xs font-bold shadow-md shadow-[#F09A57]/30 transition-all transform active:scale-95 cursor-pointer shrink-0 animate-fade-in"
                >
                  <MapPin className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden sm:inline">Use Previous:</span>
                  <span className="underline decoration-white/60 underline-offset-2">{previousLocation}</span>
                </button>
              )}

              {/* GPS Auto-detect button */}
              <button
                type="button"
                onClick={handleAutoLocate}
                disabled={isLocating}
                title="Detect current GPS location"
                className="p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#F09A57]" />
                ) : (
                  <LocateFixed className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quick Location Shortcuts Strip */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
              <span className="text-white/80 font-bold flex items-center gap-1 text-[11px] sm:text-xs mr-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F09A57]" /> Quick Location:
              </span>

              {/* Previous Bar Shortcut Tag */}
              {previousLocation && (
                <button
                  type="button"
                  onClick={() => applyLocation(previousLocation)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    search.toLowerCase().trim() === previousLocation.toLowerCase().trim()
                      ? "bg-[#F09A57] text-white ring-2 ring-white/60"
                      : "bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:scale-[1.02]"
                  }`}
                >
                  <History className="w-3 h-3 text-[#F09A57]" />
                  <span>From Previous Search: <strong>{previousLocation}</strong></span>
                </button>
              )}

              {/* Current GPS Tag */}
              <button
                type="button"
                onClick={handleAutoLocate}
                disabled={isLocating}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white/95 text-xs font-medium border border-white/20 transition-all cursor-pointer"
              >
                {isLocating ? (
                  <Loader2 className="w-3 h-3 animate-spin text-[#F09A57]" />
                ) : (
                  <LocateFixed className="w-3 h-3 text-emerald-400" />
                )}
                <span>{isLocating ? "Detecting GPS..." : "Current Location"}</span>
              </button>

              {/* Popular City Quick Chips */}
              {cities.slice(0, 5).map((cityName) => (
                <button
                  key={cityName}
                  type="button"
                  onClick={() => applyLocation(cityName)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    search.toLowerCase().trim() === cityName.toLowerCase().trim()
                      ? "bg-white text-[#234C60] font-bold shadow-xs scale-105"
                      : "bg-white/10 hover:bg-white/20 text-white/90"
                  }`}
                >
                  {cityName}
                </button>
              ))}

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-white/70 hover:text-white underline text-[11px] ml-1 cursor-pointer font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Location Toast Alert */}
            {locationToast && (
              <div className="inline-flex items-center gap-1.5 text-xs text-white bg-emerald-700/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-400/40 shadow-sm animate-fade-in w-fit">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>{locationToast}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Responsive Filters Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-card border border-[#CBD8DF] mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#234C60]" />
              <span className="text-xs font-bold text-[#2D4756] uppercase tracking-wider">
                Filter Profiles
              </span>
            </div>
            {(genderFilter || cityFilter || typeFilter || search) && (
              <button
                onClick={() => {
                  setGenderFilter("");
                  setCityFilter("");
                  setTypeFilter("");
                  setSearch("");
                }}
                className="text-xs font-bold text-[#F4A261] hover:underline cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "Male", labelKey: "male" },
              { key: "Female", labelKey: "female" },
            ].map((g) => (
              <button
                key={g.key}
                onClick={() => setGenderFilter(genderFilter === g.key ? "" : g.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[36px] ${
                  genderFilter === g.key
                    ? "bg-[#2A556A] text-white border-[#2A556A] font-bold"
                    : "border-gray-200 text-[#2D4756] hover:border-[#2A556A]/50 hover:bg-[#D9E8EF]/40"
                }`}
              >
                {t("connectPage", g.labelKey)}
              </button>
            ))}

            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setCityFilter(cityFilter === c ? "" : c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[36px] ${
                  cityFilter === c
                    ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                    : "border-gray-200 text-gray-700 hover:border-[#FF6B35]/50"
                }`}
              >
                {c}
              </button>
            ))}

            {[
              { key: "PG", labelKey: "pg" },
              { key: "Hostel", labelKey: "hostel" },
              { key: "Flat", labelKey: "flat" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setTypeFilter(typeFilter === item.key ? "" : item.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[36px] ${
                  typeFilter === item.key
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-gray-200 text-gray-700 hover:border-purple-400"
                }`}
              >
                {t("filterSidebar", item.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs sm:text-sm font-semibold text-gray-700">
            {filtered.length} verified profile{filtered.length !== 1 ? "s" : ""} found
          </p>
          <span className="text-xs text-gray-400">Sorted by compatibility</span>
        </div>

        {/* Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered
              .sort((a, b) => b.compatibility - a.compatibility)
              .map((r) => (
                <RoommateCard
                  key={r.id}
                  profile={r}
                  onConnect={(p) => handleConnectRoommate(p)}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-card">
            <Users className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-gray-700 mb-1.5">{t("connectPage", "noProfilesFound")}</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-5">
              {t("connectPage", "noProfilesSub")}
            </p>
            <button
              onClick={() => {
                setGenderFilter("");
                setCityFilter("");
                setTypeFilter("");
                setSearch("");
              }}
              className="px-5 py-2.5 bg-[#0F4C81] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#0d3f6e] transition-colors cursor-pointer min-h-[44px]"
            >
              {t("connectPage", "resetFilters")}
            </button>
          </div>
        )}
      </div>

      {/* Pop-up Dialog: Owner / Resident Notified & Accommodation Request Logged */}
      {notifiedModalProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          {/* Clickable Backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => setNotifiedModalProfile(null)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#131D31] rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 dark:border-slate-800 animate-scale-up text-center z-10 space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setNotifiedModalProfile(null)}
              aria-label="Close notification"
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Notification Bell Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <BellRing className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800/60">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Request Logged: {activeRequestId || "REQ-Processing..."}</span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white font-display tracking-tight">
                Owner &amp; Resident Notified!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                A pop-up notification has been dispatched to <span className="font-bold text-gray-900 dark:text-white">{notifiedModalProfile.name}</span> and their property owner. They will contact you within <span className="font-bold text-[#F09A57]">12 hours</span>.
              </p>
            </div>

            {/* Snapshot of contacted person */}
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-slate-900/80 rounded-2xl border border-gray-100 dark:border-slate-800 text-left">
              <img
                src={notifiedModalProfile.avatar}
                alt={notifiedModalProfile.name}
                className="w-12 h-12 rounded-xl object-cover border border-white dark:border-slate-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                  {notifiedModalProfile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                  {notifiedModalProfile.college} • {notifiedModalProfile.city}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
                {notifiedModalProfile.compatibility}% Match
              </span>
            </div>

            {/* Notification & Database Delivery Details */}
            <div className="space-y-2 text-xs text-left bg-[#E5EFF4]/60 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-[#CBD8DF]/60 dark:border-slate-700">
              <div className="flex items-center gap-2 text-gray-700 dark:text-slate-200">
                <Clock className="w-4 h-4 text-[#234C60] dark:text-sky-400 shrink-0" />
                <span>Response Window: <strong>Within 12 Hours Guarantee</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Notification dispatched to recipient via In-App &amp; SMS</span>
              </div>
            </div>

            {/* Confirmation CTA */}
            <button
              type="button"
              onClick={() => setNotifiedModalProfile(null)}
              className="w-full py-3.5 px-6 rounded-xl bg-[#234C60] hover:bg-[#1a3848] text-white font-bold text-sm shadow-md transition-all cursor-pointer active:scale-98"
            >
              Got it, Thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
