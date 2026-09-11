"use client";

import { useState } from "react";
import { Heart, MessageCircle, AlertCircle, User, MapPin, LogIn, CheckCircle } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { DUMMY_COMPLAINTS } from "@/lib/data/complaints";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const SAVED_IDS = ["lst-002", "lst-003", "lst-011"];
const DUMMY_CHATS = [
  {
    id: "ch-1",
    owner: "Priya Sharma",
    listing: "Cozy Girls Hostel — Heart of Pune",
    lastMsg: "Hi! Yes, the room is still available. When would you like to visit?",
    time: "10:30 AM",
    unread: true,
  },
  {
    id: "ch-2",
    owner: "Rajesh Kumar",
    listing: "Premium PG — Sector 62, Noida",
    lastMsg: "Sure, you can visit this Saturday between 11 AM – 2 PM.",
    time: "Yesterday",
    unread: false,
  },
];

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"saved" | "chats" | "complaints" | "profile">("saved");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "Aarav Mehta",
    email: user?.email || "aarav@example.com",
    phone: user?.phone || "+91 98765 43210",
    college: user?.college || "IIT Bombay",
    preferredCity: user?.preferredCity || "Mumbai",
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const savedListings = DUMMY_LISTINGS.filter((l) => SAVED_IDS.includes(l.id));
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
    { key: "saved", label: "Saved Listings", icon: Heart, count: SAVED_IDS.length },
    { key: "chats", label: "Chats", icon: MessageCircle, count: DUMMY_CHATS.filter((c) => c.unread).length },
    { key: "complaints", label: "Complaints", icon: AlertCircle, count: complaints.length },
    { key: "profile", label: "My Profile", icon: User, count: 0 },
  ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
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
        <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 shadow-card border border-gray-100 mb-8 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                activeTab === key
                  ? "bg-[#0F4C81] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-base sm:text-lg text-gray-900">
                Shortlisted Properties ({savedListings.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {savedListings.map((l) => (
                <div
                  key={l.id}
                  className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden card-hover flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] sm:h-48 overflow-hidden bg-gray-100">
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
                      aria-label="Saved to favorites"
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1">
                        {l.title}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0F4C81]" />
                        {l.locality}, {l.city}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                      <span className="text-base sm:text-lg font-bold text-[#0F4C81]">
                        ₹{l.price.toLocaleString("en-IN")}/mo
                      </span>
                      <Link
                        href={`/listing/${l.id}`}
                        className="px-3.5 py-1.5 bg-[#0F4C81]/10 text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white rounded-xl text-xs font-semibold transition-colors min-h-[36px] flex items-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Chats */}
        {activeTab === "chats" && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-base sm:text-lg text-gray-900 mb-2">
              Messages with Property Owners
            </h2>
            {DUMMY_CHATS.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm sm:text-base text-gray-900">{c.owner}</span>
                    {c.unread && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto sm:ml-0">{c.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#0F4C81] mb-1">{c.listing}</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{c.lastMsg}</p>
                </div>
                <button className="w-full sm:w-auto px-4 py-2.5 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shrink-0 min-h-[40px]">
                  Open Conversation
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Complaints */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-base sm:text-lg text-gray-900 mb-2">
              Your Filed Grievances
            </h2>
            {complaints.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm text-gray-900">{c.subject}</p>
                  <Badge variant="warning">{c.status}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{c.description}</p>
                <span className="text-[11px] text-gray-400 block pt-1">Filed on: {c.createdAt}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Profile */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-card border border-gray-100 max-w-2xl">
            <h2 className="font-display font-bold text-base sm:text-lg text-gray-900 mb-1">
              Personal Information
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Update your student profile to get more accurate roommate matches and owner responses.
            </p>

            {savedSuccess && (
              <div className="mb-5 flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-xs sm:text-sm animate-fade-up">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                Profile changes saved successfully!
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">College / University</label>
                  <input
                    type="text"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors min-h-[44px] cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
