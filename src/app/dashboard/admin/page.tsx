"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Compass,
  Users,
  Home,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import AdminCartoonAvatar from "@/components/ui/AdminCartoonAvatar";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { DUMMY_COMPLAINTS } from "@/lib/data/complaints";
import { Badge } from "@/components/ui/Badge";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-card">
          <div className="flex justify-center mb-4">
            <AdminCartoonAvatar size={72} showBadge={true} />
          </div>
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
            Administrator Access Required
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
            Please sign in with administrator credentials or username <code className="bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-xs text-[#0F4C81] dark:text-sky-400">admin</code> to access the Master Control Panel.
          </p>
          <Link
            href="/login?role=admin"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#0F4C81] hover:bg-[#0d3f6e] dark:bg-sky-600 dark:hover:bg-sky-500 text-white rounded-xl font-bold text-sm transition-colors min-h-[44px] shadow-sm"
          >
            <span>Sign In as Admin</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const totalListings = DUMMY_LISTINGS.length;
  const pendingGrievances = DUMMY_COMPLAINTS.filter((c) => c.status !== "Resolved").length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-400/10 via-sky-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <AdminCartoonAvatar size={76} showBadge={true} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Master Admin Console
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Dual Access Live
                  </span>
                </div>
                <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
                  Welcome back, <strong className="text-gray-900 dark:text-white">{user.name}</strong>. You have elevated master privileges to monitor and manage both <strong>Student</strong> and <strong>Owner</strong> dashboards.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                href="/dashboard/student"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-[#0F4C81] dark:text-sky-300 rounded-xl text-xs sm:text-sm font-bold transition-all border border-blue-200 dark:border-blue-800"
              >
                <GraduationCap className="w-4 h-4" />
                Student View
              </Link>
              <Link
                href="/dashboard/owner"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-xl text-xs sm:text-sm font-bold transition-all border border-amber-200 dark:border-amber-800"
              >
                <Building2 className="w-4 h-4" />
                Owner View
              </Link>
            </div>
          </div>
        </div>

        {/* Quick KPI Summary Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Platform Listings</span>
              <Home className="w-4 h-4 text-[#0F4C81] dark:text-sky-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalListings}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Verified across 7 metro hubs</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Registered Students</span>
              <Users className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">850+</p>
            <p className="text-[11px] text-sky-600 dark:text-sky-400 mt-1">Active roommate &amp; hostel queries</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Verified Owners</span>
              <Building2 className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">42</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Direct property managers</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Pending Grievances</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingGrievances}</p>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">Under moderation desk</p>
          </div>
        </div>

        {/* PRIMARY DUAL ACCESS CONTROLS (STUDENT & OWNER HUBS) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0F4C81] dark:text-sky-400" />
                Dual Dashboard Access
              </h2>
              <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">
                Direct access to manage both sides of the ApnaKona marketplace.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Control Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-gray-100 dark:border-slate-800 shadow-card hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0F4C81] dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <Badge variant="neutral" className="font-semibold text-xs">
                    Student Mode
                  </Badge>
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Student Control Portal
                </h3>
                <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                  Inspect student wishlists, active conversations with accommodation owners, roommate profiles, and student booking inquiries.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>View saved hostels and shortlisted rooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Monitor direct chat inquiries with property hosts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Edit student personal preference profiles</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/student"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0F4C81] hover:bg-[#0d3f6e] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-sm group-hover:shadow-md"
              >
                <span>Launch Student Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Owner Control Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-gray-100 dark:border-slate-800 shadow-card hover:border-amber-300 dark:hover:border-amber-700 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <Badge variant="warning" className="font-semibold text-xs">
                    Owner Mode
                  </Badge>
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Owner Control Portal
                </h3>
                <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                  Full control over PG and hostel listings, verify property photos &amp; pricing, reply to incoming student inquiries, and check tenant ratings.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Create and modify property listings</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Respond to incoming student inquiries &amp; visit requests</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Inspect student reviews and resolve owner complaints</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/owner"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#FF6B35] hover:bg-[#e85a22] text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-sm group-hover:shadow-md"
              >
                <span>Launch Owner Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Governance & Additional Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                  Grievance &amp; Dispute Resolution Desk
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Review student reports and listing flags
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mb-4 leading-relaxed">
              Direct access to the grievance tracking console to review user complaints, check property fraud flags, and resolve disputes.
            </p>
            <Link
              href="/grievance?tab=tracker"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F4C81] dark:text-sky-400 hover:underline"
            >
              <span>Inspect Grievance Records ({DUMMY_COMPLAINTS.length})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                  Marketplace Inspector
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Verify public listings across all metro hubs
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mb-4 leading-relaxed">
              Inspect active listings, room amenities, pricing tiers, and Google Maps pin locations directly on the public Explore interface.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Explore Live Listings ({totalListings})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
