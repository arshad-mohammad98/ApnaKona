"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { DUMMY_REVIEWS } from "@/lib/data/reviews";
import { Star, MapPin, Phone, MessageCircle, Flag, CheckCircle, X, ChevronLeft, ChevronRight, Wifi, Shield, Zap, Car, Camera, Lock, ArrowUpDown, Sofa, UtensilsCrossed, Clock } from "lucide-react";
import Link from "next/link";

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
      <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 bg-gray-100 group cursor-pointer" onClick={() => setLightbox(true)}>
        <img src={images[current]} alt={title} className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-5" : "bg-white/60"}`} />
          ))}
        </div>
        <button onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {current + 1} / {images.length}
        </div>
      </div>
      {/* Thumbnails */}
      <div className="flex gap-2 mt-2">
        {images.map((img, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-16 w-24 rounded-xl overflow-hidden border-2 transition-colors ${i === current ? "border-[#0F4C81]" : "border-transparent"}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <img src={images[current]} alt={title} className="max-w-4xl max-h-[90vh] object-contain rounded-2xl" />
          <button className="absolute top-5 right-5 text-white hover:text-gray-300"><X className="w-7 h-7" /></button>
        </div>
      )}
    </>
  );
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = DUMMY_LISTINGS.find((l) => l.id === id);
  if (!listing) notFound();

  const reviews = DUMMY_REVIEWS.filter((r) => r.listingId === listing.id);
  const [reportOpen, setReportOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [reportMsg, setReportMsg] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [chatSent, setChatSent] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#0F4C81]">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-[#0F4C81]">Search</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <ImageGallery images={listing.images} title={listing.title} />
            </div>

            {/* Info */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[listing.roomType, listing.sharingType + " Sharing", listing.genderPref].map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-[#0F4C81]/8 text-[#0F4C81] text-xs font-semibold rounded-full">{tag}</span>
                    ))}
                    {listing.isAC && <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full">AC</span>}
                  </div>
                  <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">{listing.title}</h1>
                  <p className="flex items-center gap-1 text-gray-500 text-sm mt-1"><MapPin className="w-4 h-4" />{listing.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#0F4C81]">₹{listing.price.toLocaleString("en-IN")}<span className="text-base font-normal text-gray-400">/mo</span></p>
                  <p className="text-sm text-gray-500">Deposit: ₹{listing.deposit.toLocaleString("en-IN")}</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-sm">{listing.rating}</span>
                    <span className="text-gray-400 text-xs">({listing.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-lg text-[#1A1A2E] mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-[#0F4C81]/10 rounded-lg flex items-center justify-center text-[#0F4C81]">
                      {AMENITY_ICONS[a] || <CheckCircle className="w-4 h-4" />}
                    </div>
                    <span className="text-sm text-gray-700">{a}</span>
                  </div>
                ))}
                {listing.hasMess && <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl"><div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><UtensilsCrossed className="w-4 h-4 text-orange-600" /></div><span className="text-sm text-orange-700">Mess Included</span></div>}
                {listing.hasTiffin && <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl"><div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><UtensilsCrossed className="w-4 h-4 text-orange-600" /></div><span className="text-sm text-orange-700">Tiffin Service</span></div>}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-lg text-[#1A1A2E] mb-4">House Rules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Curfew", value: listing.hasCurfew ? `Yes (${listing.curfewTime})` : "No Curfew", icon: Clock, ok: !listing.hasCurfew },
                  { label: "Visitor Entry", value: listing.visitorAllowed ? "Allowed" : "Not Allowed", icon: Shield, ok: listing.visitorAllowed },
                  { label: "Furnishing", value: listing.furnishingStatus, icon: Sofa, ok: true },
                  { label: "Gender", value: listing.genderPref, icon: Shield, ok: true },
                ].map(({ label, value, icon: Icon, ok }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ok ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-semibold text-lg text-[#1A1A2E] mb-4">Location</h2>
              <div className="rounded-2xl overflow-hidden h-64 bg-gray-100">
                <iframe
                  src={`https://www.google.com/maps?q=${listing.lat},${listing.lng}&z=15&output=embed`}
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  title="Listing Location"
                />
              </div>
              <p className="flex items-center gap-1 text-gray-500 text-sm mt-3"><MapPin className="w-4 h-4" />{listing.address}</p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg text-[#1A1A2E]">Reviews ({listing.reviewCount})</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-lg">{listing.rating}</span>
                  <span className="text-gray-400 text-sm">/ 5</span>
                </div>
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-5">
                  {reviews.map((r) => (
                    <div key={r.id} className="border-b border-gray-100 pb-5 last:border-0">
                      <div className="flex items-start gap-3 mb-2">
                        <img src={r.userAvatar} alt={r.userName} className="w-9 h-9 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm text-gray-900">{r.userName}</p>
                            <span className="text-xs text-gray-400">{r.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No reviews yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Owner Card */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 sticky top-24">
              <h2 className="font-display font-semibold text-base text-[#1A1A2E] mb-4">Property Owner</h2>
              <div className="flex items-center gap-3 mb-5">
                {listing.ownerAvatar ? (
                  <img src={listing.ownerAvatar} alt={listing.ownerName} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#0F4C81] flex items-center justify-center text-white font-bold">
                    {listing.ownerName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{listing.ownerName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" /> Verified Owner
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <a href={`tel:${listing.ownerPhone}`}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-[#0F4C81] text-[#0F4C81] rounded-xl text-sm font-medium hover:bg-[#0F4C81]/5 transition-colors">
                  <Phone className="w-4 h-4" /> {listing.ownerPhone}
                </a>
                <button onClick={() => setChatOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F4C81] text-white rounded-xl text-sm font-semibold hover:bg-[#0d3f6e] transition-colors">
                  <MessageCircle className="w-4 h-4" /> Chat with Owner
                </button>
                <button onClick={() => setReportOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                  <Flag className="w-4 h-4" /> Report / Flag Listing
                </button>
              </div>
              <div className="mt-5 pt-5 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                <p>Posted: {listing.postedAt}</p>
                <p>Listed on ApnaKona</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Message {listing.ownerName}</h3>
              <button onClick={() => setChatOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            {chatSent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-gray-800">Message Sent!</p>
                <p className="text-gray-500 text-sm mt-1">The owner will respond within 24 hours.</p>
                <button onClick={() => { setChatOpen(false); setChatSent(false); }} className="mt-5 px-6 py-2 bg-[#0F4C81] text-white rounded-xl text-sm">Close</button>
              </div>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-4">Introduce yourself and ask about availability.</p>
                <textarea
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  rows={4} placeholder="Hi, I'm interested in your listing..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#0F4C81] resize-none"
                />
                <button onClick={() => setChatSent(true)}
                  className="w-full mt-3 py-3 bg-[#0F4C81] text-white rounded-xl text-sm font-semibold hover:bg-[#0d3f6e] transition-colors">
                  Send Message
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-red-600">Report Listing</h3>
              <button onClick={() => setReportOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <p className="text-gray-500 text-sm mb-4">Help keep ApnaKona safe. Describe the issue with this listing.</p>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3 outline-none focus:border-red-400">
              <option>Photos don&apos;t match reality</option>
              <option>Incorrect pricing</option>
              <option>Fraudulent listing</option>
              <option>Unavailable property</option>
              <option>Other</option>
            </select>
            <textarea value={reportMsg} onChange={(e) => setReportMsg(e.target.value)} rows={3}
              placeholder="Additional details..." className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-red-400 resize-none mb-3" />
            <button onClick={() => setReportOpen(false)}
              className="w-full py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">
              Submit Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
