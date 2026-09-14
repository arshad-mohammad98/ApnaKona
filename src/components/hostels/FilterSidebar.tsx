"use client";

import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";

export interface FilterState {
  city: string;
  roomType: string;
  sharingType: string;
  gender: string;
  furnishingStatus: string;
  maxPrice: number;
  acOnly: boolean;
  messIncluded: boolean;
  tiffinService: boolean;
  noCurfew: boolean;
  visitorAllowed: boolean;
  amenities: string[];
}

export const INITIAL_FILTERS: FilterState = {
  city: "",
  roomType: "",
  sharingType: "",
  gender: "",
  furnishingStatus: "",
  maxPrice: 25000,
  acOnly: false,
  messIncluded: false,
  tiffinService: false,
  noCurfew: false,
  visitorAllowed: false,
  amenities: [],
};

const AMENITIES_LIST = [
  "WiFi",
  "Laundry",
  "Power Backup",
  "Parking",
  "CCTV",
  "Security",
  "Elevator",
];

interface FilterSidebarProps {
  filters: FilterState;
  onChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset?: () => void;
  className?: string;
}

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  className = "",
}: FilterSidebarProps) {
  const { t } = useLanguage();
  const isFiltered =
    filters.city ||
    filters.roomType ||
    filters.sharingType ||
    filters.gender ||
    filters.furnishingStatus ||
    filters.maxPrice < 25000 ||
    filters.acOnly ||
    filters.messIncluded ||
    filters.tiffinService ||
    filters.noCurfew ||
    filters.visitorAllowed ||
    filters.amenities.length > 0;

  return (
    <div className={`bg-white dark:bg-slate-800/90 rounded-3xl shadow-card border border-gray-100 dark:border-slate-700/80 p-5 space-y-6 ${className}`}>
      {/* Header / Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700/60">
        <span className="font-display font-semibold text-sm text-gray-900 dark:text-white">{t("filterSidebar", "filters")}</span>
        {isFiltered && onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#FF6B35] hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t("filterSidebar", "resetAll")}
          </button>
        )}
      </div>

      {/* Room Type */}
      <div>
        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
          {t("filterSidebar", "accommodationType")}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "PG", labelKey: "pg" },
            { key: "Hostel", labelKey: "hostel" },
            { key: "Flat", labelKey: "flat" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onChange("roomType", filters.roomType === item.key ? "" : item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${filters.roomType === item.key
                  ? "bg-[#2A556A] dark:bg-sky-600 text-white border-[#2A556A] dark:border-sky-600 shadow-xs"
                  : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:border-[#2A556A]/50 dark:hover:border-sky-400/50 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
            >
              {t("filterSidebar", item.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Sharing Type */}
      <div>
        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
          {t("filterSidebar", "sharingType")}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "Single", labelKey: "single" },
            { key: "Double", labelKey: "double" },
            { key: "Triple", labelKey: "triple" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onChange("sharingType", filters.sharingType === item.key ? "" : item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${filters.sharingType === item.key
                  ? "bg-[#2A556A] dark:bg-sky-600 text-white border-[#2A556A] dark:border-sky-600 shadow-xs"
                  : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:border-[#2A556A]/50 dark:hover:border-sky-400/50 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
            >
              {t("filterSidebar", item.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Preference */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          {t("filterSidebar", "genderPreference")}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "Boys", labelKey: "boys" },
            { key: "Girls", labelKey: "girls" },
            { key: "Co-Ed", labelKey: "coed" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onChange("gender", filters.gender === item.key ? "" : item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${filters.gender === item.key
                  ? "bg-[#2A556A] text-white border-[#2A556A] shadow-xs"
                  : "border-gray-200 text-gray-700 bg-white hover:border-[#2A556A]/50 hover:bg-gray-50"
                }`}
            >
              {t("filterSidebar", item.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t("filterSidebar", "maxMonthlyBudget")}</p>
          <span className="text-xs font-bold text-[#2A556A] dark:text-sky-400">
            ₹{filters.maxPrice.toLocaleString("en-IN")}/mo
          </span>
        </div>
        <input
          type="range"
          min={3000}
          max={30000}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => onChange("maxPrice", Number(e.target.value))}
          className="w-full accent-[#2A556A] dark:accent-sky-400 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 dark:text-slate-500 mt-1.5 font-medium">
          <span>₹3,000</span>
          <span>₹30,000</span>
        </div>
      </div>

      {/* Furnishing Status */}
      <div>
        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
          {t("filterSidebar", "furnishingStatus")}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "Fully Furnished", labelKey: "fullyFurnished" },
            { key: "Semi Furnished", labelKey: "semiFurnished" },
            { key: "Unfurnished", labelKey: "unfurnished" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onChange("furnishingStatus", filters.furnishingStatus === item.key ? "" : item.key)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${filters.furnishingStatus === item.key
                  ? "bg-[#2A556A] dark:bg-sky-600 text-white border-[#2A556A] dark:border-sky-600 shadow-xs"
                  : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:border-[#2A556A]/50 dark:hover:border-sky-400/50 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
            >
              {t("filterSidebar", item.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* AC Toggle */}
      <div className="flex items-center justify-between py-1">
        <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-slate-200">{t("filterSidebar", "acOnly")}</p>
        <button
          type="button"
          onClick={() => onChange("acOnly", !filters.acOnly)}
          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${filters.acOnly ? "bg-[#2A556A] dark:bg-sky-500" : "bg-gray-200 dark:bg-slate-700"
            }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${filters.acOnly ? "translate-x-5" : ""
              }`}
          />
        </button>
      </div>

      {/* Food Policies (Mess & Tiffin) */}
      <div className="space-y-2.5 pt-1 border-t border-gray-100 dark:border-slate-700/60">
        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t("filterSidebar", "essentialInclusions")}</p>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.messIncluded}
            onChange={(e) => onChange("messIncluded", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 accent-[#2A556A] dark:accent-sky-400 cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-gray-700 dark:text-slate-200 font-medium">{t("filterSidebar", "messIncluded")}</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.tiffinService}
            onChange={(e) => onChange("tiffinService", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 accent-[#2A556A] dark:accent-sky-400 cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-gray-700 dark:text-slate-200 font-medium">{t("filterSidebar", "tiffinService")}</span>
        </label>
      </div>

      {/* Rules & Policies (Curfew & Visitors) */}
      <div className="space-y-2.5 pt-1 border-t border-gray-100 dark:border-slate-700/60">
        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t("filterSidebar", "essentialInclusions")}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-700 dark:text-slate-200 font-medium">{t("filterSidebar", "noCurfew")}</span>
          <button
            type="button"
            onClick={() => onChange("noCurfew", !filters.noCurfew)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${filters.noCurfew ? "bg-[#2A556A] dark:bg-sky-500" : "bg-gray-200 dark:bg-slate-700"
              }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${filters.noCurfew ? "translate-x-5" : ""
                }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-700">{t("filterSidebar", "visitorAllowed")}</span>
          <button
            type="button"
            onClick={() => onChange("visitorAllowed", !filters.visitorAllowed)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${filters.visitorAllowed ? "bg-[#2A556A]" : "bg-gray-200"
              }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${filters.visitorAllowed ? "translate-x-5" : ""
                }`}
            />
          </button>
        </div>
      </div>

      {/* Amenities */}
      <div className="pt-1 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          {t("filterSidebar", "amenities")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES_LIST.map((a) => {
            const checked = filters.amenities.includes(a);
            return (
              <label key={a} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange("amenities", [...filters.amenities, a]);
                    } else {
                      onChange("amenities", filters.amenities.filter((x) => x !== a));
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 accent-[#2A556A] cursor-pointer"
                />
                <span className="text-xs text-gray-700">{a}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
