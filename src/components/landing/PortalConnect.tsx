"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, MapPin, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { DUMMY_ROOMMATES } from "@/lib/data/users";

export default function PortalConnect() {
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleConnect = (id: string) => {
    setConnectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const displayProfiles = DUMMY_ROOMMATES.slice(0, 3);

  return (
    <section id="connect" className="py-16 sm:py-24 bg-[#F9FAFB] border-t border-gray-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-semibold mb-3">
              Roommate Matching
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A2E]">
              Find Compatible College Roommates
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1.5 max-w-xl">
              Match with peers from your college by budget, study hours, and lifestyle habits before you move in.
            </p>
          </div>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81] hover:text-white transition-colors text-xs sm:text-sm font-semibold min-h-[44px] shrink-0 w-full sm:w-auto justify-center"
          >
            Browse All Roommates ({DUMMY_ROOMMATES.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Roommate Cards Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProfiles.map((profile) => {
            const isLiked = likedIds.includes(profile.id);
            const isConnected = connectedIds.includes(profile.id);

            const compatColor =
              profile.compatibility >= 90
                ? "text-green-700 bg-green-100"
                : profile.compatibility >= 75
                ? "text-blue-700 bg-blue-100"
                : "text-orange-700 bg-orange-100";

            return (
              <div
                key={profile.id}
                className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 sm:p-6 card-hover flex flex-col justify-between h-full"
              >
                <div>
                  {/* Top Row */}
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
                  </div>

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                    {profile.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {profile.habits.map((h) => (
                      <span key={h} className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleConnect(profile.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors min-h-[44px] cursor-pointer ${
                      isConnected
                        ? "bg-green-100 text-green-800"
                        : "bg-[#0F4C81] text-white hover:bg-[#0d3f6e] shadow-xs"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" /> Request Sent
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" /> Connect
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => toggleLike(profile.id)}
                    aria-label={isLiked ? "Unlike roommate" : "Like roommate"}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors cursor-pointer min-h-[44px] min-w-[44px] shrink-0 ${
                      isLiked
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
