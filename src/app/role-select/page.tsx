"use client";

import Link from "next/link";
import { GraduationCap, Building2, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelectPage() {
  const [hovered, setHovered] = useState<"student" | "owner" | null>(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-blue-50/30 flex items-center justify-center py-16 px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#1a6db5] flex items-center justify-center shadow-md">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-display font-bold text-2xl text-[#1A1A2E]">
              Apna<span className="text-[#FF6B35]">Kona</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-3">
            Who are you joining as?
          </h1>
          <p className="text-gray-500">Choose your role to get the experience made for you.</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Student */}
          <button
            id="role-student-btn"
            onClick={() => router.push("/signup?role=student")}
            onMouseEnter={() => setHovered("student")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative p-8 rounded-3xl border-2 text-left transition-all duration-300 cursor-pointer ${
              hovered === "student"
                ? "border-[#0F4C81] bg-[#0F4C81] shadow-xl shadow-blue-500/20"
                : "border-gray-200 bg-white hover:border-[#0F4C81]/40"
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              hovered === "student" ? "bg-white/20" : "bg-[#0F4C81]/10"
            }`}>
              <GraduationCap className={`w-8 h-8 ${hovered === "student" ? "text-white" : "text-[#0F4C81]"}`} />
            </div>
            <h2 className={`font-display text-2xl font-bold mb-2 ${hovered === "student" ? "text-white" : "text-[#1A1A2E]"}`}>
              I&apos;m a Student
            </h2>
            <p className={`text-sm mb-6 leading-relaxed ${hovered === "student" ? "text-white/80" : "text-gray-500"}`}>
              Looking for a PG, hostel, or flat near my college or workplace.
            </p>
            <ul className="space-y-2 mb-6">
              {["Search & filter 50,000+ listings", "Save favourites & chat owners", "Find roommates", "File complaints"].map((f) => (
                <li key={f} className={`flex items-center gap-2 text-xs ${hovered === "student" ? "text-white/80" : "text-gray-500"}`}>
                  <CheckCircle className={`w-3.5 h-3.5 ${hovered === "student" ? "text-[#FF6B35]" : "text-[#0F4C81]"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <div className={`flex items-center gap-2 font-semibold text-sm ${hovered === "student" ? "text-[#FF6B35]" : "text-[#0F4C81]"}`}>
              Continue as Student <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Owner */}
          <button
            id="role-owner-btn"
            onClick={() => router.push("/signup?role=owner")}
            onMouseEnter={() => setHovered("owner")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative p-8 rounded-3xl border-2 text-left transition-all duration-300 cursor-pointer ${
              hovered === "owner"
                ? "border-[#FF6B35] bg-[#FF6B35] shadow-xl shadow-orange-500/20"
                : "border-gray-200 bg-white hover:border-[#FF6B35]/40"
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              hovered === "owner" ? "bg-white/20" : "bg-[#FF6B35]/10"
            }`}>
              <Building2 className={`w-8 h-8 ${hovered === "owner" ? "text-white" : "text-[#FF6B35]"}`} />
            </div>
            <h2 className={`font-display text-2xl font-bold mb-2 ${hovered === "owner" ? "text-white" : "text-[#1A1A2E]"}`}>
              I&apos;m an Owner
            </h2>
            <p className={`text-sm mb-6 leading-relaxed ${hovered === "owner" ? "text-white/80" : "text-gray-500"}`}>
              I own a PG, hostel, or flat and want to list it to reach students.
            </p>
            <ul className="space-y-2 mb-6">
              {["List properties for free", "Manage leads & inquiries", "Respond to reviews", "Trusted by 10,000+ owners"].map((f) => (
                <li key={f} className={`flex items-center gap-2 text-xs ${hovered === "owner" ? "text-white/80" : "text-gray-500"}`}>
                  <CheckCircle className={`w-3.5 h-3.5 ${hovered === "owner" ? "text-white" : "text-[#FF6B35]"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <div className={`flex items-center gap-2 font-semibold text-sm ${hovered === "owner" ? "text-white" : "text-[#FF6B35]"}`}>
              Continue as Owner <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0F4C81] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
