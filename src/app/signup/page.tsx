"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, GraduationCap, Building2, Mail, Lock, Phone, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import Logo from "@/components/ui/Logo";
import { registerUserProfile } from "@/lib/supabase";

function SignupContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "student" | "owner") || "student";
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    college: "",
    preferredCity: "Bengaluru",
    preferredOccupancy: "Double Sharing",
    budgetRange: "₹8,000 - ₹12,000 / mo",
    gender: "Male",
    foodPreference: "Vegetarian",
    businessName: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Quick client validations
    const cleanUser = form.username.trim().toLowerCase().replace(/^@/, "");
    if (!cleanUser || cleanUser.length < 3) {
      setError("Username must be at least 3 characters long.");
      setLoading(false);
      return;
    }
    if (!/^[a-zA-Z0-9._]+$/.test(cleanUser)) {
      setError("Username can only contain letters, numbers, underscores (_), and dots (.).");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await registerUserProfile({
        name: form.name.trim(),
        username: cleanUser,
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role,
        college: form.college.trim() || undefined,
        preferredCity: form.preferredCity.trim() || undefined,
        preferredOccupancy: role === "student" ? form.preferredOccupancy : undefined,
        budgetRange: role === "student" ? form.budgetRange : undefined,
        gender: role === "student" ? form.gender : undefined,
        foodPreference: role === "student" ? form.foodPreference : undefined,
        businessName: role === "owner" ? form.businessName.trim() : undefined,
      });

      if (!res.success || !res.user) {
        setError(res.error || "Failed to create account. Please check your inputs.");
        setLoading(false);
        return;
      }

      // Log in the newly registered user with all preferences
      login(res.user);

      // Explicit hard redirect directly to the Home page (/)
      if (typeof window !== "undefined") {
        window.location.replace("/");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-800/95 rounded-3xl shadow-card border border-[#E2E8F0] dark:border-slate-700/80 p-6 sm:p-8">
          <Link href="/" className="inline-block mb-6 sm:mb-8" aria-label="ApnaKona Home">
            <Logo variant="full" size="md" />
          </Link>

          <h1 className="font-display text-2xl font-bold text-[#0B132B] dark:text-white mb-1">Create an account</h1>
          <p className="text-[#334155] dark:text-slate-300 text-xs sm:text-sm mb-6">
            Join ApnaKona as a {role === "owner" ? "Property Owner" : "User / Student"}
          </p>

          {/* Role Selector */}
          <div className="flex rounded-xl border border-[#CBD5E1] dark:border-slate-700 p-1 mb-6 bg-[#F7FAFC] dark:bg-slate-900">
            {(["student", "owner"] as const).map((r) => (
              <Link
                key={r}
                href={`/signup?role=${r}`}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ease-out min-h-[40px] ${
                  role === r
                    ? "bg-[#F4A261] text-white shadow-sm scale-[1.01]"
                    : "text-[#334155] dark:text-slate-300 hover:text-[#0B132B] dark:hover:text-white"
                }`}
              >
                {r === "student" ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                {r === "student" ? "User / Student" : "Owner"}
              </Link>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-xs sm:text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] dark:text-slate-500" />
                <input
                  id="signup-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Aarav Mehta"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder-[#475569] dark:placeholder-gray-400 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] dark:focus:border-[#4A7C94] focus:ring-2 focus:ring-[#2A556A]/15 min-h-[44px] font-medium"
                />
              </div>
            </div>

            {/* Choose Unique Username */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200">
                  Choose Username
                </label>
                <span className="text-[11px] text-[#64748B]">Used for login &amp; roommate profile</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#475569] dark:text-slate-500 text-sm select-none">
                  @
                </span>
                <input
                  id="signup-username"
                  type="text"
                  value={form.username}
                  onChange={(e) => update("username", e.target.value.toLowerCase().replace(/\s+/g, ""))}
                  placeholder="aarav_mehta"
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder-[#475569] dark:placeholder-gray-400 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] dark:focus:border-[#4A7C94] focus:ring-2 focus:ring-[#2A556A]/15 min-h-[44px] font-medium"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] dark:text-slate-500" />
                <input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="aarav@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder-[#475569] dark:placeholder-gray-400 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] dark:focus:border-[#4A7C94] focus:ring-2 focus:ring-[#2A556A]/15 min-h-[44px] font-medium"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                <input
                  id="signup-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] focus:ring-2 focus:ring-[#2A556A]/15 min-h-[44px] bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder-[#475569] font-medium"
                />
              </div>
            </div>

            {/* Set Password */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                Set Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full pl-11 pr-11 py-3 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] focus:ring-2 focus:ring-[#2A556A]/15 min-h-[44px] bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder-[#475569] font-medium"
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

            {/* Student specific preferences */}
            {role === "student" ? (
              <>
                <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-700/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2A556A] dark:text-[#4A7C94] mb-3">
                    Living &amp; Room Preferences
                  </p>
                </div>

                {/* College or Workplace */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                    College / Workplace
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input
                      id="signup-college"
                      type="text"
                      value={form.college}
                      onChange={(e) => update("college", e.target.value)}
                      placeholder="e.g. IIT Bombay / St. Xavier's / Infosys"
                      className="w-full pl-11 pr-4 py-3 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] focus:ring-2 focus:ring-[#2A556A]/15 min-h-[44px] bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder-[#475569] font-medium"
                    />
                  </div>
                </div>

                {/* Preferred City & Occupancy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                      Preferred City
                    </label>
                    <select
                      id="signup-city"
                      value={form.preferredCity}
                      onChange={(e) => update("preferredCity", e.target.value)}
                      className="w-full px-3 py-3 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white font-medium"
                    >
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Pune">Pune</option>
                      <option value="Kota">Kota</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Kolkata">Kolkata</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                      Room Occupancy
                    </label>
                    <select
                      id="signup-occupancy"
                      value={form.preferredOccupancy}
                      onChange={(e) => update("preferredOccupancy", e.target.value)}
                      className="w-full px-3 py-3 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white font-medium"
                    >
                      <option value="Single Seating">Single Seating</option>
                      <option value="Double Sharing">Double Sharing</option>
                      <option value="Triple Sharing">Triple Sharing</option>
                      <option value="Any Occupancy">Any Occupancy</option>
                    </select>
                  </div>
                </div>

                {/* Budget Range & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                      Monthly Budget
                    </label>
                    <select
                      id="signup-budget"
                      value={form.budgetRange}
                      onChange={(e) => update("budgetRange", e.target.value)}
                      className="w-full px-3 py-3 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white font-medium"
                    >
                      <option value="₹5,000 - ₹8,000 / mo">₹5,000 - ₹8,000 / mo</option>
                      <option value="₹8,000 - ₹12,000 / mo">₹8,000 - ₹12,000 / mo</option>
                      <option value="₹12,000 - ₹18,000 / mo">₹12,000 - ₹18,000 / mo</option>
                      <option value="₹18,000+ / mo">₹18,000+ / mo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                      Gender
                    </label>
                    <select
                      id="signup-gender"
                      value={form.gender}
                      onChange={(e) => update("gender", e.target.value)}
                      className="w-full px-3 py-3 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Any</option>
                    </select>
                  </div>
                </div>

                {/* Food Preference */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                    Dietary Preference
                  </label>
                  <select
                    id="signup-food"
                    value={form.foodPreference}
                    onChange={(e) => update("foodPreference", e.target.value)}
                    className="w-full px-3 py-3 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white font-medium"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Any / No Preference">Any / No Preference</option>
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0B132B] dark:text-slate-200 mb-1.5">
                  Property / Hostel Brand Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                  <input
                    id="signup-business"
                    type="text"
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    placeholder="e.g. Royal Living PG &amp; Hostels"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] focus:ring-2 focus:ring-[#2A556A]/15 min-h-[44px] bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder-[#475569] font-medium"
                  />
                </div>
              </div>
            )}

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#F4A261] hover:bg-[#e7924e] text-white font-bold rounded-xl transition-colors disabled:opacity-60 min-h-[46px] cursor-pointer shadow-sm shadow-[#F4A261]/25 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account &amp; Save Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#334155] dark:text-slate-400 text-xs sm:text-sm mt-6">
            Already have an account?{" "}
            <Link href={`/login?role=${role}`} className="text-[#2A556A] dark:text-[#4A7C94] font-bold hover:underline">
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
          <div className="w-8 h-8 border-4 border-[#2A556A] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
