"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";
import { supabase, syncUserProfileToSupabase, isSupabaseConfigured } from "../supabase";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isSupabaseConnected: boolean;
}

const LOCAL_USER_KEY = "apnakona_active_user";

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isSupabaseConnected: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restore user session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  const login = (u: User) => {
    setUser(u);
    try {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
    } catch {
      // Ignore storage error
    }

    // Background sync to Supabase database profiles table
    syncUserProfileToSupabase(u).catch(() => {});
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
    } catch {
      // Ignore storage error
    }

    // Sign out from Supabase Auth
    supabase.auth.signOut().catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        login,
        logout,
        isAuthenticated: !!user,
        isSupabaseConnected: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
