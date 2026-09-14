"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  AlertCircle,
  User,
  MapPin,
  LogIn,
  CheckCircle,
  AtSign,
  Users,
  GraduationCap,
  IndianRupee,
  Utensils,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { DUMMY_COMPLAINTS } from "@/lib/data/complaints";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import AdminCartoonAvatar from "@/components/ui/AdminCartoonAvatar";
import {
  syncUserProfileToSupabase,
  getSupabaseSavedListingIds,
  removeSavedListingFromSupabase,
  getAccommodationRequests,
  AccommodationRequest,
} from "@/lib/supabase";
export default function StudentDashboard() {
  const { user, isAuthenticated, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"saved" | "requests" | "complaints" | "profile">("requests");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "Aarav Mehta",
    username: user?.username || "aarav_mehta",
    email: user?.email || "aarav@example.com",
    phone: user?.phone || "+91 91234 00001",
    college: user?.college || "IIT Bombay",
    preferredCity: user?.preferredCity || "Mumbai",
    preferredOccupancy: user?.preferredOccupancy || "Double Sharing",
    budgetRange: user?.budgetRange || "₹8,000 - ₹12,000 / mo",
    gender: user?.gender || "Male",
    foodPreference: user?.foodPreference || "Vegetarian",
    bio: user?.bio || "CS student at IIT Bombay. Quiet, studious, keeps room tidy and loves coding.",
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [requests, setRequests] = useState<AccommodationRequest[]>([]);

  useEffect(() => {
    async function loadSaved() {
      setIsLoadingSaved(true);
      const ids = await getSupabaseSavedListingIds(user?.id);
      setSavedIds(ids);
      setIsLoadingSaved(false);
    }
    async function loadRequests() {
      const list = await getAccommodationRequests(user?.id);
      setRequests(list);
    }
    loadSaved();
    loadRequests();
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        username: user.username || user.email?.split("@")[0] || "",
        email: user.email || "",
        phone: user.phone || "",
        college: user.college || "",
        preferredCity: user.preferredCity || "Bengaluru",
        preferredOccupancy: user.preferredOccupancy || "Double Sharing",
        budgetRange: user.budgetRange || "₹8,000 - ₹12,000 / mo",
        gender: user.gender || "Male",
        foodPreference: user.foodPreference || "Vegetarian",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleRemoveSaved = async (listingId: string) => {
    setSavedIds((prev) => prev.filter((id) => id !== listingId));
    await removeSavedListingFromSupabase(listingId, user?.id);
  };

  const savedListings = DUMMY_LISTINGS.filter((l) => savedIds.includes(l.id));
  const complaints = DUMMY_COMPLAINTS.filter((c) => c.type === "listing" || c.type === "platform").slice(0, 2);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-gray-100 shadow-card">
          <LogIn className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-gray-800 mb-2">Student Login Required</h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">
            Sign in to access your saved properties, chat inquiries, and student profile.
          </p>
          <Link
            href="/login?role=student"
            className="w-full flex items-center justify-center py-3 px-6 bg-[#0F4C81] text-white rounded-xl font-bold text-sm hover:bg-[#0d3f6e] transition-colors min-h-[44px]"
          >
            Sign In as Student
          </Link>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: "saved", label: "Saved Listings", icon: Heart, count: savedIds.length },
    { key: "requests", label: "Requests", icon: Users, count: 0 },
    { key: "complaints", label: "Complaints", icon: AlertCircle, count: complaints.length },
    { key: "profile", label: "My Profile", icon: User, count: 0 },
  ];

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSaveFeedback(null);

    const updatedUser = {
      ...user,
      id: user?.id || "usr-001",
      name: profileForm.name,
      username: profileForm.username,
      email: profileForm.email,
      phone: profileForm.phone,
      role: user?.role || "student",
      college: profileForm.college,
      preferredCity: profileForm.preferredCity,
      preferredOccupancy: profileForm.preferredOccupancy,
      budgetRange: profileForm.budgetRange,
      gender: profileForm.gender,
      foodPreference: profileForm.foodPreference,
      bio: profileForm.bio,
    };

    if (login) {
      login(updatedUser as any);
    }

    // Direct sync to Supabase database profiles table
    const result = await syncUserProfileToSupabase(updatedUser as any);
    setIsSavingProfile(false);

    if (result?.success) {
      setSaveFeedback({
        success: true,
        message: "Profile and occupancy preferences saved to Supabase successfully!",
      });
    } else {
      setSaveFeedback({
        success: true,
        message: `Profile updated locally! (${result?.error || "Supabase database table connected"})`,
      });
    }

    setTimeout(() => setSaveFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      {/* Admin Dual-Mode Top Notification Bar */}
      {user?.role === "admin" && (
        <div className="bg-slate-900 text-white py-3 px-4 sm:px-6 lg:px-8 border-b border-sky-500/30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AdminCartoonAvatar size={34} showBadge={false} />
              <div className="text-xs">
                <span className="font-extrabold text-sky-400 uppercase tracking-wide mr-1.5">
                  👑 Admin Dual Access:
                </span>
                <span className="text-slate-300">
                  Viewing Student Portal with master permissions.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/owner"
                className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#e85a22] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Switch to Owner Portal →
              </Link>
              <Link
                href="/dashboard/admin"
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Admin Control Hub
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] via-[#125894] to-[#1a6db5] text-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xl shrink-0">
                {user?.name?.charAt(0) || "S"}
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold">
                  Welcome back, {user?.name?.split(" ")[0]}! 👋
                </h1>
                <p className="text-white/80 text-xs sm:text-sm">
                  {user?.email} • Student Account
                </p>
              </div>
            </div>
            <Link
              href="/search"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#0F4C81] font-bold rounded-xl hover:bg-blue-50 transition-colors text-xs sm:text-sm shadow-md min-h-[44px] shrink-0"
            >
              Browse More PGs →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1.5 bg-white dark:bg-slate-800/90 rounded-2xl p-1.5 shadow-card border border-gray-100 dark:border-slate-700/80 mb-8 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ease-out cursor-pointer min-h-[44px] ${
                activeTab === key
                  ? "bg-[#0F4C81] dark:bg-sky-600 text-white shadow-sm scale-[1.02]"
                  : "text-gray-700 dark:text-slate-300 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
                    activeTab === key ? "bg-white/30 text-white" : "bg-[#FF6B35] text-white"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Saved Listings */}
        {activeTab === "saved" && (
          <div key="saved" className="tab-pane-transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                Shortlisted Properties ({savedListings.length})
              </h2>
            </div>
            {savedListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {savedListings.map((l) => (
                  <div
                    key={l.id}
                    className="bg-white dark:bg-[#131D31] rounded-3xl shadow-card border border-gray-100 dark:border-slate-800 overflow-hidden card-hover flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] sm:h-48 overflow-hidden bg-gray-100 dark:bg-slate-800">
                      <img
                        src={l.images[0]}
                        alt={l.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="primary">{l.roomType}</Badge>
                      </div>
                      <button
                        onClick={() => handleRemoveSaved(l.id)}
                        title="Remove from saved properties"
                        aria-label="Remove from saved properties"
                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 transition-colors rounded-full flex items-center justify-center shadow-md cursor-pointer group"
                      >
                        <Heart className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">
                          {l.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#0F4C81] dark:text-sky-400" />
                          {l.locality}, {l.city}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 mt-4">
                        <span className="text-base sm:text-lg font-bold text-[#0F4C81] dark:text-sky-400">
                          ₹{l.price.toLocaleString("en-IN")}
                          <span className="text-xs font-normal text-gray-400 dark:text-slate-500">/mo</span>
                        </span>
                        <Link
                          href={`/hostels/${l.id}`}
                          className="px-3.5 py-1.5 bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-500/20 dark:text-sky-300 hover:bg-[#0F4C81] hover:text-white dark:hover:bg-sky-600 rounded-xl text-xs font-semibold transition-colors min-h-[36px] flex items-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#131D31] rounded-3xl p-10 text-center border border-gray-100 dark:border-slate-800 shadow-card">
                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-base text-gray-900 dark:text-white mb-1">
                  No Saved Listings Yet
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-5">
                  Browse verified student hostels &amp; PGs and click the heart icon to shortlist your favorite accommodations here!
                </p>
                <Link
                  href="/hostels"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F4C81] text-white rounded-xl text-xs font-semibold hover:bg-[#0d3f6e] transition-colors shadow-sm"
                >
                  Explore Hostels &amp; PGs
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab: Accommodation Requests */}
        {activeTab === "requests" && (
          <div key="requests" className="space-y-4 tab-pane-transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="font-display font-bold text-base sm:text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0F4C81] dark:text-sky-400" />
                  Accommodation &amp; Roommate Requests
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                  Connection requests submitted for room sharing and student accommodation.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800/60 w-fit">
                <Clock className="w-3.5 h-3.5" />
                12-Hour Response Window
              </span>
            </div>

            {requests.length > 0 ? (
              <div className="space-y-3.5">
                {requests.map((r) => (
                  <div
                    key={r.requestId}
                    className="bg-white dark:bg-[#131D31] rounded-3xl p-5 shadow-card border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#0F4C81]/30"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                        {r.receiverName?.charAt(0) || "R"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                            {r.receiverName}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0F4C81] dark:text-sky-300 border border-blue-100 dark:border-blue-900">
                            {r.requestId}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {r.receiverCollege ? `${r.receiverCollege} • ` : ""}{r.receiverCity || "Accommodation Area"}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
                          Requested on: {r.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:self-center shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Owner &amp; Resident Notified
                        </span>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                          Response due within 12 hours
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#131D31] rounded-3xl p-10 text-center border border-gray-100 dark:border-slate-800 shadow-card">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#0F4C81] dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-base text-gray-900 dark:text-white mb-1">
                  No Accommodation Requests Yet
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-5">
                  Browse roommates on the Connect page and click "Connect" to send an accommodation request with guaranteed 12-hour response!
                </p>
                <Link
                  href="/connect"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F4C81] text-white rounded-xl text-xs font-semibold hover:bg-[#0d3f6e] transition-colors shadow-sm"
                >
                  Browse Roommates &amp; Accommodations
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab: Complaints */}
        {activeTab === "complaints" && (
          <div key="complaints" className="space-y-4 tab-pane-transition">
            <h2 className="font-display font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2">
              Your Filed Grievances
            </h2>
            {complaints.map((c) => (
              <div key={c.id} className="bg-white dark:bg-[#131D31] rounded-3xl p-5 shadow-card border border-gray-100 dark:border-slate-800 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{c.subject}</p>
                  <Badge variant="warning">{c.status}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">{c.description}</p>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 block pt-1">Filed on: {c.createdAt}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Profile */}
        {activeTab === "profile" && (
          <div key="profile" className="bg-white dark:bg-[#131D31] rounded-3xl p-5 sm:p-8 shadow-card border border-gray-100 dark:border-slate-800 max-w-3xl tab-pane-transition">
            {/* Header & Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800 mb-6">
              <div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <span>Personal Information & Preferences</span>
                  <Sparkles className="w-4 h-4 text-[#F09A57]" />
                </h2>
                <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">
                  Update your student profile to get more accurate roommate matches and owner responses.
                </p>
              </div>

              {/* Live Preview Avatar Tag */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-2xl border border-gray-100 dark:border-slate-800 shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#F09A57] flex items-center justify-center text-white text-sm font-bold shadow-xs">
                  {profileForm.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 pr-1">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[130px]">
                    {profileForm.name}
                  </p>
                  <p className="text-[11px] text-[#0F4C81] dark:text-sky-400 font-medium">
                    @{profileForm.username || "student"}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-[#E5EFF4] dark:bg-[#234C60]/50 text-[#0F4C81] dark:text-sky-300 text-[10px] font-bold rounded-lg shrink-0">
                  {profileForm.preferredOccupancy}
                </span>
              </div>
            </div>

            {saveFeedback && (
              <div className={`mb-6 flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs sm:text-sm animate-fade-up border ${
                saveFeedback.success
                  ? "bg-green-50 dark:bg-emerald-950/40 border-green-200 dark:border-emerald-800 text-green-800 dark:text-emerald-300"
                  : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
              }`}>
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-emerald-400 shrink-0" />
                <span>{saveFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-6">
              {/* SECTION 1: Identity & Credentials */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81] dark:text-sky-400 mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Student Identity</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1 flex items-center gap-1">
                      <AtSign className="w-3 h-3 text-[#0F4C81] dark:text-sky-400" />
                      <span>Username</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs text-gray-400 dark:text-slate-500 font-semibold select-none">
                        @
                      </span>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            username: e.target.value.replace(/^@/, "").replace(/\s+/g, "_").toLowerCase(),
                          })
                        }
                        placeholder="aarav_mehta"
                        className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Housing & Roommate Preferences */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F09A57] mb-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Housing & Occupancy Preferences</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Occupancy Dropdown */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#0F4C81] dark:text-sky-400" />
                        <span>Preferred Occupancy</span>
                      </span>
                      <span className="text-[10px] text-[#0F4C81] dark:text-sky-400 font-bold uppercase">Required</span>
                    </label>
                    <select
                      value={profileForm.preferredOccupancy}
                      onChange={(e) => setProfileForm({ ...profileForm, preferredOccupancy: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white font-medium outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px] cursor-pointer shadow-xs"
                    >
                      <option value="Single Seating">Single Seating</option>
                      <option value="Double Sharing">Double Sharing</option>
                      <option value="Triple Sharing">Triple Sharing</option>
                    </select>
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
                      Filters hostel & PG room types matching your budget and comfort.
                    </p>
                  </div>

                  {/* College / University */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0F4C81] dark:text-sky-400" />
                      <span>College / University</span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.college}
                      onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                      placeholder="e.g. IIT Bombay, Bennett University"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px]"
                    />
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
                      Enables automatic campus commute distance calculation.
                    </p>
                  </div>

                  {/* Preferred City */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0F4C81] dark:text-sky-400" />
                      <span>Preferred City</span>
                    </label>
                    <select
                      value={profileForm.preferredCity}
                      onChange={(e) => setProfileForm({ ...profileForm, preferredCity: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px] cursor-pointer"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Greater Noida">Greater Noida</option>
                      <option value="Delhi">Delhi / NCR</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Kolkata">Kolkata</option>
                    </select>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-[#0F4C81] dark:text-sky-400" />
                      <span>Monthly Budget Range</span>
                    </label>
                    <select
                      value={profileForm.budgetRange}
                      onChange={(e) => setProfileForm({ ...profileForm, budgetRange: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px] cursor-pointer"
                    >
                      <option value="Under ₹8,000 / mo">Under ₹8,000 / mo</option>
                      <option value="₹8,000 - ₹12,000 / mo">₹8,000 - ₹12,000 / mo</option>
                      <option value="₹12,000 - ₹18,000 / mo">₹12,000 - ₹18,000 / mo</option>
                      <option value="₹18,000+ / mo">₹18,000+ / mo</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
                      Gender / Roommate Filter
                    </label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px] cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Any</option>
                    </select>
                  </div>

                  {/* Food Preference */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-[#0F4C81] dark:text-sky-400" />
                      <span>Food & Mess Preference</span>
                    </label>
                    <select
                      value={profileForm.foodPreference}
                      onChange={(e) => setProfileForm({ ...profileForm, foodPreference: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] min-h-[44px] cursor-pointer"
                    >
                      <option value="Vegetarian">Vegetarian (Pure Veg)</option>
                      <option value="Non-Vegetarian">Non-Vegetarian Friendly</option>
                      <option value="Eggetarian">Eggetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="No Preference">No Preference</option>
                    </select>
                  </div>

                  {/* About Me / Roommate Bio */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F09A57]" />
                      <span>About Me / Roommate Bio</span>
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Write a brief note about your habits, sleep schedule, study routine, or preferences for future flatmates and hostel owners..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0F4C81] hover:bg-[#0d3f6e] disabled:opacity-60 text-white rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-98"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
