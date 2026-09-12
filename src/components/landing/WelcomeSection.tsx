"use client";

import Link from "next/link";
import { Home, SlidersHorizontal, MapPin, Bot, Users2, ArrowRight } from "lucide-react";
import { openRoomie } from "@/lib/roomie";

const BENEFITS = [
  {
    icon: Home,
    title: "Find the right accommodation",
    description: "PGs, hostels and shared flats in one place.",
    href: "/hostels",
    badge: "Browse All",
    isAction: false,
    color: "bg-white/15 text-white border border-white/25",
  },
  {
    icon: SlidersHorizontal,
    title: "Search your way",
    description: "Filter according to budget, sharing, amenities, food, gender and other preferences.",
    href: "/hostels",
    badge: "Smart Filters",
    isAction: false,
    color: "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30",
  },
  {
    icon: MapPin,
    title: "Understand your surroundings",
    description: "Explore location, commute and nearby essentials.",
    href: "/explore",
    badge: "Interactive Map",
    isAction: false,
    color: "bg-white/15 text-white border border-white/25",
  },
  {
    icon: Bot,
    title: "Ask Roomie",
    description: "Tell our AI assistant what you need and get help finding suitable options.",
    href: "#",
    badge: "AI Assistant",
    isAction: true,
    action: () => openRoomie("Hello Roomie! Help me explore accommodation that fits my college location and budget."),
    color: "bg-[#F09A57]/20 text-[#F09A57] border border-[#F09A57]/30",
  },
  {
    icon: Users2,
    title: "Connect",
    description: "Connect with relevant people and accommodation providers through the platform.",
    href: "/connect",
    badge: "Community",
    isAction: false,
    color: "bg-white/15 text-white border border-white/25",
  },
];

export default function WelcomeSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white transition-colors relative overflow-hidden">
      {/* Ambient background accent */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Pure White */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full text-sm font-semibold bg-white/15 backdrop-blur-md text-white border border-white/25 mb-3 shadow-xs">
            <span style={{ color: "#FFFFFF" }}>Welcome to ApnaKona</span>
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-xs"
            style={{ color: "#FFFFFF" }}
          >
            Welcome to ApnaKona.
          </h2>
          <p
            className="text-base sm:text-lg text-white font-normal leading-relaxed drop-shadow-2xs"
            style={{ color: "#FFFFFF" }}
          >
            A new city shouldn&apos;t feel unfamiliar. Whether you&apos;re moving for college, work or a fresh start, ApnaKona helps you find a place that feels right for you.
          </p>
        </div>

        {/* 5 Benefits Cards Grid: Radiant Pure White Fonts matching Sign Up Free block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            if (item.isAction) {
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={item.action}
                  className="text-left group relative bg-[#131F2E]/90 hover:bg-[#182638] p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between cursor-pointer text-white backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F09A57]/20 text-[#F09A57] border border-[#F09A57]/30">
                        {item.badge}
                      </span>
                    </div>

                    <h3
                      className="font-display text-lg font-bold text-white mb-2 group-hover:text-[#F09A57] transition-colors"
                      style={{ color: "#FFFFFF" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm sm:text-base text-white leading-relaxed font-normal"
                      style={{ color: "#FFFFFF" }}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/15 flex items-center gap-1 text-sm font-bold text-[#F09A57] group-hover:translate-x-0.5 transition-transform">
                    <span>Chat with Roomie</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative bg-[#131F2E]/90 hover:bg-[#182638] p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between text-white backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/25" style={{ color: "#FFFFFF" }}>
                      {item.badge}
                    </span>
                  </div>

                  <h3
                    className="font-display text-lg font-bold text-white mb-2 group-hover:text-[#F09A57] transition-colors"
                    style={{ color: "#FFFFFF" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm sm:text-base text-white leading-relaxed font-normal"
                    style={{ color: "#FFFFFF" }}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/15 flex items-center gap-1 text-sm font-bold text-white group-hover:text-[#F09A57] group-hover:translate-x-0.5 transition-all" style={{ color: "#FFFFFF" }}>
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
