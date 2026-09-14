"use client";

import { ClipboardList, SearchCheck, BadgeCheck, Eye } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";

const STEP_KEYS = [
  { step: "01", titleKey: "step1Title", descKey: "step1Desc", icon: ClipboardList, pillKey: "step1Pill" },
  { step: "02", titleKey: "step2Title", descKey: "step2Desc", icon: SearchCheck, pillKey: "step2Pill" },
  { step: "03", titleKey: "step3Title", descKey: "step3Desc", icon: BadgeCheck, pillKey: "step3Pill" },
  { step: "04", titleKey: "step4Title", descKey: "step4Desc", icon: Eye, pillKey: "step4Pill" },
];

export default function TrustProcess() {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white transition-colors relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Pure White */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold bg-white/15 backdrop-blur-md text-white border border-white/25 mb-3 shadow-xs">
            <span style={{ color: "#FFFFFF" }}>{t("process", "badge")}</span>
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-xs"
            style={{ color: "#FFFFFF" }}
          >
            {t("process", "title")}
          </h2>
          <p
            className="text-base sm:text-lg text-white font-normal drop-shadow-2xs"
            style={{ color: "#FFFFFF" }}
          >
            {t("process", "subtitle")}
          </p>
        </div>

        {/* 4-Step Process: Horizontal on Desktop, Vertical on Mobile */}
        <div className="relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-white/25 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {STEP_KEYS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col items-start lg:items-center text-left lg:text-center p-6 bg-[#131F2E]/90 hover:bg-[#182638] rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all text-white backdrop-blur-md"
                >
                  {/* Step Icon Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-white/15 border-2 border-white/25 shadow-sm flex items-center justify-center text-white mb-4 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Step Number */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-md" style={{ color: "#FFFFFF" }}>
                      STEP {item.step}
                    </span>
                    <span className="text-xs font-medium text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30 px-2.5 py-0.5 rounded-full">
                      {t("process", item.pillKey)}
                    </span>
                  </div>

                  {/* Title: Pure Radiant White */}
                  <h3
                    className="font-display text-lg font-bold text-white mb-2"
                    style={{ color: "#FFFFFF" }}
                  >
                    {t("process", item.titleKey)}
                  </h3>

                  {/* Description: Pure Radiant White */}
                  <p
                    className="text-sm sm:text-base text-white leading-relaxed font-normal"
                    style={{ color: "#FFFFFF" }}
                  >
                    {t("process", item.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
