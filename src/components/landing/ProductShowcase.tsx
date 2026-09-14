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
import { useLanguage } from "@/lib/context/LanguageContext";

const TAB_KEYS = [
  { id: "search", labelKey: "tab1", icon: Search },
  { id: "explore", labelKey: "tab2", icon: MapPin },
  { id: "roomie", labelKey: "tab3", icon: Bot },
  { id: "connect", labelKey: "tab4", icon: Users },
];

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<string>("search");
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white transition-colors relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Pure radiant white fonts */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold bg-white/15 backdrop-blur-md text-white border border-white/25 mb-3 shadow-xs">
            <span style={{ color: "#FFFFFF" }}>{t("showcase", "badge")}</span>
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-xs"
            style={{ color: "#FFFFFF" }}
          >
            {t("showcase", "title")}
          </h2>
          <p
            className="text-base sm:text-lg text-white font-normal drop-shadow-2xs"
            style={{ color: "#FFFFFF" }}
          >
            {t("showcase", "subtitle")}
          </p>
        </div>

        {/* Feature Selector Tabs: Pure White Font matching Sign Up Free button */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 sm:mb-10">
          {TAB_KEYS.map((tab) => {
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
                <span>{t("showcase", tab.labelKey)}</span>
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
                  {t("showcase", "searchLabel")}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5 mb-3" style={{ color: "#FFFFFF" }}>
                  {t("showcase", "searchTitle")}
                </h3>
                <p className="text-sm sm:text-base text-white leading-relaxed mb-6 font-normal" style={{ color: "#FFFFFF" }}>
                  {t("showcase", "searchDesc")}
                </p>

                <div className="space-y-2.5 mb-6 text-sm text-white font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{t("showcase", "searchFeature1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{t("showcase", "searchFeature2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{t("showcase", "searchFeature3")}</span>
                  </div>
                </div>

                <Link
                  href="/hostels"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F09A57] hover:bg-[#e08945] text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-[#F09A57]/30"
                  style={{ color: "#FFFFFF" }}
                >
                  <span>{t("showcase", "openFullSearch")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Visual Mockup Card */}
              <div className="lg:col-span-7 bg-white/10 rounded-2xl p-5 border border-white/15 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4 text-xs font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#F09A57]" />
                    <span>{t("showcase", "activeSearchFilter")}</span>
                  </div>
                  <span className="text-[11px] text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30 px-2 py-0.5 rounded-md font-semibold">
                    {t("showcase", "verifiedResults")}
                  </span>
                </div>

                {/* Filter tags simulation */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#F09A57] text-white rounded-lg text-xs font-semibold" style={{ color: "#FFFFFF" }}>
                    {t("showcase", "filterDoubleSharing")}
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-medium" style={{ color: "#FFFFFF" }}>
                    {t("showcase", "filterAcIncluded")}
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-medium" style={{ color: "#FFFFFF" }}>
                    {t("showcase", "filterMessFood")}
                  </span>
                  <span className="px-3 py-1 bg-white/15 text-white rounded-lg text-xs font-medium" style={{ color: "#FFFFFF" }}>
                    {t("showcase", "filterBudget")}
                  </span>
                </div>

                {/* Mini Result Preview */}
                <div className="bg-[#0D1824] rounded-xl p-4 border border-white/15 flex items-center justify-between gap-4 text-white">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                        {t("showcase", "mockListingName")}
                      </span>
                      <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] font-semibold px-2 py-0.2 rounded-full border border-[#10B981]/30">
                        {t("showcase", "mockVerified")}
                      </span>
                    </div>
                    <p className="text-[11px] text-white font-normal" style={{ color: "#FFFFFF" }}>
                      {t("showcase", "mockListingLocation")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white" style={{ color: "#FFFFFF" }}>₹11,500<span className="text-[10px] text-white font-medium" style={{ color: "#FFFFFF" }}>{t("showcase", "perMonth")}</span></p>
                    <span className="text-[10px] font-semibold text-[#10B981]">{t("showcase", "zeroBrokerage")}</span>
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
                  {t("showcase", "exploreLabel")}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5 mb-3" style={{ color: "#FFFFFF" }}>
                  {t("showcase", "exploreTitle")}
                </h3>
                <p className="text-sm sm:text-base text-white leading-relaxed mb-6 font-normal" style={{ color: "#FFFFFF" }}>
                  {t("showcase", "exploreDesc")}
                </p>

                <div className="space-y-2.5 mb-6 text-sm text-white font-medium">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-sky-300 shrink-0" />
                    <span>{t("showcase", "exploreFeature1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{t("showcase", "exploreFeature2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F09A57] shrink-0" />
                    <span>{t("showcase", "exploreFeature3")}</span>
                  </div>
                </div>

                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F09A57] hover:bg-[#e08945] text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-[#F09A57]/30"
                  style={{ color: "#FFFFFF" }}
                >
                  <span>{t("showcase", "exploreTransitMap")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Transit Map Preview Card */}
              <div className="lg:col-span-7 bg-white/10 rounded-2xl p-5 border border-white/15 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4 text-xs font-semibold text-white">
                  <span>{t("showcase", "transitInsights")}</span>
                  <span className="text-[11px] text-white bg-white/20 px-2 py-0.5 rounded-md font-semibold" style={{ color: "#FFFFFF" }}>
                    {t("showcase", "campusRadius")}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#0D1824] p-3 rounded-xl border border-white/15 text-center">
                    <Train className="w-5 h-5 text-sky-300 mx-auto mb-1" />
                    <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>{t("showcase", "metroStation")}</p>
                    <p className="text-[10px] text-white font-normal" style={{ color: "#FFFFFF" }}>{t("showcase", "metroDistance")}</p>
                  </div>
                  <div className="bg-[#0D1824] p-3 rounded-xl border border-white/15 text-center">
                    <Bus className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
                    <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>{t("showcase", "busStand")}</p>
                    <p className="text-[10px] text-white font-normal" style={{ color: "#FFFFFF" }}>{t("showcase", "busDistance")}</p>
                  </div>
                  <div className="bg-[#0D1824] p-3 rounded-xl border border-white/15 text-center">
                    <Footprints className="w-5 h-5 text-[#F09A57] mx-auto mb-1" />
                    <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>{t("showcase", "toCampus")}</p>
                    <p className="text-[10px] text-white font-normal" style={{ color: "#FFFFFF" }}>{t("showcase", "campusDistance")}</p>
                  </div>
                </div>

                <div className="bg-[#0D1824] rounded-xl p-3 border border-white/15 text-xs text-white">
                  <span className="font-bold text-[#F09A57]">{t("showcase", "neighborhoodHighlights")}</span>{t("showcase", "neighborhoodDesc")}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Roomie AI Assistant */}
          {activeTab === "roomie" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-sm font-mono font-bold text-[#F09A57] uppercase tracking-wider">
                  {t("showcase", "roomieLabel")}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5 mb-3" style={{ color: "#FFFFFF" }}>
                  {t("showcase", "roomieTitle")}
                </h3>
                <p className="text-sm sm:text-base text-white leading-relaxed mb-6 font-normal" style={{ color: "#FFFFFF" }}>
                  {t("showcase", "roomieDesc")}
                </p>

                <div className="space-y-2.5 mb-6 text-sm text-white font-medium">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F09A57] shrink-0" />
                    <span>{t("showcase", "roomieFeature1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F09A57] shrink-0" />
                    <span>{t("showcase", "roomieFeature2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F09A57] shrink-0" />
                    <span>{t("showcase", "roomieFeature3")}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openRoomie(t("showcase", "roomieDefaultPrompt"))}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F09A57] hover:bg-[#e08945] text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-[#F09A57]/30 cursor-pointer"
                  style={{ color: "#FFFFFF" }}
                >
                  <Bot className="w-4 h-4 text-white" />
                  <span>{t("showcase", "chatWithRoomieAI")}</span>
                </button>
              </div>

              {/* Chat Simulation Preview Card */}
              <div className="lg:col-span-7 bg-white/10 rounded-2xl p-5 border border-white/15 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4 text-xs font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#F09A57]" />
                    <span>{t("showcase", "roomieConversation")}</span>
                  </div>
                  <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] font-semibold px-2 py-0.5 rounded-full border border-[#10B981]/30">
                    {t("showcase", "online")}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Student message */}
                  <div className="flex justify-end">
                    <div className="bg-[#F09A57] text-white p-3 rounded-2xl rounded-tr-xs max-w-[85%] font-medium" style={{ color: "#FFFFFF" }}>
                      &quot;{t("showcase", "chatStudentMsg")}&quot;
                    </div>
                  </div>

                  {/* Roomie reply */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#0D1824] border border-white/15 p-3 rounded-2xl rounded-tl-xs max-w-[90%] text-white leading-relaxed" style={{ color: "#FFFFFF" }}>
                      &quot;{t("showcase", "chatRoomieMsg")}&quot;
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
                  {t("showcase", "connectLabel")}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5 mb-3" style={{ color: "#FFFFFF" }}>
                  {t("showcase", "connectTitle")}
                </h3>
                <p className="text-sm sm:text-base text-white leading-relaxed mb-6 font-normal" style={{ color: "#FFFFFF" }}>
                  {t("showcase", "connectDesc")}
                </p>

                <div className="space-y-2.5 mb-6 text-sm text-white font-medium">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-300 shrink-0" />
                    <span>{t("showcase", "connectFeature1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{t("showcase", "connectFeature2")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/connect"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F09A57] hover:bg-[#e08945] text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-[#F09A57]/30"
                    style={{ color: "#FFFFFF" }}
                  >
                    <span>{t("showcase", "roommateConnect")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/grievance"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-sm sm:text-base font-semibold rounded-xl border border-white/25 transition-all"
                    style={{ color: "#FFFFFF" }}
                  >
                    <span>{t("showcase", "grievancePortal")}</span>
                  </Link>
                </div>
              </div>

              {/* Community Connect Preview Card */}
              <div className="lg:col-span-7 bg-white/10 rounded-2xl p-5 border border-white/15 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4 text-xs font-semibold text-white">
                  <span>{t("showcase", "communityBoard")}</span>
                  <span className="text-[11px] text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30 px-2 py-0.5 rounded-md font-semibold">
                    {t("showcase", "liveFeed")}
                  </span>
                </div>

                <div className="bg-[#0D1824] rounded-xl p-4 border border-white/15 mb-3 flex items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center">
                      AK
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                        {t("showcase", "post1User")}
                      </p>
                      <p className="text-[11px] text-white font-normal" style={{ color: "#FFFFFF" }}>
                        {t("showcase", "post1Desc")}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-white font-semibold bg-white/20 px-2.5 py-1 rounded-lg" style={{ color: "#FFFFFF" }}>
                    {t("showcase", "connectButton")}
                  </span>
                </div>

                <div className="bg-[#0D1824] rounded-xl p-4 border border-white/15 flex items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#10B981]/20 text-[#10B981] font-bold text-xs flex items-center justify-center border border-[#10B981]/30">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white" style={{ color: "#FFFFFF" }}>
                        {t("showcase", "ticketTitle")}
                      </p>
                      <p className="text-[11px] text-white font-normal" style={{ color: "#FFFFFF" }}>
                        {t("showcase", "ticketDesc")}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#10B981] font-semibold bg-[#10B981]/20 border border-[#10B981]/30 px-2.5 py-1 rounded-lg">
                    {t("showcase", "resolved")}
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
