"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FloatingLanguageWidget() {
  const { currentLanguage, openLanguageModal } = useI18n();
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center select-none">
      <button
        type="button"
        id="floating-language-btn"
        onClick={openLanguageModal}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={t("nav.switchLanguage", "Change Language")}
        title={t("nav.switchLanguage", "Change Language")}
        className="group relative flex items-center gap-2 pl-3 pr-3.5 py-2.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl shadow-black/5 dark:shadow-black/30 hover:border-[#0F4C81] dark:hover:border-sky-500 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-gray-700 dark:text-slate-200"
      >
        <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 dark:bg-sky-500/20 text-[#0F4C81] dark:text-sky-300 flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12">
          <Globe className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center gap-1.5 font-medium text-xs">
          <span className="font-semibold text-gray-900 dark:text-white leading-none">
            {currentLanguage.nativeName}
          </span>
          <span className="text-[10px] font-bold text-[#FF6B35] px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/60 uppercase leading-none">
            {currentLanguage.badge}
          </span>
        </div>
      </button>

      {/* Floating Tooltip */}
      {showTooltip && (
        <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-gray-900/90 dark:bg-slate-800/90 text-white text-xs whitespace-nowrap shadow-md backdrop-blur-xs animate-fade-in pointer-events-none">
          {t("nav.switchLanguage", "Change Language")} ({currentLanguage.name})
        </div>
      )}
    </div>
  );
}
