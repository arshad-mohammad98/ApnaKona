import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ananya Krishnan",
    college: "Symbiosis Law School, Pune",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
    rating: 5,
    text: "ApnaKona saved me from an exhausting broker nightmare! I found my PG in 2 days and the owner was verified and transparent. The room filter system is super fast and clean.",
    city: "Pune",
  },
  {
    name: "Harsh Agarwal",
    college: "DTU Delhi → Moving to Bengaluru",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80",
    rating: 5,
    text: "Moving for my first campus placement was daunting. ApnaKona's verified photos, curfew info, and genuine reviews gave me confidence to shortlist without getting scammed.",
    city: "Bengaluru",
  },
  {
    name: "Sneha Patil",
    college: "VIT Pune, 2nd Year",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80",
    rating: 5,
    text: "The roommate-matching feature on Connect is incredible! Found two compatible flatmates from my university. The map view helped us pick a spot close to campus.",
    city: "Pune",
  },
  {
    name: "Rajan Mehrotra",
    college: "IIT Madras → Internship in Chennai",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80",
    rating: 5,
    text: "Compared to other housing apps, ApnaKona is so much cleaner and responsive. The mess-included filter alone saved me hours. Found a great PG in Anna Nagar quickly!",
    city: "Chennai",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-3.5 py-1 bg-[#DDF3EA] dark:bg-emerald-950/60 text-[#1F634A] dark:text-emerald-300 rounded-full text-xs sm:text-sm font-semibold mb-3 border border-[#A4DFCA]/50">
            Student Stories
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B132B] dark:text-white mb-2.5">
            Loved by students across India
          </h2>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 text-[#F4A261] fill-[#F4A261]" />
              ))}
            </div>
            <span className="text-[#334155] dark:text-slate-200 text-xs sm:text-sm font-semibold ml-1">
              4.8 / 5 from 2,00,000+ reviews
            </span>
          </div>
        </div>

        {/* Responsive Grid: 1 col mobile, 2 col tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="relative bg-white dark:bg-slate-800/80 rounded-3xl p-5 sm:p-7 border border-[#CBD5E1] dark:border-slate-700/80 hover:border-[#2A556A]/40 hover:shadow-card transition-all duration-300 animate-fade-up flex flex-col justify-between"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 sm:w-10 sm:h-10 text-[#2A556A]/15 dark:text-[#4A7C94]/15 pointer-events-none" />

              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm shrink-0"
                  />
                  <div>
                    <p className="font-display font-bold text-[#0B132B] dark:text-white text-sm sm:text-base">
                      {t.name}
                    </p>
                    <p className="text-[#334155] dark:text-slate-400 text-xs truncate max-w-[220px] sm:max-w-none font-medium">
                      {t.college}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 text-[#F4A261] fill-[#F4A261]" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[#0F172A] dark:text-slate-200 text-xs sm:text-sm leading-relaxed italic font-medium">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#CBD5E1] dark:border-slate-700/60 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-[#D9E8EF] dark:bg-[#2A556A]/40 text-[#122733] dark:text-[#D9E8EF] text-xs font-bold px-2.5 py-1 rounded-full border border-[#2A556A]/20">
                  📍 {t.city}
                </span>
                <span className="text-[11px] text-[#334155] dark:text-slate-400 font-bold">Verified Resident</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
