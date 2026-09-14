"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type Language, translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: string, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Read saved language on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("apnakona-language") as Language | null;
      if (saved === "en" || saved === "hi") {
        setLanguageState(saved);
      }
    } catch {
      // localStorage may be disabled
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("apnakona-language", lang);
    } catch {
      // ignore
    }
    // Update the html lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, []);

  // Translation lookup function
  const t = useCallback(
    (section: string, key: string): string => {
      const sectionData = (translations as Record<string, Record<string, Record<Language, string>>>)[section];
      if (!sectionData) return key;
      const entry = sectionData[key];
      if (!entry) return key;
      return entry[language] || entry["en"] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
