import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import {
  getLocalSuggestions,
  GroupedSuggestions,
  SuggestionItem,
} from "@/lib/data/suggestionsData";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim() || "";

  if (q.length < 2) {
    return NextResponse.json({
      cities: [],
      localities: [],
      colleges: [],
      totalCount: 0,
    });
  }

  const client = supabaseAdmin || supabase;

  // If Supabase is configured, attempt to query from Supabase
  if (client) {
    try {
      const term = `%${q}%`;
      const [listingsRes, collegesRes] = await Promise.allSettled([
        client
          .from("listings")
          .select("city, locality, title")
          .or(`city.ilike.${term},locality.ilike.${term},title.ilike.${term}`)
          .limit(15),
        client
          .from("colleges")
          .select("name, city, state, type")
          .or(`name.ilike.${term},city.ilike.${term}`)
          .limit(8),
      ]);

      const foundCities = new Map<string, SuggestionItem>();
      const foundLocalities = new Map<string, SuggestionItem>();
      const foundColleges = new Map<string, SuggestionItem>();

      if (listingsRes.status === "fulfilled" && listingsRes.value.data) {
        for (const item of listingsRes.value.data) {
          const c = item.city;
          const l = item.locality;
          const t = item.title;

          if (c && c.toLowerCase().includes(q.toLowerCase())) {
            const key = c.toLowerCase();
            if (!foundCities.has(key)) {
              foundCities.set(key, {
                id: `sb-city-${key}`,
                title: c,
                subtitle: "City",
                category: "Cities",
                value: c,
                city: c,
              });
            }
          }

          if (l && l.toLowerCase().includes(q.toLowerCase())) {
            const key = l.toLowerCase();
            if (!foundLocalities.has(key)) {
              foundLocalities.set(key, {
                id: `sb-loc-${key}`,
                title: l,
                subtitle: c ? `Locality in ${c}` : "Locality",
                category: "Localities",
                value: l,
                city: c,
              });
            }
          }

          if (t && t.toLowerCase().includes(q.toLowerCase()) && /college|university|iit|bits|campus/i.test(t)) {
            const cleanTitle = t.split("—")[0].trim();
            const key = cleanTitle.toLowerCase();
            if (!foundColleges.has(key)) {
              foundColleges.set(key, {
                id: `sb-col-${key}`,
                title: cleanTitle,
                subtitle: c ? `Near ${l || ""}, ${c}` : "College / Landmark",
                category: "Colleges",
                value: cleanTitle,
                city: c,
              });
            }
          }
        }
      }

      if (collegesRes.status === "fulfilled" && collegesRes.value.data) {
        for (const col of collegesRes.value.data) {
          const key = col.name.toLowerCase();
          if (!foundColleges.has(key)) {
            foundColleges.set(key, {
              id: `sb-college-tbl-${key}`,
              title: col.name,
              subtitle: col.city ? `College • ${col.city}` : "College / Campus",
              category: "Colleges",
              value: col.name,
              city: col.city,
            });
          }
        }
      }

      const totalFound = foundCities.size + foundLocalities.size + foundColleges.size;

      if (totalFound > 0) {
        const cities = Array.from(foundCities.values()).slice(0, 3);
        const localities = Array.from(foundLocalities.values()).slice(0, 3);
        const colleges = Array.from(foundColleges.values()).slice(0, 3);
        return NextResponse.json({
          cities,
          localities,
          colleges,
          totalCount: cities.length + localities.length + colleges.length,
        });
      }
    } catch (err) {
      console.warn("Supabase query failed, falling back to local database:", err);
    }
  }

  // Fallback / standard querying against local listings & curated colleges/localities database
  const suggestions: GroupedSuggestions = getLocalSuggestions(q, 8);
  return NextResponse.json(suggestions);
}
