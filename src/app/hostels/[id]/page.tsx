"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { DUMMY_REVIEWS } from "@/lib/data/reviews";
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Flag,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Shield,
  Zap,
  Car,
  Camera,
  Lock,
  ArrowUpDown,
  Sofa,
  UtensilsCrossed,
  Clock,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import GoogleMapView from "@/components/ui/GoogleMapView";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  Security: <Shield className="w-4 h-4" />,
  "Power Backup": <Zap className="w-4 h-4" />,
  Parking: <Car className="w-4 h-4" />,
  CCTV: <Camera className="w-4 h-4" />,
  Laundry: <Lock className="w-4 h-4" />,
  Elevator: <ArrowUpDown className="w-4 h-4" />,
};

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-60 sm:h-80 md:h-96 bg-gray-100 group cursor-pointer"
        onClick={() => setLightbox(true)}
      >
        <img
          src={images[current]}
          alt={title}
          className="w-full h-full object-cover select-none"
        />
        {/* Carousel indicator dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-full">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(i);
              }}
              aria-label={`View photo ${i + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === current ? "bg-white w-5" : "bg-white/60 w-2 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((c) => (c - 1 + images.length) % images.length);
          }}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer min-h-[44px] min-w-[44px]"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((c) => (c + 1) % images.length);
          }}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer min-h-[44px] min-w-[44px]"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-full font-medium">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-16 w-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
              i === current
                ? "border-[#0F4C81] ring-2 ring-[#0F4C81]/20 scale-105"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            <img
              src={images[current]}
              alt={title}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setLightbox(false)}
              className="absolute -top-12 right-0 sm:top-2 sm:right-2 p-2.5 text-white hover:text-gray-300 rounded-full hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function HostelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = DUMMY_LISTINGS.find((l) => l.id === id);
  if (!listing) notFound();

  const reviews = DUMMY_REVIEWS.filter((r) => r.listingId === listing.id);
  const [reportOpen, setReportOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [reportMsg, setReportMsg] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [chatSent, setChatSent] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 lg:pb-12 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-gray-500 mb-5">
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link href="/" className="hover:text-[#0F4C81] shrink-0">
              Home
            </Link>
            <span>/</span>
            <Link href="/hostels" className="hover:text-[#0F4C81] shrink-0">
              Hostel/PG
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold truncate">{listing.title}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#0F4C81] text-gray-700 text-xs font-semibold cursor-pointer shrink-0 min-h-[36px]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Copied Link!" : "Share"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Details Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-card border border-gray-100">
              <ImageGallery images={listing.images} title={listing.title} />
            </div>

            {/* Title & Overview Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    <Badge variant="primary">{listing.roomType}</Badge>
                    <Badge variant="neutral">{listing.sharingType} Sharing</Badge>
                    <Badge variant="purple">{listing.genderPref}</Badge>
                    {listing.isAC && <Badge variant="cyan">AC Included</Badge>}
                  </div>
                  <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#1A1A2E] leading-tight">
                    {listing.title}
                  </h1>
                  <p className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm mt-2">
                    <MapPin className="w-4 h-4 text-[#0F4C81] shrink-0" />
                    {listing.address}
                  </p>
                </div>

                <div className="sm:text-right shrink-0 bg-blue-50/50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
                  <p className="text-2xl sm:text-3xl font-bold text-[#0F4C81]">
                    ₹{listing.price.toLocaleString("en-IN")}
                    <span className="text-xs sm:text-sm font-normal text-gray-400">/mo</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Deposit: ₹{listing.deposit.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center sm:justify-end gap-1 mt-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-sm text-gray-800">{listing.rating}</span>
                    <span className="text-gray-400 text-xs">({listing.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <h2 className="font-display font-semibold text-sm sm:text-base text-gray-900 mb-2">
                  About this property
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-base sm:text-lg text-[#1A1A2E] mb-4">
                Amenities &amp; Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {listing.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-9 h-9 bg-[#0F4C81]/10 rounded-xl flex items-center justify-center text-[#0F4C81] shrink-0">
                      {AMENITY_ICONS[a] || <CheckCircle className="w-4 h-4" />}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-800">{a}</span>
                  </div>
                ))}
                {listing.hasMess && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl">
                    <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-orange-800">Mess Included</span>
                  </div>
                )}
                {listing.hasTiffin && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl">
                    <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-orange-800">Tiffin Delivery</span>
                  </div>
                )}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-base sm:text-lg text-[#1A1A2E] mb-4">
                House Rules &amp; Policies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    label: "Curfew Policy",
                    value: listing.hasCurfew ? `Gate closes at ${listing.curfewTime}` : "No Curfew Restriction",
                    icon: Clock,
                    ok: !listing.hasCurfew,
                  },
                  {
                    label: "Visitor Entry",
                    value: listing.visitorAllowed ? "Visitors Allowed in Common Area" : "Visitors Not Permitted",
                    icon: Shield,
                    ok: listing.visitorAllowed,
                  },
                  {
                    label: "Furnishing Status",
                    value: listing.furnishingStatus,
                    icon: Sofa,
                    ok: true,
                  },
                  {
                    label: "Gender Preference",
                    value: `${listing.genderPref} Only`,
                    icon: Shield,
                    ok: true,
                  },
                ].map(({ label, value, icon: Icon, ok }) => (
                  <div key={label} className="flex items-center gap-3.5 p-3.5 bg-gray-50 rounded-2xl">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium">{label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-base sm:text-lg text-[#1A1A2E] mb-3">
                Neighborhood &amp; Location
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mb-4">
                Located in {listing.locality}, {listing.city}. Close to campus transit and local amenities.
              </p>
              <div className="rounded-2xl overflow-hidden h-72 sm:h-96 border border-gray-100 bg-gray-100 relative">
                <GoogleMapView
                  lat={listing.lat}
                  lng={listing.lng}
                  zoom={15}
                  title={listing.title}
                  markers={[
                    {
                      id: listing.id,
                      lat: listing.lat,
                      lng: listing.lng,
                      title: listing.title,
                      price: listing.price,
                      locality: listing.locality,
                    },
                  ]}
                />
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-semibold text-base sm:text-lg text-[#1A1A2E]">
                    Student Reviews
                  </h2>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {reviews.length} verified reviews from students
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-base text-gray-900">{listing.rating}</span>
                  <span className="text-xs text-gray-400">/ 5.0</span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4 divide-y divide-gray-100">
                  {reviews.map((r) => (
                    <div key={r.id} className="pt-4 first:pt-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-xs sm:text-sm text-gray-900">{r.userName}</p>
                          <p className="text-[11px] text-gray-400">{r.userCollege} • {r.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < r.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs sm:text-sm">No reviews yet for this listing.</p>
              )}
            </div>
          </div>

          {/* Sidebar / Owner Contact (1 Col on Desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-gray-100 sticky top-24 space-y-6">
              {/* Pricing Summary */}
              <div className="pb-4 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-medium">Monthly Rent</p>
                <p className="text-3xl font-bold text-[#0F4C81] mt-1">
                  ₹{listing.price.toLocaleString("en-IN")}
                  <span className="text-sm font-normal text-gray-500"> / month</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Security Deposit: ₹{listing.deposit.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white font-bold text-base shadow-sm">
                  {listing.ownerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{listing.ownerName}</p>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified Property Owner
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setChatOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#0F4C81] hover:bg-[#0d3f6e] text-white rounded-xl text-sm font-bold transition-colors min-h-[44px] cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Chat with Owner
                </button>
                <a
                  href={`tel:${listing.ownerPhone}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-[#0F4C81] text-[#0F4C81] rounded-xl text-sm font-semibold hover:bg-[#0F4C81]/5 transition-colors min-h-[44px]"
                >
                  <Phone className="w-4 h-4" /> Call {listing.ownerPhone}
                </a>
                <button
                  onClick={() => setReportOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-red-200 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors min-h-[40px] cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" /> Report Incorrect Listing
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 space-y-1">
                <p>Listing ID: {listing.id}</p>
                <p>Direct Owner Connect • Zero Brokerage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (<1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl flex items-center gap-3 z-30">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400">Starting from</p>
          <p className="text-lg font-bold text-[#0F4C81] truncate">
            ₹{listing.price.toLocaleString("en-IN")}
            <span className="text-xs font-normal text-gray-500">/mo</span>
          </p>
        </div>
        <a
          href={`tel:${listing.ownerPhone}`}
          className="flex items-center justify-center p-3 border border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81]/5 min-h-[46px] min-w-[46px]"
          aria-label="Call Owner"
        >
          <Phone className="w-5 h-5" />
        </a>
        <button
          onClick={() => setChatOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#FF6B35] hover:bg-[#e85a22] text-white font-bold rounded-xl text-sm min-h-[46px] shadow-md cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" /> Chat with Owner
        </button>
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-gray-900">
                Message {listing.ownerName}
              </h3>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {chatSent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-bold text-gray-900 text-base">Inquiry Sent!</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  The property owner has been notified and will respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setChatOpen(false);
                    setChatSent(false);
                  }}
                  className="mt-5 px-6 py-2.5 bg-[#0F4C81] text-white rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-500 text-xs sm:text-sm mb-4">
                  Ask about room availability, moving date, or arrange a property visit.
                </p>
                <textarea
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  rows={4}
                  placeholder="Hi, I'm interested in visiting this accommodation..."
                  className="w-full border border-gray-200 rounded-xl p-3.5 text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 resize-none"
                />
                <button
                  onClick={() => setChatSent(true)}
                  disabled={!chatMsg.trim()}
                  className="mt-4 w-full py-3 bg-[#0F4C81] hover:bg-[#0d3f6e] disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Send Inquiry Message
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-gray-900">
                Report This Listing
              </h3>
              <button
                onClick={() => setReportOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {reportSent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-bold text-gray-900 text-base">Report Submitted</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Our quality team will review this listing within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setReportOpen(false);
                    setReportSent(false);
                  }}
                  className="mt-5 px-6 py-2.5 bg-[#0F4C81] text-white rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <textarea
                  value={reportMsg}
                  onChange={(e) => setReportMsg(e.target.value)}
                  rows={4}
                  placeholder="Describe the issue (e.g. photos don't match, wrong price, incorrect phone number)..."
                  className="w-full border border-gray-200 rounded-xl p-3.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15 resize-none"
                />
                <button
                  onClick={() => setReportSent(true)}
                  disabled={!reportMsg.trim()}
                  className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Submit Grievance Report
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
