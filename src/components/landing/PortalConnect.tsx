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
    <section id="connect" className="py-16 sm:py-24 bg-[#F7FAFC] dark:bg-[#0B1120] border-t border-[#E2E8F0] dark:border-slate-800 scroll-mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1 bg-[#DDF3EA] dark:bg-emerald-950/50 text-[#1F634A] dark:text-emerald-300 border border-[#A4DFCA]/50 rounded-full text-xs sm:text-sm font-semibold mb-3">
              Roommate Matching
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] dark:text-white">
              Find Compatible College Roommates
            </h2>
            <p className="text-[#64748B] dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xl">
              Match with peers from your college by budget, study hours, and lifestyle habits before you move in.
            </p>
          </div>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2A556A] dark:border-[#4A7C94] text-[#2A556A] dark:text-[#D9E8EF] rounded-xl hover:bg-[#2A556A] hover:text-white dark:hover:bg-[#2A556A] dark:hover:text-white transition-colors text-xs sm:text-sm font-semibold min-h-[44px] shrink-0 w-full sm:w-auto justify-center"
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
                ? "text-[#144D37] dark:text-emerald-300 bg-[#D4ECE5] dark:bg-emerald-950/60 border border-[#A4DFCA]"
                : profile.compatibility >= 75
                ? "text-[#122733] dark:text-[#D9E8EF] bg-[#D9E8EF] dark:bg-[#2A556A]/40 border border-[#2A556A]/25"
                : "text-[#B85C1C] dark:text-orange-300 bg-[#FEF7F1] dark:bg-orange-950/60 border border-[#F4A261]/30";

            return (
              <div
                key={profile.id}
                className="bg-white dark:bg-[#131D31] rounded-3xl shadow-card border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-6 card-hover flex flex-col justify-between h-full"
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
                          className="w-13 h-13 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#4A7C94] to-[#2A556A] flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {profile.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-[#1F2937] dark:text-white text-sm sm:text-base truncate">
                          {profile.name}
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-slate-400">
                          {profile.age} yrs • {profile.gender}
                        </p>
                        <p className="text-xs text-[#2A556A] dark:text-[#4A7C94] font-semibold truncate mt-0.5">
                          {profile.college}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${compatColor}`}>
                      {profile.compatibility}% match
                    </div>
                  </div>

                  {/* Location & Budget Pills */}
                  <div className="flex flex-wrap gap-2 mb-3 text-xs text-[#64748B] dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 bg-[#D9E8EF]/60 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg text-[#122733] dark:text-slate-200 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#2A556A] dark:text-[#4A7C94]" />
                      {profile.city}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#D4ECE5]/60 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg text-[#144D37] dark:text-emerald-300 font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-[#144D37] dark:text-emerald-400" />
                      ₹{profile.budget.toLocaleString("en-IN")}/mo
                    </span>
                  </div>

                  <p className="text-[#64748B] dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                    {profile.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {profile.habits.map((h) => (
                      <span key={h} className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-300 text-xs rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
                  <button
                    onClick={() => toggleConnect(profile.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors min-h-[44px] cursor-pointer ${
                      isConnected
                        ? "bg-[#D4ECE5] text-[#144D37] border border-[#A4DFCA]"
                        : "bg-[#2A556A] text-white hover:bg-[#214557] shadow-sm shadow-[#2A556A]/20"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-[#1F634A]" /> Request Sent
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
                        ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50 text-red-500"
                        : "border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-red-200 hover:text-red-400"
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
