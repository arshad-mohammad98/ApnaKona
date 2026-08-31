"use client";

import { useState } from "react";
import {
  Building2, MessageCircle, Star, AlertCircle, Plus, Edit2, Trash2,
  Eye, CheckCircle, X, TrendingUp, Users, LogIn
} from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { DUMMY_REVIEWS } from "@/lib/data/reviews";
import { DUMMY_COMPLAINTS } from "@/lib/data/complaints";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";

const OWNER_ID = "own-001";

const DUMMY_INQUIRIES = [
  { id: "inq-1", student: "Aarav Mehta", listing: "Sunshine PG for Boys", message: "Hi! Is the double room still available for September?", date: "2026-08-28", status: "Unread" as const },
  { id: "inq-2", student: "Rajan Mehrotra", listing: "Budget PG for Boys", message: "What is the deposit amount? Can I pay in installments?", date: "2026-08-26", status: "Replied" as const },
  { id: "inq-3", student: "Karan Verma", listing: "Sunshine PG for Boys", message: "Is the mess vegetarian-only?", date: "2026-08-25", status: "Read" as const },
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
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <LogIn className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-gray-700 mb-2">Owner Login Required</h2>
          <p className="text-gray-500 text-sm mb-5">Sign in as a property owner to access this dashboard.</p>
          <Link href="/login?role=owner" className="px-6 py-3 bg-[#FF6B35] text-white rounded-xl font-semibold text-sm hover:bg-[#e85a22] transition-colors">
            Owner Sign In
          </Link>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: "listings", label: "My Listings", icon: Building2, count: ownerListings.length },
    { key: "inquiries", label: "Inquiries", icon: MessageCircle, count: DUMMY_INQUIRIES.filter((i) => i.status === "Unread").length },
    { key: "reviews", label: "Reviews", icon: Star, count: ownerReviews.length },
    { key: "complaints", label: "Complaints", icon: AlertCircle, count: ownerComplaints.length },
  ];

  const stats = [
    { icon: Eye, label: "Total Views", value: "3,842", change: "+12%" },
    { icon: Users, label: "Total Inquiries", value: "47", change: "+5%" },
    { icon: Star, label: "Avg Rating", value: "4.5", change: "+0.2" },
    { icon: TrendingUp, label: "Listings Active", value: ownerListings.length.toString(), change: "—" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#e85a22] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                {user?.name?.charAt(0) || "O"}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">Owner Dashboard</h1>
                <p className="text-white/80 text-sm">{user?.name} • {user?.businessName || "Property Owner"}</p>
              </div>
            </div>
            <button
              onClick={() => setAddListingOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#FF6B35] font-semibold rounded-xl hover:bg-orange-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add Listing
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, change }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{change}</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-card border border-gray-100 mb-8 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex-1 min-w-max flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === key ? "bg-[#FF6B35] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${activeTab === key ? "bg-white/30" : "bg-[#0F4C81] text-white"}`}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* My Listings */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {ownerListings.map((l) => (
              <div key={l.id} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <div className="flex items-start gap-4 p-5">
                  <img src={l.images[0]} alt={l.title} className="w-24 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900">{l.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{l.locality}, {l.city}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${l.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {l.available ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="font-bold text-[#0F4C81] text-base">₹{l.price.toLocaleString("en-IN")}/mo</span>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{l.rating} ({l.reviewCount} reviews)</span>
                      <span>{l.roomType} • {l.sharingType} • {l.genderPref}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-3 bg-gray-50/50">
                  <Link href={`/listing/${l.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#0F4C81] border border-gray-200 rounded-lg hover:border-[#0F4C81]/40 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#FF6B35] border border-gray-200 rounded-lg hover:border-[#FF6B35]/40 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-500 border border-gray-200 rounded-lg hover:border-red-200 transition-colors ml-auto">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setAddListingOpen(true)}
              className="w-full py-4 border-2 border-dashed border-[#FF6B35]/40 rounded-2xl text-[#FF6B35] font-medium text-sm hover:bg-[#FF6B35]/5 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add New Listing
            </button>
          </div>
        )}

        {/* Inquiries */}
        {activeTab === "inquiries" && (
          <div className="space-y-3">
            {DUMMY_INQUIRIES.map((inq) => (
              <div key={inq.id} className={`bg-white rounded-2xl p-5 shadow-card border ${inq.status === "Unread" ? "border-[#FF6B35]/30" : "border-gray-100"}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {inq.student.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{inq.student}</p>
                      <p className="text-xs text-gray-500">re: {inq.listing}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      inq.status === "Unread" ? "bg-[#FF6B35]/10 text-[#FF6B35]" :
                      inq.status === "Replied" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>{inq.status}</span>
                    <span className="text-xs text-gray-400">{inq.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{inq.message}</p>
                <button className="px-4 py-2 bg-[#0F4C81] text-white rounded-xl text-xs font-medium hover:bg-[#0d3f6e] transition-colors">
                  Reply
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {ownerReviews.length > 0 ? ownerReviews.map((r) => {
              const listing = DUMMY_LISTINGS.find((l) => l.id === r.listingId);
              return (
                <div key={r.id} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src={r.userAvatar} alt={r.userName} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{r.userName}</p>
                        <p className="text-xs text-gray-500">{listing?.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{r.comment}</p>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C81]/8 text-[#0F4C81] rounded-lg text-xs font-medium hover:bg-[#0F4C81]/15 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" /> Reply to Review
                    </button>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-16 text-gray-400">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No reviews yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Complaints */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            {ownerComplaints.length > 0 ? ownerComplaints.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-5 shadow-card border border-red-100">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-semibold text-sm text-gray-900">{c.subject}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    c.status === "Resolved" ? "bg-green-100 text-green-700" :
                    c.status === "Under Review" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{c.status}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Filed by: {c.userName} • {c.createdAt}</p>
                <p className="text-sm text-gray-600">{c.description}</p>
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1.5 bg-[#0F4C81] text-white rounded-lg text-xs hover:bg-[#0d3f6e] transition-colors">Respond</button>
                  <Link href="/grievance" className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors">View Detail</Link>
                </div>
              </div>
            )) : (
              <div className="text-center py-16 text-gray-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No complaints against your listings. Keep it up! 🎉</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Listing Modal */}
      {addListingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl text-[#1A1A2E]">Add New Listing</h3>
              <button onClick={() => setAddListingOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setAddListingOpen(false); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["Title", "Sunshine PG for Boys — Near Campus"], ["Address", "12, MG Road, Bangalore"], ["City", "Bangalore"], ["Locality", "MG Road"]].map(([label, ph]) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input type="text" placeholder={ph} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35]" />
                  </div>
                ))}
                {[["Monthly Rent (₹)", "8500"], ["Security Deposit (₹)", "17000"]].map(([label, ph]) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input type="number" placeholder={ph} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35]" />
                  </div>
                ))}
                {[["Room Type", ["PG", "Hostel", "Flat"]], ["Sharing Type", ["Single", "Double", "Triple"]], ["Gender Preference", ["Boys", "Girls", "Co-Ed"]], ["Furnishing", ["Fully Furnished", "Semi Furnished", "Unfurnished"]]].map(([label, opts]) => (
                  <div key={label as string}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label as string}</label>
                    <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35] appearance-none bg-white">
                      {(opts as string[]).map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} placeholder="Describe your property..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Photos</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center text-sm text-gray-400 cursor-pointer hover:border-[#FF6B35]/50">
                  📷 Click to upload property photos (min. 3 recommended)
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {[["AC Available", "isAC"], ["Mess Included", "hasMess"], ["Tiffin Service", "hasTiffin"], ["No Curfew", "noCurfew"], ["Visitors Allowed", "visitors"]].map(([label]) => (
                  <label key={label} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 accent-[#FF6B35]" />
                    {label}
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAddListingOpen(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#FF6B35] text-white rounded-xl text-sm font-semibold hover:bg-[#e85a22] transition-colors">
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
