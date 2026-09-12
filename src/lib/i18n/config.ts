import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import kn from "@/locales/kn.json";
import ta from "@/locales/ta.json";
import te from "@/locales/te.json";
import mr from "@/locales/mr.json";
import bn from "@/locales/bn.json";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  badge: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    badge: "EN",
    flag: "🇮🇳",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    badge: "HI",
    flag: "🇮🇳",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    badge: "KN",
    flag: "🇮🇳",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    badge: "TA",
    flag: "🇮🇳",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    badge: "TE",
    flag: "🇮🇳",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    badge: "MR",
    flag: "🇮🇳",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    badge: "BN",
    flag: "🇮🇳",
  },
];

export const LANGUAGE_STORAGE_KEY = "apnakona_language";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
  ta: { translation: ta },
  te: { translation: te },
  mr: { translation: mr },
  bn: { translation: bn },
};

// Initialize i18next
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already safeguards against XSS
    },
    react: {
      useSuspense: false, // Prevents SSR/CSR mismatch issues in Next.js
    },
  });
}

export default i18n;
