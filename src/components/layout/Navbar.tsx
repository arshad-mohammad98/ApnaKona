"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Search,
  Map,
  Users,
  MessageSquare,
  ChevronDown,
  LogIn,
  User as UserIcon,
  LayoutDashboard,
  Bot,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { openRoomie } from "@/lib/roomie";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/hostels", label: "Search", icon: Search },
  { href: "/explore", label: "Explore", icon: Map },
  { href: "/connect", label: "Connect", icon: Users },
  { href: "/grievance", label: "Grievance", icon: MessageSquare },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "owner"
      ? "/dashboard/owner"
      : "/dashboard/student";

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0" aria-label="ApnaKona Home">
            <Logo variant="full" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all whitespace-nowrap ${
                    active
                      ? "bg-[#E5EFF4] text-[#0D212D] dark:bg-[#234C60]/40 dark:text-[#E5EFF4] font-bold shadow-2xs"
                      : "text-[#0F172A] dark:text-slate-200 hover:bg-[#E5EFF4]/60 dark:hover:bg-slate-800 hover:text-[#234C60] dark:hover:text-[#35657C]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Section & Utilities (Desktop) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Compact Modern Language Switch */}
            <div className="flex items-center p-0.5 bg-[#EDF5F8] dark:bg-slate-800 rounded-lg border border-[#CBD5E1] dark:border-slate-700 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-white dark:bg-slate-900 text-[#0D212D] dark:text-white shadow-2xs font-bold"
                    : "text-[#64748B] hover:text-[#0D212D] dark:text-slate-400"
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  language === "hi"
                    ? "bg-white dark:bg-slate-900 text-[#0D212D] dark:text-white shadow-2xs font-bold"
                    : "text-[#64748B] hover:text-[#0D212D] dark:text-slate-400"
                }`}
                title="Switch to Hindi (हिन्दी)"
              >
                हिन्दी
              </button>
            </div>

            {/* Roomie AI Quick Button */}
            <button
              type="button"
              onClick={() => openRoomie()}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#234C60] bg-[#EDF5F8] hover:bg-[#DCEFF5] border border-[#CBD5E1] transition-all cursor-pointer min-h-[36px]"
              title="Ask Roomie AI Housing Assistant"
            >
              <Bot className="w-3.5 h-3.5 text-[#3B82A6]" />
              <span>Ask Roomie</span>
              <Sparkles className="w-2.5 h-2.5 text-[#F09A57]" />
            </button>

            <ThemeToggle variant="icon" />
            {isAuthenticated && user ? (
              <div className="relative flex items-center gap-2">
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E5EFF4] hover:bg-[#d8e7ef] text-[#0D212D] dark:bg-[#234C60]/40 dark:hover:bg-[#234C60]/60 dark:text-[#E5EFF4] rounded-xl text-xs font-bold transition-colors min-h-[38px]"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#234C60]" />
                  Dashboard
                </Link>

                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#35657C] to-[#234C60] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-[#1F2937] dark:text-slate-200 max-w-[110px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#64748B] dark:text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-fade-up">
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-[11px] text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-[#1F2937] dark:text-white truncate">{user.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#DDF3EA] dark:bg-emerald-950/50 text-[#1F634A] dark:text-emerald-300 rounded-full text-[10px] font-semibold capitalize">
                        {user.role} Account
                      </span>
                    </div>

                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1F2937] dark:text-slate-200 hover:bg-[#D9E8EF]/50 dark:hover:bg-slate-800 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon className="w-4 h-4 text-[#2A556A] dark:text-[#4A7C94]" />
                      My Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100 dark:border-slate-800" />
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs lg:text-sm font-bold text-white bg-[#F4A261] hover:bg-[#e7924e] rounded-xl transition-colors shadow-sm shadow-[#F4A261]/25 min-h-[44px] flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs lg:text-sm font-bold text-white bg-[#F4A261] hover:bg-[#e7924e] rounded-xl transition-colors shadow-sm shadow-[#F4A261]/25 min-h-[44px] flex items-center"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Controls (Theme Toggle + Menu Button) */}
          <div className="md:hidden flex items-center gap-1.5">
            <ThemeToggle variant="icon" />
            <button
              type="button"
              aria-label="Toggle mobile menu"
              className="p-2.5 rounded-xl text-[#1F2937] dark:text-slate-200 hover:bg-[#D9E8EF]/50 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden flex flex-col">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative bg-[#F7FAFC] dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-slate-800 px-5 pt-3 pb-6 space-y-2 shadow-2xl overflow-y-auto max-h-[calc(100dvh-4rem)]">
            <div className="space-y-1">
              {navLinks.map((item) => {
                const active = isLinkActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                      active
                        ? "bg-[#E5EFF4] text-[#0D212D] dark:bg-[#234C60]/40 dark:text-[#E5EFF4] font-bold"
                        : "text-[#0F172A] dark:text-slate-200 hover:bg-[#E5EFF4]/40 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#234C60] dark:text-[#35657C]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Roomie Mobile Shortcut */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openRoomie();
              }}
              className="flex items-center justify-between px-4 py-3 bg-[#EDF5F8] dark:bg-slate-800 text-[#234C60] dark:text-[#A0C0CE] rounded-xl text-sm font-semibold border border-[#CBD5E1]/60 cursor-pointer min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-[#3B82A6]" />
                <span>Ask Roomie AI Assistant</span>
              </div>
              <Sparkles className="w-4 h-4 text-[#F09A57]" />
            </button>

            {/* Language Switch Row (Mobile) */}
            <div className="py-2.5 px-3 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Language / भाषा</span>
              <div className="flex items-center p-0.5 bg-[#EDF5F8] dark:bg-slate-800 rounded-lg border border-[#CBD5E1] dark:border-slate-700 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-white dark:bg-slate-900 text-[#0D212D] dark:text-white shadow-2xs font-bold"
                      : "text-[#64748B] dark:text-slate-400"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    language === "hi"
                      ? "bg-white dark:bg-slate-900 text-[#0D212D] dark:text-white shadow-2xs font-bold"
                      : "text-[#64748B] dark:text-slate-400"
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {/* Appearance Theme Row (Mobile) */}
            <div className="py-2.5 px-3 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Theme Preference</span>
              <ThemeToggle variant="pill" />
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-col gap-2.5">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2 bg-white dark:bg-slate-800 rounded-xl mb-1 border border-[#E2E8F0] dark:border-slate-700">
                    <p className="text-[11px] text-[#64748B] dark:text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-[#1F2937] dark:text-white">{user.name}</p>
                    <p className="text-xs text-[#234C60] dark:text-[#35657C] font-semibold capitalize">{user.role} Account</p>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#234C60] rounded-xl hover:bg-[#173747] min-h-[44px]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl min-h-[44px] cursor-pointer transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#F4A261] hover:bg-[#e7924e] rounded-xl shadow-sm shadow-[#F4A261]/25 min-h-[44px]"
                  >
                    <LogIn className="w-4 h-4 stroke-[2.5]" />
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-[#F4A261] hover:bg-[#e7924e] rounded-xl shadow-sm shadow-[#F4A261]/25 min-h-[44px]"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
