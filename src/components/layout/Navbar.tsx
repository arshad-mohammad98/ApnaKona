"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Compass,
  Building2,
  Users,
  AlertCircle,
  LogIn,
  LayoutDashboard,
  User as UserIcon,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import Logo from "@/components/ui/Logo";
import { SITE_CONTACT } from "@/lib/constants";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/hostels", label: "Find Hostels", icon: Building2 },
  { href: "/explore", label: "Neighborhoods", icon: Compass },
  { href: "/connect", label: "Find Roommates", icon: Users },
  { href: "/grievance", label: "Student Grievance", icon: AlertCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close mobile drawer on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setDropdownOpen(false);
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#user-menu-btn") && !target.closest("#user-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isLinkActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const dashboardHref = user?.role === "owner" ? "/dashboard/owner" : "/dashboard/student";

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="ApnaKona Home">
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
                      ? "bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-500/15 dark:text-sky-400"
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-[#0F4C81] dark:hover:text-sky-400"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Controls (Phone + Theme Toggle + Auth) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <a
              href={SITE_CONTACT.phoneHref}
              title={`Call Student Support: ${SITE_CONTACT.phoneDisplay}`}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300 hover:text-[#0F4C81] dark:hover:text-sky-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors mr-1"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{SITE_CONTACT.phoneDisplay}</span>
            </a>

            {/* Desktop Theme Toggle */}
            <ThemeToggle variant="icon" />

            {isAuthenticated && user ? (
              <div className="relative flex items-center gap-2">
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C81]/8 dark:bg-sky-500/10 hover:bg-[#0F4C81]/15 text-[#0F4C81] dark:text-sky-400 rounded-xl text-xs font-bold transition-colors min-h-[38px]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <button
                  id="user-menu-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-slate-200 max-w-[110px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div
                    id="user-dropdown"
                    className="absolute right-0 top-12 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-fade-up"
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-[11px] text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-semibold capitalize">
                        {user.role} Account
                      </span>
                    </div>

                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon className="w-4 h-4 text-[#0F4C81] dark:text-sky-400" />
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
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-semibold text-[#0F4C81] dark:text-sky-400 hover:bg-[#0F4C81]/8 dark:hover:bg-sky-500/10 rounded-xl transition-colors min-h-[44px]"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs lg:text-sm font-bold text-white bg-[#FF6B35] hover:bg-[#e85a22] rounded-xl transition-colors shadow-sm shadow-orange-500/20 min-h-[44px] flex items-center"
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
              className="p-2.5 rounded-xl text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
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
          <div className="relative bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-5 pt-3 pb-6 space-y-2 shadow-2xl overflow-y-auto max-h-[calc(100dvh-4rem)]">
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
                        ? "bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-500/15 dark:text-sky-400"
                        : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#0F4C81] dark:text-sky-400" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Appearance Theme Row (Mobile) */}
            <div className="py-2.5 px-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600 dark:text-slate-400">Theme Preference</span>
              <ThemeToggle variant="pill" />
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2.5">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl mb-1">
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-[#0F4C81] dark:text-sky-400 font-semibold capitalize">{user.role} Account</p>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#0F4C81] rounded-xl hover:bg-[#0d3f6e] min-h-[44px]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl min-h-[44px] cursor-pointer transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#0F4C81] border border-[#0F4C81]/30 rounded-xl hover:bg-[#0F4C81]/5 min-h-[44px]"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-[#FF6B35] hover:bg-[#e85a22] rounded-xl shadow-md min-h-[44px]"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Contact Support */}
            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Direct Support</span>
              <div className="grid grid-cols-1 gap-2">
                <a
                  href={SITE_CONTACT.phoneHref}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:text-[#0F4C81] dark:hover:text-sky-400 transition-colors min-h-[44px]"
                >
                  <Phone className="w-4 h-4 text-[#FF6B35] shrink-0" />
                  <span>{SITE_CONTACT.phoneDisplay}</span>
                </a>
                <a
                  href={SITE_CONTACT.emailHref}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:text-[#0F4C81] dark:hover:text-sky-400 transition-colors min-h-[44px]"
                >
                  <Mail className="w-4 h-4 text-[#FF6B35] shrink-0" />
                  <span className="truncate">{SITE_CONTACT.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
