"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Clock, ChevronDown, FileText, Send, MessageSquareWarning } from "lucide-react";
import { DUMMY_COMPLAINTS } from "@/lib/data/complaints";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { Complaint } from "@/lib/types";

const STATUS_COLORS: Record<Complaint["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-600",
};

const STATUS_ICONS: Record<Complaint["status"], React.ReactNode> = {
  Pending: <Clock className="w-4 h-4" />,
  "Under Review": <AlertCircle className="w-4 h-4" />,
  Resolved: <CheckCircle className="w-4 h-4" />,
  Closed: <CheckCircle className="w-4 h-4" />,
};

export default function GrievancePage() {
  const [tab, setTab] = useState<"listing" | "platform" | "tracker">("listing");
  const [listingForm, setListingForm] = useState({ listingId: "", subject: "", description: "" });
  const [platformForm, setPlatformForm] = useState({ subject: "", description: "" });
  const [submitted, setSubmitted] = useState(false);
  const [complaints] = useState<Complaint[]>(DUMMY_COMPLAINTS);

  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setListingForm({ listingId: "", subject: "", description: "" }); }, 3000);
  };
  const handlePlatformSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setPlatformForm({ subject: "", description: "" }); }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#0d3f6e] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquareWarning className="w-6 h-6" />
            <h1 className="font-display text-2xl font-bold">Grievance Centre</h1>
          </div>
          <p className="text-white/70 text-sm">
            Report issues with listings or the platform. We take every complaint seriously and resolve it within 72 hours.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-card border border-gray-100 mb-8">
          {[
            { key: "listing", label: "Report a Listing", icon: FileText },
            { key: "platform", label: "Report Platform Issue", icon: AlertCircle },
            { key: "tracker", label: "My Complaints", icon: Clock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === key ? "bg-[#0F4C81] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {/* Success Toast */}
        {submitted && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Complaint submitted successfully!</p>
              <p className="text-green-600 text-xs">Our team will review it within 72 hours.</p>
            </div>
          </div>
        )}

        {/* Form: Report Listing */}
        {tab === "listing" && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6">
            <h2 className="font-display font-semibold text-lg text-[#1A1A2E] mb-1">Report a Listing</h2>
            <p className="text-gray-500 text-sm mb-6">Has a property owner misled you? Flag their listing here.</p>
            <form onSubmit={handleListingSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Listing</label>
                <div className="relative">
                  <select
                    id="grievance-listing-select"
                    value={listingForm.listingId}
                    onChange={(e) => setListingForm((f) => ({ ...f, listingId: e.target.value }))}
                    required
                    className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl text-sm appearance-none outline-none focus:border-[#0F4C81] bg-white"
                  >
                    <option value="">-- Choose a listing --</option>
                    {DUMMY_LISTINGS.map((l) => (
                      <option key={l.id} value={l.id}>{l.title} — {l.city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <select
                  value={listingForm.subject}
                  onChange={(e) => setListingForm((f) => ({ ...f, subject: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm appearance-none outline-none focus:border-[#0F4C81] bg-white"
                >
                  <option value="">-- Select issue type --</option>
                  <option>Photos don&apos;t match reality</option>
                  <option>Incorrect pricing / Hidden charges</option>
                  <option>Owner not responding after payment</option>
                  <option>Fraudulent / Fake listing</option>
                  <option>Harassment or misconduct</option>
                  <option>Amenities missing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  id="grievance-listing-description"
                  value={listingForm.description}
                  onChange={(e) => setListingForm((f) => ({ ...f, description: e.target.value }))}
                  rows={5}
                  required
                  placeholder="Describe the issue in detail. Include dates, amounts, and any relevant evidence..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#0F4C81] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Attach Evidence <span className="text-gray-400">(optional)</span></label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400 cursor-pointer hover:border-[#0F4C81]/40">
                  📎 Click to attach screenshots or documents
                </div>
              </div>
              <button
                id="grievance-listing-submit-btn"
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" /> Submit Complaint
              </button>
            </form>
          </div>
        )}

        {/* Form: Report Platform */}
        {tab === "platform" && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6">
            <h2 className="font-display font-semibold text-lg text-[#1A1A2E] mb-1">Report Platform Issue</h2>
            <p className="text-gray-500 text-sm mb-6">Bug, UI issue, or a feature request? Let us know.</p>
            <form onSubmit={handlePlatformSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Type</label>
                <select
                  value={platformForm.subject}
                  onChange={(e) => setPlatformForm((f) => ({ ...f, subject: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm appearance-none outline-none focus:border-[#0F4C81] bg-white"
                >
                  <option value="">-- Select issue type --</option>
                  <option>Bug / Technical issue</option>
                  <option>Feature request</option>
                  <option>Payment issue</option>
                  <option>Account / Profile issue</option>
                  <option>Search not working</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={platformForm.description}
                  onChange={(e) => setPlatformForm((f) => ({ ...f, description: e.target.value }))}
                  rows={5}
                  required
                  placeholder="Describe the issue step-by-step. Include which page or feature is affected..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#0F4C81] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white font-semibold rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" /> Submit Report
              </button>
            </form>
          </div>
        )}

        {/* Tracker */}
        {tab === "tracker" && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6">
            <h2 className="font-display font-semibold text-lg text-[#1A1A2E] mb-6">My Complaints</h2>
            {complaints.length > 0 ? (
              <div className="space-y-4">
                {complaints.map((c) => (
                  <div key={c.id} className="border border-gray-100 rounded-2xl p-5 hover:border-[#0F4C81]/20 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{c.subject}</p>
                        {c.listingName && (
                          <p className="text-xs text-gray-500 mt-0.5">🏠 {c.listingName}</p>
                        )}
                      </div>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[c.status]}`}>
                        {STATUS_ICONS[c.status]}
                        {c.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">{c.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Filed: {c.createdAt}</span>
                      <span>Updated: {c.updatedAt}</span>
                      <span className="ml-auto capitalize px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">{c.type} complaint</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No complaints filed yet. You&apos;re all good! 🎉</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
