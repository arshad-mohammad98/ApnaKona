"use client";

import { useState } from "react";
import { Heart, MessageCircle, AlertCircle, User, Bookmark, Star, MapPin, LogIn } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { DUMMY_COMPLAINTS } from "@/lib/data/complaints";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";

const SAVED_IDS = ["lst-002", "lst-003", "lst-011"];
const DUMMY_CHATS = [
  { id: "ch-1", owner: "Priya Sharma", listing: "Cozy Girls Hostel — Heart of Pune", lastMsg: "Hi! Yes, the room is still available. When would you like to visit?", time: "10:30 AM", unread: true },
  { id: "ch-2", owner: "Rajesh Kumar", listing: "Premium PG — Sector 62, Noida", lastMsg: "Sure, you can visit this Saturday between 11 AM – 2 PM.", time: "Yesterday", unread: false },
];

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"saved" | "chats" | "complaints" | "profile">("saved");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    college: user?.college || "",
    preferredCity: user?.preferredCity || "",
  });

  const savedListings = DUMMY_LISTINGS.filter((l) => SAVED_IDS.includes(l.id));
  const complaints = DUMMY_COMPLAINTS.filter((c) => c.type === "listing" || c.type === "platform").slice(0, 2);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <LogIn className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-gray-700 mb-2">Please log in</h2>
          <p className="text-gray-500 text-sm mb-5">You need to be logged in to access your dashboard.</p>
          <Link href="/login?role=student" className="px-6 py-3 bg-[#0F4C81] text-white rounded-xl font-semibold text-sm hover:bg-[#0d3f6e] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: "saved", label: "Saved", icon: Heart, count: SAVED_IDS.length },
    { key: "chats", label: "Chats", icon: MessageCircle, count: DUMMY_CHATS.filter((c) => c.unread).length },
    { key: "complaints", label: "Complaints", icon: AlertCircle, count: complaints.length },
    { key: "profile", label: "Profile", icon: User, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6db5] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.charAt(0) || "S"}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
              <p className="text-white/70 text-sm">{user?.email} • Student Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Nav */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-card border border-gray-100 mb-8 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex-1 min-w-max flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === key ? "bg-[#0F4C81] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${activeTab === key ? "bg-white/30" : "bg-[#FF6B35] text-white"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Saved Listings */}
        {activeTab === "saved" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-lg text-[#1A1A2E]">Saved Listings</h2>
              <Link href="/search" className="text-sm text-[#0F4C81] hover:underline">Browse More →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedListings.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden card-hover">
                  <div className="relative h-44 overflow-hidden">
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                    <button className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{l.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{l.locality}, {l.city}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-[#0F4C81]">₹{l.price.toLocaleString("en-IN")}<span className="text-xs text-gray-400">/mo</span></span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold">{l.rating}</span>
                      </div>
                    </div>
                    <Link href={`/listing/${l.id}`} className="block mt-3 text-center py-2 border border-[#0F4C81] text-[#0F4C81] rounded-xl text-xs font-medium hover:bg-[#0F4C81] hover:text-white transition-colors">
                      View Listing
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chats */}
        {activeTab === "chats" && (
          <div>
            <h2 className="font-display font-semibold text-lg text-[#1A1A2E] mb-5">My Inquiries & Chats</h2>
            <div className="space-y-3">
              {DUMMY_CHATS.map((chat) => (
                <div key={chat.id} className={`bg-white rounded-2xl p-5 shadow-card border flex items-start gap-4 ${chat.unread ? "border-[#0F4C81]/20" : "border-gray-100"}`}>
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white font-bold shrink-0">
                    {chat.owner.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-gray-900">{chat.owner}</p>
                      <span className="text-xs text-gray-400">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{chat.listing}</p>
                    <p className="text-sm text-gray-700 line-clamp-1">{chat.lastMsg}</p>
                  </div>
                  {chat.unread && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] shrink-0 mt-2" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complaints */}
        {activeTab === "complaints" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-lg text-[#1A1A2E]">My Complaints</h2>
              <Link href="/grievance" className="text-sm text-[#FF6B35] hover:underline">+ File New Complaint</Link>
            </div>
            <div className="space-y-4">
              {complaints.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-semibold text-sm text-gray-900">{c.subject}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === "Resolved" ? "bg-green-100 text-green-700" :
                      c.status === "Under Review" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{c.status}</span>
                  </div>
                  {c.listingName && <p className="text-xs text-gray-500 mb-2">🏠 {c.listingName}</p>}
                  <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
                  <p className="text-xs text-gray-400 mt-3">Filed: {c.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div>
            <h2 className="font-display font-semibold text-lg text-[#1A1A2E] mb-5">Profile Settings</h2>
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white font-bold text-2xl">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-bold text-gray-900">{user?.name}</p>
                  <p className="text-gray-500 text-sm">Student Account</p>
                  <button className="text-xs text-[#0F4C81] hover:underline mt-1">Change Profile Photo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Object.entries(profileForm).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                    <input type="text" value={val} onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0F4C81]" />
                  </div>
                ))}
              </div>
              <button className="mt-6 px-8 py-3 bg-[#0F4C81] text-white font-semibold rounded-xl hover:bg-[#0d3f6e] transition-colors text-sm">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
