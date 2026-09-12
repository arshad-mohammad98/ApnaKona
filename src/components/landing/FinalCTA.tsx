"use client";

import Link from "next/link";
import { ArrowRight, Bot, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { openRoomie } from "@/lib/roomie";

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white transition-colors relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F09A57]/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Glass container seamlessly integrated into the continuous background */}
        <div className="bg-white/10 backdrop-blur-md text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-white/20 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Pill: Light text on translucent surface */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold bg-white/15 backdrop-blur-md text-white border border-white/25 mb-5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span style={{ color: "#FFFFFF" }}>Zero Brokerage • Transparent Housing</span>
            </div>

            {/* Main heading: Radiant light font on dark background */}
            <h2
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-xs"
              style={{ color: "#FFFFFF" }}
            >
              Don&apos;t just find a room. <br className="hidden sm:inline" />
              <span className="text-[#F09A57]" style={{ color: "#F09A57" }}>
                Find the right one.
              </span>
            </h2>

            {/* Supporting text: High contrast light font on dark background */}
            <p
              className="text-lg sm:text-xl text-white font-normal mb-8 leading-relaxed drop-shadow-2xs"
              style={{ color: "#FFFFFF" }}
            >
              Your budget. Your preferences. Your location. Your choice.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-8">
              <Link
                href="/hostels"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F09A57] hover:bg-[#e08945] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#F09A57]/30 hover:shadow-xl active:scale-[0.98] text-base sm:text-lg min-h-[50px]"
                style={{ color: "#FFFFFF" }}
              >
                <span>Find My Place</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <button
                type="button"
                onClick={() => openRoomie("Hi Roomie! Can you suggest the best student accommodations for my budget and preferred location?")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-md transition-all text-base sm:text-lg min-h-[50px] cursor-pointer"
                style={{ color: "#FFFFFF" }}
              >
                <Bot className="w-4 h-4 text-white" />
                <span>Ask Roomie</span>
                <Sparkles className="w-3.5 h-3.5 text-[#F09A57]" />
              </button>
            </div>

            {/* Trust checkmarks: Light text on dark background */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-white font-medium">
              <span className="flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Direct Owner Contact
              </span>
              <span className="flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Zero Brokerage Fees
              </span>
              <span className="flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Transparent Amenities
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
