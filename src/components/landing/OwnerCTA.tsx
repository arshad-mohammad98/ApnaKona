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
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#35657C] via-[#234C60] to-[#102632] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block px-3.5 py-1 bg-white/15 text-[#E5EFF4] backdrop-blur-md rounded-full text-xs sm:text-sm font-semibold mb-4 border border-white/20">
              For Property Owners
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              List your property &amp; <br className="hidden sm:inline" />
              <span className="text-[#F09A57]">reach 2 lakh+ verified students</span>
            </h2>
            <p className="text-white/90 text-xs sm:text-sm mb-6 max-w-lg leading-relaxed font-normal">
              ApnaKona connects serious PG, hostel, and flat owners directly with verified students. No broker cuts, no fake inquiries.
            </p>

            <ul className="space-y-2.5 mb-8">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-white font-medium text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 text-[#F09A57] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/role-select"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#F09A57] hover:bg-[#e08945] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#F09A57]/30 text-sm min-h-[46px]"
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
              { icon: Users, value: "2 Lakh+", label: "Active Students", color: "from-[#35657C] to-[#234C60]" },
              { icon: Building2, value: "50,000+", label: "Listed Properties", color: "from-[#234C60] to-[#102632]" },
              { icon: TrendingUp, value: "35 Avg.", label: "Inquiries per Listing", color: "from-[#F4A261] to-[#E7843B]" },
              { icon: CheckCircle, value: "98%", label: "Owner Satisfaction", color: "from-[#48B892] to-[#298365]" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2.5 shadow-md`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow-xs">{value}</p>
                <p className="text-[#F1F5F9] text-[11px] sm:text-xs mt-1 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
