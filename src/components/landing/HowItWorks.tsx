import { Search, CheckCircle, MessageCircle, Key } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Search & Filter",
    description: "Enter your city, set your budget, and filter by room type, amenities, and gender preference. Hundreds of verified listings at your fingertips.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: CheckCircle,
    step: "02",
    title: "Compare & Shortlist",
    description: "View detailed listing pages with real photos, amenities, rules, and honest reviews from past residents. Save your favorites.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Chat with Owner",
    description: "Directly message verified property owners. Ask questions, negotiate rent, and schedule a site visit — all within the platform.",
    color: "from-[#FF6B35] to-orange-600",
  },
  {
    icon: Key,
    step: "04",
    title: "Move In!",
    description: "Finalize your room and move in confidently. Rate your stay and help future students make the right choice.",
    color: "from-green-500 to-emerald-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#0F4C81]/8 text-[#0F4C81] rounded-full text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            Find your room in{" "}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            No brokers, no hidden fees. Just a clean, transparent process from search to move-in.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-green-500 opacity-20" />

          {STEPS.map(({ icon: Icon, step, title, description, color }, i) => (
            <div
              key={step}
              className="relative flex flex-col items-center text-center group animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon Circle */}
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow mb-5 relative`}>
                <Icon className="w-9 h-9 text-white" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                  {step}
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#1A1A2E] mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
