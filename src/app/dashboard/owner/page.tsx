"use client";

import { useState } from "react";
import {
  Building2,
  MessageCircle,
  Star,
  AlertCircle,
  Plus,
  Eye,
  CheckCircle,
  X,
  TrendingUp,
  Users,
  LogIn,
  MapPin,
} from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { DUMMY_REVIEWS } from "@/lib/data/reviews";
import { DUMMY_COMPLAINTS } from "@/lib/data/complaints";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const OWNER_ID = "own-001";

const DUMMY_INQUIRIES = [
  {
    id: "inq-1",
    student: "Aarav Mehta",
    listing: "Sunshine PG for Boys",
    message: "Hi! Is the double sharing room available for the upcoming semester?",
    date: "2026-08-28",
    status: "Unread" as const,
  },
  {
    id: "inq-2",
    student: "Rajan Mehrotra",
    listing: "Budget PG for Boys",
    message: "What is the deposit amount? Can I pay half before moving?",
    date: "2026-08-26",
    status: "Replied" as const,
  },
  {
    id: "inq-3",
    student: "Karan Verma",
    listing: "Sunshine PG for Boys",
    message: "Is the mess strictly vegetarian or is non-veg allowed?",
    date: "2026-08-25",
    status: "Read" as const,
  },
];

