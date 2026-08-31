import Link from "next/link";
import { Home, Search, Map, Users, MessageSquare, Mail, Phone, Globe, Share2, Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#1a6db5] flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-display font-bold text-xl">
                Apna<span className="text-[#FF6B35]">Kona</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              India&apos;s most trusted platform for students to find safe, affordable, and comfortable accommodation in a new city.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                <Briefcase className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home", icon: Home },
                { href: "/search", label: "Find Accommodation", icon: Search },
                { href: "/explore", label: "Explore City", icon: Map },
                { href: "/connect", label: "Find Roommates", icon: Users },
                { href: "/grievance", label: "Raise Grievance", icon: MessageSquare },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-gray-400 hover:text-[#FF6B35] text-sm transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4">For Property Owners</h3>
            <ul className="space-y-3">
              {[
                { href: "/role-select", label: "List Your Property" },
                { href: "/dashboard/owner", label: "Owner Dashboard" },
                { href: "/login", label: "Owner Login" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#FF6B35] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Reach thousands of students</p>
              <Link href="/role-select" className="inline-block px-4 py-2 bg-[#FF6B35] text-white text-xs font-medium rounded-xl hover:bg-[#e85a22] transition-colors">
                List for Free →
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a href="mailto:help@apnakona.in" className="flex items-center gap-2 text-gray-400 hover:text-[#FF6B35] text-sm transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                help@apnakona.in
              </a>
              <a href="tel:+918000000000" className="flex items-center gap-2 text-gray-400 hover:text-[#FF6B35] text-sm transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                +91 80000 00000
              </a>
            </div>
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Subscribe for updates</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-[#FF6B35] transition-colors"
                />
                <button className="px-3 py-2 bg-[#FF6B35] rounded-xl text-white text-xs font-medium hover:bg-[#e85a22] transition-colors">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-xs text-gray-500">
          <p>© 2026 ApnaKona. All rights reserved. Built with ❤️ for Indian students.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
