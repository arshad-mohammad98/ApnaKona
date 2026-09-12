"use client";

import Link from "next/link";
import { Home, Search, Map, Users, MessageSquare, Mail, Phone } from "lucide-react";
import { FaInstagram, FaXTwitter, FaPhone } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import Logo from "@/components/ui/Logo";
import { SITE_CONTACT, SITE_SOCIAL } from "@/lib/constants";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#1A1A2E] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group" aria-label="ApnaKona Home">
              <Logo variant="full" size="md" theme="dark" />
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {t("footer.tagline", "India's most trusted platform for students to find safe, affordable, and verified accommodation near top colleges.")}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={SITE_SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ApnaKona on Instagram"
                title="Follow us on Instagram (@apna._kona)"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[40px] min-w-[40px]"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href={SITE_SOCIAL.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ApnaKona on Twitter / X"
                title="Follow us on X / Twitter"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[40px] min-w-[40px] border border-transparent hover:border-white/20"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONTACT.emailHref}
                aria-label="Email ApnaKona on Gmail"
                title={`Email: ${SITE_CONTACT.email}`}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#EA4335] hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[40px] min-w-[40px]"
              >
                <SiGmail className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONTACT.phoneHref}
                aria-label="Call ApnaKona Helpline"
                title={`Call: ${SITE_CONTACT.phoneDisplay}`}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#0F4C81] hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[40px] min-w-[40px]"
              >
                <FaPhone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base mb-4 text-white">{t("footer.exploreTitle", "Quick Links")}</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: t("nav.home", "Home"), icon: Home },
                { href: "/hostels", label: t("nav.findHostels", "Hostel/PG"), icon: Search },
                { href: "/explore", label: t("nav.exploreHubs", "Explore City"), icon: Map },
                { href: "/connect", label: t("nav.roomieConnect", "Find Roommates"), icon: Users },
                { href: "/grievance", label: t("nav.grievance", "Raise Grievance"), icon: MessageSquare },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2.5 text-gray-400 hover:text-[#FF6B35] text-xs sm:text-sm py-1 transition-colors"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base mb-4 text-white">{t("footer.companyTitle", "For Property Owners")}</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/role-select", label: "List Your Property" },
                { href: "/dashboard/owner", label: "Owner Dashboard" },
                { href: "/login", label: "Owner Login" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-[#FF6B35] text-xs sm:text-sm block py-1 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-4 bg-white/5 rounded-2xl border border-white/10 max-w-xs">
              <p className="text-xs text-gray-300 mb-2">Reach thousands of student leads</p>
              <Link
                href="/role-select"
                className="inline-flex items-center px-4 py-2 bg-[#FF6B35] text-white text-xs font-semibold rounded-xl hover:bg-[#e85a22] transition-colors min-h-[38px]"
              >
                List for Free →
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base mb-4 text-white">{t("footer.contactTitle", "Contact Us")}</h3>
            <div className="space-y-3">
              <a
                href={SITE_CONTACT.emailHref}
                className="flex items-center gap-2.5 text-gray-400 hover:text-[#FF6B35] text-xs sm:text-sm transition-colors py-1 break-all"
              >
                <Mail className="w-4 h-4 shrink-0 text-[#FF6B35]" />
                {SITE_CONTACT.email}
              </a>
              <a
                href={SITE_CONTACT.phoneHref}
                className="flex items-center gap-2.5 text-gray-400 hover:text-[#FF6B35] text-xs sm:text-sm transition-colors py-1"
              >
                <Phone className="w-4 h-4 shrink-0 text-[#FF6B35]" />
                {SITE_CONTACT.phoneDisplay}
              </a>
            </div>

            {/* Social Media Links */}
            <div className="mt-4 pt-3.5 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2.5 font-medium">{t("footer.followUs", "Follow Us")}</p>
              <div className="flex items-center gap-2">
                <a
                  href={SITE_SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ApnaKona on Instagram"
                  title="Follow us on Instagram (@apna._kona)"
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[36px] min-w-[36px]"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href={SITE_SOCIAL.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ApnaKona on Twitter/X"
                  title="Follow us on Twitter/X"
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[36px] min-w-[36px] border border-transparent hover:border-white/20"
                >
                  <FaXTwitter className="w-4 h-4" />
                </a>
                <a
                  href={SITE_CONTACT.emailHref}
                  aria-label="Send us an Email"
                  title={`Email us: ${SITE_CONTACT.email}`}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#EA4335] hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[36px] min-w-[36px]"
                >
                  <SiGmail className="w-4 h-4" />
                </a>
                <a
                  href={SITE_CONTACT.phoneHref}
                  aria-label="Call ApnaKona Support"
                  title={`Call us: ${SITE_CONTACT.phoneDisplay}`}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#0F4C81] hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[36px] min-w-[36px]"
                >
                  <FaPhone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs text-gray-400 mb-2 font-medium">{t("footer.newsletter", "Get Campus Housing Updates")}</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder={t("footer.newsletterPlaceholder", "student@college.edu")}
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FF6B35] transition-colors min-h-[44px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FF6B35] rounded-xl text-white text-xs font-bold hover:bg-[#e85a22] transition-colors shrink-0 min-h-[44px] cursor-pointer"
                >
                  {t("footer.subscribe", "Join")}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-gray-500 text-center sm:text-left">
          <p>© 2026 ApnaKona. {t("footer.copyright", "All rights reserved. Built with ❤️ for Indian students.")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">{t("footer.privacy", "Privacy Policy")}</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">{t("footer.terms", "Terms of Service")}</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">{t("footer.safety", "Safety Standards")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