export default function OwnerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"listings" | "inquiries" | "reviews" | "complaints">("listings");
  const [addListingOpen, setAddListingOpen] = useState(false);

  const ownerListings = DUMMY_LISTINGS.filter((l) => l.ownerId === OWNER_ID);
  const ownerReviews = DUMMY_REVIEWS.filter((r) => ownerListings.some((l) => l.id === r.listingId));
  const ownerComplaints = DUMMY_COMPLAINTS.filter((c) => ownerListings.some((l) => l.id === c.listingId));

  if (!isAuthenticated || user?.role !== "owner") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-gray-100 shadow-card">
          <LogIn className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-gray-800 mb-2">Owner Login Required</h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">
            Sign in as an accommodation owner to access the management portal.
          </p>
          <Link
            href="/login?role=owner"
            className="w-full flex items-center justify-center py-3 px-6 bg-[#FF6B35] hover:bg-[#e85a22] text-white rounded-xl font-bold text-sm transition-colors min-h-[44px]"
          >
            Owner Sign In
          </Link>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: "listings", label: "My Listings", icon: Building2, count: ownerListings.length },
    {
      key: "inquiries",
      label: "Inquiries",
      icon: MessageCircle,
      count: DUMMY_INQUIRIES.filter((i) => i.status === "Unread").length,
    },
    { key: "reviews", label: "Reviews", icon: Star, count: ownerReviews.length },
    { key: "complaints", label: "Complaints", icon: AlertCircle, count: ownerComplaints.length },
  ];

  const stats = [
    { icon: Eye, label: "Total Views", value: "3,842", change: "+12%" },
    { icon: Users, label: "Student Leads", value: "47", change: "+5%" },
    { icon: Star, label: "Average Rating", value: "4.5", change: "+0.2" },
    { icon: TrendingUp, label: "Active Listings", value: ownerListings.length.toString(), change: "Active" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#e85a22] text-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xl shrink-0">
                {user?.name?.charAt(0) || "O"}
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold">Owner Portal</h1>
                <p className="text-white/80 text-xs sm:text-sm">
                  {user?.name} • {user?.businessName || "Verified Property Partner"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAddListingOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#FF6B35] font-bold rounded-xl hover:bg-orange-50 transition-colors text-xs sm:text-sm shadow-md cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4" /> Add New Property
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid: 2 cols on mobile, 4 cols on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, change }) => (
            <div
              key={label}
              className="bg-white rounded-3xl p-4 sm:p-5 shadow-card border border-gray-100 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  {change}
                </span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 shadow-card border border-gray-100 mb-8 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                activeTab === key
                  ? "bg-[#FF6B35] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
                    activeTab === key ? "bg-white/30 text-white" : "bg-[#0F4C81] text-white"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Listings */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-bold text-base sm:text-lg text-gray-900">
                Your Properties ({ownerListings.length})
              </h2>
            </div>
            {ownerListings.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-card border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={l.images[0]}
                    alt={l.title}
                    loading="lazy"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary">{l.roomType}</Badge>
                      <span className="text-xs text-gray-500 font-medium">{l.sharingType} Sharing</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {l.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#0F4C81]" />
                      {l.locality}, {l.city}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 gap-2">
                  <p className="text-base sm:text-lg font-bold text-[#0F4C81]">
                    ₹{l.price.toLocaleString("en-IN")}/mo
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/hostels/${l.id}`}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors min-h-[36px] flex items-center"
                    >
                      View Live
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Inquiries */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-base sm:text-lg text-gray-900 mb-2">
              Student Inquiries ({DUMMY_INQUIRIES.length})
            </h2>
            {DUMMY_INQUIRIES.map((i) => (
              <div
                key={i.id}
                className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-sm text-gray-900">{i.student}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        i.status === "Unread"
                          ? "bg-red-100 text-red-700"
                          : i.status === "Replied"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {i.status}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-auto sm:ml-0">{i.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#0F4C81] mb-1">Re: {i.listing}</p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{i.message}</p>
                </div>
                <button className="w-full sm:w-auto px-4 py-2.5 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 min-h-[40px]">
                  Reply to Student
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-base sm:text-lg text-gray-900 mb-2">
              Student Reviews ({ownerReviews.length})
            </h2>
            {ownerReviews.map((r) => (
              <div key={r.id} className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm text-gray-900">{r.userName}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                <span className="text-[11px] text-gray-400 block mt-2">{r.date}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Complaints */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            {ownerComplaints.length > 0 ? (
              ownerComplaints.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl p-5 shadow-card border border-red-100 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-sm text-gray-900">{c.subject}</p>
                    <Badge variant="warning">{c.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">Filed by: {c.userName} • {c.createdAt}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{c.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-card">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p className="text-sm font-semibold text-gray-800">No complaints against your properties 🎉</p>
                <p className="text-xs text-gray-400 mt-1">Students love staying at your accommodations.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Listing Modal */}
      {addListingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-2xl max-h-[90dvh] overflow-y-auto shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#1A1A2E]">
                Add New Accommodation
              </h3>
              <button
                onClick={() => setAddListingOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setAddListingOpen(false);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  ["Title", "Sunshine PG for Boys — Near Campus"],
                  ["Address", "12, MG Road, Koramangala"],
                  ["City", "Bangalore"],
                  ["Locality", "Koramangala 4th Block"],
                ].map(([label, ph]) => (
                  <div key={label}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type="text"
                      placeholder={ph}
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#FF6B35] min-h-[44px]"
                    />
                  </div>
                ))}
                {[
                  ["Monthly Rent (₹)", "8500"],
                  ["Security Deposit (₹)", "17000"],
                ].map(([label, ph]) => (
                  <div key={label}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type="number"
                      placeholder={ph}
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#FF6B35] min-h-[44px]"
                    />
                  </div>
                ))}
                {[
                  ["Room Type", ["PG", "Hostel", "Flat"]],
                  ["Sharing Type", ["Single", "Double", "Triple"]],
                  ["Gender Preference", ["Boys", "Girls", "Co-Ed"]],
                  ["Furnishing", ["Fully Furnished", "Semi Furnished", "Unfurnished"]],
                ].map(([label, opts]) => (
                  <div key={label as string}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {label as string}
                    </label>
                    <select className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#FF6B35] bg-white min-h-[44px]">
                      {(opts as string[]).map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Property Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe amenities, proximity to colleges, and special house rules..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#FF6B35] resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {[
                  "AC Rooms",
                  "Mess Included",
                  "Tiffin Delivery",
                  "No Curfew",
                  "Visitors Allowed",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#FF6B35]" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddListingOpen(false)}
                  className="w-full sm:w-1/2 py-3 border border-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-1/2 py-3 bg-[#FF6B35] hover:bg-[#e85a22] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors min-h-[44px] cursor-pointer shadow-md"
                >
                  Publish Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
