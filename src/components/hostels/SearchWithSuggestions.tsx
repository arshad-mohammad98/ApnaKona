"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  Building2,
  MapPin,
  GraduationCap,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { SuggestionItem, GroupedSuggestions } from "@/lib/data/suggestionsData";

interface SearchWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  onSelectSuggestion?: (item: SuggestionItem) => void;
  placeholder?: string;
  className?: string;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <span>{text}</span>;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === trimmed.toLowerCase();
        return isMatch ? (
          <strong key={index} className="font-bold text-[#0F4C81]">
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
}

export default function SearchWithSuggestions({
  value,
  onChange,
  onSelectSuggestion,
  placeholder = "Search by city, college, or locality (e.g. Christ University, Koramangala, Powai)...",
  className = "",
}: SearchWithSuggestionsProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GroupedSuggestions>({
    cities: [],
    localities: [],
    colleges: [],
    totalCount: 0,
  });
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [prevPropValue, setPrevPropValue] = useState(value);
  if (prevPropValue !== value) {
    setPrevPropValue(value);
    setInputValue(value);
  }

  // Flatten suggestions for linear keyboard navigation
  const allFlatSuggestions = useMemo(() => {
    return [
      ...suggestions.cities,
      ...suggestions.localities,
      ...suggestions.colleges,
    ];
  }, [suggestions]);

  // Debounced fetch for suggestions (300ms)
  useEffect(() => {
    const trimmed = inputValue.trim();
    if (trimmed.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data: GroupedSuggestions = await res.json();
          setSuggestions(data);
          setIsOpen(true);
          setActiveIndex(-1);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSelect = (item: SuggestionItem) => {
    setInputValue(item.value);
    setIsOpen(false);
    setActiveIndex(-1);
    onChange(item.value);
    if (onSelectSuggestion) {
      onSelectSuggestion(item);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setIsOpen(false);
    setActiveIndex(-1);
    onChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === "ArrowDown") {
      if (!isOpen && allFlatSuggestions.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
        return;
      }
      if (allFlatSuggestions.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev < allFlatSuggestions.length - 1 ? prev + 1 : 0));
      }
      return;
    }

    if (e.key === "ArrowUp") {
      if (allFlatSuggestions.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : allFlatSuggestions.length - 1));
      }
      return;
    }

    if (e.key === "Enter") {
      if (isOpen && activeIndex >= 0 && activeIndex < allFlatSuggestions.length) {
        e.preventDefault();
        handleSelect(allFlatSuggestions[activeIndex]);
      } else {
        // Trigger search with typed text
        setIsOpen(false);
        onChange(inputValue);
      }
    }
  };

  // Helper to render an item row with appropriate icon and keyboard focus
  const renderItem = (item: SuggestionItem, flatIndex: number) => {
    const isFocused = activeIndex === flatIndex;

    let icon = <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />;
    let iconBg = "bg-orange-50 text-[#FF6B35]";

    if (item.category === "Cities") {
      icon = <Building2 className="w-3.5 h-3.5 text-[#0F4C81]" />;
      iconBg = "bg-blue-50 text-[#0F4C81]";
    } else if (item.category === "Colleges") {
      icon = <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      iconBg = "bg-emerald-50 text-emerald-600";
    }

    return (
      <button
        key={item.id}
        type="button"
        onMouseDown={(e) => {
          // Prevent input blur before click registers
          e.preventDefault();
          handleSelect(item);
        }}
        onMouseEnter={() => setActiveIndex(flatIndex)}
        className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
          isFocused ? "bg-blue-50/80" : "hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
              <HighlightMatch text={item.title} query={inputValue} />
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              {item.subtitle}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center text-gray-300">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </button>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            const next = e.target.value;
            setInputValue(next);
            if (next.trim().length < 2) {
              setIsOpen(false);
              setSuggestions({ cities: [], localities: [], colleges: [], totalCount: 0 });
            }
            // Also update search if user deletes completely
            if (next === "") {
              onChange("");
            }
          }}
          onFocus={() => {
            if (inputValue.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-16 py-3.5 bg-white text-gray-900 rounded-2xl shadow-lg text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#FF6B35]"
        />

        {/* Right action indicators: Loader and/or Clear button */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-[#FF6B35] animate-spin shrink-0" />
          )}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Auto-Suggestion Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-[380px] overflow-y-auto divide-y divide-gray-100">
          {suggestions.totalCount === 0 && !isLoading ? (
            <div className="py-6 px-4 text-center">
              <Search className="w-5 h-5 text-gray-300 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-gray-700">
                No matches found — try a different search
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Search by city, locality, or college name
              </p>
            </div>
          ) : (
            <>
              {/* Category 1: Cities */}
              {suggestions.cities.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 bg-gray-50/75 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Building2 className="w-3 h-3" />
                    <span>Cities</span>
                  </div>
                  <div>
                    {suggestions.cities.map((cityItem, idx) => {
                      const flatIndex = idx;
                      return renderItem(cityItem, flatIndex);
                    })}
                  </div>
                </div>
              )}

              {/* Category 2: Localities */}
              {suggestions.localities.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 bg-gray-50/75 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    <span>Localities</span>
                  </div>
                  <div>
                    {suggestions.localities.map((locItem, idx) => {
                      const flatIndex = suggestions.cities.length + idx;
                      return renderItem(locItem, flatIndex);
                    })}
                  </div>
                </div>
              )}

              {/* Category 3: Colleges */}
              {suggestions.colleges.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 bg-gray-50/75 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <GraduationCap className="w-3 h-3" />
                    <span>Colleges &amp; Campuses</span>
                  </div>
                  <div>
                    {suggestions.colleges.map((colItem, idx) => {
                      const flatIndex =
                        suggestions.cities.length +
                        suggestions.localities.length +
                        idx;
                      return renderItem(colItem, flatIndex);
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
