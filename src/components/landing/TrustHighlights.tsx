import { ShieldCheck, FileCheck, CheckCircle2, UserCheck } from "lucide-react";

const TRUST_CARDS = [
  {
    icon: FileCheck,
    title: "Real Information",
    description: "Clear information about rent, amenities, rules and property details.",
    badge: "Direct Data",
    accent: "text-white bg-white/20 border border-white/30",
  },
  {
    icon: ShieldCheck,
    title: "Verified Information",
    description: "Important property information is checked and presented transparently.",
    badge: "Verified Badge",
    accent: "text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30",
  },
  {
    icon: CheckCircle2,
    title: "Transparent Details",
    description: "See pricing, sharing, facilities, policies and location information clearly before making a decision.",
    badge: "Zero Hidden Fees",
    accent: "text-white bg-white/20 border border-white/30",
  },
  {
    icon: UserCheck,
    title: "User-First Discovery",
    description: "Find accommodation based on your own requirements instead of browsing irrelevant listings.",
    badge: "Personalized",
    accent: "text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30",
  },
];

export default function TrustHighlights() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white transition-colors relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Radiant white fonts */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold bg-white/15 backdrop-blur-md text-white border border-white/25 mb-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span style={{ color: "#FFFFFF" }}>Trust &amp; Transparency</span>
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-xs"
            style={{ color: "#FFFFFF" }}
          >
            Why trust ApnaKona?
          </h2>
          <p
            className="text-base sm:text-lg text-white font-normal drop-shadow-2xs"
            style={{ color: "#FFFFFF" }}
          >
            Finding a place to live starts with trustworthy information.
          </p>
        </div>

        {/* 4 Trust Cards Grid: Radiant white font style like in the Sign Up Free button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {TRUST_CARDS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative bg-[#131F2E]/90 hover:bg-[#182638] p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between text-left backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-white bg-white/15 border border-white/25 px-2.5 py-0.5 rounded-full" style={{ color: "#FFFFFF" }}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title: Pure Radiant White (matching Sign Up Free text) */}
                  <h3
                    className="font-display text-lg font-bold text-white mb-2"
                    style={{ color: "#FFFFFF" }}
                  >
                    {item.title}
                  </h3>

                  {/* Description: Pure Radiant White so it NEVER gets sabotaged */}
                  <p
                    className="text-sm sm:text-base text-white leading-relaxed font-normal"
                    style={{ color: "#FFFFFF" }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Bottom line: Radiant White & Mint */}
                <div className="mt-5 pt-4 border-t border-white/15 flex items-center gap-1.5 text-xs font-medium" style={{ color: "#FFFFFF" }}>
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span style={{ color: "#FFFFFF" }}>Platform Guaranteed Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
