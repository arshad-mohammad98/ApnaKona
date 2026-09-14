"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  MapPin,
  Bus,
  ShoppingBag,
  Truck,
  Calculator,
  Star,
  Filter,
  Map as MapIcon,
  List,
  Search,
  LocateFixed,
  Loader2,
  X,
  Compass,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  ArrowUpDown,
  Navigation,
  Car,
  Bike,
  Footprints,
  Train,
  GraduationCap,
  Building2,
  Home,
} from "lucide-react";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { CITIES, CITY_AREAS, AreaInfo, CityInfo, findClosestCity, getDistanceKm } from "@/lib/data/areas";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Listing } from "@/lib/types";
import GoogleMapView, { RouteInfo, RouteCalculationResult } from "@/components/ui/GoogleMapView";
import { useLanguage } from "@/lib/context/LanguageContext";

export interface TransitDetails {
  distanceKm: number;
  distanceText: string;
  autoMins: number;
  bikeMins: number;
  metroMins: number;
  walkMins: number;
  origin: string;
  destination: string;
  isExactGoogle?: boolean;
}

const LOCAL_HIGHLIGHTS = [
  { id: "safety", label: "High Safety Rating (4.5+)", labelKey: "highlightSafety", icon: Shield },
  { id: "transport", label: "Metro / Bus (<500m)", labelKey: "highlightTransport", icon: Bus },
  { id: "market", label: "Student Market Hub", labelKey: "highlightMarket", icon: ShoppingBag },
  { id: "delivery", label: "Quick Delivery (10m)", labelKey: "highlightDelivery", icon: Truck },
];

