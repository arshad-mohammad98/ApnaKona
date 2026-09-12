"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowLeft,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { DUMMY_USERS } from "@/lib/data/users";
import Logo from "@/components/ui/Logo";
import AdminCartoonAvatar from "@/components/ui/AdminCartoonAvatar";

function LoginContent() {
  const searchParams = useSearchParams();
  const rawRole = searchParams.get("role");
  const role: "student" | "owner" | "admin" =
    rawRole === "admin" ? "admin" : rawRole === "owner" ? "owner" : "student";

  const [identifier, setIdentifier] = useState("");
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

    const trimmed = identifier.trim().toLowerCase();

    if (role === "admin") {
      // Check admin credentials by username or email
      const adminUser = DUMMY_USERS.find((u) => u.role === "admin");

      if (
        trimmed === "admin" ||
        trimmed === "admin@apnakona.com" ||
        trimmed === "administrator" ||
        adminUser?.email.toLowerCase() === trimmed ||
        adminUser?.username?.toLowerCase() === trimmed
      ) {
        if (adminUser) {
          login(adminUser as Parameters<typeof login>[0]);
          router.push("/dashboard/admin");
          setLoading(false);
          return;
        }
      }

      // Default demo fallback for admin if any non-empty input given
      if (adminUser) {
        login(adminUser as Parameters<typeof login>[0]);
        router.push("/dashboard/admin");
        setLoading(false);
        return;
      }

      setError("Admin account not found. Use username 'admin' to sign in.");
      setLoading(false);
      return;
    }

    // Standard Student / Owner Authentication
    const found = DUMMY_USERS.find(
      (u) =>
        (u.email.toLowerCase() === trimmed || u.username?.toLowerCase() === trimmed) &&
        u.role === role
    );

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
    <div className="min-h-screen bg-[#F7FAFC] dark:from-slate-950 dark:to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-800/95 rounded-3xl shadow-card border border-[#E2E8F0] dark:border-slate-700/80 p-6 sm:p-8 relative overflow-hidden">
          
          {/* Header Bar: Logo on left, Circular Cartoon Admin Link on right */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <Link href="/" className="inline-block" aria-label="ApnaKona Home">
              <Logo variant="full" size="md" />
            </Link>

            {/* CIRCLE LOGIN LINK WITH CARTOONISTIC ADMIN PROFILE (SOFT SKY THEME) */}
            <Link
              href={role === "admin" ? "/login?role=student" : "/login?role=admin"}
              className="group flex flex-col items-center gap-1.5 focus:outline-none select-none"
              title={role === "admin" ? "Switch back to User/Owner Login" : "Admin Login — Access both Owner & User"}
            >
              <div
                className={`relative rounded-full p-1 transition-all duration-200 ${
                  role === "admin"
                    ? "border-2 border-[#2A556A] dark:border-[#4A7C94] bg-[#D9E8EF]/60 dark:bg-[#2A556A]/40 scale-105 shadow-xs"
                    : "border-2 border-[#D9E8EF] dark:border-slate-700 hover:border-[#2A556A] dark:hover:border-[#4A7C94] hover:scale-105"
                }`}
              >
                <AdminCartoonAvatar size={50} showBadge={false} />
              </div>
              <span
                className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full transition-colors ${
                  role === "admin"
                    ? "bg-[#2A556A] text-white shadow-xs"
                    : "bg-[#D9E8EF] dark:bg-slate-800 text-[#122733] dark:text-[#D9E8EF] border border-[#2A556A]/20 dark:border-slate-700 group-hover:bg-[#2A556A] group-hover:text-white"
                }`}
              >
                {role === "admin" ? "Admin Mode" : "Admin Login"}
              </span>
            </Link>
          </div>

          {/* Heading and description depending on active role */}
          {role === "admin" ? (
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D9E8EF] dark:bg-[#2A556A]/40 text-[#122733] dark:text-[#D9E8EF] border border-[#2A556A]/25 mb-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2A556A] dark:text-[#4A7C94]" />
                Master Admin Privileges
              </div>
              <h1 className="font-display text-2xl font-bold text-[#0B132B] dark:text-white mb-1">
                Admin Control Panel
              </h1>
              <p className="text-[#334155] dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Sign in with your admin credentials to access and manage both <strong>Owner</strong> and <strong>User</strong> portals simultaneously.
              </p>
            </div>
          ) : (
            <div className="mb-5">
              <h1 className="font-display text-2xl font-bold text-[#0B132B] dark:text-white mb-1">
                Welcome back
              </h1>
              <p className="text-[#334155] dark:text-slate-300 text-xs sm:text-sm">
                Sign in to access your verified bookings, listings, and messages.
              </p>
            </div>
          )}

          {/* Role Selector or Admin Active State */}
          {role === "admin" ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#D9E8EF]/60 dark:bg-[#2A556A]/40 border border-[#2A556A]/25 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#122733] dark:text-[#D9E8EF]">
                <ShieldCheck className="w-4 h-4 text-[#2A556A] dark:text-[#4A7C94] shrink-0" />
                <span>Dual Access: User &amp; Owner Systems</span>
              </div>
              <Link
                href="/login?role=student"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2A556A] dark:text-[#4A7C94] hover:underline shrink-0"
              >
                <ArrowLeft className="w-3 h-3" /> Standard Login
              </Link>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex rounded-xl border border-[#CBD5E1] dark:border-slate-700 p-1 bg-[#F7FAFC] dark:bg-slate-900">
                {(["student", "owner"] as const).map((r) => (
                  <Link
                    key={r}
                    href={`/login?role=${r}`}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ease-out min-h-[40px] ${
                      role === r
                        ? "bg-[#F4A261] text-white shadow-sm scale-[1.01]"
                        : "text-[#334155] dark:text-slate-300 hover:text-[#0B132B] dark:hover:text-white"
                    }`}
                  >
                    {r === "student" ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                    {r === "student" ? "User" : "Owner"}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-xs sm:text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL ID OR USERNAME INPUT */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                {role === "admin" ? "Email ID or Username" : "Email Address"}
              </label>
              <div className="relative">
                {role === "admin" ? (
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A556A] dark:text-[#4A7C94]" />
                ) : (
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] dark:text-slate-500" />
                )}
                <input
                  id="login-identifier"
                  type={role === "admin" ? "text" : "email"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    role === "admin"
                      ? "Enter admin username or email (e.g. admin)"
                      : role === "owner"
                      ? "owner@properties.com"
                      : "user@example.com"
                  }
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder-[#475569] dark:placeholder-gray-400 border border-[#CBD5E1] dark:border-slate-700 focus:border-[#2A556A] dark:focus:border-[#4A7C94] focus:ring-2 focus:ring-[#2A556A]/15 rounded-xl text-xs sm:text-sm outline-none transition-all min-h-[44px] font-medium"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                {role === "admin" ? "Admin Password" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] dark:text-slate-500" />
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder-[#475569] dark:placeholder-gray-400 border border-[#CBD5E1] dark:border-slate-700 focus:border-[#2A556A] dark:focus:border-[#4A7C94] focus:ring-2 focus:ring-[#2A556A]/15 rounded-xl text-xs sm:text-sm outline-none transition-all min-h-[44px] font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#0B132B] min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-[#334155] dark:text-slate-300 font-medium cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-[#CBD5E1] accent-[#2A556A]" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#2A556A] dark:text-[#4A7C94] font-bold hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-bold rounded-xl transition-colors disabled:opacity-60 min-h-[46px] cursor-pointer shadow-sm bg-[#F4A261] hover:bg-[#e7924e] shadow-[#F4A261]/25"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {role === "admin"
                      ? "Sign In to Admin Control Panel"
                      : `Sign In as ${role === "owner" ? "Owner" : "User"}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {role !== "admin" ? (
            <p className="text-center text-[#64748B] dark:text-slate-400 text-xs sm:text-sm mt-6">
              Don&apos;t have an account?{" "}
              <Link href={`/signup?role=${role}`} className="text-[#F4A261] font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          ) : (
            <p className="text-center text-[#64748B] dark:text-slate-400 text-xs sm:text-sm mt-6">
              Access restricted to verified platform administrators.
            </p>
          )}

          {/* Quick Demo Credentials Helper */}
          <div className="mt-5 p-3.5 bg-[#D9E8EF]/60 dark:bg-slate-900/80 border border-[#2A556A]/20 dark:border-slate-700 rounded-2xl text-xs text-[#122733] dark:text-[#D9E8EF]">
            {role === "admin" ? (
              <div>
                <strong className="text-[#2A556A] dark:text-[#4A7C94]">👑 Admin Demo Credentials:</strong>
                <p className="mt-1 text-[11px] text-[#1F2937] dark:text-slate-300">
                  Enter username <code className="bg-[#D9E8EF] dark:bg-[#2A556A]/80 text-[#122733] dark:text-[#D9E8EF] px-1.5 py-0.5 rounded font-mono font-bold">admin</code> or email <code className="bg-[#D9E8EF] dark:bg-[#2A556A]/80 text-[#122733] dark:text-[#D9E8EF] px-1.5 py-0.5 rounded font-mono font-bold">admin@apnakona.com</code> with any password to access both Owner &amp; User controls.
                </p>
              </div>
            ) : (
              <div>
                <strong>Demo Quick Login:</strong> Use{" "}
                <code className="bg-white/80 dark:bg-blue-900/60 text-[#122733] px-1.5 py-0.5 rounded font-mono text-[11px] border border-[#2A556A]/20">aarav@example.com</code> for user or{" "}
                <code className="bg-white/80 dark:bg-blue-900/60 text-[#122733] px-1.5 py-0.5 rounded font-mono text-[11px] border border-[#2A556A]/20">rajesh@example.com</code> for owner with any password.
              </div>
            )}
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
          <div className="w-8 h-8 border-4 border-[#2A556A] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
