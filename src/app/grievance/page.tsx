"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Clock, FileText, Send, MessageSquareWarning } from "lucide-react";
import { DUMMY_COMPLAINTS } from "@/lib/data/complaints";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { Complaint } from "@/lib/types";

const STATUS_COLORS: Record<Complaint["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Under Review": "bg-blue-100 text-blue-800 border-blue-200",
  Resolved: "bg-green-100 text-green-800 border-green-200",
  Closed: "bg-gray-100 text-gray-700 border-gray-200",
};

const STATUS_ICONS: Record<Complaint["status"], React.ReactNode> = {
  Pending: <Clock className="w-3.5 h-3.5" />,
  "Under Review": <AlertCircle className="w-3.5 h-3.5" />,
  Resolved: <CheckCircle className="w-3.5 h-3.5" />,
  Closed: <CheckCircle className="w-3.5 h-3.5" />,
};

export default function GrievancePage() {
  const [tab, setTab] = useState<"listing" | "platform" | "tracker">("listing");
  const [listingForm, setListingForm] = useState({ listingId: "", subject: "", description: "" });
  const [platformForm, setPlatformForm] = useState({ subject: "", description: "" });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("AKG-4821");
  const [complaints] = useState<Complaint[]>(DUMMY_COMPLAINTS);

  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketId(`AKG-${Math.floor(1000 + Math.random() * 9000)}`);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setListingForm({ listingId: "", subject: "", description: "" });
    }, 3500);
  };

  const handlePlatformSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketId(`AKG-${Math.floor(1000 + Math.random() * 9000)}`);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPlatformForm({ subject: "", description: "" });
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#0d3f6e] text-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <MessageSquareWarning className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Grievance &amp; Redressal</h1>
          </div>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
            Report misleading listings, owner misconduct, or platform issues. We review all complaints and take action within 72 hours.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Responsive Tabs */}
        <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 shadow-card border border-gray-100 mb-8 overflow-x-auto">
          {[
            { key: "listing", label: "Report Listing", icon: FileText },
            { key: "platform", label: "Report Platform Issue", icon: AlertCircle },
            { key: "tracker", label: "My Grievances", icon: Clock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[44px] ${
                tab === key
                  ? "bg-[#0F4C81] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Success Alert */}
        {submitted && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 animate-fade-up">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="font-bold text-green-900 text-sm">Grievance filed successfully!</p>
              <p className="text-green-700 text-xs mt-0.5">
                Ticket #{ticketId} created. You will receive an email update within 72 hours.
              </p>
            </div>
          </div>
        )}

        {/* Form: Report Listing */}
        {tab === "listing" && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 sm:p-8">
            <h2 className="font-display font-bold text-lg sm:text-xl text-[#1A1A2E] mb-1">
              Report a Property / Listing
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Encountered fake photos, unauthorized rent increases, or safety hazards? Flag it below.
            </p>

            <form onSubmit={handleListingSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Select Associated Property
                </label>
                <select
                  id="grievance-listing-select"
                  value={listingForm.listingId}
                  onChange={(e) => setListingForm((f) => ({ ...f, listingId: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 bg-white min-h-[44px]"
                >
                  <option value="">-- Choose property from database --</option>
                  {DUMMY_LISTINGS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} ({l.locality}, {l.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Grievance Category / Subject
                </label>
                <input
                  type="text"
                  value={listingForm.subject}
                  onChange={(e) => setListingForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Deposit not returned / Room not as depicted"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  value={listingForm.description}
                  onChange={(e) => setListingForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe exactly what occurred, including relevant dates and owner communication..."
                  required
                  className="w-full p-4 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors min-h-[46px] cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" /> Submit Listing Grievance
              </button>
            </form>
          </div>
        )}

        {/* Form: Platform Issue */}
        {tab === "platform" && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 sm:p-8">
            <h2 className="font-display font-bold text-lg sm:text-xl text-[#1A1A2E] mb-1">
              Report Technical or Platform Issue
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Found a bug, broken feature, or account problem on ApnaKona? Let our engineering team know.
            </p>

            <form onSubmit={handlePlatformSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Issue Topic
                </label>
                <input
                  type="text"
                  value={platformForm.subject}
                  onChange={(e) => setPlatformForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Chat widget disconnected / Search filter reset bug"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Steps to Reproduce
                </label>
                <textarea
                  rows={4}
                  value={platformForm.description}
                  onChange={(e) => setPlatformForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Explain what steps you took, what device/browser you're using, and what error occurred..."
                  required
                  className="w-full p-4 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors min-h-[46px] cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" /> Submit Technical Report
              </button>
            </form>
          </div>
        )}

        {/* Complaints Tracker */}
        {tab === "tracker" && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
              Your Filed Grievances ({complaints.length})
            </h2>

            {complaints.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-gray-100 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-gray-400 block mb-0.5">
                      #{c.id} • {c.createdAt}
                    </span>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">{c.subject}</h3>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                      STATUS_COLORS[c.status]
                    }`}
                  >
                    {STATUS_ICONS[c.status]}
                    <span>{c.status}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{c.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-gray-400">
                  <span>Type: {c.type === "listing" ? "Property Flag" : "Platform Report"}</span>
                  <span className="text-[#0F4C81] font-semibold">Priority: Normal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
