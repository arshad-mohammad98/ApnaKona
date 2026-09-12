"use client";

import { useId } from "react";
import { RotateCcw, Calendar, Check, Info } from "lucide-react";

export interface FilterState {
  city: string;
  roomTypes: string[];
  sharingTypes: string[];
  gender: string;
  furnishingStatuses: string[];
  minPrice: number;
  maxPrice: number;
  acTypes: string[];
  moveInDate: string;
  messIncluded: boolean;
  tiffinService: boolean;
  noCurfew: boolean;
  visitorAllowed: boolean;
  amenities: string[];
  // Legacy aliases
  roomType?: string;
  sharingType?: string;
}

export const INITIAL_FILTERS: FilterState = {
  city: "",
  roomTypes: [],
  sharingTypes: [],
  gender: "",
  furnishingStatuses: [],
  minPrice: 3000,
  maxPrice: 30000,
  acTypes: [],
  moveInDate: "",
  messIncluded: false,
  tiffinService: false,
  noCurfew: false,
  visitorAllowed: false,
  amenities: [],
};

export interface FilterCounts {
  roomType: Record<string, number>;
  sharingType: Record<string, number>;
  gender: Record<string, number>;
  furnishingStatus: Record<string, number>;
  acTypes: Record<string, number>;
}

const AMENITIES_LIST = [
  "WiFi",
  "Laundry",
  "Power Backup",
  "Parking",
  "CCTV",
  "Security",
  "Elevator",
];

