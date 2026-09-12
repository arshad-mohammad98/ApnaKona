"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, GraduationCap, Building2, Mail, Lock, Phone, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import Logo from "@/components/ui/Logo";

function SignupContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "student" | "owner") || "student";
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    college: "",
    preferredCity: "",
    businessName: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role,
          college: form.college || undefined,
          preferredCity: form.preferredCity || undefined,
          businessName: form.businessName || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok && data.error) {
        setErrorMsg(data.error);
        setLoading(false);
        return;
      }

      login(
        data.user || {
          id: `new-${Date.now()}`,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role,
          college: form.college || undefined,
          preferredCity: form.preferredCity || undefined,
          businessName: form.businessName || undefined,
        }
      );

      router.push(role === "owner" ? "/dashboard/owner" : "/dashboard/student");
    } catch (err: unknown) {
      console.error("Signup failed:", err);
      setErrorMsg("Failed to connect to database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-blue-50/40 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6 sm:p-8">
          <Link href="/" className="inline-block mb-6 sm:mb-8" aria-label="ApnaKona Home">
            <Logo variant="full" size="md" />
          </Link>

          <h1 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">Create an account</h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">
            Join ApnaKona as a {role === "owner" ? "Property Owner" : "Student"}
          </p>

          {/* Role Selector */}
          <div className="flex rounded-xl border border-gray-200 p-1 mb-6 bg-gray-50">
            {(["student", "owner"] as const).map((r) => (
              <Link
                key={r}
                href={`/signup?role=${r}`}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors min-h-[40px] ${
                  role === r
                    ? "bg-[#0F4C81] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {r === "student" ? <GraduationCap className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                {r === "student" ? "Student" : "Owner"}
              </Link>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Aarav Mehta"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="aarav@college.edu"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                />
              </div>
            </div>

            {/* College or Business Name */}
            {role === "student" ? (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  College / University
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="signup-college"
                    type="text"
                    value={form.college}
                    onChange={(e) => update("college", e.target.value)}
                    placeholder="IIT Bombay / Symbiosis Pune"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Property / Hostel Brand Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="signup-business"
                    type="text"
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    placeholder="e.g. Royal PG &amp; Hostels"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Set Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100">
                {errorMsg}
              </div>
            )}

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FF6B35] hover:bg-[#e85a22] text-white font-bold rounded-xl transition-colors disabled:opacity-60 min-h-[46px] cursor-pointer shadow-sm shadow-orange-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs sm:text-sm mt-6">
            Already have an account?{" "}
            <Link href={`/login?role=${role}`} className="text-[#0F4C81] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
