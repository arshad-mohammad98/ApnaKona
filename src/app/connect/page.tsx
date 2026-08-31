"use client";

import { useState } from "react";
import { Search, Users, Heart, MessageCircle, MapPin, DollarSign, SlidersHorizontal } from "lucide-react";
import { DUMMY_ROOMMATES } from "@/lib/data/users";
import { RoommateProfile } from "@/lib/types";

function RoommateCard({ profile }: { profile: RoommateProfile }) {
  const [liked, setLiked] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  const compatColor =
    profile.compatibility >= 90 ? "text-green-600 bg-green-100" :
    profile.compatibility >= 75 ? "text-blue-600 bg-blue-100" :
    "text-orange-600 bg-orange-100";

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 card-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white font-bold text-lg">
              {profile.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-display font-semibold text-gray-900">{profile.name}</p>
            <p className="text-xs text-gray-500">{profile.age} · {profile.gender}</p>
            <p className="text-xs text-[#0F4C81] font-medium">{profile.college}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${compatColor}`}>
          {profile.compatibility}% match
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.city}</span>
        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />₹{profile.budget.toLocaleString("en-IN")}/mo</span>
        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{profile.lookingFor}</span>
      </div>

      <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-2">{profile.bio}</p>

      {/* Habits */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {profile.habits.map((h) => (
          <span key={h} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{h}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setMsgSent(!msgSent)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
            msgSent ? "bg-green-100 text-green-700" : "bg-[#0F4C81] text-white hover:bg-[#0d3f6e]"
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {msgSent ? "Request Sent!" : "Connect"}
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
            liked ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"
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
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.college.toLowerCase().includes(q) || r.city.toLowerCase().includes(q);
    const matchGender = !genderFilter || r.gender === genderFilter;
    const matchCity = !cityFilter || r.city === cityFilter;
    const matchType = !typeFilter || r.lookingFor === typeFilter;
    return matchSearch && matchGender && matchCity && matchType;
  });

  const cities = [...new Set(DUMMY_ROOMMATES.map((r) => r.city))];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6db5] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6" />
            <h1 className="font-display text-2xl font-bold">Find Roommates</h1>
          </div>
          <p className="text-white/70 text-sm max-w-xl">
            Connect with compatible students based on budget, habits, and location. Find your perfect flatmate before you move in.
          </p>
          <div className="mt-6 flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 max-w-xl">
            <Search className="w-5 h-5 text-white/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, college, or city..."
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            {["Male", "Female"].map((g) => (
              <button key={g} onClick={() => setGenderFilter(genderFilter === g ? "" : g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${genderFilter === g ? "bg-[#0F4C81] text-white border-[#0F4C81]" : "border-gray-200 text-gray-600 hover:border-[#0F4C81]/50"}`}>
                {g}
              </button>
            ))}
            {cities.map((c) => (
              <button key={c} onClick={() => setCityFilter(cityFilter === c ? "" : c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${cityFilter === c ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "border-gray-200 text-gray-600 hover:border-[#FF6B35]/50"}`}>
                {c}
              </button>
            ))}
            {["PG", "Hostel", "Flat"].map((t) => (
              <button key={t} onClick={() => setTypeFilter(typeFilter === t ? "" : t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${typeFilter === t ? "bg-purple-600 text-white border-purple-600" : "border-gray-200 text-gray-600 hover:border-purple-400"}`}>
                Looking for {t}
              </button>
            ))}
          </div>
          {(genderFilter || cityFilter || typeFilter || search) && (
            <button onClick={() => { setGenderFilter(""); setCityFilter(""); setTypeFilter(""); setSearch(""); }}
              className="ml-auto text-xs text-red-500 hover:underline">
              Clear All
            </button>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">{filtered.length} profiles found</p>
          <span className="text-xs text-gray-400">Sorted by compatibility</span>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.sort((a, b) => b.compatibility - a.compatibility).map((r) => (
              <RoommateCard key={r.id} profile={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="w-14 h-14 text-gray-200 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-gray-600 mb-2">No profiles found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
