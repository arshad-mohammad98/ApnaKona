"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, GraduationCap, Building2, Mail, Lock, Phone, User, MapPin, ArrowRight, Upload } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const CITIES = ["Bangalore", "Pune", "Delhi", "Mumbai", "Chennai", "Hyderabad", "Noida", "Kolkata", "Jaipur", "Ahmedabad"];

function SignupContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "student" | "owner") || "student";
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    college: "", preferredCity: "", businessName: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    login({
      id: `new-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      role,
      college: form.college || undefined,
      preferredCity: form.preferredCity || undefined,
      businessName: form.businessName || undefined,
    });
    router.push(role === "owner" ? "/dashboard/owner" : "/dashboard/student");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-blue-50/30 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#1a6db5] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-display font-bold text-xl text-[#1A1A2E]">
              Apna<span className="text-[#FF6B35]">Kona</span>
            </span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">
            Join as a {role === "owner" ? "Property Owner" : "Student"}
          </p>

          {/* Role Toggle */}
          <div className="flex rounded-xl border border-gray-200 p-1 mb-6">
            {(["student", "owner"] as const).map((r) => (
              <Link
                key={r}
                href={`/signup?role=${r}`}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  role === r ? "bg-[#0F4C81] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r === "student" ? <GraduationCap className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                {r === "student" ? "Student" : "Owner"}
              </Link>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Aarav Mehta"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81] transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81] transition-colors"
                />
              </div>
            </div>

            {/* Role-specific fields */}
            {role === "student" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    College / Company <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="signup-college"
                    type="text"
                    value={form.college}
                    onChange={(e) => update("college", e.target.value)}
                    placeholder="IIT Bombay / Infosys"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      id="signup-city"
                      value={form.preferredCity}
                      onChange={(e) => update("preferredCity", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81] transition-colors appearance-none bg-white"
                    >
                      <option value="">Select a city</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Property / Business Name</label>
                  <input
                    id="signup-business"
                    type="text"
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    placeholder="Kumar Properties"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Govt ID / Verification Doc <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-[#0F4C81]/40 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-400 text-center">Click to upload Aadhar / PAN / Trade License</span>
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              By signing up, you agree to our{" "}
              <a href="#" className="text-[#0F4C81] underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-[#0F4C81] underline">Privacy Policy</a>.
            </p>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF6B35] hover:bg-[#e85a22] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ArrowRight className="w-4 h-4" /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link href={`/login?role=${role}`} className="text-[#0F4C81] font-medium hover:underline">
              Sign in
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
