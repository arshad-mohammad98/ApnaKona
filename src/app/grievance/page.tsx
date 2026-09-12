"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Send,
  MessageSquareWarning,
  Phone,
  Mail,
  Headphones,
  RefreshCw,
  LogIn,
  Building,
  Loader2,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/context/AuthContext";
import { SITE_CONTACT } from "@/lib/constants";

interface DbListing {
  id: string;
  title: string;
  city: string | null;
  locality: string | null;
}

interface DbComplaint {
  id: string;
  user_id: string;
  listing_id: string | null;
  complaint_type: "listing" | "platform";
  subject: string;
  description: string;
  status: "pending" | "under_review" | "resolved" | "closed" | string;
  created_at: string;
  resolved_at: string | null;
  admin_response: string | null;
  listings?: {
    id: string;
    title: string;
    city: string | null;
    locality: string | null;
  } | null;
}

const STATUS_BADGES: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: {
    label: "Pending Review",
    className: "bg-yellow-50 text-yellow-800 border-yellow-200",
    icon: <Clock className="w-3.5 h-3.5 text-yellow-600" />,
  },
  under_review: {
    label: "Under Review",
    className: "bg-blue-50 text-blue-800 border-blue-200",
    icon: <AlertCircle className="w-3.5 h-3.5 text-blue-600" />,
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-50 text-green-800 border-green-200",
    icon: <CheckCircle className="w-3.5 h-3.5 text-green-600" />,
  },
  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    icon: <CheckCircle className="w-3.5 h-3.5 text-gray-500" />,
  },
};