export default function ExplorePage() {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<CityInfo>(CITIES[0]);
  const [selectedArea, setSelectedArea] = useState<AreaInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    label: string;
    distanceKm?: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Property Filters
  const [activeHighlights, setActiveHighlights] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");

  // Transit Calculator state
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [distResult, setDistResult] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteInfo | null>(null);
  const [transitDetails, setTransitDetails] = useState<TransitDetails | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [mobileTab, setMobileTab] = useState<"map" | "filters">("map");
  const [selectedTravelMode, setSelectedTravelMode] = useState<"auto" | "bike" | "metro" | "walk">("auto");

  // Dropdown Autocomplete state for Hostel -> College transit
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedFromCoords, setSelectedFromCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedToCoords, setSelectedToCoords] = useState<{ lat: number; lng: number } | null>(null);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const fromBoxRef = useRef<HTMLDivElement>(null);
  const toBoxRef = useRef<HTMLDivElement>(null);

  // Close search suggestions and transit dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
      if (fromBoxRef.current && !fromBoxRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toBoxRef.current && !toBoxRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get areas for current city
  const currentCityAreas = CITY_AREAS[selectedCity.name] || [];

  // Reset area when city changes
  const handleSelectCity = (city: CityInfo) => {
    setSelectedCity(city);
    setSelectedArea(null);
    setUserLocation(null);
    setActiveRoute(null);
    setTransitDetails(null);
    setDistResult(null);
    setSelectedFromCoords(null);
    setSelectedToCoords(null);
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  // Select area
  const handleSelectArea = (area: AreaInfo) => {
    setSelectedArea(area);
    setUserLocation(null);
    setSearchQuery(`${area.name}, ${selectedCity.name}`);
  };

  // Clear area filter
  const handleClearArea = () => {
    setSelectedArea(null);
  };

  // Reverse geocode lat/lng into a readable area/city string
  const fetchAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      if (response.ok) {
        const data = await response.json();
        const addr = data.address || {};
        const neighborhood =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.city_district ||
          addr.quarter ||
          addr.commercial ||
          "";
        const cityName =
          addr.city ||
          addr.town ||
          addr.municipality ||
          addr.state_district ||
          "";

        if (neighborhood && cityName) {
          return `${neighborhood}, ${cityName}`;
        }
        if (neighborhood) {
          return neighborhood;
        }
        if (cityName) {
          return cityName;
        }
        if (data.display_name) {
          const parts = data.display_name.split(",");
          return parts.slice(0, 2).join(",").trim();
        }
      }
    } catch {
      // Fallback below
    }

    const { city } = findClosestCity(lat, lng);
    return `${city.name}`;
  };

  // Auto-detect user geolocation and write exact location in the search box
  const handleAutoLocate = useCallback(() => {
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const { city: closestCity, distanceKm } = findClosestCity(latitude, longitude);

        // Fetch exact readable address
        const exactLocationText = await fetchAddressFromCoords(latitude, longitude);

        // WRITE EXACT LOCATION INTO SEARCH BOX
        setSearchQuery(exactLocationText);

        setSelectedCity(closestCity);

        // Check if detected text matches any known local area in closestCity
        const matchedArea = (CITY_AREAS[closestCity.name] || []).find((a) =>
          exactLocationText.toLowerCase().includes(a.name.toLowerCase())
        );

        if (matchedArea) {
          setSelectedArea(matchedArea);
        } else {
          setSelectedArea(null);
        }

        setUserLocation({
          lat: latitude,
          lng: longitude,
          label: exactLocationText,
          distanceKm,
        });

        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please allow location access in your browser.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError("Could not determine your location.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Search suggestions across all areas and cities
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      type: "area" | "city" | "college";
      title: string;
      subtitle: string;
      city: CityInfo;
      area?: AreaInfo;
    }> = [];

    // Match cities
    CITIES.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        results.push({
          type: "city",
          title: c.name,
          subtitle: `Hub City • ${c.colleges}`,
          city: c,
        });
      }
    });

    // Match areas & campuses
    Object.entries(CITY_AREAS).forEach(([cityName, areas]) => {
      const parentCity = CITIES.find((c) => c.name === cityName);
      if (!parentCity) return;

      areas.forEach((area) => {
        const matchesArea = area.name.toLowerCase().includes(q);
        const matchedCampus = area.campuses.find((camp) => camp.toLowerCase().includes(q));

        if (matchesArea) {
          results.push({
            type: "area",
            title: area.name,
            subtitle: `${cityName} • Near ${area.campuses.join(", ")}`,
            city: parentCity,
            area,
          });
        } else if (matchedCampus) {
          results.push({
            type: "college",
            title: matchedCampus,
            subtitle: `${area.name}, ${cityName} (${area.tag})`,
            city: parentCity,
            area,
          });
        }
      });
    });

    return results.slice(0, 7);
  }, [searchQuery]);

  // Handle selection from search dropdown
  const handleSelectSearchResult = (result: (typeof searchResults)[0]) => {
    setSelectedCity(result.city);
    if (result.area) {
      setSelectedArea(result.area);
      setSearchQuery(`${result.area.name}, ${result.city.name}`);
    } else {
      setSelectedArea(null);
      setSearchQuery(result.city.name);
    }
    setUserLocation(null);
    setIsSearching(false);
  };

  // Toggle highlight filter
  const toggleHighlight = (id: string) => {
    setActiveHighlights((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Comprehensive College & Campus Catalog
  const COLLEGES_CATALOG = useMemo(
    () => [
      // Greater Noida
      { id: "gn-1", name: "Sharda University", shortName: "Sharda", campus: "Knowledge Park III", city: "Greater Noida", lat: 28.4731, lng: 77.4828, type: "University" },
      { id: "gn-2", name: "Galgotias University", shortName: "Galgotias", campus: "Knowledge Park II / Expressway", city: "Greater Noida", lat: 28.3640, lng: 77.5402, type: "University" },
      { id: "gn-3", name: "GL Bajaj Institute of Technology", shortName: "GL Bajaj", campus: "Knowledge Park II", city: "Greater Noida", lat: 28.4619, lng: 77.4988, type: "Institute" },
      { id: "gn-4", name: "Bennett University", shortName: "Bennett", campus: "Techzone II", city: "Greater Noida", lat: 28.4503, lng: 77.5843, type: "University" },
      { id: "gn-5", name: "Gautam Buddha University (GBU)", shortName: "GBU", campus: "Yamuna Expressway", city: "Greater Noida", lat: 28.4239, lng: 77.5273, type: "University" },
      { id: "gn-6", name: "Noida Institute of Engg & Tech (NIET)", shortName: "NIET", campus: "Knowledge Park II", city: "Greater Noida", lat: 28.4632, lng: 77.4907, type: "Institute" },
      { id: "gn-7", name: "ITS Engineering College", shortName: "ITS", campus: "Knowledge Park III", city: "Greater Noida", lat: 28.4705, lng: 77.4912, type: "College" },
      { id: "gn-8", name: "Lloyd Law College", shortName: "Lloyd", campus: "Knowledge Park II", city: "Greater Noida", lat: 28.4665, lng: 77.4975, type: "College" },

      // Bangalore
      { id: "blr-1", name: "Christ University (Central Campus)", shortName: "Christ University", campus: "Hosur Road, Koramangala", city: "Bangalore", lat: 12.9343, lng: 77.6060, type: "University" },
      { id: "blr-2", name: "Christ University (Bannerghatta)", shortName: "Christ BGR", campus: "Bannerghatta Road, Hulimavu", city: "Bangalore", lat: 12.8797, lng: 77.5954, type: "University" },
      { id: "blr-3", name: "Indian Institute of Science (IISc)", shortName: "IISc Bangalore", campus: "Malleshwaram", city: "Bangalore", lat: 13.0219, lng: 77.5671, type: "Institute" },
      { id: "blr-4", name: "RV College of Engineering (RVCE)", shortName: "RVCE", campus: "Mysore Road", city: "Bangalore", lat: 12.9237, lng: 77.4987, type: "College" },
      { id: "blr-5", name: "PES University (Ring Road)", shortName: "PES University", campus: "Banashankari 3rd Stage", city: "Bangalore", lat: 12.9344, lng: 77.5345, type: "University" },
      { id: "blr-6", name: "St. John's Medical College", shortName: "St. John's", campus: "Koramangala", city: "Bangalore", lat: 12.9312, lng: 77.6205, type: "College" },
      { id: "blr-7", name: "NIFT Bangalore", shortName: "NIFT", campus: "HSR Layout Sector 1", city: "Bangalore", lat: 12.9121, lng: 77.6446, type: "Institute" },
      { id: "blr-8", name: "IIIT Bangalore", shortName: "IIIT-B", campus: "Electronic City Phase 1", city: "Bangalore", lat: 12.8407, lng: 77.6638, type: "Institute" },
      { id: "blr-9", name: "BMS College of Engineering (BMSCE)", shortName: "BMSCE", campus: "Basavanagudi", city: "Bangalore", lat: 12.9416, lng: 77.5658, type: "College" },
      { id: "blr-10", name: "Symbiosis Institute (SIBM)", shortName: "SIBM", campus: "Electronic City", city: "Bangalore", lat: 12.8488, lng: 77.6749, type: "Institute" },

      // Delhi
      { id: "del-1", name: "Shri Ram College of Commerce (SRCC)", shortName: "SRCC", campus: "DU North Campus", city: "Delhi", lat: 28.6908, lng: 77.2084, type: "College" },
      { id: "del-2", name: "Hindu College", shortName: "Hindu", campus: "DU North Campus", city: "Delhi", lat: 28.6872, lng: 77.2104, type: "College" },
      { id: "del-3", name: "Hansraj College", shortName: "Hansraj", campus: "DU North Campus", city: "Delhi", lat: 28.6877, lng: 77.2098, type: "College" },
      { id: "del-4", name: "Kirori Mal College (KMC)", shortName: "KMC", campus: "DU North Campus", city: "Delhi", lat: 28.6865, lng: 77.2078, type: "College" },
      { id: "del-5", name: "IIT Delhi", shortName: "IIT Delhi", campus: "Hauz Khas", city: "Delhi", lat: 28.5450, lng: 77.1926, type: "Institute" },
      { id: "del-6", name: "Delhi Technological University (DTU)", shortName: "DTU", campus: "Rohini Sector 17", city: "Delhi", lat: 28.7495, lng: 77.1180, type: "University" },
      { id: "del-7", name: "Sri Venkateswara College", shortName: "Venky", campus: "DU South Campus, Satya Niketan", city: "Delhi", lat: 28.5878, lng: 77.1685, type: "College" },
      { id: "del-8", name: "Jaypee Institute (JIIT)", shortName: "JIIT Noida", campus: "Sector 62, Noida", city: "Delhi", lat: 28.6258, lng: 77.3688, type: "Institute" },

      // Mumbai
      { id: "mum-1", name: "IIT Bombay", shortName: "IIT Bombay", campus: "Powai", city: "Mumbai", lat: 19.1334, lng: 72.9133, type: "Institute" },
      { id: "mum-2", name: "NMIMS University", shortName: "NMIMS", campus: "Vile Parle West", city: "Mumbai", lat: 19.1031, lng: 72.8375, type: "University" },
      { id: "mum-3", name: "Mithibai College", shortName: "Mithibai", campus: "Vile Parle West", city: "Mumbai", lat: 19.1038, lng: 72.8398, type: "College" },
      { id: "mum-4", name: "St. Xavier's College", shortName: "Xavier's", campus: "Dhobi Talao, Fort", city: "Mumbai", lat: 18.9429, lng: 72.8313, type: "College" },
      { id: "mum-5", name: "VJTI Mumbai", shortName: "VJTI", campus: "Matunga", city: "Mumbai", lat: 19.0222, lng: 72.8561, type: "Institute" },

      // Pune
      { id: "pune-1", name: "Symbiosis International University", shortName: "Symbiosis", campus: "Viman Nagar", city: "Pune", lat: 18.5679, lng: 73.9143, type: "University" },
      { id: "pune-2", name: "Fergusson College", shortName: "Fergusson", campus: "FC Road, Deccan", city: "Pune", lat: 18.5204, lng: 73.8415, type: "College" },
      { id: "pune-3", name: "COEP Technological University", shortName: "COEP", campus: "Shivajinagar", city: "Pune", lat: 18.5314, lng: 73.8446, type: "University" },
      { id: "pune-4", name: "MIT World Peace University", shortName: "MIT-WPU", campus: "Kothrud", city: "Pune", lat: 18.5074, lng: 73.8077, type: "University" },
      { id: "pune-5", name: "BMCC College", shortName: "BMCC", campus: "Deccan Gymkhana", city: "Pune", lat: 18.5240, lng: 73.8375, type: "College" },

      // Hyderabad
      { id: "hyd-1", name: "BITS Pilani Hyderabad", shortName: "BITS Hyd", campus: "Jawaharnagar", city: "Hyderabad", lat: 17.5449, lng: 78.5718, type: "Institute" },
      { id: "hyd-2", name: "IIIT Hyderabad", shortName: "IIIT-H", campus: "Gachibowli", city: "Hyderabad", lat: 17.4456, lng: 78.3489, type: "Institute" },
      { id: "hyd-3", name: "University of Hyderabad (UoH)", shortName: "HCU", campus: "Gachibowli", city: "Hyderabad", lat: 17.4567, lng: 78.3264, type: "University" },
      { id: "hyd-4", name: "Osmania University", shortName: "Osmania", campus: "Amberpet", city: "Hyderabad", lat: 17.4138, lng: 78.5284, type: "University" },

      // Chennai
      { id: "chn-1", name: "IIT Madras", shortName: "IIT Madras", campus: "Sardar Patel Road, Guindy", city: "Chennai", lat: 12.9915, lng: 80.2337, type: "Institute" },
      { id: "chn-2", name: "Anna University (CEG)", shortName: "Anna Univ", campus: "Guindy", city: "Chennai", lat: 13.0109, lng: 80.2354, type: "University" },
      { id: "chn-3", name: "Loyola College", shortName: "Loyola", campus: "Nungambakkam", city: "Chennai", lat: 13.0645, lng: 80.2338, type: "College" },
      { id: "chn-4", name: "SRM Institute of Science & Tech", shortName: "SRM", campus: "Kattankulathur", city: "Chennai", lat: 12.8231, lng: 80.0442, type: "University" },
    ],
    []
  );

  // Helper to compile all Hostels, PGs and Student Stay Hubs for a city
  const getHostelsForCity = useCallback(
    (cityName: string) => {
      const list: Array<{
        id: string;
        name: string;
        locality: string;
        city: string;
        lat: number;
        lng: number;
        price?: number;
        type: "Hostel" | "PG" | "Flat" | "Student Hub";
      }> = [];

      // 1. City property listings from database
      DUMMY_LISTINGS.filter((l) => l.city.toLowerCase() === cityName.toLowerCase()).forEach((l) => {
        list.push({
          id: l.id,
          name: l.title,
          locality: l.locality || cityName,
          city: l.city,
          lat: l.lat,
          lng: l.lng,
          price: l.price,
          type: l.roomType === "Hostel" ? "Hostel" : l.roomType === "PG" ? "PG" : "Flat",
        });
      });

      // 2. City student residential stay hubs
      const areas = CITY_AREAS[cityName] || [];
      areas.forEach((a) => {
        list.push({
          id: `area-${a.name}`,
          name: `${a.name} Student Hub`,
          locality: a.name,
          city: cityName,
          lat: a.lat,
          lng: a.lng,
          type: "Student Hub",
        });
      });

      // 3. Fallback: listings from other cities if current list is sparse
      if (list.length < 5) {
        DUMMY_LISTINGS.filter((l) => l.city.toLowerCase() !== cityName.toLowerCase()).forEach((l) => {
          list.push({
            id: l.id,
            name: l.title,
            locality: l.locality || l.city,
            city: l.city,
            lat: l.lat,
            lng: l.lng,
            price: l.price,
            type: l.roomType === "Hostel" ? "Hostel" : "PG",
          });
        });
      }

      return list;
    },
    []
  );

  // Autocomplete Suggestions for "From" (Hostel / PG)
  const fromSuggestions = useMemo(() => {
    const query = fromPlace.trim().toLowerCase();
    const cityHostels = getHostelsForCity(selectedCity.name);

    if (!query) {
      return cityHostels.slice(0, 6);
    }

    const matches = cityHostels.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.locality.toLowerCase().includes(query) ||
        h.city.toLowerCase().includes(query)
    );

    if (matches.length > 0) return matches.slice(0, 7);

    // If not found in current city, search across all listings
    return DUMMY_LISTINGS.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        (l.locality || "").toLowerCase().includes(query) ||
        l.city.toLowerCase().includes(query)
    )
      .map((l) => ({
        id: l.id,
        name: l.title,
        locality: l.locality || l.city,
        city: l.city,
        lat: l.lat,
        lng: l.lng,
        price: l.price,
        type: (l.roomType === "Hostel" ? "Hostel" : "PG") as "Hostel" | "PG",
      }))
      .slice(0, 7);
  }, [fromPlace, selectedCity, getHostelsForCity]);

  // Autocomplete Suggestions for "To" (College / Campus)
  const toSuggestions = useMemo(() => {
    const query = toPlace.trim().toLowerCase();

    if (!query) {
      const inCity = COLLEGES_CATALOG.filter(
        (c) => c.city.toLowerCase() === selectedCity.name.toLowerCase()
      );
      if (inCity.length > 0) return inCity.slice(0, 6);
      return COLLEGES_CATALOG.slice(0, 6);
    }

    // Direct matches in catalog
    const matches = COLLEGES_CATALOG.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.shortName && c.shortName.toLowerCase().includes(query)) ||
        c.campus.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query)
    );

    // Also match any campus names from CITY_AREAS
    const extraMatches: typeof COLLEGES_CATALOG = [];
    Object.entries(CITY_AREAS).forEach(([cityName, areas]) => {
      areas.forEach((a) => {
        a.campuses.forEach((campusName) => {
          if (
            campusName.toLowerCase().includes(query) &&
            !matches.some((m) => m.name.toLowerCase().includes(campusName.toLowerCase())) &&
            !extraMatches.some((m) => m.name.toLowerCase().includes(campusName.toLowerCase()))
          ) {
            extraMatches.push({
              id: `extra-${campusName}`,
              name: campusName,
              shortName: campusName,
              campus: a.name,
              city: cityName,
              lat: a.lat,
              lng: a.lng,
              type: "College",
            });
          }
        });
      });
    });

    const combined = [...matches, ...extraMatches];
    combined.sort((a, b) => {
      const aIn = a.city.toLowerCase() === selectedCity.name.toLowerCase() ? 0 : 1;
      const bIn = b.city.toLowerCase() === selectedCity.name.toLowerCase() ? 0 : 1;
      return aIn - bIn;
    });

    return combined.slice(0, 7);
  }, [toPlace, selectedCity, COLLEGES_CATALOG]);

  // Popular Hostels / PGs in current city (for From quick chips)
  const quickHostels = useMemo(() => {
    const hostels = getHostelsForCity(selectedCity.name);
    return hostels.slice(0, 4);
  }, [selectedCity, getHostelsForCity]);

  // Top Colleges in current city (for To quick chips)
  const quickColleges = useMemo(() => {
    const colleges = COLLEGES_CATALOG.filter(
      (c) => c.city.toLowerCase() === selectedCity.name.toLowerCase()
    );
    if (colleges.length > 0) return colleges.slice(0, 4);
    return COLLEGES_CATALOG.slice(0, 4);
  }, [selectedCity, COLLEGES_CATALOG]);

  // Handle Selection from "From (Hostel)" dropdown
  const handleSelectFrom = (hostel: { name: string; lat: number; lng: number }) => {
    setFromPlace(hostel.name);
    setSelectedFromCoords({ lat: hostel.lat, lng: hostel.lng });
    setShowFromDropdown(false);
  };

  // Handle Selection from "To (College)" dropdown
  const handleSelectTo = (college: { name: string; lat: number; lng: number }) => {
    setToPlace(college.name);
    setSelectedToCoords({ lat: college.lat, lng: college.lng });
    setShowToDropdown(false);
  };

  // Helper to resolve coordinates for campuses, areas, listings, or city landmarks
  const resolvePlaceCoords = useCallback(
    (placeStr: string, city: CityInfo): { lat: number; lng: number; displayName: string } => {
      const clean = placeStr.trim().toLowerCase();

      // 1. Check Colleges Catalog
      for (const c of COLLEGES_CATALOG) {
        if (
          clean.includes(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(clean) ||
          (c.shortName && clean.includes(c.shortName.toLowerCase()))
        ) {
          return { lat: c.lat, lng: c.lng, displayName: `${c.name}, ${c.city}` };
        }
      }

      // 2. Check current city campuses
      const currentAreas = CITY_AREAS[city.name] || [];
      for (const area of currentAreas) {
        for (const campus of area.campuses) {
          if (clean.includes(campus.toLowerCase()) || campus.toLowerCase().includes(clean)) {
            return { lat: area.lat, lng: area.lng, displayName: `${campus}, ${city.name}` };
          }
        }
      }

      // 3. Check current city areas
      for (const area of currentAreas) {
        if (clean.includes(area.name.toLowerCase()) || area.name.toLowerCase().includes(clean)) {
          return { lat: area.lat, lng: area.lng, displayName: `${area.name}, ${city.name}` };
        }
      }

      // 4. Check listings in database
      for (const l of DUMMY_LISTINGS) {
        if (
          clean.includes(l.title.toLowerCase()) ||
          clean.includes((l.locality || "").toLowerCase()) ||
          clean.includes(l.address.toLowerCase())
        ) {
          return { lat: l.lat, lng: l.lng, displayName: `${l.title}, ${l.locality}` };
        }
      }

      // 5. Check across all other cities & campuses
      for (const [cityName, areas] of Object.entries(CITY_AREAS)) {
        for (const area of areas) {
          for (const campus of area.campuses) {
            if (clean.includes(campus.toLowerCase()) || campus.toLowerCase().includes(clean)) {
              return { lat: area.lat, lng: area.lng, displayName: `${campus}, ${cityName}` };
            }
          }
          if (clean.includes(area.name.toLowerCase()) || area.name.toLowerCase().includes(clean)) {
            return { lat: area.lat, lng: area.lng, displayName: `${area.name}, ${cityName}` };
          }
        }
      }

      // 6. Default fallback near city center with deterministic offset
      let hash = 0;
      for (let i = 0; i < clean.length; i++) {
        hash = (hash * 31 + clean.charCodeAt(i)) % 1000;
      }
      const offsetLat = ((hash % 80) - 40) * 0.0006;
      const offsetLng = (((hash * 7) % 80) - 40) * 0.0006;
      return {
        lat: city.lat + offsetLat,
        lng: city.lng + offsetLng,
        displayName: `${placeStr}, ${city.name}`,
      };
    },
    [COLLEGES_CATALOG]
  );

  // Commute distance and direct route calculator from Hostel to College
  const calcDistance = () => {
    if (!fromPlace.trim() || !toPlace.trim()) return;

    setIsCalculatingRoute(true);

    const originTrim = fromPlace.trim();
    const destTrim = toPlace.trim();

    // Qualify place strings with city if not included
    const originStr = originTrim.toLowerCase().includes(selectedCity.name.toLowerCase())
      ? originTrim
      : `${originTrim}, ${selectedCity.name}`;
    const destStr = destTrim.toLowerCase().includes(selectedCity.name.toLowerCase())
      ? destTrim
      : `${destTrim}, ${selectedCity.name}`;

    // Resolve coordinates (prioritize directly selected dropdown coordinates)
    const originLoc = selectedFromCoords
      ? { lat: selectedFromCoords.lat, lng: selectedFromCoords.lng, displayName: originStr }
      : resolvePlaceCoords(originTrim, selectedCity);

    const destLoc = selectedToCoords
      ? { lat: selectedToCoords.lat, lng: selectedToCoords.lng, displayName: destStr }
      : resolvePlaceCoords(destTrim, selectedCity);

    // Compute realistic road distance
    const straightLine = getDistanceKm(originLoc.lat, originLoc.lng, destLoc.lat, destLoc.lng);
    // Road curvature factor in Indian metro cities is ~1.34
    const roadDistKm = Math.max(0.8, Number((straightLine * 1.34).toFixed(1)));

    // Realistic commute speeds
    const autoMins = Math.max(4, Math.round((roadDistKm / 22) * 60 + 3));
    const bikeMins = Math.max(3, Math.round((roadDistKm / 28) * 60 + 1));
    const metroMins =
      roadDistKm < 1.5
        ? Math.round((roadDistKm / 4.8) * 60)
        : Math.max(8, Math.round((roadDistKm / 32) * 60 + 5));
    const walkMins = Math.round((roadDistKm / 4.6) * 60);

    const details: TransitDetails = {
      distanceKm: roadDistKm,
      distanceText: `${roadDistKm} km`,
      autoMins,
      bikeMins,
      metroMins,
      walkMins,
      origin: originTrim,
      destination: destTrim,
      isExactGoogle: false,
    };

    setTransitDetails(details);
    setDistResult(`~${roadDistKm} km • ~${autoMins} min by auto/cab`);

    // Allot direct route on map
    setActiveRoute({
      origin: originStr,
      destination: destStr,
      originCoords: { lat: originLoc.lat, lng: originLoc.lng },
      destinationCoords: { lat: destLoc.lat, lng: destLoc.lng },
    });

    // Close any open dropdowns
    setShowFromDropdown(false);
    setShowToDropdown(false);

    // Automatically switch to map tab on mobile screens so user sees route
    setMobileTab("map");
    setIsCalculatingRoute(false);
  };

  // When Google Maps DirectionsService calculates exact road route
  const handleRouteCalculated = useCallback(
    (result: RouteCalculationResult) => {
      const distKm = result.distanceKm;
      const autoMins = result.durationMinutes;
      const bikeMins = Math.max(3, Math.round((distKm / 28) * 60 + 1));
      const metroMins =
        distKm < 1.5
          ? Math.round((distKm / 4.8) * 60)
          : Math.max(8, Math.round((distKm / 32) * 60 + 5));
      const walkMins = Math.round((distKm / 4.6) * 60);

      setTransitDetails((prev) => ({
        distanceKm: distKm,
        distanceText: result.distanceText,
        autoMins,
        bikeMins,
        metroMins,
        walkMins,
        origin: prev?.origin || fromPlace,
        destination: prev?.destination || toPlace,
        isExactGoogle: true,
      }));
      setDistResult(`${result.distanceText} • ${result.durationText} via Google Maps`);
    },
    [fromPlace, toPlace]
  );

  // Clear route
  const handleClearRoute = () => {
    setActiveRoute(null);
    setTransitDetails(null);
    setDistResult(null);
  };

  // Swap From and To
  const handleSwapPlaces = () => {
    const temp = fromPlace;
    setFromPlace(toPlace);
    setToPlace(temp);
    if (activeRoute) {
      setActiveRoute({
        origin: activeRoute.destination,
        destination: activeRoute.origin,
        originCoords: activeRoute.destinationCoords,
        destinationCoords: activeRoute.originCoords,
      });
    }
  };

  // Filter listings based on city, selected area, budget, gender, highlights
  const cityListings = useMemo(() => {
    return DUMMY_LISTINGS.filter((listing: Listing) => {
      // City check
      if (listing.city.toLowerCase() !== selectedCity.name.toLowerCase()) {
        return false;
      }

      // Area / Locality check
      if (selectedArea) {
        const areaName = selectedArea.name.toLowerCase();
        const locality = (listing.locality || "").toLowerCase();
        const title = listing.title.toLowerCase();
        const address = listing.address.toLowerCase();

        const matchesArea =
          locality.includes(areaName) ||
          areaName.includes(locality) ||
          title.includes(areaName) ||
          address.includes(areaName);

        if (!matchesArea) return false;
      }

      // Gender filter
      if (selectedGender !== "all") {
        if (selectedGender === "Boys" && listing.genderPref !== "Boys") return false;
        if (selectedGender === "Girls" && listing.genderPref !== "Girls") return false;
        if (selectedGender === "Co-Ed" && listing.genderPref !== "Co-Ed") return false;
      }

      // Budget filter
      if (selectedBudget === "under10k" && listing.price > 10000) return false;
      if (selectedBudget === "10kTo16k" && (listing.price < 10000 || listing.price > 16000)) return false;
      if (selectedBudget === "above16k" && listing.price <= 16000) return false;

      // Highlights
      if (activeHighlights.includes("safety") && listing.rating < 4.5) return false;
      if (activeHighlights.includes("transport") && !listing.tags.some((t) => t.toLowerCase().includes("metro"))) return false;
      if (activeHighlights.includes("market") && !listing.amenities.includes("Parking") && !listing.tags.some((t) => t.toLowerCase().includes("food"))) return false;
      if (activeHighlights.includes("delivery") && !listing.amenities.includes("WiFi")) return false;

      return true;
    });
  }, [selectedCity, selectedArea, selectedGender, selectedBudget, activeHighlights]);

  // Determine dynamic map query and zoom
  const mapConfig = useMemo(() => {
    if (activeRoute) {
      return {
        query: `${activeRoute.origin} to ${activeRoute.destination}`,
        zoom: 13,
        title: `Route: ${fromPlace} ➔ ${toPlace}`,
        sub: distResult ? `Live Road Route • ${distResult}` : "Direct route plotted on map",
      };
    }
    if (userLocation) {
      return {
        query: `${userLocation.lat},${userLocation.lng}`,
        zoom: 15,
        title: userLocation.label,
        sub: userLocation.distanceKm !== undefined ? `~${userLocation.distanceKm} km from ${selectedCity.name}` : undefined,
      };
    }
    if (selectedArea) {
      return {
        query: `${selectedArea.lat},${selectedArea.lng}`,
        zoom: 15,
        title: `${selectedArea.name}, ${selectedCity.name}`,
        sub: `Near ${selectedArea.campuses.join(", ")}`,
      };
    }
    return {
      query: `${selectedCity.lat},${selectedCity.lng}`,
      zoom: 13,
      title: `${selectedCity.name} Hub View`,
      sub: selectedCity.colleges,
    };
  }, [activeRoute, fromPlace, toPlace, distResult, userLocation, selectedArea, selectedCity]);

  const hasActiveFilters =
    Boolean(selectedArea) ||
    Boolean(userLocation) ||
    selectedGender !== "all" ||
    selectedBudget !== "all" ||
    activeHighlights.length > 0;

  const resetAllFilters = () => {
    setSelectedArea(null);
    setUserLocation(null);
    setSelectedGender("all");
    setSelectedBudget("all");
    setActiveHighlights([]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1120] pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] text-white py-8 sm:py-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-[#E5EFF4] backdrop-blur-xs border border-white/20">
                  <Compass className="w-3.5 h-3.5 text-[#F09A57]" /> {t("explorePage", "badge")}
                </span>
                {userLocation && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-[#D4ECE5] border border-emerald-400/30 animate-pulse">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GPS Active
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {t("explorePage", "title")}
              </h1>
              <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-xl font-normal">
                {t("explorePage", "subtitle")}
              </p>
            </div>

            {/* Mobile View Toggle */}
            <div className="lg:hidden flex items-center bg-white/10 backdrop-blur-xs p-1 rounded-2xl w-full sm:w-auto border border-white/20">
              <button
                onClick={() => setMobileTab("map")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ease-out cursor-pointer min-h-[40px] ${
                  mobileTab === "map" ? "bg-white text-[#234C60] shadow-sm scale-[1.02] font-bold" : "text-white/80"
                }`}
              >
                <MapIcon className="w-4 h-4" /> {t("explorePage", "mapTab")}
              </button>
              <button
                onClick={() => setMobileTab("filters")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ease-out cursor-pointer min-h-[40px] ${
                  mobileTab === "filters" ? "bg-white text-[#2A556A] shadow-sm scale-[1.02] font-bold" : "text-white/80"
                }`}
              >
                <List className="w-4 h-4" /> {t("explorePage", "filterTab")} ({cityListings.length})
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SEARCH PALETTE WITH AUTO-LOCATION MAP ICON
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-6 relative" ref={searchBoxRef}>
            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200/90 dark:border-slate-700 hover:border-[#0F4C81]/40 focus-within:border-[#0F4C81] dark:focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-[#0F4C81]/10 shadow-sm transition-all">
              {/* Search Icon */}
              <div className="pl-4 pr-2 text-gray-400 dark:text-slate-400">
                <Search className="w-5 h-5 text-gray-400 dark:text-slate-400" />
              </div>

              {/* Main Input - Shows Typed Query OR Auto-detected Location */}
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                }}
                placeholder={t("explorePage", "searchPlaceholder")}
                className="w-full py-3.5 pr-2 text-xs sm:text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400 outline-none font-medium"
              />

              {/* Clear button if search query typed */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors mr-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1 shrink-0" />

              {/* MAP / GEOLOCATION AUTO-DETECT BUTTON */}
              <button
                type="button"
                onClick={handleAutoLocate}
                disabled={isLocating}
                title="Automatically fetch my location and fill search"
                className={`group flex items-center gap-1.5 px-3 sm:px-4 py-2 my-1 mr-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  userLocation
                    ? "bg-emerald-600 dark:bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                    : isLocating
                    ? "bg-[#E5EFF4] dark:bg-slate-800 text-[#234C60] dark:text-sky-300 border border-[#CBD5E1] dark:border-slate-700"
                    : "bg-[#E5EFF4] dark:bg-slate-800 hover:bg-[#234C60] dark:hover:bg-slate-700 text-[#0D212D] dark:text-white hover:text-white dark:hover:text-white border border-[#CBD5E1] dark:border-slate-700 shadow-2xs"
                }`}
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#234C60] dark:text-sky-400 shrink-0" />
                    <span className="text-xs font-semibold whitespace-nowrap">{t("explorePage", "locating")}</span>
                  </>
                ) : userLocation ? (
                  <>
                    <LocateFixed className="w-4 h-4 text-white shrink-0" />
                    <span className="text-xs font-semibold whitespace-nowrap">{t("explorePage", "locateMe")}</span>
                  </>
                ) : (
                  <>
                    <LocateFixed className="w-4 h-4 text-[#234C60] dark:text-sky-400 group-hover:text-white dark:group-hover:text-white group-hover:scale-110 transition-all shrink-0" />
                    <span className="text-xs font-bold text-[#0D212D] dark:text-white group-hover:text-white dark:group-hover:text-white whitespace-nowrap">{t("explorePage", "locateMe")}</span>
                  </>
                )}
              </button>
            </div>

            {/* Location Feedback / Error Banner */}
            {locationError && (
              <div className="mt-2.5 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{locationError}</span>
                </div>
                <button
                  onClick={() => setLocationError(null)}
                  className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {userLocation && !locationError && (
              <div className="mt-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <LocateFixed className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    <strong>Exact Location Detected:</strong> {userLocation.label} • Map centered on your coordinates
                  </span>
                </div>
                <button
                  onClick={() => {
                    setUserLocation(null);
                    setSearchQuery("");
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline shrink-0 cursor-pointer"
                >
                  Clear GPS
                </button>
              </div>
            )}

            {/* SEARCH SUGGESTIONS DROPDOWN PALETTE */}
            {isSearching && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3">
                  Matching Neighborhoods &amp; Campuses
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50/60 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 p-2 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-[#0F4C81] group-hover:text-white transition-colors">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#0F4C81]">
                            {res.title}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">{res.subtitle}</p>
                        </div>
                      </div>
                      <Badge variant="neutral" className="shrink-0 text-[10px]">
                        {res.city.name}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA (LISTINGS & INTERACTIVE MAP)
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & Listings Panel (5 cols) */}
          <div
            className={`lg:col-span-5 space-y-5 ${
              mobileTab === "filters" ? "block" : "hidden lg:block"
            }`}
          >
            {/* Filtered City & Area Listings */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-card border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-semibold text-sm sm:text-base text-[#0B132B] dark:text-white">
                  {selectedArea
                    ? `Properties in ${selectedArea.name}`
                    : `Properties in ${selectedCity.name}`}{" "}
                  <span className="text-[#234C60] dark:text-sky-400 font-bold">({cityListings.length})</span>
                </h2>
                {selectedArea && (
                  <button
                    onClick={handleClearArea}
                    className="text-[11px] text-[#234C60] dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                  >
                    Clear Area
                  </button>
                )}
              </div>

              {cityListings.length > 0 ? (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-slate-800">
                  {cityListings.map((l: Listing) => (
                    <div
                      key={l.id}
                      className="pt-3 first:pt-0 group"
                    >
                      <Link
                        href={`/hostels/${l.id}`}
                        className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 transition-all cursor-pointer group shadow-2xs"
                      >
                        <img
                          src={l.images[0]}
                          alt={l.title}
                          loading="lazy"
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-[#0D212D] dark:text-white group-hover:text-[#F09A57] dark:group-hover:text-[#F09A57] truncate transition-colors">
                            {l.title}
                          </p>
                          <p className="text-[11px] text-[#64748B] dark:text-slate-300 truncate flex items-center gap-1 mt-0.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400 shrink-0" />
                            {l.locality}, {l.city}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs sm:text-sm font-bold text-[#234C60] dark:text-sky-300">
                              ₹{l.price.toLocaleString("en-IN")}/mo
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-[#1E293B] dark:text-slate-200 font-semibold">
                                {l.genderPref}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FEF7F1] dark:bg-amber-950/60 text-[#F4A261] dark:text-amber-300 font-bold flex items-center gap-1 border border-[#F4A261]/20">
                                <Star className="w-3 h-3 fill-[#F4A261] text-[#F4A261]" />
                                {l.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
                    No properties match the selected criteria in {selectedArea ? selectedArea.name : selectedCity.name}.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="mt-3 px-4 py-2 bg-[#F09A57] hover:bg-[#e08945] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Reset Area &amp; Filters
                  </button>
                </div>
              )}
            </div>

            {/* Distance & Transit Calculator */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-card border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="font-display font-semibold text-sm sm:text-base text-[#0B132B] dark:text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#F09A57]" /> {t("explorePage", "transitCalcTitle")}
                </h2>
                {activeRoute && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-[#F09A57] border border-[#F09A57]/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F09A57] animate-pulse" />
                    Route Active
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-3.5">
                {t("explorePage", "transitCalcSubtitle")}
              </p>

              <div className="space-y-3">
                {/* From Input (Hostel / PG) with Dropdown */}
                <div ref={fromBoxRef} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-[#F09A57]" />
                      <span>{t("explorePage", "fromPlaceholder")}</span>
                    </label>
                    {fromPlace && (
                      <button
                        type="button"
                        onClick={() => {
                          setFromPlace("");
                          setSelectedFromCoords(null);
                        }}
                        className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={fromPlace}
                      onFocus={() => setShowFromDropdown(true)}
                      onChange={(e) => {
                        setFromPlace(e.target.value);
                        setSelectedFromCoords(null);
                        setShowFromDropdown(true);
                      }}
                      placeholder={t("explorePage", "fromInputHint")}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0D212D] dark:text-white rounded-xl text-xs sm:text-sm outline-none focus:border-[#F09A57] min-h-[44px]"
                    />
                  </div>

                  {/* Autocomplete Dropdown for From (Hostel / PG) */}
                  {showFromDropdown && fromSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-60 overflow-y-auto">
                      <div className="p-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/70 text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-3 flex items-center justify-between">
                        <span>Select Hostel or PG</span>
                        <span className="text-[9px] text-gray-400 font-normal">Click to fill</span>
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-slate-800">
                        {fromSuggestions.map((h) => (
                          <button
                            key={h.id}
                            type="button"
                            onClick={() => handleSelectFrom(h)}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-orange-50/70 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-2.5 group cursor-pointer"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="mt-0.5 p-1.5 rounded-lg bg-orange-100/80 dark:bg-orange-950/60 text-[#F09A57] shrink-0">
                                <Home className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-[#F09A57] truncate">
                                  {h.name}
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                  {h.locality}, {h.city} {h.price ? `• ₹${h.price.toLocaleString("en-IN")}/mo` : ""}
                                </p>
                              </div>
                            </div>
                            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-medium">
                              {h.type}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Hostel / PG Chips */}
                  {quickHostels.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-gray-400">Popular Hostels:</span>
                      {quickHostels.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => handleSelectFrom(h)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium transition-colors cursor-pointer truncate max-w-[170px]"
                        >
                          {h.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Swap button between From & To */}
                <div className="flex justify-center -my-1">
                  <button
                    type="button"
                    onClick={handleSwapPlaces}
                    title="Swap From and To"
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-orange-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-[#F09A57] transition-all shadow-xs border border-gray-200 dark:border-slate-700 cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* To Input (College / University) with Dropdown */}
                <div ref={toBoxRef} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0F4C81] dark:text-sky-400" />
                      <span>{t("explorePage", "toPlaceholder")}</span>
                    </label>
                    {toPlace && (
                      <button
                        type="button"
                        onClick={() => {
                          setToPlace("");
                          setSelectedToCoords(null);
                        }}
                        className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={toPlace}
                      onFocus={() => setShowToDropdown(true)}
                      onChange={(e) => {
                        setToPlace(e.target.value);
                        setSelectedToCoords(null);
                        setShowToDropdown(true);
                      }}
                      placeholder={t("explorePage", "toInputHint")}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0D212D] dark:text-white rounded-xl text-xs sm:text-sm outline-none focus:border-[#F09A57] min-h-[44px]"
                    />
                  </div>

                  {/* Autocomplete Dropdown for To (College / Campus) */}
                  {showToDropdown && toSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-60 overflow-y-auto">
                      <div className="p-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/70 text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-3 flex items-center justify-between">
                        <span>Select College or Campus</span>
                        <span className="text-[9px] text-gray-400 font-normal">Click to fill</span>
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-slate-800">
                        {toSuggestions.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectTo(c)}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/70 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-2.5 group cursor-pointer"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="mt-0.5 p-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-950/60 text-[#0F4C81] dark:text-sky-400 shrink-0">
                                <GraduationCap className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-[#0F4C81] dark:group-hover:text-sky-400 truncate">
                                  {c.name}
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                  {c.campus}, {c.city}
                                </p>
                              </div>
                            </div>
                            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-medium">
                              {c.type}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick College Chips */}
                  {quickColleges.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-gray-400">Top Colleges:</span>
                      {quickColleges.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectTo(c)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium transition-colors cursor-pointer truncate max-w-[170px]"
                        >
                          {c.shortName || c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={calcDistance}
                    disabled={isCalculatingRoute || !fromPlace.trim() || !toPlace.trim()}
                    className="flex-1 py-3 bg-[#F09A57] hover:bg-[#e08945] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] shadow-sm shadow-[#F09A57]/25 flex items-center justify-center gap-2"
                  >
                    {isCalculatingRoute ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Calculating Route...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        <span>{t("explorePage", "calculateRoute")}</span>
                      </>
                    )}
                  </button>

                  {activeRoute && (
                    <button
                      type="button"
                      onClick={handleClearRoute}
                      title={t("explorePage", "clearRoute")}
                      className="px-3 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer min-h-[44px] transition-colors"
                    >
                      {t("explorePage", "clearRoute")}
                    </button>
                  )}
                </div>

                {/* Detailed Transit Breakdown Card */}
                {transitDetails && (
                  <div className="mt-3 p-4 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-emerald-50/40 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/70 border border-[#F09A57]/40 rounded-2xl shadow-xs space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D212D] dark:text-white">
                          <span className="w-2 h-2 rounded-full bg-[#F09A57] shrink-0" />
                          <span>{transitDetails.distanceText} Commute</span>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-slate-300 mt-0.5 truncate">
                          {transitDetails.origin} ➔ {transitDetails.destination}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shrink-0">
                        ✓ Allotted on Map
                      </span>
                    </div>

                    {/* 4 Commute Modes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="bg-white/90 dark:bg-slate-900/90 p-2 rounded-xl border border-gray-200/70 dark:border-slate-700/70 text-center shadow-2xs">
                        <Car className="w-3.5 h-3.5 mx-auto text-[#F09A57] mb-0.5" />
                        <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                          {t("explorePage", "autoCab")}
                        </p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                          ~{transitDetails.autoMins}m
                        </p>
                      </div>

                      <div className="bg-white/90 dark:bg-slate-900/90 p-2 rounded-xl border border-gray-200/70 dark:border-slate-700/70 text-center shadow-2xs">
                        <Bike className="w-3.5 h-3.5 mx-auto text-[#0F4C81] dark:text-sky-400 mb-0.5" />
                        <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                          {t("explorePage", "bikeScooter")}
                        </p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                          ~{transitDetails.bikeMins}m
                        </p>
                      </div>

                      <div className="bg-white/90 dark:bg-slate-900/90 p-2 rounded-xl border border-gray-200/70 dark:border-slate-700/70 text-center shadow-2xs">
                        <Train className="w-3.5 h-3.5 mx-auto text-emerald-600 dark:text-emerald-400 mb-0.5" />
                        <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                          {t("explorePage", "metroTransit")}
                        </p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                          ~{transitDetails.metroMins}m
                        </p>
                      </div>

                      <div className="bg-white/90 dark:bg-slate-900/90 p-2 rounded-xl border border-gray-200/70 dark:border-slate-700/70 text-center shadow-2xs">
                        <Footprints className="w-3.5 h-3.5 mx-auto text-purple-600 dark:text-purple-400 mb-0.5" />
                        <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                          {t("explorePage", "walking")}
                        </p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                          ~{transitDetails.walkMins}m
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 pt-1 border-t border-gray-200/60 dark:border-slate-700/60">
                      <span>{transitDetails.isExactGoogle ? "Live Google Directions" : "Geometric Road Curvature"}</span>
                      <button
                        type="button"
                        onClick={() => setMobileTab("map")}
                        className="text-[#0F4C81] dark:text-sky-400 font-semibold hover:underline cursor-pointer"
                      >
                        Inspect on Map ➔
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              INTERACTIVE MAP VIEW (7 cols)
          ───────────────────────────────────────────────────────────── */}
          <div className={`lg:col-span-7 ${mobileTab === "map" ? "block" : "hidden lg:block"}`}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card border border-gray-100 dark:border-slate-800 overflow-hidden lg:sticky lg:top-24 flex flex-col h-[480px] sm:h-[600px] lg:h-[760px]">
              {/* Map Header */}
              <div className="bg-gradient-to-r from-[#102632] via-[#234C60] to-[#35657C] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
                <div className="flex items-center gap-2.5 text-white min-w-0">
                  <div className="p-1.5 rounded-lg bg-white/15 backdrop-blur-xs">
                    {activeRoute ? (
                      <Navigation className="w-4 h-4 text-[#F09A57]" />
                    ) : userLocation ? (
                      <LocateFixed className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <MapPin className="w-4 h-4 text-[#F09A57]" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-xs sm:text-sm truncate">
                      {mapConfig.title}
                    </p>
                    {mapConfig.sub && (
                      <p className="text-[11px] text-blue-100 truncate">{mapConfig.sub}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeRoute && (
                    <button
                      type="button"
                      onClick={handleClearRoute}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Clear Route</span>
                    </button>
                  )}
                  {selectedArea && !activeRoute && (
                    <button
                      type="button"
                      onClick={handleClearArea}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      City View
                    </button>
                  )}
                  {userLocation && !activeRoute && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserLocation(null);
                        setSearchQuery("");
                      }}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Exit GPS
                    </button>
                  )}
                  <Badge variant="cyan">
                    {cityListings.length} {cityListings.length === 1 ? "Listing" : "Listings"}
                  </Badge>
                </div>
              </div>

              {/* Map Frame with Google Maps API */}
              <div className="flex-1 w-full relative bg-gray-100 min-h-[450px]">
                <GoogleMapView
                  lat={userLocation ? userLocation.lat : selectedArea ? selectedArea.lat : selectedCity.lat}
                  lng={userLocation ? userLocation.lng : selectedArea ? selectedArea.lng : selectedCity.lng}
                  zoom={mapConfig.zoom}
                  title={mapConfig.title}
                  markers={cityListings.map((l) => ({
                    id: l.id,
                    lat: l.lat,
                    lng: l.lng,
                    title: l.title,
                    price: l.price,
                    locality: l.locality,
                  }))}
                  route={activeRoute}
                  onRouteCalculated={handleRouteCalculated}
                  onClearRoute={handleClearRoute}
                  className="w-full h-full"
                />

                {/* Floating Map Hint Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-3 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 text-xs text-gray-700 dark:text-slate-300">
                  {activeRoute ? (
                    <div>
                      <div className="flex items-center justify-between gap-2 font-semibold text-gray-900 dark:text-white mb-0.5">
                        <div className="flex items-center gap-1.5 text-[#F09A57]">
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Direct Route Plotted</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearRoute}
                          className="text-[10px] text-gray-400 hover:text-rose-500 font-bold cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400">
                        Direct road navigation route between {fromPlace} and {toPlace} is plotted directly on the page above.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
                        <span>Live Location Focus</span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400">
                        Map auto-syncs with your search input, selected neighborhood, and GPS location.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* On-Page Direct Route Bar (renders below map frame within the sticky card) */}
              {activeRoute && transitDetails && (
                <div className="border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    {/* Route Endpoints Visualizer */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="p-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-[#F09A57] shrink-0">
                          <Home className="w-3.5 h-3.5" />
                        </span>
                        <div className="truncate">
                          <p className="text-[9px] text-gray-400 uppercase font-semibold">Origin (Hostel / PG)</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{fromPlace}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-[#F09A57]">
                        <span>➔</span>
                        <span>{transitDetails.distanceText}</span>
                      </div>

                      <div className="flex items-center gap-2 min-w-0">
                        <span className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#0F4C81] dark:text-sky-400 shrink-0">
                          <GraduationCap className="w-3.5 h-3.5" />
                        </span>
                        <div className="truncate">
                          <p className="text-[9px] text-gray-400 uppercase font-semibold">Destination (College)</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{toPlace}</p>
                        </div>
                      </div>
                    </div>

                    {/* Clear Route Button */}
                    <button
                      type="button"
                      onClick={handleClearRoute}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold rounded-lg cursor-pointer shrink-0 transition-colors"
                    >
                      Clear Route
                    </button>
                  </div>

                  {/* On-Page Travel Mode Switcher */}
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                      <Navigation className="w-3.5 h-3.5 text-[#F09A57]" />
                      <span className="font-semibold text-gray-800 dark:text-slate-200 text-[11px]">On-Page Commute Mode:</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTravelMode("auto")}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                          selectedTravelMode === "auto"
                            ? "bg-[#F09A57] text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        <Car className="w-3 h-3" />
                        <span>Auto: ~{transitDetails.autoMins}m</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTravelMode("bike")}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                          selectedTravelMode === "bike"
                            ? "bg-[#0F4C81] text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        <Bike className="w-3 h-3" />
                        <span>Bike: ~{transitDetails.bikeMins}m</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTravelMode("metro")}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                          selectedTravelMode === "metro"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        <Train className="w-3 h-3" />
                        <span>Metro: ~{transitDetails.metroMins}m</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTravelMode("walk")}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                          selectedTravelMode === "walk"
                            ? "bg-purple-600 text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        <Footprints className="w-3 h-3" />
                        <span>Walk: ~{transitDetails.walkMins}m</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
