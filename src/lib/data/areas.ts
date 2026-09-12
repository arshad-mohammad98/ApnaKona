export interface AreaInfo {
  name: string;
  lat: number;
  lng: number;
  campuses: string[];
  tag: string;
}

export interface CityInfo {
  name: string;
  lat: number;
  lng: number;
  colleges: string;
}

export const CITIES: CityInfo[] = [
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, colleges: "IISc, Christ, RVCE, PES" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, colleges: "Symbiosis, COEP, Ferguson, MIT" },
  { name: "Delhi", lat: 28.6139, lng: 77.2090, colleges: "DU, IIT Delhi, DTU, JNU" },
  { name: "Greater Noida", lat: 28.4744, lng: 77.5040, colleges: "Sharda, Galgotias, Bennett, GL Bajaj, GBU" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, colleges: "IIT Bombay, NMIMS, Xavier's, VJTI" },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, colleges: "BITS Hyd, Osmania, IIIT-H, UoH" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, colleges: "IIT Madras, Anna Univ, SRM, Loyola" },
];

export const CITY_AREAS: Record<string, AreaInfo[]> = {
  Bangalore: [
    { name: "Koramangala", lat: 12.9352, lng: 77.6245, campuses: ["Christ University", "St. John's"], tag: "Student Hub" },
    { name: "Indiranagar", lat: 12.9784, lng: 77.6408, campuses: ["EGL", "NIFT"], tag: "Metro & Cafes" },
    { name: "HSR Layout", lat: 12.9121, lng: 77.6446, campuses: ["NIFT", "Oxford College"], tag: "Startup Hub" },
    { name: "BTM Layout", lat: 12.9166, lng: 77.6101, campuses: ["Christ Bannerghatta", "IIMB"], tag: "Budget PGs" },
    { name: "Electronic City", lat: 12.8399, lng: 77.6770, campuses: ["IIIT-B", "Symbiosis"], tag: "Tech Campuses" },
    { name: "Whitefield", lat: 12.9698, lng: 77.7500, campuses: ["MVJ College", "ITPL"], tag: "Metro Connected" },
    { name: "Jayanagar", lat: 12.9308, lng: 77.5838, campuses: ["National College", "RV Teachers"], tag: "Safe & Green" },
    { name: "Hebbal", lat: 13.0358, lng: 77.5970, campuses: ["BMSIT", "Presidency Univ"], tag: "North Bangalore" },
  ],
  Pune: [
    { name: "FC Road", lat: 18.5196, lng: 73.8396, campuses: ["Fergusson College", "BMCC"], tag: "College Epicenter" },
    { name: "Kothrud", lat: 18.5074, lng: 73.8077, campuses: ["MIT World Peace", "Cummins"], tag: "Student Fav" },
    { name: "Viman Nagar", lat: 18.5679, lng: 73.9143, campuses: ["Symbiosis Intl", "ISB&M"], tag: "Walkable & Safe" },
    { name: "Hinjawadi", lat: 18.5913, lng: 73.7389, campuses: ["IIMS", "Symbiosis Infotech"], tag: "Tech Campuses" },
    { name: "Wakad", lat: 18.5987, lng: 73.7656, campuses: ["Indira College", "DY Patil"], tag: "Affordable Stays" },
    { name: "Baner", lat: 18.5590, lng: 73.7868, campuses: ["NICMAR", "GS Moze"], tag: "Premium PGs" },
    { name: "Shivajinagar", lat: 18.5314, lng: 73.8446, campuses: ["COEP", "Modern College"], tag: "Central Transit" },
  ],
  Delhi: [
    { name: "North Campus", lat: 28.6853, lng: 77.2069, campuses: ["SRCC", "Hindu", "Hansraj", "KMC"], tag: "DU Epicenter" },
    { name: "South Campus", lat: 28.5878, lng: 77.1685, campuses: ["Venkateshwara", "ARSD", "MRL"], tag: "Satya Niketan Food" },
    { name: "Hauz Khas", lat: 28.5494, lng: 77.1950, campuses: ["IIT Delhi", "NIFT Delhi"], tag: "Elite Academic" },
    { name: "Laxmi Nagar", lat: 28.6304, lng: 77.2773, campuses: ["Coaching Hub", "DU East"], tag: "Budget Friendly" },
    { name: "Noida Sector 62", lat: 28.6258, lng: 77.3688, campuses: ["Jaypee JIIT", "Symbiosis Noida"], tag: "Metro Connected" },
    { name: "Gurgaon Cyber City", lat: 28.4950, lng: 77.0895, campuses: ["GD Goenka", "MDI Gurgaon"], tag: "Corporate & Univ" },
  ],
  "Greater Noida": [
    { name: "Knowledge Park II & III", lat: 28.4601, lng: 77.4947, campuses: ["Sharda University", "Galgotias", "GL Bajaj"], tag: "Mega Campus Hub" },
    { name: "Pari Chowk", lat: 28.4697, lng: 77.5085, campuses: ["Aqua Line Metro", "Transit Hub", "Food Street"], tag: "Metro & Transit Central" },
    { name: "Alpha 1 & 2", lat: 28.4839, lng: 77.5140, campuses: ["Alpha 1 Metro", "Commercial Market"], tag: "Popular Student PGs" },
    { name: "Beta 1 & 2", lat: 28.4725, lng: 77.5186, campuses: ["Bennett Univ Shuttle", "Student Eateries"], tag: "Affordable Stays" },
    { name: "Gamma 1 & 2", lat: 28.4892, lng: 77.5061, campuses: ["Walking to Knowledge Park", "Green Area"], tag: "Quiet & Green" },
    { name: "Delta 1 & 2", lat: 28.4971, lng: 77.5252, campuses: ["Delta 1 Metro", "Coaching Hub"], tag: "Metro Connected" },
    { name: "Techzone 4", lat: 28.5830, lng: 77.4520, campuses: ["Greater Noida West", "Modern Societies"], tag: "Modern Student Flats" },
  ],
  Mumbai: [
    { name: "Powai", lat: 19.1254, lng: 72.9137, campuses: ["IIT Bombay", "IIM Mumbai"], tag: "Campus Lake Vibe" },
    { name: "Vile Parle", lat: 19.1031, lng: 72.8406, campuses: ["NMIMS", "Mithibai", "D.J. Sanghvi"], tag: "Student Center" },
    { name: "Andheri West", lat: 19.1363, lng: 72.8277, campuses: ["Bhavan's College", "SPJIMR"], tag: "Metro & Cafes" },
    { name: "Bandra West", lat: 19.0596, lng: 72.8295, campuses: ["St. Andrew's", "National College"], tag: "Vibrant Hub" },
    { name: "Juhu", lat: 19.1075, lng: 72.8263, campuses: ["SNDT Univ", "UPG College"], tag: "Beachside" },
    { name: "Dadar / Matunga", lat: 19.0178, lng: 72.8478, campuses: ["VJTI", "ICT Mumbai", "Ruia College"], tag: "Historic Colleges" },
  ],
  Hyderabad: [
    { name: "Gachibowli", lat: 17.4401, lng: 78.3489, campuses: ["Univ of Hyderabad", "IIIT-H"], tag: "University District" },
    { name: "Madhapur", lat: 17.4483, lng: 78.3915, campuses: ["NIFT Hyderabad", "VNR VJIET"], tag: "Hitec City Core" },
    { name: "Kondapur", lat: 17.4699, lng: 78.3578, campuses: ["Chaitanya", "IIIT Adjacent"], tag: "Student Friendly" },
    { name: "Kukatpally", lat: 17.4948, lng: 78.3996, campuses: ["JNTUH", "Pragati Mahavidyalaya"], tag: "Affordable PGs" },
    { name: "Ameerpet", lat: 17.4375, lng: 78.4482, campuses: ["Nizam College Nearby", "Coaching Hub"], tag: "Coaching Capital" },
  ],
  Chennai: [
    { name: "Adyar", lat: 13.0012, lng: 80.2565, campuses: ["IIT Madras", "NIFT Chennai", "AC Tech"], tag: "IIT Zone" },
    { name: "Guindy", lat: 13.0067, lng: 80.2025, campuses: ["Anna University (CEG)", "IITM Gate"], tag: "Academic Heart" },
    { name: "Velachery", lat: 12.9815, lng: 80.2180, campuses: ["Guru Nanak College", "IIT Adjacent"], tag: "High Demand PGs" },
    { name: "OMR IT Corridor", lat: 12.9249, lng: 80.2319, campuses: ["SSN College", "Sathyabama", "Hindustan Univ"], tag: "Engineering Belt" },
    { name: "Anna Nagar", lat: 13.0850, lng: 80.2101, campuses: ["Loyola College Nearby", "IAS Hub"], tag: "Upscale & Safe" },
    { name: "Tambaram", lat: 12.9249, lng: 80.1278, campuses: ["MCC College", "BSAU"], tag: "South Suburban" },
  ],
};

// Calculate Haversine distance in KM between two geographic coordinates
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest city given user coordinates
export function findClosestCity(lat: number, lng: number): { city: CityInfo; distanceKm: number } {
  let closest = CITIES[0];
  let minDistance = getDistanceKm(lat, lng, closest.lat, closest.lng);

  for (let i = 1; i < CITIES.length; i++) {
    const dist = getDistanceKm(lat, lng, CITIES[i].lat, CITIES[i].lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = CITIES[i];
    }
  }

  return { city: closest, distanceKm: Math.round(minDistance) };
}
