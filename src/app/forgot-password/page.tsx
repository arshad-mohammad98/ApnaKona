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
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-blue-50/30 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
          <Link href="/login" className="flex items-center gap-2 text-gray-500 hover:text-[#0F4C81] text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          {!sent ? (
            <>
              <div className="w-14 h-14 bg-[#0F4C81]/10 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-[#0F4C81]" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#1A1A2E] mb-2">Forgot your password?</h1>
              <p className="text-gray-500 text-sm mb-8">
                Enter your registered email address. We&apos;ll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81] transition-colors"
                    />
                  </div>
                </div>
                <button
                  id="forgot-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#1A1A2E] mb-2">Check your email!</h2>
              <p className="text-gray-500 text-sm mb-2">
                We&apos;ve sent a password reset link to
              </p>
              <p className="font-semibold text-[#0F4C81] mb-6">{email}</p>
              <p className="text-gray-400 text-xs mb-8">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button onClick={() => setSent(false)} className="text-[#FF6B35] hover:underline">
                  try again
                </button>.
              </p>
              <Link href="/login" className="inline-block px-6 py-3 bg-[#0F4C81] text-white font-medium rounded-xl text-sm hover:bg-[#0d3f6e] transition-colors">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