export default function GrievancePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [tab, setTab] = useState<"listing" | "platform" | "tracker">("listing");
  const [listingForm, setListingForm] = useState({ listingId: "", subject: "", description: "" });
  const [platformForm, setPlatformForm] = useState({ subject: "", description: "" });

  // Database listings for dropdown
  const [dbListings, setDbListings] = useState<DbListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  // Complaints state for "My Grievances"
  const [myComplaints, setMyComplaints] = useState<DbComplaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [complaintsError, setComplaintsError] = useState<string | null>(null);

  // Submission & Toast states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<{ message: string; ticketId?: string } | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // 1. Fetch real listings from Supabase for the dropdown
  useEffect(() => {
    async function loadListings() {
      setLoadingListings(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("id, title, city, locality")
          .order("title", { ascending: true });

        if (error) {
          console.warn("Could not load listings from database:", error.message);
        } else if (data) {
          setDbListings(data);
        }
      } catch (err) {
        console.error("Exception loading listings:", err);
      } finally {
        setLoadingListings(false);
      }
    }
    loadListings();
  }, []);

  // 2. Fetch user's complaints from Supabase
  const fetchMyComplaints = useCallback(async () => {
    setLoadingComplaints(true);
    setComplaintsError(null);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id || user?.id;

      if (!currentUserId) {
        setMyComplaints([]);
        return;
      }

      const { data, error } = await supabase
        .from("complaints")
        .select(
          `
          id,
          user_id,
          listing_id,
          complaint_type,
          subject,
          description,
          status,
          created_at,
          resolved_at,
          admin_response,
          listings (
            id,
            title,
            city,
            locality
          )
        `
        )
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching complaints:", error);
        setComplaintsError(error.message);
      } else {
        setMyComplaints((data as unknown as DbComplaint[]) || []);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load complaints";
      console.error("Exception fetching grievances:", err);
      setComplaintsError(message);
    } finally {
      setLoadingComplaints(false);
    }
  }, [user?.id]);

  // Load complaints whenever tab changes to tracker or user logs in
  useEffect(() => {
    if (tab === "tracker" || isAuthenticated) {
      fetchMyComplaints();
    }
  }, [tab, isAuthenticated, fetchMyComplaints]);

  // Auto-dismiss success toast after 6 seconds
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Submit Listing Grievance
  const handleListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessToast(null);
    setErrorToast(null);

    // Verify authentication
    const { data: authData } = await supabase.auth.getUser();
    const activeUser = authData?.user;

    if (!activeUser) {
      setErrorToast("You must be logged in to submit a grievance. Redirecting to login...");
      setTimeout(() => router.push("/login?redirect=/grievance"), 1200);
      return;
    }

    if (!listingForm.listingId) {
      setErrorToast("Please select a property from the database.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("complaints")
        .insert({
          user_id: activeUser.id,
          complaint_type: "listing",
          listing_id: listingForm.listingId,
          subject: listingForm.subject.trim(),
          description: listingForm.description.trim(),
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase listing complaint submission error:", error);
        setErrorToast(error.message || "Something went wrong, please try again.");
      } else {
        const ticketId = data?.id ? `AKG-${data.id.slice(0, 8).toUpperCase()}` : "AKG-SUBMITTED";
        setSuccessToast({
          message: "Complaint submitted successfully!",
          ticketId,
        });
        setListingForm({ listingId: "", subject: "", description: "" });
        // Refresh complaints tracker list
        await fetchMyComplaints();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit complaint";
      console.error("Exception submitting listing grievance:", err);
      setErrorToast(message || "Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Platform Issue
  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessToast(null);
    setErrorToast(null);

    // Verify authentication
    const { data: authData } = await supabase.auth.getUser();
    const activeUser = authData?.user;

    if (!activeUser) {
      setErrorToast("You must be logged in to submit a platform issue. Redirecting to login...");
      setTimeout(() => router.push("/login?redirect=/grievance"), 1200);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("complaints")
        .insert({
          user_id: activeUser.id,
          complaint_type: "platform",
          listing_id: null,
          subject: platformForm.subject.trim(),
          description: platformForm.description.trim(),
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase platform complaint submission error:", error);
        setErrorToast(error.message || "Something went wrong, please try again.");
      } else {
        const ticketId = data?.id ? `AKG-${data.id.slice(0, 8).toUpperCase()}` : "AKG-SUBMITTED";
        setSuccessToast({
          message: "Platform issue reported successfully!",
          ticketId,
        });
        setPlatformForm({ subject: "", description: "" });
        // Refresh complaints tracker list
        await fetchMyComplaints();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit platform issue";
      console.error("Exception submitting platform issue:", err);
      setErrorToast(message || "Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {t("grievance.title", "Student Grievance Redressal")}
            </h1>
          </div>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
            {t("grievance.subtitle", "Transparent, time-bound resolution for student housing and hostel disputes")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Reach Us Directly Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-gray-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold">
              <Headphones className="w-3.5 h-3.5" />
              {t("grievance.directChannels", "Direct Support Channels")}
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg text-gray-900">
              {t("grievance.directSupport", "Need immediate help outside formal grievance?")}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-lg">
              {t(
                "grievance.directSupportSub",
                "For urgent safety concerns, payment disputes, or quick inquiries, reach our student support desk directly:"
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href={SITE_CONTACT.phoneHref}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#0d3f6e] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>{SITE_CONTACT.phoneDisplay}</span>
            </a>
            <a
              href={SITE_CONTACT.emailHref}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-[#0F4C81] text-xs sm:text-sm font-semibold transition-all min-h-[44px]"
            >
              <Mail className="w-4 h-4 text-[#FF6B35]" />
              <span>{SITE_CONTACT.email}</span>
            </a>
          </div>
        </div>

        {/* Authentication Notice Banner (if unauthenticated) */}
        {!isAuthLoading && !isAuthenticated && (
          <div className="mb-8 bg-amber-50/90 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 text-sm">Account Login Required</h3>
                <p className="text-amber-700 text-xs mt-0.5">
                  To ensure security and link complaints to your verified student profile, please log in before filing a grievance.
                </p>
              </div>
            </div>
            <Link
              href="/login?redirect=/grievance"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs min-h-[40px] shrink-0"
            >
              <LogIn className="w-4 h-4" /> Sign In to Proceed
            </Link>
          </div>
        )}

        {/* Responsive Navigation Tabs */}
        <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 shadow-card border border-gray-100 mb-8 overflow-x-auto">
          {[
            { key: "listing", label: "Report Listing", icon: FileText },
            { key: "platform", label: "Report Platform Issue", icon: AlertCircle },
            {
              key: "tracker",
              label: `My Grievances${myComplaints.length > 0 ? ` (${myComplaints.length})` : ""}`,
              icon: Clock,
            },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              id={`tab-btn-${key}`}
              onClick={() => {
                setTab(key as typeof tab);
                setSuccessToast(null);
                setErrorToast(null);
              }}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[44px] ${
                tab === key ? "bg-[#0F4C81] text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Success Alert / Toast */}
        {successToast && (
          <div
            id="grievance-success-banner"
            className="mb-6 flex items-start sm:items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 animate-fade-up shadow-xs"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="font-bold text-green-900 text-sm">{successToast.message}</p>
                <p className="text-green-700 text-xs mt-0.5">
                  Reference Ticket <span className="font-mono font-bold">{successToast.ticketId}</span> saved to Supabase. Our grievance committee reviews within 48-72 hours.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-green-700 hover:text-green-900 p-1 text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error Alert / Toast */}
        {errorToast && (
          <div
            id="grievance-error-banner"
            className="mb-6 flex items-start sm:items-center justify-between gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 animate-fade-up shadow-xs"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold text-red-900 text-sm">Submission Error</p>
                <p className="text-red-700 text-xs mt-0.5">{errorToast}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorToast(null)}
              className="text-red-700 hover:text-red-900 p-1 text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 1: Report Listing                                         */}
        {/* ───────────────────────────────────────────────────────────── */}
        {tab === "listing" && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 sm:p-8">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#1A1A2E]">
                Report a Property / Listing
              </h2>
              <span className="text-[11px] font-semibold text-[#0F4C81] bg-[#0F4C81]/10 px-2.5 py-1 rounded-full">
                Supabase Connected
              </span>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Encountered fake photos, unauthorized rent increases, or safety hazards? Select the property and report it below.
            </p>

            <form onSubmit={handleListingSubmit} className="space-y-4 sm:space-y-5">
              {/* Select Property */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Select Associated Property <span className="text-red-500">*</span>
                </label>
                <select
                  id="grievance-listing-select"
                  value={listingForm.listingId}
                  onChange={(e) => setListingForm((f) => ({ ...f, listingId: e.target.value }))}
                  required
                  disabled={loadingListings || isSubmitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 bg-white min-h-[44px] transition-all disabled:opacity-60"
                >
                  <option value="">
                    {loadingListings ? "-- Loading properties from Supabase... --" : "-- Choose property from database --"}
                  </option>
                  {dbListings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} {l.locality ? `(${l.locality}, ${l.city})` : l.city ? `(${l.city})` : ""}
                    </option>
                  ))}
                </select>
                {dbListings.length === 0 && !loadingListings && (
                  <p className="text-xs text-amber-600 mt-1">
                    No properties currently active in database.
                  </p>
                )}
              </div>

              {/* Grievance Subject */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Grievance Category / Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="grievance-listing-subject"
                  type="text"
                  value={listingForm.subject}
                  onChange={(e) => setListingForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Deposit not returned / Room condition does not match photos"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px] transition-all disabled:opacity-60"
                />
              </div>

              {/* Detailed Explanation */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Detailed Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="grievance-listing-description"
                  rows={4}
                  value={listingForm.description}
                  onChange={(e) => setListingForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe exactly what occurred, including relevant dates, rent receipts, and owner communication..."
                  required
                  disabled={isSubmitting}
                  className="w-full p-4 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 resize-none transition-all disabled:opacity-60"
                />
              </div>

              <button
                id="grievance-listing-submit-btn"
                type="submit"
                disabled={isSubmitting || !isAuthenticated}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors min-h-[46px] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting to Supabase...</span>
                  </>
                ) : !isAuthenticated ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Submit Grievance</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Listing Grievance</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: Report Platform Issue                                  */}
        {/* ───────────────────────────────────────────────────────────── */}
        {tab === "platform" && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 sm:p-8">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#1A1A2E]">
                Report Technical or Platform Issue
              </h2>
              <span className="text-[11px] font-semibold text-[#0F4C81] bg-[#0F4C81]/10 px-2.5 py-1 rounded-full">
                Supabase Connected
              </span>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Found a bug, payment gateway error, or account issue on ApnaKona? Let our engineering team know.
            </p>

            <form onSubmit={handlePlatformSubmit} className="space-y-4 sm:space-y-5">
              {/* Issue Topic */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Issue Topic / Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="grievance-platform-subject"
                  type="text"
                  value={platformForm.subject}
                  onChange={(e) => setPlatformForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Chat widget disconnected / Search filter reset bug"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 min-h-[44px] transition-all disabled:opacity-60"
                />
              </div>

              {/* Steps to Reproduce */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Detailed Explanation / Steps to Reproduce <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="grievance-platform-description"
                  rows={4}
                  value={platformForm.description}
                  onChange={(e) => setPlatformForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Explain what steps you took, what device/browser you're using, and what error occurred..."
                  required
                  disabled={isSubmitting}
                  className="w-full p-4 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 resize-none transition-all disabled:opacity-60"
                />
              </div>

              <button
                id="grievance-platform-submit-btn"
                type="submit"
                disabled={isSubmitting || !isAuthenticated}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors min-h-[46px] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : !isAuthenticated ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Report Issue</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Technical Report</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 3: My Grievances Tracker                                  */}
        {/* ───────────────────────────────────────────────────────────── */}
        {tab === "tracker" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="font-display font-bold text-lg text-gray-900">
                  Your Filed Grievances ({myComplaints.length})
                </h2>
                <p className="text-xs text-gray-500">
                  Live synchronized from your Supabase account
                </p>
              </div>
              <button
                id="grievance-refresh-btn"
                onClick={fetchMyComplaints}
                disabled={loadingComplaints}
                title="Refresh Grievances"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingComplaints ? "animate-spin text-[#0F4C81]" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Error banner while fetching */}
            {complaintsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Error loading grievances from database: {complaintsError}</span>
              </div>
            )}

            {/* Not logged in message */}
            {!isAuthenticated && !isAuthLoading && (
              <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-card">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0F4C81] flex items-center justify-center mx-auto mb-3">
                  <LogIn className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Please Sign In</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                  Sign in with your ApnaKona account to view your past filed grievances and track live resolution updates.
                </p>
                <Link
                  href="/login?redirect=/grievance"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Go to Login</span>
                </Link>
              </div>
            )}

            {/* Loading state */}
            {loadingComplaints && myComplaints.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-card">
                <Loader2 className="w-6 h-6 text-[#0F4C81] animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-500">Fetching your grievances from Supabase...</p>
              </div>
            )}

            {/* Empty state */}
            {!loadingComplaints && isAuthenticated && myComplaints.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-card">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">No Grievances Filed</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                  You have not submitted any listing complaints or platform issues yet.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setTab("listing")}
                    className="px-4 py-2 bg-[#0F4C81] text-white text-xs font-bold rounded-xl hover:bg-[#0d3f6e] transition-colors"
                  >
                    Report a Listing
                  </button>
                  <button
                    onClick={() => setTab("platform")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Report Platform Issue
                  </button>
                </div>
              </div>
            )}

            {/* Complaints List */}
            {myComplaints.map((c) => {
              const badge = STATUS_BADGES[c.status?.toLowerCase()] || STATUS_BADGES.pending;
              const formattedDate = c.created_at
                ? new Date(c.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recently";

              const ticketRef = `AKG-${c.id.slice(0, 8).toUpperCase()}`;

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-gray-100 space-y-3.5 transition-all hover:border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-gray-400 block mb-0.5">
                        #{ticketRef} • {formattedDate}
                      </span>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900">{c.subject}</h3>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${badge.className}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  {/* Associated Listing preview if available */}
                  {c.complaint_type === "listing" && (
                    <div className="flex items-center gap-2 text-xs bg-blue-50/70 border border-blue-100 text-blue-900 px-3.5 py-2 rounded-xl">
                      <Building className="w-3.5 h-3.5 text-[#0F4C81] shrink-0" />
                      <span>
                        <strong className="font-semibold">Property:</strong>{" "}
                        {c.listings?.title || "Database Property"}{" "}
                        {c.listings?.city ? `(${c.listings.city})` : ""}
                      </span>
                    </div>
                  )}

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {c.description}
                  </p>

                  {/* Admin response if available */}
                  {c.admin_response && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900">
                      <strong className="block font-semibold mb-0.5">Official Redressal Response:</strong>
                      <p>{c.admin_response}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-gray-400 border-t border-gray-50">
                    <span className="font-medium text-gray-500">
                      Type:{" "}
                      <span className="text-gray-700">
                        {c.complaint_type === "listing" ? "Property Flag" : "Platform Report"}
                      </span>
                    </span>
                    <span className="text-[#0F4C81] font-semibold">Priority: High (48h SLA)</span>
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
