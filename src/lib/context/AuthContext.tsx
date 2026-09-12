"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";
import { supabase } from "../supabaseClient";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  login: () => {},
  logout: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync Supabase Auth session on mount and state changes
  useEffect(() => {
    let isMounted = true;

    async function syncUserSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          // Fetch user details from profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          const mappedUser: User = {
            id: session.user.id,
            name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Student",
            email: session.user.email || "",
            phone: profile?.phone || session.user.user_metadata?.phone || "",
            role: (profile?.role || session.user.user_metadata?.role || "student") as UserRole,
            college: profile?.college_or_company,
            preferredCity: profile?.preferred_city,
            businessName: profile?.business_name,
            verified: profile?.is_verified ?? false,
          };

          if (isMounted) {
            setUser(mappedUser);
          }
        }
      } catch (err) {
        console.error("Error syncing Supabase auth session:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    syncUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        setUser({
          id: session.user.id,
          name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Student",
          email: session.user.email || "",
          phone: profile?.phone || session.user.user_metadata?.phone || "",
          role: (profile?.role || session.user.user_metadata?.role || "student") as UserRole,
          college: profile?.college_or_company,
          preferredCity: profile?.preferred_city,
          businessName: profile?.business_name,
          verified: profile?.is_verified ?? false,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (u: User) => setUser(u);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase sign out warning:", e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
