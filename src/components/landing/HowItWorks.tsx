import { Search, CheckCircle, MessageCircle, Key } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Search & Filter",
    description: "Enter your college or city, set your budget, and filter by sharing type, AC, and mess. Hundreds of verified listings ready to browse.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: CheckCircle,
    step: "02",
    title: "Compare & Shortlist",
    description: "Inspect genuine photos, check distance to your campus, compare rules, and read authentic reviews from student residents.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Chat with Owner",
    description: "Directly message verified property owners without middlemen. Clarify details, ask questions, or schedule a physical visit.",
    color: "from-[#FF6B35] to-orange-600",
  },
  {
    icon: Key,
    step: "04",
    title: "Move In Confidently",
    description: "Finalize your booking with zero brokerage. Move into your new room and connect with flatmates on ApnaKona.",
    color: "from-green-500 to-emerald-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-3.5 py-1 bg-[#0F4C81]/8 text-[#0F4C81] rounded-full text-xs sm:text-sm font-semibold mb-3">
            Simple Process
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A2E] mb-3">
            Find your room in <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-lg mx-auto">
            Zero brokers, zero hidden costs. Just a transparent, safe journey from campus search to moving in.
          </p>
        </div>

        {/* Steps Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-green-500 opacity-20 pointer-events-none" />

          {STEPS.map(({ icon: Icon, step, title, description, color }, i) => (
            <div
              key={step}
              className="relative flex flex-col items-center text-center p-6 bg-gray-50/70 sm:bg-transparent rounded-3xl sm:rounded-none border sm:border-0 border-gray-100 group animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Step Icon */}
              <div
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 mb-4 sm:mb-5 relative`}
              >
                <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm">
                  {step}
                </span>
              </div>
              <h3 className="font-display font-semibold text-base sm:text-lg text-[#1A1A2E] mb-1.5">
                {title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xs">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
