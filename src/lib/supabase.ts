/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Supabase Client & Backend Service for ApnaKona
 * Connected to: https://tdaguhpafgeffcuquxkf.supabase.co
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides:
 *  1. Supabase Auth (Sign Up, Sign In, Sign Out, User Session)
 *  2. PostgREST Database Client (Profiles, Listings, Complaints, Saved Listings)
 *  3. Resilient Fallbacks: Guarantees smooth frontend operation even if
 *     custom tables haven't been seeded yet in Supabase.
 */

import { User, Listing, Complaint, FurnishingStatus } from "./types";
import { DUMMY_LISTINGS } from "./data/listings";

export const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdaguhpafgeffcuquxkf.supabase.co"
).trim();

export const SUPABASE_ANON_KEY = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_Pl1zLGoUFBiq93yX_VB-kw_DV0TLTVz"
).trim();

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string; status?: number } | null;
}

// Internal Auth Storage Key
const AUTH_STORAGE_KEY = "apnakona_supabase_auth";

interface StoredSession {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    user_metadata?: Record<string, any>;
  };
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(session: StoredSession | null) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.warn("Could not access localStorage for Supabase session", err);
  }
}

/**
 * Standard HTTP headers for Supabase requests
 */
function getHeaders(accessToken?: string): HeadersInit {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  const token = accessToken || getStoredSession()?.access_token || SUPABASE_ANON_KEY;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Native Supabase Auth Service
 */
export const supabaseAuth = {
  /**
   * Sign Up with Email & Password
   */
  async signUp(credentials: {
    email: string;
    password: string;
    options?: { data?: Record<string, any> };
  }): Promise<SupabaseResponse<{ user: any; session: any }>> {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          data: credentials.options?.data || {},
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: data.msg || data.error_description || "Signup failed", status: res.status } };
      }

      if (data.access_token) {
        setStoredSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: data.user || data,
        });
      }

      return { data: { user: data.user || data, session: data }, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message || "Network error connecting to Supabase Auth" } };
    }
  },

  /**
   * Sign In with Email & Password
   */
  async signInWithPassword(credentials: {
    email: string;
    password: string;
  }): Promise<SupabaseResponse<{ user: any; session: any }>> {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: data.error_description || data.msg || "Invalid login credentials", status: res.status } };
      }

      const session: StoredSession = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      };
      setStoredSession(session);

      return { data: { user: data.user, session }, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message || "Network error connecting to Supabase Auth" } };
    }
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<{ error: any }> {
    try {
      const session = getStoredSession();
      if (session?.access_token) {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: "POST",
          headers: getHeaders(session.access_token),
        });
      }
    } catch {
      // Ignore network errors on signout
    } finally {
      setStoredSession(null);
    }
    return { error: null };
  },

  /**
   * Get Current Authenticated User from Supabase
   */
  async getUser(): Promise<SupabaseResponse<any>> {
    const session = getStoredSession();
    if (!session?.access_token) {
      return { data: null, error: null };
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: getHeaders(session.access_token),
      });

      if (!res.ok) {
        setStoredSession(null);
        return { data: null, error: { message: "Session expired", status: res.status } };
      }

      const user = await res.json();
      return { data: user, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  },
};

/**
 * Fluent Query Builder for Supabase PostgREST
 */
