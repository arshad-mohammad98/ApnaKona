import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ananya Krishnan",
    college: "Symbiosis Law School, Pune",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    rating: 5,
    text: "ApnaKona saved me from a nightmare broker experience! I found my PG in 2 days and the owner was exactly as described. The filter system is super easy and the app is beautiful.",
    city: "Pune",
  },
  {
    name: "Harsh Agarwal",
    college: "DTU, Delhi → Job in Bangalore",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80",
    rating: 5,
    text: "As someone moving from Delhi to Bangalore for my first job, I was scared about finding a room remotely. ApnaKona's detailed photos and verified reviews gave me the confidence to book without visiting. 10/10!",
    city: "Bangalore",
  },
  {
    name: "Sneha Patil",
    college: "VIT Pune, 2nd Year",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
    rating: 4,
    text: "The roommate-matching feature is brilliant! Found two amazing flatmates through Connect and we're all from the same state. The platform is so well-designed, especially the map view.",
    city: "Pune",
  },
  {
    name: "Rajan Mehrotra",
    college: "IIT Madras → Intern at Chennai MNC",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    rating: 5,
    text: "Compared to other platforms, ApnaKona is so much cleaner and faster. The mess-included filter alone saved me hours of searching. Found a great PG in Anna Nagar within a day!",
    city: "Chennai",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
            Student Stories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-3">
            Loved by students across India
          </h2>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-gray-600 ml-2 text-sm font-medium">4.8 / 5 from 2,00,000+ reviews</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="relative bg-[#F9FAFB] rounded-3xl p-6 border border-gray-100 hover:border-[#0F4C81]/20 hover:shadow-card transition-all animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Quote className="absolute top-5 right-5 w-10 h-10 text-[#0F4C81]/8" />

              <div className="flex items-start gap-4 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-display font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.college}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>

              <div className="mt-4 inline-flex items-center gap-1.5 bg-[#0F4C81]/6 text-[#0F4C81] text-xs font-medium px-3 py-1 rounded-full">
                📍 {t.city}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
