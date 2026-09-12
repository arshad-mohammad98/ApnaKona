"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Bot,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Bus,
  Train,
  Footprints,
  SlidersHorizontal,
} from "lucide-react";
import { openRoomie } from "@/lib/roomie";

const TABS = [
  { id: "search", label: "Personalized Search", icon: Search },
  { id: "explore", label: "Explore & Commute", icon: MapPin },
  { id: "roomie", label: "Roomie AI Assistant", icon: Bot },
  { id: "connect", label: "Connect & Support", icon: Users },
];

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<string>("search");

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white transition-colors relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Pure radiant white fonts */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold bg-white/15 backdrop-blur-md text-white border border-white/25 mb-3 shadow-xs">
            <span style={{ color: "#FFFFFF" }}>Interactive Product Features</span>
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-xs"
            style={{ color: "#FFFFFF" }}
          >
            More than just a room.
          </h2>
          <p
            className="text-base sm:text-lg text-white font-normal drop-shadow-2xs"
            style={{ color: "#FFFFFF" }}
          >
            ApnaKona integrates search, neighborhood insights, smart AI guidance, and community connection in one unified platform.
          </p>
        </div>

        {/* Feature Selector Tabs: Pure White Font matching Sign Up Free button */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 sm:mb-10">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#F09A57] text-white shadow-lg shadow-[#F09A57]/30 border border-[#F09A57]"
                    : "bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md"
                }`}
                style={{ color: "#FFFFFF" }}
              >
                <Icon className="w-4 h-4 text-white" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product UI Previews Card Container: Pure White Text on Dark Backdrop */}
        <div className="bg-[#131F2E]/95 rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 shadow-2xl backdrop-blur-md text-white">
          {/* TAB 1: Personalized Search Preview */}
          {activeTab === "search" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-sm font-mono font-bold text-[#F09A57] uppercase tracking-wider">
                  Real-time Filters
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5 mb-3" style={{ color: "#FFFFFF" }}>
                  Find accommodation tailored to your everyday student lifestyle.
                </h3>
                <p className="text-sm sm:text-base text-white leading-relaxed mb-6 font-normal" style={{ color: "#FFFFFF" }}>
                  Set sharing preferences, verify AC and meal facilities, filter by campus distance, and specify exact budget brackets with zero agent pressure.
                </p>

                <div className="space-y-2.5 mb-6 text-sm text-white font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Single, Double, Triple sharing filters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Food mess &amp; AC facility verification tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Transparent rent with zero broker commissions</span>
                  </div>
                </div>

                <Link
                  href="/hostels"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F09A57] hover:bg-[#e08945] text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-[#F09A57]/30"
                  style={{ color: "#FFFFFF" }}
                >
                  <span>Open Full Search</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Visual Mockup Card */}
              <div className="lg:col-span-7 bg-white/10 rounded-2xl p-5 border border-white/15 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4 text-xs font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#F09A57]" />
                    <span>Active Search Filter UI</span>
                  </div>
                  <span className="text-[11px] text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30 px-2 py-0.5 rounded-md font-semibold">
                    12 Verified Results
                  </span>
                </div>

                {/* Filter tags simulation */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#F09A57] text-white rounded-lg text-xs font-semibold" style={{ color: "#FFFFFF" }}>
                    Double Sharing ✓
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-medium" style={{ color: "#FFFFFF" }}>
                    AC Included ✓
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-medium" style={{ color: "#FFFFFF" }}>
                    Mess Food Included ✓
                  </span>
                  <span className="px-3 py-1 bg-white/15 text-white rounded-lg text-xs font-medium" style={{ color: "#FFFFFF" }}>
                    Budget: &lt; ₹14,000/mo
                  </span>
                </div>

                {/* Mini Result Preview */}
                <div className="bg-[#0D1824] rounded-xl p-4 border border-white/15 flex items-center justify-between gap-4 text-white">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                        Greenfield Luxury Student Living
                      </span>
                      <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] font-semibold px-2 py-0.2 rounded-full border border-[#10B981]/30">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-white font-normal" style={{ color: "#FFFFFF" }}>
                      Koramangala, Bangalore • 800m from St. Joseph&apos;s
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white" style={{ color: "#FFFFFF" }}>₹11,500<span className="text-[10px] text-white font-medium" style={{ color: "#FFFFFF" }}>/mo</span></p>
                    <span className="text-[10px] font-semibold text-[#10B981]">0 Brokerage</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Explore & Commute Preview */}
          {activeTab === "explore" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-sm font-mono font-bold text-[#F09A57] uppercase tracking-wider">
                  Explore Mode
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5 mb-3" style={{ color: "#FFFFFF" }}>
                  Know your neighborhood and commute before you move.
                </h3>
                <p className="text-sm sm:text-base text-white leading-relaxed mb-6 font-normal" style={{ color: "#FFFFFF" }}>
                  Browse transit hubs, metro stops, college distances, and nearby amenities directly on an interactive student map.
                </p>

                <div className="space-y-2.5 mb-6 text-sm text-white font-medium">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-sky-300 shrink-0" />
                    <span>Live metro and bus station proximities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Safe walkable route indicators to campus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F09A57] shrink-0" />
                    <span>Libraries, grocery markets &amp; healthcare spots</span>
                  </div>
                </div>

                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F09A57] hover:bg-[#e08945] text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-[#F09A57]/30"
                  style={{ color: "#FFFFFF" }}
                >
                  <span>Explore Transit Map</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Transit Map Preview Card */}
              <div className="lg:col-span-7 bg-white/10 rounded-2xl p-5 border border-white/15 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4 text-xs font-semibold text-white">
                  <span>Transit &amp; Commute Insights</span>
                  <span className="text-[11px] text-white bg-white/20 px-2 py-0.5 rounded-md font-semibold" style={{ color: "#FFFFFF" }}>
                    Campus Radius: 2 km
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#0D1824] p-3 rounded-xl border border-white/15 text-center">
                    <Train className="w-5 h-5 text-sky-300 mx-auto mb-1" />
                    <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>Metro Station</p>
                    <p className="text-[10px] text-white font-normal" style={{ color: "#FFFFFF" }}>450m • 5 min walk</p>
                  </div>
                  <div className="bg-[#0D1824] p-3 rounded-xl border border-white/15 text-center">
                    <Bus className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
                    <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>Bus Stand</p>
                    <p className="text-[10px] text-white font-normal" style={{ color: "#FFFFFF" }}>200m • 2 min walk</p>
                  </div>
                  <div className="bg-[#0D1824] p-3 rounded-xl border border-white/15 text-center">
                    <Footprints className="w-5 h-5 text-[#F09A57] mx-auto mb-1" />
                    <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>To Campus</p>
                    <p className="text-[10px] text-white font-normal" style={{ color: "#FFFFFF" }}>850m • 10 min walk</p>
                  </div>
                </div>

                <div className="bg-[#0D1824] rounded-xl p-3 border border-white/15 text-xs text-white">
                  <span className="font-bold text-[#F09A57]">Neighborhood Highlights:</span> 24x7 Pharmacy (150m), Student Study Library (400m), Safe well-lit street.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Roomie AI Assistant */}
          {activeTab === "roomie" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-sm font-mono font-bold text-[#F09A57] uppercase tracking-wider">
                  AI Housing Companion
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5 mb-3" style={{ color: "#FFFFFF" }}>
                  Ask Roomie anything about your upcoming stay.
                </h3>
                <p className="text-sm sm:text-base text-white leading-relaxed mb-6 font-normal" style={{ color: "#FFFFFF" }}>
                  Need help negotiating house rules, understanding security deposits, or finding PGs with vegan food? Roomie guides you 24/7.
                </p>

                <div className="space-y-2.5 mb-6 text-sm text-white font-medium">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F09A57] shrink-0" />
                    <span>Instant budget and locality recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F09A57] shrink-0" />
                    <span>Student checklist for lease and deposit safety</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F09A57] shrink-0" />
                    <span>Tailored advice for first-time college movers</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openRoomie("Hi Roomie! What should I keep in mind before paying a PG security deposit?")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F09A57] hover:bg-[#e08945] text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-[#F09A57]/30 cursor-pointer"
                  style={{ color: "#FFFFFF" }}
                >
                  <Bot className="w-4 h-4 text-white" />
                  <span>Chat with Roomie AI</span>
                </button>
              </div>

              {/* Chat Simulation Preview Card */}
              <div className="lg:col-span-7 bg-white/10 rounded-2xl p-5 border border-white/15 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4 text-xs font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#F09A57]" />
                    <span>Roomie AI Live Conversation</span>
                  </div>
                  <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] font-semibold px-2 py-0.5 rounded-full border border-[#10B981]/30">
                    Online
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Student message */}
                  <div className="flex justify-end">
                    <div className="bg-[#F09A57] text-white p-3 rounded-2xl rounded-tr-xs max-w-[85%] font-medium" style={{ color: "#FFFFFF" }}>
                      "I need a double-sharing PG near Indiranagar under ₹13,000 with good Wi-Fi."
                    </div>
                  </div>

                  {/* Roomie reply */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#0D1824] border border-white/15 p-3 rounded-2xl rounded-tl-xs max-w-[90%] text-white leading-relaxed" style={{ color: "#FFFFFF" }}>
                      "I found 3 verified PGs matching your criteria! One is 600m from the metro with 100 Mbps fiber and zero security deposit disputes. Would you like me to filter by attached washroom?"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Connect & Support */}
          {activeTab === "connect" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-sm font-mono font-bold text-[#10B981] uppercase tracking-wider">
                  Community &amp; Resolution
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5 mb-3" style={{ color: "#FFFFFF" }}>
                  Find compatible flatmates and resolve issues peacefully.
                </h3>
                <p className="text-sm sm:text-base text-white leading-relaxed mb-6 font-normal" style={{ color: "#FFFFFF" }}>
                  Match with college batchmates seeking rooms together, and access ApnaKona&apos;s grievance resolution mechanism when you need landlord mediation.
                </p>

                <div className="space-y-2.5 mb-6 text-sm text-white font-medium">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-300 shrink-0" />
                    <span>Peer roommate matching by college and habits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Transparent grievance tracking &amp; dispute support</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/connect"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F09A57] hover:bg-[#e08945] text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-[#F09A57]/30"
                    style={{ color: "#FFFFFF" }}
                  >
                    <span>Roommate Connect</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/grievance"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-sm sm:text-base font-semibold rounded-xl border border-white/25 transition-all"
                    style={{ color: "#FFFFFF" }}
                  >
                    <span>Grievance Portal</span>
                  </Link>
                </div>
              </div>

              {/* Community Connect Preview Card */}
              <div className="lg:col-span-7 bg-white/10 rounded-2xl p-5 border border-white/15 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4 text-xs font-semibold text-white">
                  <span>Student Community Board</span>
                  <span className="text-[11px] text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30 px-2 py-0.5 rounded-md font-semibold">
                    Live Platform Feed
                  </span>
                </div>

                <div className="bg-[#0D1824] rounded-xl p-4 border border-white/15 mb-3 flex items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center">
                      AK
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                        Aarav (CS Sophomore)
                      </p>
                      <p className="text-[11px] text-white font-normal" style={{ color: "#FFFFFF" }}>
                        Looking for a 2BHK flatmate near Koramangala
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-white font-semibold bg-white/20 px-2.5 py-1 rounded-lg" style={{ color: "#FFFFFF" }}>
                    Connect
                  </span>
                </div>

                <div className="bg-[#0D1824] rounded-xl p-4 border border-white/15 flex items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#10B981]/20 text-[#10B981] font-bold text-xs flex items-center justify-center border border-[#10B981]/30">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                        Ticket #1042 Resolved
                      </p>
                      <p className="text-[11px] text-white font-normal" style={{ color: "#FFFFFF" }}>
                        Wi-Fi speed dispute reconciled within 18 hours
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#10B981] font-semibold bg-[#10B981]/20 border border-[#10B981]/30 px-2.5 py-1 rounded-lg">
                    Resolved
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
