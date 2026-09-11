"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquareWarning, CheckCircle, Send, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";

export default function PortalGrievance() {
  const [listingId, setListingId] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("AKG-7391");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketId(`AKG-${Math.floor(1000 + Math.random() * 9000)}`);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setListingId("");
      setSubject("");
      setDescription("");
    }, 4000);
  };

  return (
    <section id="grievance" className="py-16 sm:py-24 bg-white border-t border-gray-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block px-3.5 py-1 bg-red-50 text-red-700 rounded-full text-xs sm:text-sm font-semibold mb-3">
                Student Protection &amp; Safety
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A2E] leading-tight">
                Grievance &amp; Redressal Desk
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
                We believe in zero broker harassment, genuine photos, and timely deposit returns. If a property owner violates student standards, report them directly.
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  icon: ShieldCheck,
                  title: "100% Inspected & Verified",
                  desc: "Owners must submit government KYC and pass hygiene visits.",
                },
                {
                  icon: Clock,
                  title: "72-Hour Resolution Promise",
                  desc: "Our grievance officers investigate and mediate with owners immediately.",
                },
                {
                  icon: CheckCircle,
                  title: "Escrow & Deposit Assistance",
                  desc: "We assist in dispute recovery if an owner holds deposits illegally.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3.5 p-4 bg-[#F9FAFB] rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/grievance"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F4C81] hover:underline"
            >
              Open Grievance Tracker &amp; Past Tickets <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Form Card (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#F9FAFB] rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MessageSquareWarning className="w-5 h-5 text-red-600" />
                  <h3 className="font-display font-bold text-base sm:text-lg text-gray-900">
                    File a Grievance Ticket
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                  Response in &lt; 24h
                </span>
              </div>

              {submitted ? (
                <div className="py-10 text-center animate-fade-up">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-gray-900 mb-1">
                    Grievance Ticket #{ticketId} Logged
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto mb-4">
                    Our safety review officer has received your complaint. You will receive an SMS and email notification with next steps.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 bg-[#0F4C81] text-white rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    Submit Another Report
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Property Involved (Optional)
                    </label>
                    <select
                      value={listingId}
                      onChange={(e) => setListingId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                    >
                      <option value="">-- Select listed property (if applicable) --</option>
                      {DUMMY_LISTINGS.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title} ({l.locality}, {l.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Grievance Subject / Category
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Deposit refund delay / Photos did not match actual room"
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Brief Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide specific details, dates, or communication summary..."
                      required
                      className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#0F4C81] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer min-h-[46px] flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" /> Submit Grievance Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
