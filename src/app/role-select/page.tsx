"use client";

import Link from "next/link";
import { GraduationCap, Building2, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function RoleSelectPage() {
  const [hovered, setHovered] = useState<"student" | "owner" | null>(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-blue-50/40 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <Link href="/" className="inline-block mb-6" aria-label="ApnaKona Home">
            <Logo variant="full" size="lg" />
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A2E] mb-2">
            Who are you joining as?
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Choose your account type to get the right experience tailored for you.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8">
          {/* Student */}
          <button
            id="role-student-btn"
            onClick={() => router.push("/signup?role=student")}
            onMouseEnter={() => setHovered("student")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative p-6 sm:p-8 rounded-3xl border-2 text-left transition-all duration-300 cursor-pointer min-h-[44px] ${
              hovered === "student"
                ? "border-[#0F4C81] bg-[#0F4C81] shadow-xl shadow-blue-500/20"
                : "border-gray-200 bg-white hover:border-[#0F4C81]/40 shadow-card"
            }`}
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 transition-colors ${
                hovered === "student" ? "bg-white/20" : "bg-[#0F4C81]/10"
              }`}
            >
              <GraduationCap className={`w-7 h-7 sm:w-8 sm:h-8 ${hovered === "student" ? "text-white" : "text-[#0F4C81]"}`} />
            </div>
            <h2
              className={`font-display text-xl sm:text-2xl font-bold mb-1.5 ${
                hovered === "student" ? "text-white" : "text-[#1A1A2E]"
              }`}
            >
              I&apos;m a Student
            </h2>
            <p className={`text-xs sm:text-sm mb-5 leading-relaxed ${hovered === "student" ? "text-white/80" : "text-gray-500"}`}>
              Looking for a verified PG, hostel, or flat near my college or university campus.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Search & filter 50,000+ verified listings",
                "Direct chat with property owners",
                "Connect with compatible student flatmates",
                "Zero broker fees & grievance protection",
              ].map((f) => (
                <li
                  key={f}
                  className={`flex items-center gap-2 text-xs ${
                    hovered === "student" ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  <CheckCircle
                    className={`w-3.5 h-3.5 shrink-0 ${
                      hovered === "student" ? "text-[#FF6B35]" : "text-[#0F4C81]"
                    }`}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div
              className={`flex items-center gap-2 font-bold text-xs sm:text-sm pt-2 ${
                hovered === "student" ? "text-[#FF6B35]" : "text-[#0F4C81]"
              }`}
            >
              Continue as Student <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Owner */}
          <button
            id="role-owner-btn"
            onClick={() => router.push("/signup?role=owner")}
            onMouseEnter={() => setHovered("owner")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative p-6 sm:p-8 rounded-3xl border-2 text-left transition-all duration-300 cursor-pointer min-h-[44px] ${
              hovered === "owner"
                ? "border-[#FF6B35] bg-[#FF6B35] shadow-xl shadow-orange-500/20"
                : "border-gray-200 bg-white hover:border-[#FF6B35]/40 shadow-card"
            }`}
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 transition-colors ${
                hovered === "owner" ? "bg-white/20" : "bg-[#FF6B35]/10"
              }`}
            >
              <Building2 className={`w-7 h-7 sm:w-8 sm:h-8 ${hovered === "owner" ? "text-white" : "text-[#FF6B35]"}`} />
            </div>
            <h2
              className={`font-display text-xl sm:text-2xl font-bold mb-1.5 ${
                hovered === "owner" ? "text-white" : "text-[#1A1A2E]"
              }`}
            >
              I&apos;m an Owner
            </h2>
            <p className={`text-xs sm:text-sm mb-5 leading-relaxed ${hovered === "owner" ? "text-white/80" : "text-gray-500"}`}>
              I manage or own a PG, hostel, or flat and want verified student leads with zero brokerage.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "List unlimited properties with zero commission",
                "Direct lead inquiries and visit booking",
                "Respond to student reviews & build reputation",
                "Earn verified partner badge for 3x leads",
              ].map((f) => (
                <li
                  key={f}
                  className={`flex items-center gap-2 text-xs ${
                    hovered === "owner" ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  <CheckCircle
                    className={`w-3.5 h-3.5 shrink-0 ${
                      hovered === "owner" ? "text-white" : "text-[#FF6B35]"
                    }`}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div
              className={`flex items-center gap-2 font-bold text-xs sm:text-sm pt-2 ${
                hovered === "owner" ? "text-white" : "text-[#FF6B35]"
              }`}
            >
              Continue as Owner <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs sm:text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0F4C81] font-bold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
