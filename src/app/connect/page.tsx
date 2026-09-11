"use client";

import { useState } from "react";
import { Search, Users, Heart, MessageCircle, MapPin, DollarSign, SlidersHorizontal, CheckCircle } from "lucide-react";
import { DUMMY_ROOMMATES } from "@/lib/data/users";
import { RoommateProfile } from "@/lib/types";

function RoommateCard({ profile }: { profile: RoommateProfile }) {
  const [liked, setLiked] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  const compatColor =
    profile.compatibility >= 90
      ? "text-green-700 bg-green-100"
      : profile.compatibility >= 75
      ? "text-blue-700 bg-blue-100"
      : "text-orange-700 bg-orange-100";

  return (
    <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 sm:p-6 card-hover flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                loading="lazy"
                className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
              />
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white font-bold text-lg shrink-0">
                {profile.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-display font-semibold text-gray-900 text-sm sm:text-base truncate">
                {profile.name}
              </p>
              <p className="text-xs text-gray-500">
                {profile.age} yrs • {profile.gender}
              </p>
              <p className="text-xs text-[#0F4C81] font-semibold truncate mt-0.5">
                {profile.college}
              </p>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${compatColor}`}>
            {profile.compatibility}% match
          </div>
        </div>

        {/* Location & Budget Pills */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-[#0F4C81]" />
            {profile.city}
          </span>
          <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg">
            <DollarSign className="w-3.5 h-3.5 text-green-600" />
            ₹{profile.budget.toLocaleString("en-IN")}/mo
          </span>
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg font-medium">
            Looking for {profile.lookingFor}
          </span>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
          {profile.bio}
        </p>

        {/* Habit tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {profile.habits.map((h) => (
            <span key={h} className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5 pt-3 border-t border-gray-100">
        <button
          onClick={() => setMsgSent(!msgSent)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors min-h-[44px] cursor-pointer ${
            msgSent
              ? "bg-green-100 text-green-800"
              : "bg-[#0F4C81] text-white hover:bg-[#0d3f6e] shadow-xs"
          }`}
        >
          {msgSent ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" /> Connected!
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4" /> Connect
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
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = DUMMY_ROOMMATES.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.college.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q);
    const matchGender = !genderFilter || r.gender === genderFilter;
    const matchCity = !cityFilter || r.city === cityFilter;
    const matchType = !typeFilter || r.lookingFor === typeFilter;
    return matchSearch && matchGender && matchCity && matchType;
  });

  const cities = [...new Set(DUMMY_ROOMMATES.map((r) => r.city))];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] via-[#125894] to-[#1a6db5] text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Find Verified Roommates</h1>
          </div>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
            Connect with college students based on study habits, sleep schedules, and budget. Match before moving in!
          </p>

          <div className="mt-6 flex items-center gap-3 bg-white/15 border border-white/25 rounded-2xl px-4 py-2.5 max-w-xl backdrop-blur-xs">
            <Search className="w-5 h-5 text-white/70 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, college, or city..."
              className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-xs sm:text-sm min-h-[38px]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Responsive Filters Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-card border border-gray-100 mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0F4C81]" />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
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
                className="text-xs font-semibold text-[#FF6B35] hover:underline cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {["Male", "Female"].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(genderFilter === g ? "" : g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[36px] ${
                  genderFilter === g
                    ? "bg-[#0F4C81] text-white border-[#0F4C81]"
                    : "border-gray-200 text-gray-700 hover:border-[#0F4C81]/50"
                }`}
              >
                {g}
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

            {["PG", "Hostel", "Flat"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(typeFilter === t ? "" : t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[36px] ${
                  typeFilter === t
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-gray-200 text-gray-700 hover:border-purple-400"
                }`}
              >
                {t}
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
                <RoommateCard key={r.id} profile={r} />
              ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-card">
            <Users className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-gray-700 mb-1.5">No profiles found</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-5">
              Try adjusting or clearing your filters to see more student profiles.
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
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
