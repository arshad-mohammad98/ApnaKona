import { DUMMY_LISTINGS } from "./listings";

export type SuggestionCategory = "Cities" | "Localities" | "Colleges";

export interface SuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  category: SuggestionCategory;
  value: string;
  city?: string;
}

export interface GroupedSuggestions {
  cities: SuggestionItem[];
  localities: SuggestionItem[];
  colleges: SuggestionItem[];
  totalCount: number;
}

export const KNOWN_CITIES: { name: string; state: string }[] = [
  { name: "Bangalore", state: "Karnataka" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Delhi", state: "Delhi NCR" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Greater Noida", state: "Uttar Pradesh" },
  { name: "Gurgaon", state: "Haryana" },
  { name: "Pilani", state: "Rajasthan" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Kota", state: "Rajasthan" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Manipal", state: "Karnataka" },
  { name: "Vellore", state: "Tamil Nadu" },
];

export const KNOWN_LOCALITIES: { name: string; city: string }[] = [
  { name: "Koramangala", city: "Bangalore" },
  { name: "HSR Layout", city: "Bangalore" },
  { name: "Indiranagar", city: "Bangalore" },
  { name: "BTM Layout", city: "Bangalore" },
  { name: "Electronic City", city: "Bangalore" },
  { name: "Whitefield", city: "Bangalore" },
  { name: "Marathahalli", city: "Bangalore" },
  { name: "Jayanagar", city: "Bangalore" },
  { name: "Powai", city: "Mumbai" },
  { name: "Andheri", city: "Mumbai" },
  { name: "Bandra", city: "Mumbai" },
  { name: "FC Road", city: "Pune" },
  { name: "Aundh", city: "Pune" },
  { name: "Baner", city: "Pune" },
  { name: "Viman Nagar", city: "Pune" },
  { name: "Kothrud", city: "Pune" },
  { name: "Hinjewadi", city: "Pune" },
  { name: "Laxmi Nagar", city: "Delhi" },
  { name: "Rohini", city: "Delhi" },
  { name: "North Campus", city: "Delhi" },
  { name: "South Campus", city: "Delhi" },
  { name: "Hauz Khas", city: "Delhi" },
  { name: "Mukherjee Nagar", city: "Delhi" },
  { name: "Ameerpet", city: "Hyderabad" },
  { name: "Gachibowli", city: "Hyderabad" },
  { name: "Madhapur", city: "Hyderabad" },
  { name: "Kondapur", city: "Hyderabad" },
  { name: "Anna Nagar", city: "Chennai" },
  { name: "Adyar", city: "Chennai" },
  { name: "Velachery", city: "Chennai" },
  { name: "Sector 62", city: "Noida" },
  { name: "Knowledge Park III", city: "Greater Noida" },
  { name: "Vidya Nagar", city: "Pilani" },
];

export const KNOWN_COLLEGES: { name: string; city: string; landmark?: string }[] = [
  { name: "Christ University", city: "Bangalore", landmark: "Hosur Road & Bannerghatta" },
  { name: "BITS Pilani", city: "Pilani", landmark: "Vidya Vihar Campus" },
  { name: "IIT Bombay", city: "Mumbai", landmark: "Powai" },
  { name: "IIT Delhi", city: "Delhi", landmark: "Hauz Khas" },
  { name: "IIT Madras", city: "Chennai", landmark: "Sardar Patel Road" },
  { name: "Delhi University (DU)", city: "Delhi", landmark: "North & South Campus" },
  { name: "DTU (Delhi Technological University)", city: "Delhi", landmark: "Rohini" },
  { name: "Symbiosis International University", city: "Pune", landmark: "Viman Nagar & Lavale" },
  { name: "COEP Technological University", city: "Pune", landmark: "Shivajinagar" },
  { name: "Fergusson College", city: "Pune", landmark: "FC Road" },
  { name: "Savitribai Phule Pune University (SPPU)", city: "Pune", landmark: "Ganeshkhind" },
  { name: "IIIT Hyderabad", city: "Hyderabad", landmark: "Gachibowli" },
  { name: "Osmania University", city: "Hyderabad", landmark: "Amberpet" },
  { name: "Anna University", city: "Chennai", landmark: "Guindy" },
  { name: "Sharda University", city: "Greater Noida", landmark: "Knowledge Park III" },
  { name: "Amity University", city: "Noida", landmark: "Sector 125" },
  { name: "St. Joseph's University", city: "Bangalore", landmark: "Langford Road" },
  { name: "Mount Carmel College", city: "Bangalore", landmark: "Vasanth Nagar" },
  { name: "NMIMS Mumbai", city: "Mumbai", landmark: "Vile Parle" },
  { name: "Manipal Academy of Higher Education (MAHE)", city: "Manipal", landmark: "Madhav Nagar" },
  { name: "VIT University", city: "Vellore", landmark: "Katpadi" },
];

