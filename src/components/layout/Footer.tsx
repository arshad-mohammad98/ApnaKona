"use client";

import Link from "next/link";
import { Home, Search, Map, Users, MessageSquare, Mail, Phone, Globe, Share2, Briefcase } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function Footer() {
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
              India&apos;s most trusted platform for students to find safe, affordable, and verified accommodation near top colleges.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Share ApnaKona"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Website"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Careers"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors"
              >
                <Briefcase className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home", icon: Home },
                { href: "/hostels", label: "Hostel/PG", icon: Search },
                { href: "/explore", label: "Explore City", icon: Map },
                { href: "/connect", label: "Find Roommates", icon: Users },
                { href: "/grievance", label: "Raise Grievance", icon: MessageSquare },
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
            <h3 className="font-display font-semibold text-sm sm:text-base mb-4 text-white">For Property Owners</h3>
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
            <h3 className="font-display font-semibold text-sm sm:text-base mb-4 text-white">Contact & Support</h3>
            <div className="space-y-3">
              <a
                href="mailto:help@apnakona.in"
                className="flex items-center gap-2.5 text-gray-400 hover:text-[#FF6B35] text-xs sm:text-sm transition-colors py-1"
              >
                <Mail className="w-4 h-4 shrink-0" />
                help@apnakona.in
              </a>
              <a
                href="tel:+918000000000"
                className="flex items-center gap-2.5 text-gray-400 hover:text-[#FF6B35] text-xs sm:text-sm transition-colors py-1"
              >
                <Phone className="w-4 h-4 shrink-0" />
                +91 80000 00000
              </a>
            </div>
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-2 font-medium">Get Campus Housing Updates</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="student@college.edu"
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FF6B35] transition-colors min-h-[44px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FF6B35] rounded-xl text-white text-xs font-bold hover:bg-[#e85a22] transition-colors shrink-0 min-h-[44px] cursor-pointer"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-gray-500 text-center sm:text-left">
          <p>© 2026 ApnaKona. All rights reserved. Built with ❤️ for Indian students.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Safety Standards</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