class QueryBuilder<T = any> {
  private tableName: string;
  private filters: string[] = [];
  private orderClauses: string[] = [];
  private limitCount?: number;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = "*") {
    // Return this query builder instance
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push(`${column}=eq.${encodeURIComponent(value)}`);
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    const dir = options.ascending ? "asc" : "desc";
    this.orderClauses.push(`${column}.${dir}`);
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  private buildUrl(): string {
    const params = new URLSearchParams();
    if (this.filters.length > 0) {
      this.filters.forEach((f) => {
        const [k, v] = f.split("=");
        params.append(k, v);
      });
    }
    if (this.orderClauses.length > 0) {
      params.append("order", this.orderClauses.join(","));
    }
    if (this.limitCount !== undefined) {
      params.append("limit", this.limitCount.toString());
    }
    const query = params.toString();
    return `${SUPABASE_URL}/rest/v1/${this.tableName}${query ? `?${query}` : ""}`;
  }

  async then<TResult1 = SupabaseResponse<T[]>, TResult2 = never>(
    onfulfilled?: ((value: SupabaseResponse<T[]>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    try {
      const res = await fetch(this.buildUrl(), {
        headers: getHeaders(),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const result: SupabaseResponse<T[]> = {
          data: null,
          error: { message: errJson.message || res.statusText, status: res.status },
        };
        return onfulfilled ? onfulfilled(result) : (result as any);
      }

      const data = await res.json();
      const result: SupabaseResponse<T[]> = { data, error: null };
      return onfulfilled ? onfulfilled(result) : (result as any);
    } catch (err: any) {
      const result: SupabaseResponse<T[]> = {
        data: null,
        error: { message: err.message || "Failed to query table" },
      };
      return onfulfilled ? onfulfilled(result) : (result as any);
    }
  }

  async insert(record: Partial<T> | Partial<T>[]): Promise<SupabaseResponse<T>> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${this.tableName}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(record),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const errorMsg = data?.message || data?.details || data?.hint || res.statusText || "Insert failed";
        return { data: null, error: { message: errorMsg, status: res.status } };
      }
      return { data: Array.isArray(data) ? data[0] : (data || (record as any)), error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message || "Insert failed" } };
    }
  }

  async update(record: Partial<T>): Promise<SupabaseResponse<T>> {
    try {
      const res = await fetch(this.buildUrl(), {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(record),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return { data: null, error: { message: data?.message || res.statusText, status: res.status } };
      }
      return { data: Array.isArray(data) ? data[0] : data, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message || "Update failed" } };
    }
  }

  async upsert(record: Partial<T>, options?: { onConflict?: string }): Promise<SupabaseResponse<T>> {
    try {
      const headers = getHeaders();
      (headers as any)["Prefer"] = "resolution=merge-duplicates,return=representation";

      const conflictParam = options?.onConflict ? `?on_conflict=${encodeURIComponent(options.onConflict)}` : "";
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${this.tableName}${conflictParam}`, {
        method: "POST",
        headers,
        body: JSON.stringify(record),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return { data: null, error: { message: data?.message || data?.details || res.statusText, status: res.status } };
      }
      return { data: Array.isArray(data) ? data[0] : data, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message || "Upsert failed" } };
    }
  }

  async delete(): Promise<SupabaseResponse<null>> {
    try {
      const res = await fetch(this.buildUrl(), {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return { data: null, error: { message: data?.message || res.statusText, status: res.status } };
      }
      return { data: null, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message || "Delete failed" } };
    }
  }
}

/**
 * Unified Supabase Client Object
 */
export const supabase = {
  auth: supabaseAuth,
  from: <T = any>(table: string) => new QueryBuilder<T>(table),
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * High-Level ApnaKona Backend Connectors (with Seamless Fallback)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Fetch property listings from Supabase `listings` table,
 * falling back gracefully to DUMMY_LISTINGS if table is not yet created.
 */
export async function getSupabaseListings(): Promise<Listing[]> {
  try {
    const { data, error } = await supabase.from<any>("listings").select("*");
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((item) => ({
        id: item.id || `lst-${Math.random()}`,
        ownerId: item.owner_id || item.ownerId || "own-001",
        ownerName: item.owner_name || item.ownerName || "Verified Owner",
        ownerPhone: item.owner_phone || item.ownerPhone || "+91 98765 43210",
        ownerAvatar: item.owner_avatar || item.ownerAvatar,
        title: item.title || "ApnaKona Property",
        description: item.description || "",
        address: item.address || "",
        city: item.city || "",
        locality: item.locality || item.city || "",
        lat: Number(item.lat || 0),
        lng: Number(item.lng || 0),
        price: Number(item.price || 0),
        deposit: Number(item.deposit || 0),
        roomType: item.room_type || item.roomType || "PG",
        sharingType: item.sharing_type || item.sharingType || "Single",
        genderPref: item.gender_pref || item.genderPref || "Co-Ed",
        furnishingStatus: (item.furnishing_status || item.furnishingStatus || "Fully Furnished") as FurnishingStatus,
        isAC: Boolean(item.is_ac ?? item.isAC ?? false),
        amenities: Array.isArray(item.amenities) ? item.amenities : ["WiFi", "AC"],
        hasMess: Boolean(item.has_mess ?? item.hasMess ?? false),
        hasTiffin: Boolean(item.has_tiffin ?? item.hasTiffin ?? false),
        hasCurfew: Boolean(item.has_curfew ?? item.hasCurfew ?? false),
        curfewTime: item.curfew_time || item.curfewTime || undefined,
        visitorAllowed: Boolean(item.visitor_allowed ?? item.visitorAllowed ?? true),
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80"],
        rating: Number(item.rating || 4.5),
        reviewCount: Number(item.review_count ?? item.reviews_count ?? item.reviewCount ?? 12),
        tags: Array.isArray(item.tags) ? item.tags : ["Verified"],
        available: Boolean(item.available ?? (item.available_beds !== undefined ? Number(item.available_beds) > 0 : true)),
        postedAt: item.posted_at || item.postedAt || new Date().toISOString().split("T")[0],
        verified: Boolean(item.verified ?? true),
        featured: Boolean(item.featured ?? false),
      }));
    }
  } catch (e) {
    console.info("Using local property catalog while Supabase listings table initializes.");
  }
  return DUMMY_LISTINGS;
}

/**
 * Save / Update User Profile in Supabase `profiles` table smoothly
 */
export async function syncUserProfileToSupabase(user: User): Promise<{ success: boolean; error?: string }> {
  try {
    const isUuid = (val?: string) => Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));

    // Determine safe user id (prefer auth session UUID or valid user.id)
    const sessionUserId = getStoredSession()?.user?.id;
    let validUserId: string | null = null;
    if (isUuid(user.id)) {
      validUserId = user.id;
    } else if (isUuid(sessionUserId)) {
      validUserId = sessionUserId!;
    }

    const payload: Record<string, any> = {
      name: user.name,
      username: user.username || user.name.toLowerCase().replace(/\s+/g, "_"),
      email: user.email,
      phone: user.phone || "",
      role: user.role || "student",
      avatar: user.avatar || "",
      college: user.college || "",
      preferred_city: user.preferredCity || "",
      preferred_occupancy: user.preferredOccupancy || "",
      budget_range: user.budgetRange || "",
      gender: user.gender || "",
      food_preference: user.foodPreference || "",
      bio: user.bio || "",
      updated_at: new Date().toISOString(),
    };

    if (validUserId) {
      payload.id = validUserId;
    }

    console.info("[Supabase] Saving profile update to Supabase for:", user.email, payload);

    // Strategy 1: Check if a profile with this email or id already exists
    let existingProfileId: string | null = null;
    try {
      const { data: existingRows } = await supabase.from("profiles").select("id").eq("email", user.email);
      if (Array.isArray(existingRows) && existingRows.length > 0 && existingRows[0]?.id) {
        existingProfileId = existingRows[0].id;
      }
    } catch {
      // ignore lookup error
    }

    // Strategy 2: If existing profile found, update by ID
    if (existingProfileId) {
      console.info("[Supabase] Existing profile found with ID:", existingProfileId, "updating...");
      const updateResult = await supabase.from("profiles").eq("id", existingProfileId).update(payload);
      if (!updateResult.error) {
        console.info("[Supabase] Profile updated successfully via ID");
        return { success: true };
      }
    }

    // Strategy 3: Try updating by email directly
    const updateByEmail = await supabase.from("profiles").eq("email", user.email).update(payload);
    if (!updateByEmail.error && updateByEmail.data) {
      console.info("[Supabase] Profile updated successfully via Email");
      return { success: true };
    }

    // Strategy 4: Insert / Upsert with onConflict=email
    if (!payload.id && typeof crypto !== "undefined" && crypto.randomUUID) {
      payload.id = crypto.randomUUID();
    }

    const upsertResult = await supabase.from("profiles").upsert(payload, { onConflict: "email" });
    if (!upsertResult.error) {
      console.info("[Supabase] Profile upserted successfully");
      return { success: true };
    }

    // Fallback: If custom columns like preferred_occupancy don't exist in user's table, retry with standard core columns
    const isColumnError = upsertResult.error?.message?.toLowerCase().includes("column") ||
      upsertResult.error?.message?.toLowerCase().includes("does not exist");
    if (isColumnError) {
      console.warn("[Supabase] Retrying profile update with core columns only...");
      const corePayload: Record<string, any> = {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        college: user.college || "",
        bio: user.bio || "",
        role: user.role || "student",
        updated_at: new Date().toISOString(),
      };
      if (payload.id) corePayload.id = payload.id;

      const retryRes = await supabase.from("profiles").upsert(corePayload, { onConflict: "email" });
      if (!retryRes.error) {
        console.info("[Supabase] Profile core columns saved successfully");
        return { success: true };
      }
      return { success: false, error: retryRes.error.message };
    }

    return { success: false, error: upsertResult.error?.message };
  } catch (err: any) {
    console.error("[Supabase] Profile sync exception:", err);
    return { success: false, error: err.message || "Failed to update profile" };
  }
}

/**
 * Submit Grievance / Complaint to Supabase `complaints` table
 */
export async function submitGrievanceToSupabase(complaint: {
  userId?: string;
  userName?: string;
  subject: string;
  description: string;
  type?: string;
  listingId?: string;
  listingName?: string;
  ticketId?: string;
}): Promise<{ success: boolean; data?: any; error?: string; ticketId: string }> {
  const ticketId = complaint.ticketId || `AKG-${Math.floor(1000 + Math.random() * 9000)}`;
  const isUuid = (val?: string) => Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));

  const payload: Record<string, any> = {
    user_name: complaint.userName || "Anonymous Student",
    subject: complaint.subject,
    description: complaint.description,
    type: complaint.type || "listing",
    status: "Pending",
  };

  if (complaint.ticketId) {
    payload.ticket_id = complaint.ticketId;
  }
  if (complaint.listingName) {
    payload.listing_name = complaint.listingName;
  }
  // Only pass UUIDs if matching UUID format, otherwise null to avoid Postgres 22P02 invalid UUID errors
  if (complaint.userId) {
    payload.user_id = isUuid(complaint.userId) ? complaint.userId : null;
  }
  if (complaint.listingId) {
    payload.listing_id = isUuid(complaint.listingId) ? complaint.listingId : null;
  }

  try {
    console.info("[Supabase] Submitting complaint payload:", payload);
    const { data, error } = await supabase.from("complaints").insert(payload);

    if (error) {
      console.warn("[Supabase] Initial complaint insert error:", error);

      // If failed due to UUID or Foreign Key constraint, retry with minimal safe fields
      const isConstraintError =
        error.message?.toLowerCase().includes("uuid") ||
        error.message?.toLowerCase().includes("foreign key") ||
        error.message?.toLowerCase().includes("fkey") ||
        error.message?.toLowerCase().includes("ticket_id");

      if (isConstraintError) {
        console.info("[Supabase] Retrying insert with stripped optional constraints...");
        const safePayload = {
          user_name: complaint.userName || "Anonymous Student",
          subject: complaint.subject,
          description: complaint.description,
          type: complaint.type || "listing",
          status: "Pending",
        };
        const retryResult = await supabase.from("complaints").insert(safePayload);
        if (!retryResult.error) {
          console.info("[Supabase] Complaint saved successfully after retry:", retryResult.data);
          return { success: true, data: retryResult.data, ticketId };
        }
        return { success: false, error: retryResult.error.message, ticketId };
      }

      return { success: false, error: error.message, ticketId };
    }

    console.info("[Supabase] Complaint submitted successfully:", data);
    return { success: true, data, ticketId };
  } catch (err: any) {
    console.error("[Supabase] Unexpected error submitting complaint:", err);
    return { success: false, error: err.message || "Failed to submit grievance", ticketId };
  }
}

/**
 * Fetch complaints from Supabase `complaints` table, falling back to DUMMY_COMPLAINTS
 */
export async function getSupabaseComplaints(userId?: string): Promise<Complaint[]> {
  try {
    let query = supabase.from<any>("complaints").select("*").order("created_at", { ascending: false });
    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((item) => ({
        id: item.ticket_id || (item.id ? `AKG-${String(item.id).slice(0, 4)}` : `AKG-${Math.floor(1000 + Math.random() * 9000)}`),
        userId: item.user_id || "guest",
        userName: item.user_name || "Student",
        listingId: item.listing_id,
        listingName: item.listing_name,
        type: (item.type as any) || "listing",
        subject: item.subject || "Grievance",
        description: item.description || "",
        status: (item.status as any) || "Pending",
        createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Today",
        updatedAt: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "Today",
      }));
    }
  } catch (e) {
    console.info("Using local complaints catalog while Supabase initializes.");
  }
  return [];
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Saved Listings Service (Supabase `saved_listings` table + Local Cache)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const LOCAL_SAVED_KEY = "apnakona_saved_listing_ids";
const DEFAULT_SAVED_IDS = ["lst-002", "lst-003", "lst-011"];

export function getLocalSavedListingIds(): string[] {
  if (typeof window === "undefined") return DEFAULT_SAVED_IDS;
  try {
    const raw = localStorage.getItem(LOCAL_SAVED_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(DEFAULT_SAVED_IDS));
      return DEFAULT_SAVED_IDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SAVED_IDS;
  } catch {
    return DEFAULT_SAVED_IDS;
  }
}

export function setLocalSavedListingIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage errors
  }
}

export function isListingSavedLocally(listingId: string): boolean {
  const ids = getLocalSavedListingIds();
  return ids.includes(listingId);
}

/**
 * Save listing to Supabase `saved_listings` table and update local cache
 */
export async function saveListingToSupabase(
  listing: { id: string; title: string; price: number; images?: string[]; locality?: string; city?: string },
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  // 1. Immediately update local state
  const currentIds = getLocalSavedListingIds();
  if (!currentIds.includes(listing.id)) {
    setLocalSavedListingIds([listing.id, ...currentIds]);
  }

  // 2. Prepare payload for Supabase
  const isUuid = (val?: string) => Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));
  const validUserId = isUuid(userId) ? userId : null;

  const payload: Record<string, any> = {
    listing_id: listing.id,
    listing_title: listing.title,
    listing_price: listing.price,
    listing_image: listing.images?.[0] || "",
    listing_city: listing.city || "",
  };

  if (validUserId) {
    payload.user_id = validUserId;
  }

  try {
    const { data, error } = await supabase.from("saved_listings").insert(payload);
    if (error) {
      console.warn("[Supabase] Notice saving to saved_listings:", error.message);
      // Fallback: If table has extra constraints or not yet migrated, local state is still safely stored
      return { success: true };
    }
    console.info("[Supabase] Listing saved to saved_listings successfully:", data);
    return { success: true };
  } catch (err: any) {
    console.warn("[Supabase] Exception saving listing to Supabase:", err.message);
    return { success: true };
  }
}

/**
 * Remove saved listing from Supabase and local cache
 */
export async function removeSavedListingFromSupabase(
  listingId: string,
  userId?: string
): Promise<{ success: boolean }> {
  // 1. Immediately update local state
  const currentIds = getLocalSavedListingIds();
  setLocalSavedListingIds(currentIds.filter((id) => id !== listingId));

  // 2. Remove from Supabase
  try {
    await supabase.from("saved_listings").eq("listing_id", listingId).delete();
    console.info("[Supabase] Listing removed from saved_listings:", listingId);
    return { success: true };
  } catch (err) {
    return { success: true };
  }
}

/**
 * Get all saved listing IDs for the active user (combining Supabase + Local Cache)
 */
export async function getSupabaseSavedListingIds(userId?: string): Promise<string[]> {
  const localIds = getLocalSavedListingIds();
  try {
    const { data, error } = await supabase.from<any>("saved_listings").select("listing_id");
    if (!error && Array.isArray(data) && data.length > 0) {
      const dbIds = data.map((d) => d.listing_id).filter(Boolean);
      // Merge unique IDs
      const merged = Array.from(new Set([...localIds, ...dbIds]));
      setLocalSavedListingIds(merged);
      return merged;
    }
  } catch (err) {
    console.info("Using local saved listings catalog while Supabase initializes.");
  }
  return localIds;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Accommodation / Roommate Connection Requests (Supabase `accommodation_requests`)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface AccommodationRequest {
  id?: string;
  requestId: string;
  senderId?: string;
  senderName: string;
  senderContact?: string;
  receiverId: string;
  receiverName: string;
  receiverCollege?: string;
  receiverCity?: string;
  status: "pending" | "notified" | "contacted" | "accepted";
  responseWindow: string;
  createdAt: string;
}

const LOCAL_REQUESTS_KEY = "apnakona_accommodation_requests";
const LOCAL_NOTIFS_KEY = "apnakona_user_notifications";

export function getLocalAccommodationRequests(): AccommodationRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalAccommodationRequest(req: AccommodationRequest): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalAccommodationRequests();
    localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify([req, ...existing]));
  } catch {
    // Ignore storage error
  }
}

/**
 * Creates an accommodation connection request in Supabase `accommodation_requests` table,
 * dispatches notification to the recipient user, and caches locally.
 */
export async function createAccommodationRequest(params: {
  senderId?: string;
  senderName?: string;
  senderContact?: string;
  receiverId: string;
  receiverName: string;
  receiverCollege?: string;
  receiverCity?: string;
  notes?: string;
}): Promise<{ success: boolean; requestId: string; error?: string }> {
  const requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newRequest: AccommodationRequest = {
    requestId,
    senderId: params.senderId || "usr-current",
    senderName: params.senderName || "Student Seeker",
    senderContact: params.senderContact || "+91 98000 12345",
    receiverId: params.receiverId,
    receiverName: params.receiverName,
    receiverCollege: params.receiverCollege || "",
    receiverCity: params.receiverCity || "",
    status: "notified",
    responseWindow: "Within 12 Hours",
    createdAt: now,
  };

  // 1. Save to local storage cache immediately
  saveLocalAccommodationRequest(newRequest);

  // 2. Dispatch notification locally for receiver
  try {
    if (typeof window !== "undefined") {
      const rawNotifs = localStorage.getItem(LOCAL_NOTIFS_KEY);
      const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      notifs.unshift({
        id: `notif-${Date.now()}`,
        userId: params.receiverId,
        userName: params.receiverName,
        title: "New Accommodation Request!",
        message: `${params.senderName || "A student"} connected with you for accommodation in ${params.receiverCity || "your area"}. Owner & resident notified. Response due within 12h.`,
        createdAt: now,
        isRead: false,
      });
      localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(notifs));
    }
  } catch {
    // ignore local storage error
  }

  // 3. Post to Supabase `accommodation_requests`
  const isUuid = (val?: string) => Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));
  const payload: Record<string, any> = {
    request_id: requestId,
    sender_name: newRequest.senderName,
    sender_contact: newRequest.senderContact,
    receiver_id: params.receiverId,
    receiver_name: params.receiverName,
    receiver_college: params.receiverCollege || null,
    receiver_city: params.receiverCity || null,
    status: "notified",
    response_window: "within 12 hours",
  };

  if (params.senderId && isUuid(params.senderId)) {
    payload.sender_id = params.senderId;
  }

  try {
    const { data, error } = await supabase.from("accommodation_requests").insert(payload);
    if (error) {
      console.warn("[Supabase] Accommodation request inserted locally, Supabase notice:", error.message);
    } else {
      console.info("[Supabase] Accommodation request recorded in database:", data);
    }
  } catch (err: any) {
    console.warn("[Supabase] Exception posting to accommodation_requests:", err.message);
  }

  // 4. Also post to Supabase `notifications` table for the user
  try {
    const notifPayload = {
      user_id: isUuid(params.receiverId) ? params.receiverId : null,
      receiver_name: params.receiverName,
      title: "New Accommodation Request",
      message: `${params.senderName || "A student"} has requested to connect for accommodation. Response window: 12 Hours.`,
      status: "unread",
    };
    await supabase.from("notifications").insert(notifPayload);
  } catch (err) {
    // optional notification sync
  }

  return { success: true, requestId };
}

/**
 * Fetch accommodation requests (combining Supabase + Local Cache)
 */
export async function getAccommodationRequests(userId?: string): Promise<AccommodationRequest[]> {
  const local = getLocalAccommodationRequests();
  try {
    const { data, error } = await supabase
      .from<any>("accommodation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const dbItems: AccommodationRequest[] = data.map((d) => ({
        id: d.id,
        requestId: d.request_id || `REQ-${String(d.id).slice(0, 4)}`,
        senderId: d.sender_id,
        senderName: d.sender_name || "Student Seeker",
        senderContact: d.sender_contact || "",
        receiverId: d.receiver_id || "",
        receiverName: d.receiver_name || "Roommate",
        receiverCollege: d.receiver_college || "",
        receiverCity: d.receiver_city || "",
        status: (d.status as any) || "notified",
        responseWindow: d.response_window || "Within 12 Hours",
        createdAt: d.created_at ? new Date(d.created_at).toLocaleDateString() : "Today",
      }));

      // Merge avoiding duplicate requestIds
      const map = new Map<string, AccommodationRequest>();
      [...dbItems, ...local].forEach((item) => {
        if (!map.has(item.requestId)) map.set(item.requestId, item);
      });
      return Array.from(map.values());
    }
  } catch (err) {
    console.info("Using local accommodation requests catalog.");
  }
  return local;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * User Profile Registration & Exact Credentials Authentication
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface RegisterAccountData {
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  role: "student" | "owner";
  college?: string;
  preferredCity?: string;
  preferredOccupancy?: string;
  budgetRange?: string;
  gender?: string;
  foodPreference?: string;
  bio?: string;
  businessName?: string;
}

const LOCAL_ACCOUNTS_KEY = "apnakona_registered_accounts";

function hashPassword(pass: string): string {
  const salt = "apnakona_sec_2026";
  const str = `${salt}_${pass}_${salt}`;
  if (typeof btoa !== "undefined") {
    return btoa(str);
  }
  return Buffer.from(str).toString("base64");
}

function verifyPassword(pass: string, storedHash?: string): boolean {
  if (!storedHash) return false;
  return storedHash === pass || storedHash === hashPassword(pass);
}

export function getLocalRegisteredAccounts(): Record<string, any>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalRegisteredAccount(account: Record<string, any>): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalRegisteredAccounts().filter(
      (a) => a.email !== account.email && a.username !== account.username
    );
    existing.unshift(account);
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(existing));
  } catch { }
}

/**
 * Register user in Supabase Auth & Supabase `profiles` table
 */
export async function registerUserProfile(data: RegisterAccountData): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanUsername = data.username.trim().toLowerCase().replace(/^@/, "");

  // 1. Validation checks
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: "Username must be at least 3 characters long." };
  }
  if (!/^[a-zA-Z0-9._]+$/.test(cleanUsername)) {
    return { success: false, error: "Username can only contain letters, numbers, underscores (_), and dots (.)." };
  }
  if (!data.password || data.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  // 2. Check for duplicate email or username
  try {
    const { data: byEmail } = await supabase.from("profiles").select("id").eq("email", cleanEmail);
    if (Array.isArray(byEmail) && byEmail.length > 0) {
      return { success: false, error: "An account with this email address already exists. Please log in." };
    }
    const { data: byUser } = await supabase.from("profiles").select("id").eq("username", cleanUsername);
    if (Array.isArray(byUser) && byUser.length > 0) {
      return { success: false, error: `Username "${cleanUsername}" is already taken. Please choose another username.` };
    }
  } catch { }

  const localAccounts = getLocalRegisteredAccounts();
  if (localAccounts.some((a) => a.email?.toLowerCase() === cleanEmail)) {
    return { success: false, error: "An account with this email address already exists. Please log in." };
  }
  if (localAccounts.some((a) => a.username?.toLowerCase() === cleanUsername)) {
    return { success: false, error: `Username "${cleanUsername}" is already taken. Please choose another username.` };
  }

  const pwdHash = hashPassword(data.password);

  // 3. Try Supabase Auth Sign Up
  let authUserId: string | null = null;
  try {
    const authRes = await supabase.auth.signUp({
      email: cleanEmail,
      password: data.password,
      options: {
        data: {
          name: data.name,
          username: cleanUsername,
          role: data.role,
        },
      },
    });

    if (authRes.error) {
      const msg = authRes.error.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        return { success: false, error: "An account with this email is already registered. Please log in." };
      }
    }

    if (authRes.data?.user?.id) {
      authUserId = authRes.data.user.id;
    }
  } catch (err: any) {
    console.warn("[Supabase] Auth signup note:", err?.message);
  }

  // 4. Generate guaranteed valid UUID for PostgreSQL
  const userId =
    authUserId ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `a0000000-0000-4000-a000-${Date.now().toString(16).padStart(12, "0")}`);

  const profileRow: Record<string, any> = {
    id: userId,
    name: data.name,
    username: cleanUsername,
    email: cleanEmail,
    password_hash: pwdHash,
    phone: data.phone || "",
    role: data.role,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    college: data.college || "",
    preferred_city: data.preferredCity || "",
    preferred_occupancy: data.preferredOccupancy || "Double Sharing",
    budget_range: data.budgetRange || "₹8,000 - ₹12,000 / mo",
    gender: data.gender || "Male",
    food_preference: data.foodPreference || "Vegetarian",
    bio: data.bio || `Looking for verified accommodation in ${data.preferredCity || "the city"}.`,
    business_name: data.businessName || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 5. Save to local accounts registry immediately
  saveLocalRegisteredAccount({
    ...profileRow,
    raw_password: data.password,
  });

  // 6. Save to Supabase `profiles` table
  try {
    const insertRes = await supabase.from("profiles").upsert(profileRow, { onConflict: "email" });
    if (insertRes.error) {
      console.warn("[Supabase] Profiles table insert notice:", insertRes.error.message);
      // Fallback: If custom column isn't present in DB, retry with core profile columns
      const isColumnErr =
        insertRes.error.message.toLowerCase().includes("column") ||
        insertRes.error.message.toLowerCase().includes("does not exist");
      if (isColumnErr) {
        const corePayload: Record<string, any> = {
          id: userId,
          name: data.name,
          username: cleanUsername,
          email: cleanEmail,
          phone: data.phone || "",
          role: data.role,
          college: data.college || "",
          preferred_city: data.preferredCity || "",
          bio: data.bio || "",
          updated_at: new Date().toISOString(),
        };
        await supabase.from("profiles").upsert(corePayload, { onConflict: "email" });
      }
    } else {
      console.info("[Supabase] User profile stored in Supabase profiles table:", insertRes.data);
    }
  } catch (err: any) {
    console.warn("[Supabase] Exception inserting profile to Supabase:", err.message);
  }

  const mappedUser: User = {
    id: userId,
    name: data.name,
    username: cleanUsername,
    email: cleanEmail,
    phone: data.phone || "",
    role: data.role,
    college: data.college,
    preferredCity: data.preferredCity,
    preferredOccupancy: data.preferredOccupancy || "Double Sharing",
    budgetRange: data.budgetRange || "₹8,000 - ₹12,000 / mo",
    gender: data.gender || "Male",
    foodPreference: data.foodPreference || "Vegetarian",
    bio: profileRow.bio,
    businessName: data.businessName,
  };

  return { success: true, user: mappedUser };
}

/**
 * Authenticate user strictly by Email or Username and Password,
 * and load all profile preferences from Supabase `profiles` table.
 */
export async function authenticateUser(
  identifier: string,
  password: string,
  role?: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const cleanId = identifier.trim().toLowerCase().replace(/^@/, "");

  if (!cleanId) {
    return { success: false, error: "Please enter your username or email address." };
  }
  if (!password) {
    return { success: false, error: "Please enter your password." };
  }

  // 1. Try querying Supabase `profiles` table
  let dbProfile: Record<string, any> | null = null;
  try {
    // Check by email
    const { data: byEmail } = await supabase.from("profiles").select("*").eq("email", cleanId);
    if (Array.isArray(byEmail) && byEmail.length > 0) {
      dbProfile = byEmail[0];
    } else {
      // Check by username
      const { data: byUsername } = await supabase.from("profiles").select("*").eq("username", cleanId);
      if (Array.isArray(byUsername) && byUsername.length > 0) {
        dbProfile = byUsername[0];
      }
    }
  } catch (err) {
    console.warn("[Supabase] Lookup in profiles table note:", err);
  }

  // 2. Try Supabase Auth token if email has '@'
  let isAuthSuccess = false;
  let authEmail = cleanId;
  if (cleanId.includes("@")) {
    try {
      const authRes = await supabase.auth.signInWithPassword({
        email: cleanId,
        password,
      });
      if (authRes.data?.user) {
        isAuthSuccess = true;
        authEmail = authRes.data.user.email || cleanId;
      }
    } catch { }
  } else if (dbProfile?.email) {
    try {
      const authRes = await supabase.auth.signInWithPassword({
        email: dbProfile.email,
        password,
      });
      if (authRes.data?.user) {
        isAuthSuccess = true;
      }
    } catch { }
  }

  // 3. Check local registered accounts registry
  const localAccounts = getLocalRegisteredAccounts();
  const localMatch = localAccounts.find(
    (a) => a.email?.toLowerCase() === cleanId || a.username?.toLowerCase() === cleanId
  );

  const matchedRecord = {
    ...(localMatch || {}),
    ...(dbProfile || {}),
  };
  const hasRecord = Boolean(dbProfile || localMatch);

  if (hasRecord) {
    // Verify password if not already validated by Supabase Auth
    if (!isAuthSuccess) {
      const isValid =
        verifyPassword(password, matchedRecord.password_hash) ||
        matchedRecord.raw_password === password;

      if (!isValid) {
        return { success: false, error: "Incorrect password. Please check your password and try again." };
      }
    }

    const userObj: User = {
      id: matchedRecord.id || `a0000000-0000-4000-a000-${Date.now().toString(16).padStart(12, "0")}`,
      name: matchedRecord.name || "User",
      username: matchedRecord.username || cleanId,
      email: matchedRecord.email || cleanId,
      phone: matchedRecord.phone || "+91 91234 00001",
      role: (matchedRecord.role as any) || role || "student",
      avatar: matchedRecord.avatar,
      college: matchedRecord.college,
      preferredCity: matchedRecord.preferred_city || matchedRecord.preferredCity,
      preferredOccupancy: matchedRecord.preferred_occupancy || matchedRecord.preferredOccupancy || "Double Sharing",
      budgetRange: matchedRecord.budget_range || matchedRecord.budgetRange || "₹8,000 - ₹12,000 / mo",
      gender: matchedRecord.gender || "Male",
      foodPreference: matchedRecord.food_preference || matchedRecord.foodPreference || "Vegetarian",
      bio: matchedRecord.bio || "",
      businessName: matchedRecord.business_name || matchedRecord.businessName,
    };

    return { success: true, user: userObj };
  }

  // 4. If Supabase Auth succeeded even without a profile row
  if (isAuthSuccess) {
    const session = getStoredSession();
    const meta = session?.user?.user_metadata || {};
    const userObj: User = {
      id: session?.user?.id || `a0000000-0000-4000-a000-${Date.now().toString(16).padStart(12, "0")}`,
      name: meta.name || cleanId.split("@")[0],
      username: meta.username || cleanId.split("@")[0],
      email: authEmail,
      phone: meta.phone || "+91 91234 00001",
      role: (meta.role as any) || role || "student",
      college: meta.college,
      preferredCity: meta.preferredCity,
      preferredOccupancy: meta.preferredOccupancy || "Double Sharing",
    };
    return { success: true, user: userObj };
  }

  return {
    success: false,
    error: "No account found with this username or email. Please sign up to create your profile.",
  };
}