export function getLocalSuggestions(rawQuery: string, maxTotal = 8): GroupedSuggestions {
  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) {
    return { cities: [], localities: [], colleges: [], totalCount: 0 };
  }

  // 1. Collect all unique cities
  const citySet = new Map<string, string>();
  KNOWN_CITIES.forEach((c) => citySet.set(c.name.toLowerCase(), c.state));
  DUMMY_LISTINGS.forEach((l) => {
    if (l.city && !citySet.has(l.city.toLowerCase())) {
      citySet.set(l.city.toLowerCase(), "India");
    }
  });

  const matchedCities: SuggestionItem[] = [];
  citySet.forEach((state, cityLower) => {
    if (cityLower.includes(query)) {
      const properName =
        KNOWN_CITIES.find((c) => c.name.toLowerCase() === cityLower)?.name ||
        DUMMY_LISTINGS.find((l) => l.city.toLowerCase() === cityLower)?.city ||
        cityLower.charAt(0).toUpperCase() + cityLower.slice(1);

      matchedCities.push({
        id: `city-${cityLower}`,
        title: properName,
        subtitle: `City in ${state}`,
        category: "Cities",
        value: properName,
        city: properName,
      });
    }
  });

  // Sort cities: prefix match first, then alphabetical
  matchedCities.sort((a, b) => {
    const aStarts = a.title.toLowerCase().startsWith(query);
    const bStarts = b.title.toLowerCase().startsWith(query);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.title.localeCompare(b.title);
  });

  // 2. Collect all unique localities
  const localitySet = new Map<string, string>();
  KNOWN_LOCALITIES.forEach((loc) => localitySet.set(loc.name.toLowerCase(), loc.city));
  DUMMY_LISTINGS.forEach((l) => {
    if (l.locality && !localitySet.has(l.locality.toLowerCase())) {
      localitySet.set(l.locality.toLowerCase(), l.city || "");
    }
  });

  const matchedLocalities: SuggestionItem[] = [];
  localitySet.forEach((cityName, locLower) => {
    if (locLower.includes(query)) {
      const properName =
        KNOWN_LOCALITIES.find((l) => l.name.toLowerCase() === locLower)?.name ||
        DUMMY_LISTINGS.find((l) => l.locality.toLowerCase() === locLower)?.locality ||
        locLower.charAt(0).toUpperCase() + locLower.slice(1);

      matchedLocalities.push({
        id: `loc-${locLower}`,
        title: properName,
        subtitle: cityName ? `Locality in ${cityName}` : "Locality / Area",
        category: "Localities",
        value: properName,
        city: cityName,
      });
    }
  });

  // Sort localities: prefix match first
  matchedLocalities.sort((a, b) => {
    const aStarts = a.title.toLowerCase().startsWith(query);
    const bStarts = b.title.toLowerCase().startsWith(query);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.title.localeCompare(b.title);
  });

  // 3. Match Colleges & Landmarks
  const matchedColleges: SuggestionItem[] = [];
  KNOWN_COLLEGES.forEach((col, idx) => {
    const matchName = col.name.toLowerCase().includes(query);
    const matchLandmark = col.landmark?.toLowerCase().includes(query);
    if (matchName || matchLandmark) {
      matchedColleges.push({
        id: `col-${idx}-${col.name}`,
        title: col.name,
        subtitle: `College / Campus • ${col.city}`,
        category: "Colleges",
        value: col.name,
        city: col.city,
      });
    }
  });

  // Also check DUMMY_LISTINGS titles that reference a college or landmark
  DUMMY_LISTINGS.forEach((l) => {
    if (l.title.toLowerCase().includes(query)) {
      // If title includes campus/university keywords and isn't already duplicated
      const isCampusRelated =
        /college|university|iit|bits|campus|du|dtu|symbiosis/i.test(l.title);
      if (
        isCampusRelated &&
        !matchedColleges.some((c) => l.title.toLowerCase().includes(c.title.toLowerCase()))
      ) {
        matchedColleges.push({
          id: `col-listing-${l.id}`,
          title: l.title.split("—")[0].trim(),
          subtitle: `Near ${l.locality}, ${l.city}`,
          category: "Colleges",
          value: l.title.split("—")[0].trim(),
          city: l.city,
        });
      }
    }
  });

  // Sort colleges: prefix match first
  matchedColleges.sort((a, b) => {
    const aStarts = a.title.toLowerCase().startsWith(query);
    const bStarts = b.title.toLowerCase().startsWith(query);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.title.localeCompare(b.title);
  });

  // Allocate quotas up to maxTotal (e.g. 8 total)
  // Ensure balanced representation across categories
  const resCities: SuggestionItem[] = [];
  const resLocs: SuggestionItem[] = [];
  const resCols: SuggestionItem[] = [];

  let count = 0;
  // Round-robin selection so all matching categories get representation
  const maxPerCategory = Math.max(3, Math.ceil(maxTotal / 3));

  // Take top from each category up to maxPerCategory
  for (const c of matchedCities.slice(0, maxPerCategory)) {
    if (count < maxTotal) {
      resCities.push(c);
      count++;
    }
  }

  for (const l of matchedLocalities.slice(0, maxPerCategory)) {
    if (count < maxTotal) {
      resLocs.push(l);
      count++;
    }
  }

  for (const col of matchedColleges.slice(0, maxPerCategory)) {
    if (count < maxTotal) {
      resCols.push(col);
      count++;
    }
  }

  // If still below maxTotal, fill from remaining
  if (count < maxTotal) {
    for (const c of matchedCities.slice(resCities.length)) {
      if (count >= maxTotal) break;
      resCities.push(c);
      count++;
    }
  }
  if (count < maxTotal) {
    for (const l of matchedLocalities.slice(resLocs.length)) {
      if (count >= maxTotal) break;
      resLocs.push(l);
      count++;
    }
  }
  if (count < maxTotal) {
    for (const col of matchedColleges.slice(resCols.length)) {
      if (count >= maxTotal) break;
      resCols.push(col);
      count++;
    }
  }

  return {
    cities: resCities,
    localities: resLocs,
    colleges: resCols,
    totalCount: count,
  };
}
