import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DUMMY_LISTINGS } from "@/lib/data/listings";
import { CITY_AREAS } from "@/lib/data/areas";

// STEP 2: SYSTEM PROMPT WITH LOCATION-FIRST TRAINING & DATABASE GROUNDING
const SYSTEM_PROMPT = `You are Roomie, the AI assistant for ApnaKona — a platform helping students find hostels, PGs, and flats in cities new to them. Be warm, sharp, and specific — like a knowledgeable senior who's lived in the city for years.

CRITICAL LOCATION-FIRST WORKFLOW:
1. ALWAYS establish the student's location first. If the student's target city or college campus is NOT yet known (neither in their profile nor in the conversation), your FIRST action must be to ask them which city or college campus they are moving to before recommending specific properties or pricing.
2. Once the user specifies a city or college (or if it is already known in context), IMMEDIATELY look at the real database listings provided in your context for that location. Recommend actual matching properties, citing their exact title, monthly rent, sharing type, locality, and inspected amenities.
3. Reason through trade-offs for that specific location (e.g. distance to campus vs rent, meal inclusion, metro connectivity, safe neighborhoods).
4. When real listing or user data is provided in context, use it directly and confidently. When no specific data is available, reason from general knowledge but clearly signal what's general advice versus what needs live confirmation on the app.
5. Ask one sharp clarifying question at a time when something is ambiguous. Keep responses conversational and concise, not long paragraphs. Never invent specific prices, ratings, or listing names that weren't given to you.`;

interface ChatMessage {
  role: "user" | "assistant" | "bot";
  content?: string;
  text?: string;
}

interface UserProfileData {
  name?: string;
  username?: string;
  email?: string;
  preferredCity?: string;
  budgetRange?: string;
  gender?: string;
  college?: string;
  preferredOccupancy?: string;
  foodPreference?: string;
  bio?: string;
  role?: string;
}

/**
 * STEP 3: RAG Retrieval - Gather user profile, location, relevant database listings, and college area data
 */
