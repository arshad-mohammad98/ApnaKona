"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Home, Search, Map, Users, MessageSquare, ChevronDown, LogIn } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Find PG / Hostel", icon: Search },
  { href: "/explore", label: "Explore", icon: Map },
  { href: "/connect", label: "Connect", icon: Users },
  { href: "/grievance", label: "Grievance", icon: MessageSquare },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#1a6db5] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-display font-bold text-xl text-[#1A1A2E]">
              Apna<span className="text-[#FF6B35]">Kona</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-[#0F4C81]/10 text-[#0F4C81]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#0F4C81]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href={user.role === "owner" ? "/dashboard/owner" : "/dashboard/student"}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
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
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#0F4C81] hover:bg-[#0F4C81]/5 rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/role-select"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#e85a22] rounded-xl transition-colors shadow-sm"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-[#0F4C81]/10 text-[#0F4C81]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link href={user.role === "owner" ? "/dashboard/owner" : "/dashboard/student"} onClick={() => setMenuOpen(false)} className="text-center px-4 py-2 text-sm font-medium text-[#0F4C81] border border-[#0F4C81] rounded-xl">Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-center px-4 py-2 text-sm font-medium text-[#0F4C81] border border-[#0F4C81] rounded-xl">Login</Link>
                <Link href="/role-select" onClick={() => setMenuOpen(false)} className="text-center px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] rounded-xl">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
