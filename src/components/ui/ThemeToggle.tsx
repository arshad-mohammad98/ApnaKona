"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { Sun, Moon, Laptop } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ThemeToggleProps {
  variant?: "icon" | "dropdown" | "pill";
  className?: string;
}

export default function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse ${className}`} />
    );
  }

  // Pill variant with label
  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme preference"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
          resolvedTheme === "dark"
            ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700"
            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-[#0F4C81]"
        } ${className}`}
      >
        {resolvedTheme === "dark" ? (
          <>
            <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-[#0F4C81] rotate-0 transition-transform" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Dropdown variant
  if (variant === "dropdown") {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Theme menu"
          className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer ${
            resolvedTheme === "dark"
              ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 text-[#0F4C81]"
          } ${className}`}
        >
          {resolvedTheme === "dark" ? (
            <Moon className="w-4 h-4 text-amber-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 py-1.5 z-50 text-xs font-semibold animate-in fade-in">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Laptop },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setTheme(id as "light" | "dark" | "system");
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors cursor-pointer ${
                  theme === id
                    ? "bg-[#0F4C81]/10 dark:bg-sky-500/20 text-[#0F4C81] dark:text-sky-400 font-bold"
                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default toggle button (icon variant)
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      className={`group relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer ${
        resolvedTheme === "dark"
          ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-xs"
          : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-[#0F4C81] border-gray-200/80 shadow-2xs"
      } ${className}`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform group-hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#0F4C81] rotate-0 transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}