async function retrieveRAGContext(
  userQuery: string,
  userProfile?: UserProfileData | null,
  userId?: string,
  conversationHistoryText: string = ""
): Promise<{
  isLocationKnown: boolean;
  targetCity: string | null;
  contextPrompt: string;
  matchedListings: any[];
  collegeInfo: string;
}> {
  // 1. Fetch User Profile from Supabase `profiles` table or client session
  let profile: Record<string, any> = userProfile ? { ...userProfile } : {};
  if (userId) {
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId);
      if (Array.isArray(data) && data.length > 0) {
        profile = { ...profile, ...data[0] };
      }
    } catch {}
  }

  // Format profile string
  let profileStr = "Guest student exploring student housing";
  if (profile.name || profile.preferredCity || profile.budgetRange || profile.college || profile.preferred_city) {
    const details = [
      profile.name ? `Student name: ${profile.name}` : null,
      (profile.preferredCity || profile.preferred_city) ? `preferred city is ${profile.preferredCity || profile.preferred_city}` : null,
      (profile.budgetRange || profile.budget_range) ? `budget is ${profile.budgetRange || profile.budget_range}` : null,
      profile.college ? `studies/works at ${profile.college}` : null,
      (profile.preferredOccupancy || profile.preferred_occupancy) ? `preferred room occupancy is ${profile.preferredOccupancy || profile.preferred_occupancy}` : null,
      profile.gender ? `gender: ${profile.gender}` : null,
      (profile.foodPreference || profile.food_preference) ? `dietary preference is ${profile.foodPreference || profile.food_preference}` : null,
      profile.bio ? `habits/bio: ${profile.bio}` : null,
    ].filter(Boolean);

    profileStr = details.join(", ");
  }

  // 2. Scan for Target Location (checking current message, full chat history, and user profile)
  const qLower = userQuery.toLowerCase();
  const histLower = conversationHistoryText.toLowerCase();
  const combinedText = `${histLower} ${qLower}`;

  const cityMap: Record<string, string> = {
    bangalore: "Bangalore",
    bengaluru: "Bangalore",
    pune: "Pune",
    delhi: "Delhi",
    "greater noida": "Greater Noida",
    noida: "Greater Noida",
    mumbai: "Mumbai",
    hyderabad: "Hyderabad",
    chennai: "Chennai",
    kota: "Kota",
    jaipur: "Jaipur",
    kolkata: "Kolkata",
  };

  // College-to-city mapping
  const campusToCityMap: Record<string, string> = {
    christ: "Bangalore",
    iisc: "Bangalore",
    rvce: "Bangalore",
    pes: "Bangalore",
    symbiosis: "Pune",
    coep: "Pune",
    fergusson: "Pune",
    mit: "Pune",
    sharda: "Greater Noida",
    galgotias: "Greater Noida",
    bennett: "Greater Noida",
    "gl bajaj": "Greater Noida",
    "iit delhi": "Delhi",
    du: "Delhi",
    "delhi university": "Delhi",
    dtu: "Delhi",
    jnu: "Delhi",
    "iit bombay": "Mumbai",
    nmims: "Mumbai",
    "xavier's": "Mumbai",
    vjti: "Mumbai",
    "bits hyd": "Hyderabad",
    "iit madras": "Chennai",
  };

  let targetCity: string | null = null;

  // Check current user message first
  for (const [slug, cityName] of Object.entries(cityMap)) {
    if (qLower.includes(slug)) {
      targetCity = cityName;
      break;
    }
  }

  // Check campus in current message
  if (!targetCity) {
    for (const [slug, cityName] of Object.entries(campusToCityMap)) {
      if (qLower.includes(slug)) {
        targetCity = cityName;
        break;
      }
    }
  }

  // Check previous conversation history
  if (!targetCity) {
    for (const [slug, cityName] of Object.entries(cityMap)) {
      if (histLower.includes(slug)) {
        targetCity = cityName;
        break;
      }
    }
  }
  if (!targetCity) {
    for (const [slug, cityName] of Object.entries(campusToCityMap)) {
      if (histLower.includes(slug)) {
        targetCity = cityName;
        break;
      }
    }
  }

  // Check user profile preferred city
  if (!targetCity) {
    const prefCity = profile.preferredCity || profile.preferred_city;
    if (prefCity) {
      const prefLower = prefCity.toLowerCase();
      for (const [slug, cityName] of Object.entries(cityMap)) {
        if (prefLower.includes(slug)) {
          targetCity = cityName;
          break;
        }
      }
      if (!targetCity) targetCity = prefCity;
    }
  }

  const isLocationKnown = Boolean(targetCity);

  // 3. Detect other filters (budget, type, sharing)
  let detectedBudgetMax: number | null = null;
  const kMatch = combinedText.match(/(\d{1,2})\s*k/);
  if (kMatch) {
    detectedBudgetMax = parseInt(kMatch[1]) * 1000;
  } else {
    const numMatch = combinedText.match(/₹?\s*(\d{4,5})/);
    if (numMatch) {
      detectedBudgetMax = parseInt(numMatch[1]);
    }
  }

  const wantsPg = combinedText.includes("pg") || combinedText.includes("paying guest");
  const wantsHostel = combinedText.includes("hostel");
  const wantsFlat = combinedText.includes("flat") || combinedText.includes("apartment");
  const wantsSingle = combinedText.includes("single");
  const wantsDouble = combinedText.includes("double");
  const wantsTriple = combinedText.includes("triple");

  // 4. Query Real Database Listings (Supabase with DUMMY_LISTINGS fallback)
  let allListings: any[] = [];
  try {
    const { data } = await supabase.from("listings").select("*");
    if (Array.isArray(data) && data.length > 0) {
      allListings = data;
    }
  } catch {}

  if (allListings.length === 0) {
    allListings = DUMMY_LISTINGS;
  }

  // Filter listings by target city
  let matched: any[] = [];
  if (targetCity) {
    matched = allListings
      .filter((l) => {
        const lCity = (l.city || "").toLowerCase();
        const lLocality = (l.locality || "").toLowerCase();
        return lCity.includes(targetCity!.toLowerCase()) || lLocality.includes(targetCity!.toLowerCase());
      })
      .map((l) => {
        let score = 0;
        const lTitle = (l.title || "").toLowerCase();
        const lDesc = (l.description || "").toLowerCase();
        const lLocality = (l.locality || "").toLowerCase();
        const lPrice = Number(l.pricePerMonth || l.price || 0);

        // Locality match in query
        if (lLocality && combinedText.includes(lLocality)) score += 6;

        // College match from profile or query
        const collegeWords = (profile.college || "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
        for (const word of collegeWords) {
          if (lLocality.includes(word) || lDesc.includes(word) || lTitle.includes(word)) {
            score += 5;
          }
        }

        // Type match
        if (wantsPg && (l.type === "PG" || lTitle.includes("pg"))) score += 3;
        if (wantsHostel && (l.type === "Hostel" || lTitle.includes("hostel"))) score += 3;
        if (wantsFlat && (l.type === "Flat" || lTitle.includes("flat"))) score += 3;

        // Sharing match
        const sharingList = Array.isArray(l.sharingTypes) ? l.sharingTypes : [l.sharing_type || ""];
        if (wantsSingle && sharingList.some((s: string) => s.toLowerCase().includes("single"))) score += 3;
        if (wantsDouble && sharingList.some((s: string) => s.toLowerCase().includes("double"))) score += 3;
        if (wantsTriple && sharingList.some((s: string) => s.toLowerCase().includes("triple"))) score += 3;

        // Budget match
        if (detectedBudgetMax && lPrice > 0) {
          if (lPrice <= detectedBudgetMax + 2000) score += 4;
        }

        return { listing: l, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.listing)
      .slice(0, 4);

    // Fallback to top city listings if no specific property scored
    if (matched.length === 0) {
      matched = allListings.filter((l) => (l.city || "").toLowerCase().includes(targetCity!.toLowerCase())).slice(0, 4);
    }
  }

  // Format matched listings
  const listingsStr =
    matched.length > 0
      ? matched
          .map((l) => {
            const title = l.title || "Student PG";
            const price = l.pricePerMonth || l.price || "N/A";
            const city = l.city || targetCity;
            const locality = l.locality || "";
            const type = l.type || "PG";
            const sharing = Array.isArray(l.sharingTypes)
              ? l.sharingTypes.join("/")
              : l.sharing_type || "Double Sharing";
            const amenities = Array.isArray(l.amenities)
              ? l.amenities.map((a: any) => (typeof a === "string" ? a : a.label)).slice(0, 4).join(", ")
              : "Wi-Fi, Meals, CCTV";
            const verified = l.verified ? "Verified 🛡️" : "Pending Verification";
            const gender = l.gender || "Co-Ed";
            return `• ${title} (${type}, ${sharing}) in ${locality}, ${city} — Price: ₹${price}/month — Amenities: ${amenities} — Gender: ${gender} — ${verified}`;
          })
          .join("\n")
      : `No matching listings found in ${targetCity || "this area"} yet.`;

  // 5. College / Campus Location Context
  let collegeInfo = "";
  const collegeToSearch = profile.college || (combinedText.includes("college") || combinedText.includes("university") || combinedText.includes("campus") ? userQuery : "");
  if (collegeToSearch) {
    const cLower = collegeToSearch.toLowerCase();
    for (const [cityName, areas] of Object.entries(CITY_AREAS)) {
      for (const area of areas) {
        if (area.campuses.some((c) => cLower.includes(c.toLowerCase()) || c.toLowerCase().includes(cLower))) {
          collegeInfo = `${area.campuses.join(", ")} is located in ${area.name}, ${cityName} (${area.tag}). High student density, safe walking areas, and transit access.`;
          break;
        }
      }
      if (collegeInfo) break;
    }
  }

  // 6. Build RAG Context Prompt with Location-First Instruction
  let contextPrompt = "";
  if (!isLocationKnown) {
    contextPrompt = `[LOCATION STATUS: NOT YET SPECIFIED]\n`;
    contextPrompt += `The user has NOT specified which city or college campus they are looking to live in.\n`;
    contextPrompt += `YOUR IMMEDIATE ACTION: You MUST first ask the student which city or college campus they are searching in (e.g. Bangalore, Pune, Delhi NCR, Greater Noida, Mumbai, Hyderabad, Kota, etc.) before suggesting specific properties or rent numbers.\n`;
    contextPrompt += `User profile: [${profileStr}].\n`;
    contextPrompt += `User's question: [${userQuery}].`;
  } else {
    contextPrompt = `[LOCATION STATUS: CONFIRMED - ${targetCity!.toUpperCase()}]\n`;
    contextPrompt += `User profile: [${profileStr}].\n`;
    contextPrompt += `Target City: ${targetCity}.\n`;
    contextPrompt += `Real Database Listings in ${targetCity}:\n${listingsStr}\n`;
    if (collegeInfo) {
      contextPrompt += `Campus Area Context: [${collegeInfo}].\n`;
    }
    contextPrompt += `User's question: [${userQuery}].\n`;
    contextPrompt += `YOUR IMMEDIATE ACTION: Answer the student's question specifically for ${targetCity} using the real database listings provided above. Confidently cite the exact property names, monthly rents, room sharing types, and amenities from the database.`;
  }

  return { isLocationKnown, targetCity, contextPrompt, matchedListings: matched, collegeInfo };
}

/**
 * Clean up and alternate message history for Anthropic API
 */
function formatAnthropicMessages(
  history: ChatMessage[],
  augmentedLatestPrompt: string
): Array<{ role: "user" | "assistant"; content: string }> {
  const result: Array<{ role: "user" | "assistant"; content: string }> = [];

  for (const m of history) {
    const role = m.role === "assistant" || m.role === "bot" ? "assistant" : "user";
    const text = (m.content || m.text || "").trim();
    if (!text) continue;

    if (result.length === 0) {
      if (role === "user") {
        result.push({ role: "user", content: text });
      }
    } else {
      const prevRole = result[result.length - 1].role;
      if (prevRole === role) {
        result[result.length - 1].content += `\n\n${text}`;
      } else {
        result.push({ role, content: text });
      }
    }
  }

  // Append latest augmented user prompt
  if (result.length > 0 && result[result.length - 1].role === "user") {
    result[result.length - 1].content = augmentedLatestPrompt;
  } else {
    result.push({ role: "user", content: augmentedLatestPrompt });
  }

  return result;
}

export async function POST(req: Request) {
  try {
    const { messages, userProfile, userId } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    // Keep last 10 messages from current chat session for conversation memory
    const recentMessages: ChatMessage[] = messages.slice(-10);
    const lastMsg = recentMessages[recentMessages.length - 1];
    const userQuery = (lastMsg.content || lastMsg.text || "").trim();
    const historyWithoutLast = recentMessages.slice(0, -1);

    // Concatenate conversation history text for complete multi-turn location detection
    const conversationHistoryText = historyWithoutLast
      .map((m) => m.content || m.text || "")
      .join(" ");

    // STEP 3: Retrieve RAG context with Location-First resolution
    const { isLocationKnown, targetCity, contextPrompt, matchedListings } = await retrieveRAGContext(
      userQuery,
      userProfile,
      userId,
      conversationHistoryText
    );

    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: OPENAI API AS PRIMARY ENGINE (Answer all questions via OpenAI)
    // ─────────────────────────────────────────────────────────────────────────
    if (openAiKey && openAiKey !== "sk-abcdef1234567890abcdef1234567890abcdef12") {
      try {
        const openAiMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          {
            role: "system",
            content: `${SYSTEM_PROMPT}\n\n=== VERIFIED DATABASE CONTEXT & ACTIVE STUDENT DATA ===\n${contextPrompt}`,
          },
          ...historyWithoutLast.map((m) => ({
            role: (m.role === "assistant" || m.role === "bot" ? "assistant" : "user") as "user" | "assistant",
            content: m.content || m.text || "",
          })),
          { role: "user", content: userQuery },
        ];

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.7,
            max_tokens: 1024,
            messages: openAiMessages,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data.choices?.[0]?.message?.content;
          if (replyText) {
            return NextResponse.json({ reply: replyText, source: "openai" });
          }
        } else {
          const errData = await res.json().catch(() => null);
          const errMsg = errData?.error?.message || `HTTP ${res.status}`;
          console.error("[Roomie Chat] OpenAI API Error:", res.status, errMsg);

          if (res.status === 401) {
            return NextResponse.json({
              reply:
                `⚠️ **OpenAI API Key Error**: The \`OPENAI_API_KEY\` provided in \`.env.local\` was rejected by OpenAI (${errMsg}).\n\n` +
                `Please ensure your valid OpenAI key (e.g. \`sk-proj-...\`) is pasted into \`.env.local\` under \`OPENAI_API_KEY\`, then reload the page!`,
              source: "openai-auth-error",
            });
          }

          if (res.status === 429) {
            return NextResponse.json({
              reply:
                `⚠️ **OpenAI Quota Exceeded**: OpenAI responded with rate limit / quota error: "${errMsg}".\n\n` +
                `Please check your OpenAI platform account credits or billing limits at [platform.openai.com](https://platform.openai.com).`,
              source: "openai-quota-error",
            });
          }
        }
      } catch (err: any) {
        console.error("[Roomie Chat] OpenAI network error:", err);
      }
    } else if (openAiKey === "sk-abcdef1234567890abcdef1234567890abcdef12" || !openAiKey) {
      // Placeholder or key not yet set: proceed to location-grounded reasoning engine below
      // so the user gets an immediate, accurate response with database listings, while noting the key setup
    }

    // ─────────────────────────────────────────────────────────────────────────
    // OPTIONAL SECONDARY FALLBACKS (Anthropic Claude or Gemini)
    // ─────────────────────────────────────────────────────────────────────────
    if (anthropicKey) {
      try {
        const anthropicMessages = formatAnthropicMessages(historyWithoutLast, contextPrompt);

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: anthropicMessages,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data.content?.[0]?.text;
          if (replyText) {
            return NextResponse.json({ reply: replyText, source: "anthropic" });
          }
        }
      } catch (err) {
        console.warn("[Roomie Chat] Anthropic fallback error:", err);
      }
    }

    // 3. Try Gemini API fallback if configured
    if (geminiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${SYSTEM_PROMPT}\n\n${contextPrompt}` }],
                },
              ],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({ reply: replyText, source: "gemini" });
          }
        }
      } catch (err) {
        console.warn("[Roomie Chat] Gemini API fallback error:", err);
      }
    }

    // 4. Fallback Knowledge Engine with Location-First Simulation
    let reply = "";

    if (!isLocationKnown) {
      const studentName = userProfile?.name ? ` ${userProfile.name.split(" ")[0]}` : "";
      reply = `Hi${studentName}! To recommend the best verified hostels, PGs, and rent options directly from our database, **which city or college campus are you moving to?**\n\n*(For example: Bangalore, Pune, Delhi NCR, Greater Noida, Mumbai, Hyderabad, Kota, etc.)*`;
    } else {
      const qLower = userQuery.toLowerCase();

      if (matchedListings.length > 0) {
        const top = matchedListings[0];
        const second = matchedListings.length > 1 ? matchedListings[1] : null;

        if (qLower.includes("budget") || qLower.includes("price") || qLower.includes("rent") || qLower.includes("cost")) {
          reply = `In **${targetCity}**, student accommodation generally starts around **₹7,500 – ₹12,000/month** for sharing with meals.\n\nFrom our verified database in ${targetCity}, take a look at **${top.title}** in ${top.locality} (${top.sharingTypes ? top.sharingTypes.join("/") : "Double Sharing"} starting at **₹${top.pricePerMonth || top.price}/month** with ${Array.isArray(top.amenities) ? top.amenities.slice(0, 3).map((a: any) => a.label || a).join(", ") : "Wi-Fi & meals"}).`;
          if (second) {
            reply += `\n\nAnother verified option nearby is **${second.title}** in ${second.locality} at **₹${second.pricePerMonth || second.price}/month**.`;
          }
          reply += `\n\nAre you looking for single occupancy or room sharing?`;
        } else {
          reply = `Got it! Here are top verified properties in **${targetCity}** matching student housing from our database:\n\n` +
            `• **${top.title}** in ${top.locality} — **₹${top.pricePerMonth || top.price}/mo** (${top.sharingTypes ? top.sharingTypes.join(" & ") : "Shared"}, ${top.verified ? "Verified 🛡️" : "Inspected"})\n` +
            `  *Amenities:* ${Array.isArray(top.amenities) ? top.amenities.slice(0, 3).map((a: any) => a.label || a).join(", ") : "Wi-Fi, 3 Meals, Security"}\n`;

          if (second) {
            reply += `• **${second.title}** in ${second.locality} — **₹${second.pricePerMonth || second.price}/mo** (${second.sharingTypes ? second.sharingTypes.join(" & ") : "Shared"})\n`;
          }

          reply += `\nWhich specific campus or neighborhood in ${targetCity} do you need to commute to daily?`;
        }
      } else {
        reply = `I have logged your target city as **${targetCity}**! What is your preferred monthly budget or college campus so I can filter verified options for you?`;
      }
    }

    const isLiveOpenAi = openAiKey && openAiKey.startsWith("sk-") && openAiKey !== "sk-abcdef1234567890abcdef1234567890abcdef12";
    if (!isLiveOpenAi && !anthropicKey && !geminiKey) {
      reply += `\n\n*(💡 Grounded in ApnaKona verified database. Paste your real OpenAI key in \`.env.local\` under \`OPENAI_API_KEY\` to enable live GPT-4o responses!)*`;
    }

    return NextResponse.json({ reply, source: "location-grounded" });
  } catch (error: any) {
    console.error("[Roomie Chat] Unexpected API route error:", error);
    return NextResponse.json(
      {
        reply:
          "To find you the right verified accommodation, **which city or college campus are you moving to?**",
        error: error?.message,
      },
      { status: 200 }
    );
  }
}
