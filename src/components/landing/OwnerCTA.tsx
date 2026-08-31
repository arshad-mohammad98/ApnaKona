import Link from "next/link";
import { Building2, TrendingUp, Users, ArrowRight, CheckCircle } from "lucide-react";

const BENEFITS = [
  "Free to list your first property",
  "Reach verified student leads instantly",
  "Built-in chat and inquiry management",
  "Dashboard to track views and bookings",
  "Respond to reviews and build trust",
];

export default function OwnerCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0F4C81] to-[#0d3f6e] relative overflow-hidden">
      {/* Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#FF6B35]/20 text-[#FF6B35] rounded-full text-sm font-semibold mb-6">
              For Property Owners
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              List your property &amp;<br />
              <span className="text-[#FF6B35]">reach 2 lakh+ students</span>
            </h2>
            <p className="text-white/70 mb-8 max-w-md leading-relaxed">
              ApnaKona connects serious property owners with verified, earnest students looking for accommodation. No spam leads, only real inquiries.
            </p>

            <ul className="space-y-3 mb-10">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-white/85 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#FF6B35] shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/role-select"
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#e85a22] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/30"
              >
                List Your Property
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border border-white/30 text-white hover:bg-white/10 rounded-xl transition-colors text-sm font-medium"
              >
                Owner Login
              </Link>
            </div>
          </div>

          {/* Right: Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, value: "2 Lakh+", label: "Active Students", color: "from-blue-400 to-blue-500" },
              { icon: Building2, value: "50,000+", label: "Listed Properties", color: "from-violet-400 to-purple-500" },
              { icon: TrendingUp, value: "35 Avg.", label: "Inquiries per Listing", color: "from-[#FF6B35] to-orange-500" },
              { icon: CheckCircle, value: "98%", label: "Owner Satisfaction", color: "from-green-400 to-emerald-500" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="glass rounded-2xl p-6 text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-display text-2xl font-bold text-[#1A1A2E]">{value}</p>
                <p className="text-gray-500 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
