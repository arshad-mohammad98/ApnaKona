"use client";

import { RotateCcw } from "lucide-react";

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
    <div className={`bg-white rounded-3xl shadow-card border border-gray-100 p-5 space-y-6 ${className}`}>
      {/* Header / Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <span className="font-display font-semibold text-sm text-gray-900">Filters</span>
        {isFiltered && onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#FF6B35] hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All
          </button>
        )}
      </div>

      {/* Room Type */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Accommodation Type
        </p>
        <div className="flex flex-wrap gap-2">
          {["PG", "Hostel", "Flat"].map((t) => (
            <button
              key={t}
              onClick={() => onChange("roomType", filters.roomType === t ? "" : t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                filters.roomType === t
                  ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                  : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/50 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Sharing Type */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Sharing Type
        </p>
        <div className="flex flex-wrap gap-2">
          {["Single", "Double", "Triple"].map((t) => (
            <button
              key={t}
              onClick={() => onChange("sharingType", filters.sharingType === t ? "" : t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                filters.sharingType === t
                  ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                  : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/50 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Preference */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Gender Preference
        </p>
        <div className="flex flex-wrap gap-2">
          {["Boys", "Girls", "Co-Ed"].map((t) => (
            <button
              key={t}
              onClick={() => onChange("gender", filters.gender === t ? "" : t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                filters.gender === t
                  ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                  : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/50 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Max Monthly Budget</p>
          <span className="text-xs font-bold text-[#0F4C81]">
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
          className="w-full accent-[#0F4C81] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1.5 font-medium">
          <span>₹3,000</span>
          <span>₹30,000</span>
        </div>
      </div>

      {/* Furnishing Status */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Furnishing
        </p>
        <div className="flex flex-wrap gap-2">
          {["Fully Furnished", "Semi Furnished", "Unfurnished"].map((f) => (
            <button
              key={f}
              onClick={() => onChange("furnishingStatus", filters.furnishingStatus === f ? "" : f)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                filters.furnishingStatus === f
                  ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                  : "border-gray-200 text-gray-700 bg-white hover:border-[#0F4C81]/50 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* AC Toggle */}
      <div className="flex items-center justify-between py-1">
        <p className="text-xs sm:text-sm font-medium text-gray-800">AC Rooms Only</p>
        <button
          type="button"
          onClick={() => onChange("acOnly", !filters.acOnly)}
          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
            filters.acOnly ? "bg-[#0F4C81]" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
              filters.acOnly ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {/* Food Policies (Mess & Tiffin) */}
      <div className="space-y-2.5 pt-1 border-t border-gray-100">
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

      {/* Rules & Policies (Curfew & Visitors) */}
      <div className="space-y-2.5 pt-1 border-t border-gray-100">
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

      {/* Amenities */}
      <div className="pt-1 border-t border-gray-100">
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
    </div>
  );
}
