"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Home, Search, Map, Users, MessageSquare, ChevronDown, LogIn, User } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const navLinks = [
  { href: "/", pageHref: "/", label: "Home", icon: Home, id: "" },
  { href: "/#search", pageHref: "/search", label: "Find PG / Hostel", icon: Search, id: "search" },
  { href: "/#explore", pageHref: "/explore", label: "Explore", icon: Map, id: "explore" },
  { href: "/#connect", pageHref: "/connect", label: "Connect", icon: Users, id: "connect" },
  { href: "/#grievance", pageHref: "/grievance", label: "Grievance", icon: MessageSquare, id: "grievance" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  // Track hash or scroll section when on home page
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScrollOrHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveSection(hash);
      } else if (window.scrollY < 250) {
        setActiveSection("");
      }
    };
    handleScrollOrHash();
    window.addEventListener("hashchange", handleScrollOrHash);
    window.addEventListener("scroll", handleScrollOrHash, { passive: true });
    return () => {
      window.removeEventListener("hashchange", handleScrollOrHash);
      window.removeEventListener("scroll", handleScrollOrHash);
    };
  }, []);

  const isLinkActive = (item: (typeof navLinks)[0]) => {
    if (pathname === "/") {
      if (!item.id) return !activeSection;
      return activeSection === item.id;
    }
    return pathname === item.pageHref;
  };

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

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#1a6db5] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-base">A</span>
            </div>
            <span className="font-display font-bold text-xl text-[#1A1A2E] tracking-tight">
              Apna<span className="text-[#FF6B35]">Kona</span>
            </span>
          </Link>

          {/* Desktop & Tablet Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 lg:px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                  isLinkActive(item)
                    ? "bg-[#0F4C81]/10 text-[#0F4C81] font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#0F4C81]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-up">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role} account</p>
                    </div>
                    <Link
                      href={user.role === "owner" ? "/dashboard/owner" : "/dashboard/student"}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-medium text-[#0F4C81] hover:bg-[#0F4C81]/8 rounded-xl transition-colors min-h-[44px]"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/role-select"
                  className="px-4 py-2 text-xs lg:text-sm font-semibold text-white bg-[#FF6B35] hover:bg-[#e85a22] rounded-xl transition-colors shadow-sm shadow-orange-500/20 min-h-[44px] flex items-center"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle mobile menu"
            className="md:hidden p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden flex flex-col">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative bg-white border-b border-gray-200 px-5 pt-3 pb-6 space-y-2 shadow-2xl overflow-y-auto max-h-[calc(100dvh-4rem)]">
            <div className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                      isLinkActive(item)
                        ? "bg-[#0F4C81]/10 text-[#0F4C81] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#0F4C81]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2 bg-gray-50 rounded-xl mb-1">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role} account</p>
                  </div>
                  <Link
                    href={user.role === "owner" ? "/dashboard/owner" : "/dashboard/student"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#0F4C81] border border-[#0F4C81] rounded-xl hover:bg-[#0F4C81]/5 min-h-[44px]"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl min-h-[44px] cursor-pointer transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#0F4C81] border border-[#0F4C81]/40 rounded-xl hover:bg-[#0F4C81]/5 min-h-[44px]"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    href="/role-select"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-[#FF6B35] hover:bg-[#e85a22] rounded-xl shadow-md min-h-[44px]"
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
