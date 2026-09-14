"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Clock, FileText, Send, MessageSquareWarning, Loader2, XCircle } from "lucide-react";
import { DUMMY_COMPLAINTS } from "@/lib/data/complaints";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { Complaint } from "@/lib/types";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useAuth } from "@/lib/context/AuthContext";
import { submitGrievanceToSupabase, getSupabaseComplaints } from "@/lib/supabase";

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
  const { t } = useLanguage();
  const { user } = useAuth();
  const [tab, setTab] = useState<"listing" | "platform" | "tracker">("listing");
  const [listingForm, setListingForm] = useState({ listingId: "", subject: "", description: "" });
  const [platformForm, setPlatformForm] = useState({ subject: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState("AKG-4821");
  const [complaints, setComplaints] = useState<Complaint[]>(DUMMY_COMPLAINTS);

  // Fetch real complaints from Supabase on mount
  useEffect(() => {
    getSupabaseComplaints().then((fetched) => {
      if (fetched && fetched.length > 0) {
        // Merge Supabase records with default demo records
        const unique = [...fetched, ...DUMMY_COMPLAINTS.filter((d) => !fetched.some((f) => f.id === d.id))];
        setComplaints(unique);
      }
    });
  }, []);

  const handleListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const generatedTicket = `AKG-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedListing = DUMMY_LISTINGS.find((l) => l.id === listingForm.listingId);

    const res = await submitGrievanceToSupabase({
      userId: user?.id || undefined,
      userName: user?.name || "Anonymous Student",
      subject: listingForm.subject,
      description: listingForm.description,
      type: "listing",
      listingId: listingForm.listingId,
      listingName: selectedListing ? `${selectedListing.title} (${selectedListing.city})` : undefined,
      ticketId: generatedTicket,
    });

    setSubmitting(false);

    if (res.success) {
      setTicketId(res.ticketId);
      setSubmitted(true);

      // Prepend to local tracker state immediately
      const newRecord: Complaint = {
        id: res.ticketId,
        userId: user?.id || "guest",
        userName: user?.name || "Anonymous Student",
        listingId: listingForm.listingId,
        listingName: selectedListing?.title,
        type: "listing",
        subject: listingForm.subject,
        description: listingForm.description,
        status: "Pending",
        createdAt: "Just now",
        updatedAt: "Just now",
      };
      setComplaints((prev) => [newRecord, ...prev]);

      setListingForm({ listingId: "", subject: "", description: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setErrorMessage(
        res.error || "Failed to save complaint to Supabase. Check table permissions or SQL setup."
      );
    }
  };

  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const generatedTicket = `AKG-${Math.floor(1000 + Math.random() * 9000)}`;

    const res = await submitGrievanceToSupabase({
      userId: user?.id || undefined,
      userName: user?.name || "Anonymous Student",
      subject: platformForm.subject,
      description: platformForm.description,
      type: "platform",
      ticketId: generatedTicket,
    });

    setSubmitting(false);

    if (res.success) {
      setTicketId(res.ticketId);
      setSubmitted(true);

      const newRecord: Complaint = {
        id: res.ticketId,
        userId: user?.id || "guest",
        userName: user?.name || "Anonymous Student",
        type: "platform",
        subject: platformForm.subject,
        description: platformForm.description,
        status: "Pending",
        createdAt: "Just now",
        updatedAt: "Just now",
      };
      setComplaints((prev) => [newRecord, ...prev]);

      setPlatformForm({ subject: "", description: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setErrorMessage(
        res.error || "Failed to save complaint to Supabase. Check table permissions or SQL setup."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white py-10 sm:py-14 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
              <MessageSquareWarning className="w-5 h-5 text-[#F09A57]" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {t("grievancePage", "titlePart1")} <span className="text-[#F09A57]">{t("grievancePage", "titlePart2")}</span>
            </h1>
          </div>
          <p className="text-white/90 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
            {t("grievancePage", "subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Responsive Tabs */}
        <div className="flex gap-1.5 bg-white dark:bg-slate-800/90 rounded-2xl p-1.5 shadow-card border border-[#CBD8DF] dark:border-slate-700/80 mb-8 overflow-x-auto">
          {[
            { key: "listing", labelKey: "tabListing", icon: FileText },
            { key: "platform", labelKey: "tabPlatform", icon: AlertCircle },
            { key: "tracker", labelKey: "tabTracker", icon: Clock },
          ].map(({ key, labelKey, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ease-out cursor-pointer min-h-[44px] ${
                tab === key
                  ? "bg-[#234C60] text-white shadow-sm scale-[1.02] font-bold"
                  : "text-[#2D4756] dark:text-slate-300 hover:text-[#0D212D] dark:hover:text-white hover:bg-[#E5EFF4] dark:hover:bg-slate-700/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{t("grievancePage", labelKey)}</span>
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
                Ticket #{ticketId} registered in Supabase. You will receive updates within 72 hours.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl px-5 py-4 animate-fade-up">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900 dark:text-red-200 text-sm">Could not save grievance to Supabase</p>
              <p className="text-red-700 dark:text-red-300 text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form: Report Listing */}
        {tab === "listing" && (
          <div key="listing" className="bg-white dark:bg-[#131D31] rounded-3xl shadow-card border border-gray-100 dark:border-slate-800 p-5 sm:p-8 tab-pane-transition">
            <h2 className="font-display font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-1">
              {t("grievancePage", "tabListing")}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mb-6">
              {t("grievancePage", "subtitle")}
            </p>

            <form onSubmit={handleListingSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  {t("grievancePage", "selectListing")}
                </label>
                <select
                  id="grievance-listing-select"
                  value={listingForm.listingId}
                  onChange={(e) => setListingForm((f) => ({ ...f, listingId: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#0F4C81]/15 bg-white dark:bg-slate-900 text-gray-900 dark:text-white min-h-[44px]"
                >
                  <option value="">{t("grievancePage", "selectPlaceholder")}</option>
                  {DUMMY_LISTINGS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} ({l.locality}, {l.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  {t("grievancePage", "subjectLabel")}
                </label>
                <input
                  type="text"
                  value={listingForm.subject}
                  onChange={(e) => setListingForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder={t("grievancePage", "subjectPlaceholder")}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  {t("grievancePage", "descLabel")}
                </label>
                <textarea
                  rows={4}
                  value={listingForm.description}
                  onChange={(e) => setListingForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder={t("grievancePage", "descPlaceholder")}
                  required
                  className="w-full p-4 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#0F4C81]/15 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#2A556A] hover:bg-[#214557] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors min-h-[46px] cursor-pointer shadow-sm shadow-[#2A556A]/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting to Supabase...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> {t("grievancePage", "submitButton")}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Form: Platform Issue */}
        {tab === "platform" && (
          <div key="platform" className="bg-white dark:bg-[#131D31] rounded-3xl shadow-card border border-gray-100 dark:border-slate-800 p-5 sm:p-8 tab-pane-transition">
            <h2 className="font-display font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-1">
              {t("grievancePage", "tabPlatform")}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mb-6">
              {t("grievancePage", "subtitle")}
            </p>

            <form onSubmit={handlePlatformSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  {t("grievancePage", "subjectLabel")}
                </label>
                <input
                  type="text"
                  value={platformForm.subject}
                  onChange={(e) => setPlatformForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder={t("grievancePage", "platformSubjectPlaceholder")}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#2A556A]/15 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  {t("grievancePage", "descLabel")}
                </label>
                <textarea
                  rows={4}
                  value={platformForm.description}
                  onChange={(e) => setPlatformForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder={t("grievancePage", "descPlaceholder")}
                  required
                  className="w-full p-4 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2A556A] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#2A556A]/15 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#2A556A] hover:bg-[#214557] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors min-h-[46px] cursor-pointer shadow-sm shadow-[#2A556A]/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting to Supabase...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> {t("grievancePage", "submitButton")}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Complaints Tracker */}
        {tab === "tracker" && (
          <div key="tracker" className="space-y-4 tab-pane-transition">
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">
              {t("grievancePage", "tabTracker")} ({complaints.length})
            </h2>

            {complaints.map((c) => {
              const statusLabel =
                c.status === "Resolved"
                  ? t("grievancePage", "statusResolved")
                  : c.status === "Under Review"
                  ? t("grievancePage", "statusUnderReview")
                  : c.status === "Pending"
                  ? t("grievancePage", "statusPending")
                  : t("grievancePage", "statusClosed");

              return (
                <div
                  key={c.id}
                  className="bg-white dark:bg-[#131D31] rounded-3xl p-5 sm:p-6 shadow-card border border-gray-100 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100 dark:border-slate-800">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-gray-400 dark:text-slate-500 block mb-0.5">
                        #{c.id} • {c.createdAt}
                      </span>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{c.subject}</h3>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                        STATUS_COLORS[c.status]
                      }`}
                    >
                      {STATUS_ICONS[c.status]}
                      <span>{statusLabel}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{c.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-gray-400 dark:text-slate-400">
                    <span>Type: {c.type === "listing" ? "Property Flag" : "Platform Report"}</span>
                    <span className="text-[#0F4C81] dark:text-sky-400 font-semibold">Priority: Normal</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
