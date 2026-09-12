import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      password = "Password@123",
      role = "student",
      college,
      preferredCity,
      businessName,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const client = supabaseAdmin || supabase;

    if (client) {
      let userId: string | null = null;

      // 1. Create auth user via admin API if available
      if (supabaseAdmin) {
        const createRes = await supabaseAdmin.auth.admin.createUser({
          email: email.trim().toLowerCase(),
          password: password || "ApnaKona2026!",
          email_confirm: true,
          user_metadata: {
            full_name: name,
            phone: phone || "",
            role,
          },
        });

        if (createRes.data?.user) {
          userId = createRes.data.user.id;
        } else if (createRes.error) {
          // If user already exists in auth, find existing user id
          const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
          const existing = userList?.users?.find(
            (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
          );
          if (existing) {
            userId = existing.id;
          } else {
            console.warn("Auth user creation warning:", createRes.error);
          }
        }
      }

      // If we couldn't create in auth, generate UUID
      if (!userId) {
        userId = crypto.randomUUID();
      }

      // 2. Upsert profile into 'profiles' table
      const profileRow = {
        id: userId,
        role,
        full_name: name,
        email: email.trim().toLowerCase(),
        phone: phone || null,
        college_or_company: college || null,
        preferred_city: preferredCity || null,
        business_name: businessName || null,
        is_verified: false,
      };

      const { data: savedProfile, error: profileErr } = await client
        .from("profiles")
        .upsert(profileRow, { onConflict: "id" })
        .select()
        .single();

      if (profileErr) {
        console.error("Failed to save to Supabase profiles:", profileErr);
        return NextResponse.json(
          {
            success: false,
            error: profileErr.message,
            hint: profileErr.hint,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: savedProfile.id,
          name: savedProfile.full_name,
          email: savedProfile.email,
          phone: savedProfile.phone,
          role: savedProfile.role,
          college: savedProfile.college_or_company,
          preferredCity: savedProfile.preferred_city,
          businessName: savedProfile.business_name,
        },
        source: "supabase",
        message: "Successfully saved in Supabase database",
      });
    }

    return NextResponse.json(
      { error: "Database client is not initialized" },
      { status: 500 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
