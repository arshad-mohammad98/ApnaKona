"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-blue-50/40 dark:from-[#0B1120] dark:to-[#0F172A] flex items-center justify-center py-12 px-4 sm:px-6 transition-colors">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-[#131D31] rounded-3xl shadow-card border border-gray-100 dark:border-slate-800 p-6 sm:p-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-[#0F4C81] dark:hover:text-blue-400 text-xs sm:text-sm mb-6 transition-colors min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          {!sent ? (
            <>
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#0F4C81]/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-5">
                <Mail className="w-6 sm:w-7 h-6 sm:h-7 text-[#0F4C81] dark:text-blue-400" />
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
                Forgot password?
              </h1>
              <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Enter your registered college or personal email address to receive password recovery instructions.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                    />
                  </div>
                </div>
                <button
                  id="forgot-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#0F4C81] hover:bg-[#0d3f6e] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 min-h-[46px] cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 sm:w-16 h-14 sm:h-16 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 sm:w-8 h-7 sm:h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email!</h2>
              <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mb-2">
                We&apos;ve dispatched a recovery link to:
              </p>
              <p className="font-bold text-[#0F4C81] dark:text-blue-400 text-sm sm:text-base mb-6 break-all">{email}</p>
              <p className="text-gray-500 dark:text-slate-500 text-xs mb-6">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-[#FF6B35] font-semibold hover:underline cursor-pointer"
                >
                  try again
                </button>
                .
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0F4C81] hover:bg-[#0d3f6e] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors min-h-[44px] w-full"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
