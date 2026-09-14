/**
 * ApnaKona Site Configuration & Contact Constants
 */

export const SITE_CONFIG = {
  name: "ApnaKona",
  contact: {
    email: "apnakonaa@gmail.com",
    phone: "+918076135853",
    displayPhone: "+91 80761 35853",
  },
  social: {
    instagram: {
      url: "https://instagram.com/apna._kona",
      handle: "@apna._kona",
      label: "Instagram",
    },
    twitter: {
      url: "https://twitter.com/apnaKonaB",
      handle: "@apnaKonaB",
      label: "Twitter / X",
    },
    gmail: {
      url: "mailto:apnakonaa@gmail.com",
      email: "apnakonaa@gmail.com",
      label: "Gmail",
    },
    phone: {
      url: "tel:+918076135853",
      phone: "+918076135853",
      label: "Call Us",
    },
  },
  admin: {
    email: "apnakonaa@gmail.com",
    username: "apnakonaa",
    password: "8076135853",
  },
};

/**
 * Maps user-entered or reverse-geocoded location strings (e.g. "Knowledge Park III, Gautam Buddha Nagar")
 * to the corresponding canonical database city and locality search query.
 */
export function resolveLocationQuery(input: string): { city: string; search: string } {
  if (!input || !input.trim() || input.trim().toLowerCase() === "all") {
    return { city: "", search: "" };
  }

  const raw = input.trim();
  const lower = raw.toLowerCase();

  // 1. Greater Noida / Gautam Buddha Nagar / Knowledge Park / Pari Chowk / Noida
  if (
    lower.includes("greater noida") ||
    lower.includes("gautam buddha nagar") ||
    lower.includes("gautam budh nagar") ||
    lower.includes("knowledge park") ||
    lower.includes("pari chowk") ||
    lower.includes("noida")
  ) {
    const isKnowledgePark = lower.includes("knowledge park");
    const isPariChowk = lower.includes("pari chowk");
    const isAlpha = lower.includes("alpha");
    return {
      city: "Greater Noida",
      search: isKnowledgePark ? "Knowledge Park" : isPariChowk ? "Pari Chowk" : isAlpha ? "Alpha" : "",
    };
  }

  // 2. Bangalore / Bengaluru
  if (
    lower.includes("bangalore") ||
    lower.includes("bengaluru") ||
    lower.includes("koramangala") ||
    lower.includes("indiranagar") ||
    lower.includes("whitefield") ||
    lower.includes("electronic city") ||
    lower.includes("bellandur") ||
    lower.includes("hsr")
  ) {
    const locality = lower.includes("koramangala")
      ? "Koramangala"
      : lower.includes("indiranagar")
      ? "Indiranagar"
      : lower.includes("whitefield")
      ? "Whitefield"
      : lower.includes("electronic city")
      ? "Electronic City"
      : "";
    return { city: "Bangalore", search: locality };
  }

  // 3. Pune
  if (
    lower.includes("pune") ||
    lower.includes("fc road") ||
    lower.includes("kothrud") ||
    lower.includes("viman nagar") ||
    lower.includes("hinjewadi") ||
    lower.includes("wakad") ||
    lower.includes("baner")
  ) {
    const locality = lower.includes("fc road")
      ? "FC Road"
      : lower.includes("kothrud")
      ? "Kothrud"
      : lower.includes("viman nagar")
      ? "Viman Nagar"
      : lower.includes("hinjewadi")
      ? "Hinjewadi"
      : "";
    return { city: "Pune", search: locality };
  }

  // 4. Delhi
  if (
    lower.includes("delhi") ||
    lower.includes("north campus") ||
    lower.includes("south campus") ||
    lower.includes("laxmi nagar") ||
    lower.includes("hauz khas") ||
    lower.includes("dwarka") ||
    lower.includes("rohini")
  ) {
    const locality = lower.includes("north campus")
      ? "North Campus"
      : lower.includes("south campus")
      ? "South Campus"
      : lower.includes("laxmi nagar")
      ? "Laxmi Nagar"
      : lower.includes("hauz khas")
      ? "Hauz Khas"
      : "";
    return { city: "Delhi", search: locality };
  }

  // 5. Mumbai
  if (
    lower.includes("mumbai") ||
    lower.includes("bombay") ||
    lower.includes("powai") ||
    lower.includes("andheri") ||
    lower.includes("bandra") ||
    lower.includes("thane") ||
    lower.includes("navi mumbai")
  ) {
    const locality = lower.includes("powai")
      ? "Powai"
      : lower.includes("andheri")
      ? "Andheri"
      : lower.includes("bandra")
      ? "Bandra"
      : "";
    return { city: "Mumbai", search: locality };
  }

  // 6. Hyderabad
  if (
    lower.includes("hyderabad") ||
    lower.includes("gachibowli") ||
    lower.includes("madhapur") ||
    lower.includes("hitec") ||
    lower.includes("kondapur") ||
    lower.includes("kukatpally")
  ) {
    const locality = lower.includes("gachibowli")
      ? "Gachibowli"
      : lower.includes("madhapur")
      ? "Madhapur"
      : "";
    return { city: "Hyderabad", search: locality };
  }

  // 7. Chennai
  if (lower.includes("chennai") || lower.includes("madras") || lower.includes("omr") || lower.includes("guindy")) {
    return { city: "Chennai", search: "" };
  }

  const POPULAR = ["Bangalore", "Pune", "Delhi", "Greater Noida", "Mumbai", "Hyderabad", "Chennai", "Kota", "Jaipur"];
  for (const c of POPULAR) {
    if (lower.includes(c.toLowerCase())) {
      return { city: c, search: "" };
    }
  }

  return { city: raw, search: "" };
}
