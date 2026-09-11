"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, GraduationCap, Building2, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { DUMMY_USERS } from "@/lib/data/users";

function LoginContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "student" | "owner") || "student";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    const found = DUMMY_USERS.find((u) => u.email === email && u.role === role);
    if (found) {
      login(found as Parameters<typeof login>[0]);
    } else {
      const demo = DUMMY_USERS.find((u) => u.role === role);
      if (demo) {
        login(demo as Parameters<typeof login>[0]);
      } else {
        setError("Invalid credentials. Try using the demo account credentials below.");
        setLoading(false);
        return;
      }
    }
    router.push(role === "owner" ? "/dashboard/owner" : "/dashboard/student");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-blue-50/40 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6 sm:p-8">
          <Link href="/" className="flex items-center gap-2 mb-6 sm:mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#1a6db5] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-display font-bold text-xl text-[#1A1A2E]">
              Apna<span className="text-[#FF6B35]">Kona</span>
            </span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">Welcome back</h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">
            Sign in to access your verified bookings and messages.
          </p>

          {/* Role Toggle */}
          <div className="flex rounded-xl border border-gray-200 p-1 mb-6 bg-gray-50">
            {(["student", "owner"] as const).map((r) => (
              <Link
                key={r}
                href={`/login?role=${r}`}
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs sm:text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 transition-all min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 transition-all min-h-[44px]"
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

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#0F4C81]" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#0F4C81] font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white font-bold rounded-xl transition-colors disabled:opacity-60 min-h-[46px] cursor-pointer shadow-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs sm:text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href={`/signup?role=${role}`} className="text-[#FF6B35] font-semibold hover:underline">
              Sign up free
            </Link>
          </p>

          <div className="mt-5 p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-800">
            <strong>Demo Quick Login:</strong> Use{" "}
            <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-[11px]">aarav@example.com</code> for student or{" "}
            <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-[11px]">rajesh@example.com</code> for owner with any password.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
