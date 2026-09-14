import { NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

export async function GET() {
  const results: Record<string, any> = {
    supabaseUrl: SUPABASE_URL,
    configured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
  };

  const tables = ["profiles", "listings", "complaints"];

  for (const table of tables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (res.ok) {
        results[table] = { status: "ready", statusCode: res.status };
      } else {
        const json = await res.json().catch(() => ({}));
        results[table] = { status: "missing_or_error", statusCode: res.status, error: json.message || res.statusText };
      }
    } catch (err: any) {
      results[table] = { status: "fetch_error", error: err.message };
    }
  }

  return NextResponse.json(results);
}
