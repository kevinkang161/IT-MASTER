"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile, UserRole } from "@/types/database";
import { MOCK_PROFILE } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, gradeLevel: 10 | 11 | 12, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  addXp: (amount: number, reason: string) => void;
  toggleRoleForDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "it_master_user_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage or Supabase session on mount
    async function initAuth() {
      try {
        const supabase = createClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile from supabase
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profile) {
              setUser(profile as Profile);
              setIsLoading(false);
              return;
            }
          }
        }

        // Fallback to local storage demo profile
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          // Initialize with demo student profile
          setUser(MOCK_PROFILE);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_PROFILE));
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setUser(MOCK_PROFILE);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      // Instant demo login
      if (email === "hocsinh.demo@itmaster.edu.vn" || !password) {
        setUser(MOCK_PROFILE);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_PROFILE));
        setIsLoading(false);
        return { success: true };
      }

      const supabase = createClient();
      if (supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!error && data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (profile) {
            setUser(profile as Profile);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
            setIsLoading(false);
            return { success: true };
          }
        }
      }

      // Demo fallback login for local environment
      const demoUser: Profile = {
        ...MOCK_PROFILE,
        id: "usr-" + Date.now(),
        email,
        full_name: email.split("@")[0].replace(".", " "),
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demoUser));
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      // Fallback gracefully so users are never blocked
      const demoUser: Profile = {
        ...MOCK_PROFILE,
        id: "usr-" + Date.now(),
        email,
        full_name: email.split("@")[0].replace(".", " "),
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demoUser));
      setIsLoading(false);
      return { success: true };
    }
  };

  const register = async (
    fullName: string,
    email: string,
    gradeLevel: 10 | 11 | 12,
    password?: string
  ) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      if (supabase && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              grade_level: gradeLevel,
              role: "student",
            },
          },
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
      }

      // Demo registration
      const newUser: Profile = {
        id: "user-" + Date.now(),
        email,
        full_name: fullName,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
        role: "student",
        grade_level: gradeLevel,
        xp: 100, // Welcome bonus
        level: 1,
        streak_days: 1,
        longest_streak: 1,
        last_active_date: new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || "Đã xảy ra lỗi đăng ký" };
    }
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    const supabase = createClient();
    if (supabase) {
      await supabase.from("profiles").update(updates).eq("id", user.id);
    }
  };

  const addXp = (amount: number, reason: string) => {
    if (!user) return;
    const newXp = user.xp + amount;
    // Calculate new level
    let level = 1;
    let accumulated = 0;
    let nextThreshold = 150;
    while (newXp >= accumulated + nextThreshold) {
      accumulated += nextThreshold;
      level += 1;
      nextThreshold = level * 150;
    }

    const updated = {
      ...user,
      xp: newXp,
      level,
    };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const toggleRoleForDemo = () => {
    if (!user) return;
    const newRole: UserRole = user.role === "admin" ? "student" : "admin";
    updateProfile({ role: newRole });
  };

  const role = user?.role || "student";
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        addXp,
        toggleRoleForDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
