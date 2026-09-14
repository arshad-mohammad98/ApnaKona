"use client";

import Link from "next/link";
import { Home, Search, Map, Users, MessageSquare, Mail, Phone, Globe, Share2, Briefcase } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useLanguage } from "@/lib/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/constants";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterXIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GmailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: "/", labelKey: "home", icon: Home },
    { href: "/hostels", labelKey: "hostelPG", icon: Search },
    { href: "/explore", labelKey: "exploreCity", icon: Map },
    { href: "/connect", labelKey: "findRoommates", icon: Users },
    { href: "/grievance", labelKey: "raiseGrievance", icon: MessageSquare },
  ];

  const ownerLinks = [
    { href: "/role-select", labelKey: "listProperty" },
    { href: "/dashboard/owner", labelKey: "ownerDashboard" },
    { href: "/login", labelKey: "ownerLogin" },
  ];

  return (
    <footer className="bg-[#1F2937] text-white pt-16 pb-8 border-t border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group" aria-label="ApnaKona Home">
              <Logo variant="full" size="md" theme="dark" />
            </Link>
            <p className="text-[#F1F5F9] text-xs sm:text-sm leading-relaxed max-w-sm">
              {t("footer", "description")}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Share ApnaKona"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#2A556A] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Website"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#2A556A] transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Careers"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#2A556A] transition-colors"
              >
                <Briefcase className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base mb-4 text-white">{t("footer", "quickLinks")}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ href, labelKey, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2.5 text-[#F8FAFC] hover:text-[#F4A261] text-xs sm:text-sm font-medium py-1 transition-colors"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[#8DC7DC]" />
                    {t("footer", labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base mb-4 text-white">{t("footer", "forOwners")}</h3>
            <ul className="space-y-2.5">
              {ownerLinks.map(({ href, labelKey }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[#F8FAFC] hover:text-[#F4A261] text-xs sm:text-sm font-medium block py-1 transition-colors"
                  >
                    {t("footer", labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-4 bg-white/10 rounded-2xl border border-white/15 max-w-xs">
              <p className="text-xs text-white font-medium mb-2">{t("footer", "reachStudents")}</p>
              <Link
                href="/role-select"
                className="inline-flex items-center px-4 py-2 bg-[#F4A261] text-white text-xs font-semibold rounded-xl hover:bg-[#e7924e] transition-colors min-h-[38px]"
              >
                {t("footer", "listForFree")}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base mb-4 text-white">{t("footer", "contactSupport")}</h3>
            <div className="space-y-3">
              <a
                href={SITE_CONFIG.social.gmail.url}
                className="flex items-center gap-2.5 text-[#F8FAFC] hover:text-[#F4A261] text-xs sm:text-sm font-medium transition-colors py-1"
              >
                <Mail className="w-4 h-4 shrink-0 text-[#8DC7DC]" />
                {SITE_CONFIG.contact.email}
              </a>
              <a
                href={SITE_CONFIG.social.phone.url}
                className="flex items-center gap-2.5 text-[#F8FAFC] hover:text-[#F4A261] text-xs sm:text-sm font-medium transition-colors py-1"
              >
                <Phone className="w-4 h-4 shrink-0 text-[#8DC7DC]" />
                {SITE_CONFIG.contact.displayPhone}
              </a>
            </div>

            {/* Follow Us / Social Media & Contact Links */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Follow Us
              </p>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href={SITE_CONFIG.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ApnaKona on Instagram"
                  title="Instagram"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-[#E1306C] text-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 border border-white/10 shadow-xs cursor-pointer"
                >
                  <InstagramIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </a>

                {/* Twitter / X */}
                <a
                  href={SITE_CONFIG.social.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ApnaKona on Twitter/X"
                  title="Twitter / X"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-black text-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 border border-white/10 shadow-xs cursor-pointer"
                >
                  <TwitterXIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </a>

                {/* Gmail */}
                <a
                  href={SITE_CONFIG.social.gmail.url}
                  aria-label="Send email to ApnaKona"
                  title="Email Us (Gmail)"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-[#EA4335] text-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 border border-white/10 shadow-xs cursor-pointer"
                >
                  <GmailIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </a>

                {/* Phone */}
                <a
                  href={SITE_CONFIG.social.phone.url}
                  aria-label="Call ApnaKona Support"
                  title="Call Us"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-[#10B981] text-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 border border-white/10 shadow-xs cursor-pointer"
                >
                  <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </a>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs text-white mb-2 font-medium">{t("footer", "getUpdates")}</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="student@college.edu"
                  className="flex-1 bg-white/10 border border-white/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-300 outline-none focus:border-[#F4A261] transition-colors min-h-[44px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#F4A261] rounded-xl text-white text-xs font-bold hover:bg-[#e7924e] transition-colors shrink-0 min-h-[44px] cursor-pointer"
                >
                  {t("footer", "join")}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-[#CBD5E1] text-center sm:text-left">
          <p>{t("footer", "copyright")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="text-[#E2E8F0] hover:text-white transition-colors">{t("footer", "privacy")}</a>
            <span>•</span>
            <a href="#" className="text-[#E2E8F0] hover:text-white transition-colors">{t("footer", "terms")}</a>
            <span>•</span>
            <a href="#" className="text-[#E2E8F0] hover:text-white transition-colors">{t("footer", "safety")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