export function getAvailableSharingOptions(roomTypes: string[]): string[] {
  const options = new Set<string>();
  const hasPgOrHostel = roomTypes.includes("PG") || roomTypes.includes("Hostel");
  const hasFlat = roomTypes.includes("Flat");

  if (hasPgOrHostel) {
    options.add("2 Seater");
    options.add("3 Seater");
    options.add("4 Seater");
  }

  if (hasFlat) {
    options.add("2 BHK");
    options.add("3 BHK");
    options.add("4 BHK");
  }

  return Array.from(options);
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset?: () => void;
  counts?: FilterCounts;
  className?: string;
}

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  counts,
  className = "",
}: FilterSidebarProps) {
  const moveInInputId = useId();
  const isFiltered =
    Boolean(filters.city && filters.city !== "All") ||
    filters.roomTypes.length > 0 ||
    filters.sharingTypes.length > 0 ||
    Boolean(filters.gender) ||
    filters.furnishingStatuses.length > 0 ||
    filters.minPrice > 3000 ||
    filters.maxPrice < 30000 ||
    filters.acTypes.length > 0 ||
    Boolean(filters.moveInDate) ||
    filters.messIncluded ||
    filters.tiffinService ||
    filters.noCurfew ||
    filters.visitorAllowed ||
    filters.amenities.length > 0;

  // Toggle helper for array filters
  const toggleArrayItem = <K extends "roomTypes" | "sharingTypes" | "furnishingStatuses" | "acTypes" | "amenities">(
    key: K,
    item: string
  ) => {
    const list = filters[key] as string[];
    if (list.includes(item)) {
      const nextList = list.filter((x) => x !== item);
      onChange(key, nextList as FilterState[K]);
    } else {
      const nextList = [...list, item];
      onChange(key, nextList as FilterState[K]);
    }
  };

  const availableSharingOptions = getAvailableSharingOptions(filters.roomTypes);

  return (
    <div className={`bg-white rounded-3xl shadow-card border border-gray-100 p-5 space-y-6 ${className}`}>
      {/* Header / Clear All */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm text-gray-900">Filters</span>
          {isFiltered && (
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
          )}
        </div>
        {isFiltered && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-[#FF6B35] hover:text-[#e85a22] font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* 1. Accommodation Type (Multi-select) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Accommodation Type
          </p>
          {filters.roomTypes.length > 0 && (
            <span className="text-[10px] text-[#0F4C81] font-semibold">
              {filters.roomTypes.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["PG", "Hostel", "Flat"] as const).map((t) => {
            const isSelected = filters.roomTypes.includes(t);
            const count = counts?.roomType[t] ?? 0;
            return (
              <button
                type="button"
                key={t}
                onClick={() => toggleArrayItem("roomTypes", t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                  isSelected
                    ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                    : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/40 hover:bg-gray-50"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                <span>{t}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Dynamic Sharing Type */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Sharing Type
          </p>
          {filters.sharingTypes.length > 0 && (
            <span className="text-[10px] text-[#0F4C81] font-semibold">
              {filters.sharingTypes.length} selected
            </span>
          )}
        </div>

        {availableSharingOptions.length === 0 ? (
          <div className="p-3 bg-gray-50/80 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>Select accommodation type to see sharing options</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableSharingOptions.map((opt) => {
              const isSelected = filters.sharingTypes.includes(opt);
              const count = counts?.sharingType[opt] ?? 0;
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => toggleArrayItem("sharingTypes", opt)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                    isSelected
                      ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                      : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/40 hover:bg-gray-50"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                  <span>{opt}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Monthly Budget Range (Dual Range / Min & Max) */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Monthly Budget
          </p>
          <span className="text-xs font-bold text-[#0F4C81]">
            ₹{filters.minPrice.toLocaleString("en-IN")} – ₹{filters.maxPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Dual sliders */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[11px] text-gray-400 mb-1">
              <span>Min: ₹{filters.minPrice.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={3000}
              max={filters.maxPrice - 500}
              step={500}
              value={filters.minPrice}
              onChange={(e) => onChange("minPrice", Number(e.target.value))}
              className="w-full accent-[#0F4C81] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-gray-400 mb-1">
              <span>Max: ₹{filters.maxPrice.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={filters.minPrice + 500}
              max={30000}
              step={500}
              value={filters.maxPrice}
              onChange={(e) => onChange("maxPrice", Number(e.target.value))}
              className="w-full accent-[#0F4C81] cursor-pointer"
            />
          </div>
        </div>

        {/* Budget Quick Presets */}
        <div className="grid grid-cols-2 gap-1.5 mt-3">
          {[
            { label: "< ₹8,000", min: 3000, max: 8000 },
            { label: "₹8k – ₹14k", min: 8000, max: 14000 },
            { label: "₹14k – ₹20k", min: 14000, max: 20000 },
            { label: "All Budgets", min: 3000, max: 30000 },
          ].map((preset) => {
            const isSelected =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                type="button"
                key={preset.label}
                onClick={() => {
                  onChange("minPrice", preset.min);
                  onChange("maxPrice", preset.max);
                }}
                className={`py-1 px-2 text-[11px] rounded-lg border font-medium transition-colors cursor-pointer text-center ${
                  isSelected
                    ? "bg-[#0F4C81]/10 text-[#0F4C81] border-[#0F4C81]"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. AC / Non-AC */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Cooling / AC
        </p>
        <div className="flex flex-wrap gap-2">
          {(["AC", "Non-AC"] as const).map((ac) => {
            const isSelected = filters.acTypes.includes(ac);
            const count = counts?.acTypes[ac] ?? 0;
            return (
              <button
                type="button"
                key={ac}
                onClick={() => toggleArrayItem("acTypes", ac)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                  isSelected
                    ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                    : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/40 hover:bg-gray-50"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                <span>{ac}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Move-in Date Picker */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor={moveInInputId} className="text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
            Move-in Date
          </label>
          {filters.moveInDate && (
            <button
              type="button"
              onClick={() => onChange("moveInDate", "")}
              className="text-[11px] text-[#FF6B35] hover:underline cursor-pointer"
            >
              Clear date
            </button>
          )}
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            id={moveInInputId}
            type="date"
            value={filters.moveInDate}
            onChange={(e) => onChange("moveInDate", e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] bg-white cursor-pointer"
          />
        </div>
      </div>

      {/* 6. Furnishing */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Furnishing
        </p>
        <div className="flex flex-wrap gap-2">
          {(["Fully Furnished", "Semi Furnished", "Unfurnished"] as const).map((f) => {
            const isSelected = filters.furnishingStatuses.includes(f);
            const count = counts?.furnishingStatus[f] ?? 0;
            return (
              <button
                type="button"
                key={f}
                onClick={() => toggleArrayItem("furnishingStatuses", f)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                  isSelected
                    ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                    : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/40 hover:bg-gray-50"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                <span>{f}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Gender Preference */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Gender Preference
        </p>
        <div className="flex flex-wrap gap-2">
          {["Boys", "Girls", "Co-Ed"].map((g) => {
            const isSelected = filters.gender === g;
            const count = counts?.gender[g] ?? 0;
            return (
              <button
                type="button"
                key={g}
                onClick={() => onChange("gender", isSelected ? "" : g)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                  isSelected
                    ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                    : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/40 hover:bg-gray-50"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                <span>{g}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Meals & Food */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meals &amp; Food</p>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.messIncluded}
            onChange={(e) => onChange("messIncluded", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-[#0F4C81] cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-gray-700">Mess Included (3 Meals)</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.tiffinService}
            onChange={(e) => onChange("tiffinService", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-[#0F4C81] cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-gray-700">Tiffin Delivery Available</span>
        </label>
      </div>

      {/* 9. Rules & Freedom */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rules &amp; Freedom</p>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-700">No Curfew Restriction</span>
          <button
            type="button"
            onClick={() => onChange("noCurfew", !filters.noCurfew)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
              filters.noCurfew ? "bg-[#0F4C81]" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                filters.noCurfew ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-700">Visitors Allowed</span>
          <button
            type="button"
            onClick={() => onChange("visitorAllowed", !filters.visitorAllowed)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
              filters.visitorAllowed ? "bg-[#0F4C81]" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                filters.visitorAllowed ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* 10. Amenities */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Amenities
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
                  className="w-4 h-4 rounded border-gray-300 accent-[#0F4C81] cursor-pointer"
                />
                <span className="text-xs text-gray-700">{a}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bottom Clear Button */}
      {isFiltered && onReset && (
        <div className="pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onReset}
            className="w-full py-2.5 px-4 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
