import Link from "next/link";
import { Building2, TrendingUp, Users, ArrowRight, CheckCircle } from "lucide-react";

const BENEFITS = [
  "Free to list your first property with zero commission",
  "Reach thousands of verified students looking for rooms",
  "Built-in chat, inquiry tracker, and direct calling",
  "Dashboard to monitor real-time leads and student visits",
  "Verified owner badge with up to 3x higher inquiries",
];

export default function OwnerCTA() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#0F4C81] via-[#0d3f6e] to-[#12283e] relative overflow-hidden">
      {/* Decorations */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#FF6B35]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block px-3.5 py-1 bg-[#FF6B35]/20 text-[#FF6B35] rounded-full text-xs sm:text-sm font-semibold mb-4">
              For Property Owners
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              List your property &amp; <br className="hidden sm:inline" />
              <span className="text-[#FF6B35]">reach 2 lakh+ verified students</span>
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mb-6 max-w-lg leading-relaxed">
              ApnaKona connects serious PG, hostel, and flat owners directly with verified students. No broker cuts, no fake inquiries.
            </p>

            <ul className="space-y-2.5 mb-8">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-white/90 text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/role-select"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF6B35] hover:bg-[#e85a22] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/30 text-sm min-h-[46px]"
              >
                List Your Property Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center px-6 py-3.5 border border-white/30 text-white hover:bg-white/10 rounded-xl transition-colors text-sm font-medium min-h-[46px]"
              >
                Owner Login
              </Link>
            </div>
          </div>

          {/* Right: Responsive Stat Cards */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            {[
              { icon: Users, value: "2 Lakh+", label: "Active Students", color: "from-blue-400 to-blue-500" },
              { icon: Building2, value: "50,000+", label: "Listed Properties", color: "from-violet-400 to-purple-500" },
              { icon: TrendingUp, value: "35 Avg.", label: "Inquiries per Listing", color: "from-[#FF6B35] to-orange-500" },
              { icon: CheckCircle, value: "98%", label: "Owner Satisfaction", color: "from-green-400 to-emerald-500" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2.5 shadow-md`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#1A1A2E]">{value}</p>
                <p className="text-gray-500 text-[11px] sm:text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
