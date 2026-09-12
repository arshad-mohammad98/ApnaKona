"use client";

import React, { useEffect } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Globe, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LanguageSelectorModal() {
  const { currentLanguage, languages, changeLanguage, isModalOpen, closeLanguageModal } = useI18n();
  const { t } = useTranslation();

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeLanguageModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeLanguageModal]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeLanguageModal}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden transform transition-all animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C81]/10 dark:bg-sky-500/20 text-[#0F4C81] dark:text-sky-300 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 id="language-modal-title" className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {t("langModal.title", "Select Language")}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {t("langModal.subtitle", "Translate the ApnaKona platform into your preferred language")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLanguageModal}
            aria-label="Close language selector"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Languages Grid */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {languages.map((lang) => {
              const isSelected = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    changeLanguage(lang.code);
                    closeLanguageModal();
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl text-left border transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-[#0F4C81]/8 dark:bg-sky-500/15 border-[#0F4C81] dark:border-sky-500 ring-2 ring-[#0F4C81]/20 dark:ring-sky-500/30"
                      : "bg-gray-50/70 dark:bg-slate-800/60 border-gray-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 hover:border-[#0F4C81]/40 dark:hover:border-sky-500/50 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`font-semibold text-sm leading-tight truncate ${
                          isSelected
                            ? "text-[#0F4C81] dark:text-sky-300"
                            : "text-gray-900 dark:text-slate-100 group-hover:text-[#0F4C81] dark:group-hover:text-sky-300"
                        }`}
                      >
                        {lang.nativeName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                        {lang.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        isSelected
                          ? "bg-[#0F4C81] text-white dark:bg-sky-500 dark:text-slate-900"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300"
                      }`}
                    >
                      {lang.badge}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#0F4C81] dark:bg-sky-500 text-white dark:text-slate-900 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-gray-50/80 dark:bg-slate-800/40 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
          <span>{t("hero.badge", "India's #1 Student Accommodation Platform")}</span>
          <span className="font-semibold text-[#FF6B35]">7 Languages Supported</span>
        </div>
      </div>
    </div>
  );
}
