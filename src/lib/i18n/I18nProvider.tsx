"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { SUPPORTED_LANGUAGES, LANGUAGE_STORAGE_KEY, LanguageOption } from "./config";

interface I18nContextType {
  currentLanguage: LanguageOption;
  languages: LanguageOption[];
  changeLanguage: (code: string) => void;
  isModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
}

const defaultLang = SUPPORTED_LANGUAGES[0]; // English

const I18nContext = createContext<I18nContextType>({
  currentLanguage: defaultLang,
  languages: SUPPORTED_LANGUAGES,
  changeLanguage: () => {},
  isModalOpen: false,
  openLanguageModal: () => {},
  closeLanguageModal: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(defaultLang);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check saved language preference in localStorage
    try {
      const savedLangCode = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLangCode) {
        const found = SUPPORTED_LANGUAGES.find((l) => l.code === savedLangCode);
        if (found) {
          setCurrentLanguage(found);
          i18n.changeLanguage(found.code);
          document.documentElement.lang = found.code;
          document.documentElement.dir = "ltr";
        }
      }
    } catch {
      // localStorage unavailable or private browsing
    }
  }, []);

  const changeLanguage = (code: string) => {
    const target = SUPPORTED_LANGUAGES.find((l) => l.code === code) || defaultLang;
    setCurrentLanguage(target);
    i18n.changeLanguage(target.code);
    if (typeof document !== "undefined") {
      document.documentElement.lang = target.code;
      document.documentElement.dir = "ltr";
    }
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, target.code);
    } catch {
      // ignore
    }
  };

  const openLanguageModal = () => setIsModalOpen(true);
  const closeLanguageModal = () => setIsModalOpen(false);

  return (
    <I18nContext.Provider
      value={{
        currentLanguage,
        languages: SUPPORTED_LANGUAGES,
        changeLanguage,
        isModalOpen,
        openLanguageModal,
        closeLanguageModal,
      }}
    >
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </I18nContext.Provider>
  );
}
