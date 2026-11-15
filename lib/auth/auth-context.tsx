"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile, UserRole } from "@/types/database";
import { MOCK_PROFILE } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

// List of verified System Administrator emails (strictly protected)
export const ADMIN_EMAILS = [
  "thaidoanhoangbh@gmail.com",
];

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  isLoading: boolean;
  isAdmin: boolean;
  isDemo: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, gradeLevel: 10 | 11 | 12, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  addXp: (amount: number, reason: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "it_master_user_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const supabase = createClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const cleanEmail = (session.user.email || "").trim().toLowerCase();
            const isEmailAdmin = ADMIN_EMAILS.includes(cleanEmail);

            // Attempt to fetch profile from public.profiles table if exists
            try {
              const { data: profile, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

              if (!error && profile) {
                const finalRole: UserRole = isEmailAdmin ? "admin" : (profile.role as UserRole || "student");
                setUser({
                  ...profile,
                  role: finalRole,
                } as Profile);
                setIsLoading(false);
                return;
              }
            } catch (_) {
              // Profiles table not migrated yet, handled below
            }

            // Synthesize profile from session metadata + saved data
            const savedRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
            const savedProfile = savedRaw ? JSON.parse(savedRaw) : null;

            const userMeta = session.user.user_metadata || {};
            const finalRole: UserRole = isEmailAdmin || userMeta.role === "admin" ? "admin" : "student";

            const synthesized: Profile = {
              id: session.user.id,
              email: cleanEmail,
              full_name: userMeta.full_name || savedProfile?.full_name || cleanEmail.split("@")[0].replace(".", " "),
              avatar_url: savedProfile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
              role: finalRole,
              grade_level: userMeta.grade_level || savedProfile?.grade_level || 12,
              xp: savedProfile?.xp || 150,
              level: savedProfile?.level || 1,
              streak_days: savedProfile?.streak_days || 1,
              longest_streak: savedProfile?.longest_streak || 1,
              last_active_date: new Date().toISOString().split("T")[0],
              created_at: session.user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            setUser(synthesized);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(synthesized));
            setIsLoading(false);
            return;
          }
        }

        // Check local storage if previously logged in without active Supabase session
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.email) {
              // Purge legacy demo profile automatically so visitors always start as Guest (Chưa đăng nhập)
              if (parsed.email === "hocsinh.demo@itmaster.edu.vn" || parsed.id === "user-demo-01") {
                const isExplicitDemo = typeof window !== "undefined" && sessionStorage.getItem("it_master_demo_active") === "true";
                if (!isExplicitDemo) {
                  localStorage.removeItem(LOCAL_STORAGE_KEY);
                  setUser(null);
                  setIsLoading(false);
                  return;
                }
              }

              const isEmailAdmin = ADMIN_EMAILS.includes((parsed.email || "").toLowerCase());
              if (isEmailAdmin) parsed.role = "admin";
              setUser(parsed);
              setIsLoading(false);
              return;
            }
          } catch (_) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        }

        // Default: Guest visitor (not logged in)
        setUser(null);
      } catch (err) {
        console.error("Auth init error:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Demo Student account shortcut
      if (cleanEmail === "hocsinh.demo@itmaster.edu.vn" && (!password || password === "demo123456")) {
        setUser(MOCK_PROFILE);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("it_master_demo_active", "true");
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_PROFILE));
        setIsLoading(false);
        return { success: true };
      }

      // 2. Clear any lingering demo session
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("it_master_demo_active");
      }

      // 3. Supabase Authentication
      const supabase = createClient();
      if (supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setIsLoading(false);
          const msg = error.message.toLowerCase();
          if (msg.includes("invalid login credentials")) {
            return {
              success: false,
              error: "Email hoặc mật khẩu không chính xác. Nếu chưa có tài khoản, vui lòng Đăng ký.",
            };
          }
          if (msg.includes("email not confirmed")) {
            return {
              success: false,
              error: "Tài khoản chưa được kích hoạt email. Vui lòng kiểm tra hộp thư hoặc liên hệ hỗ trợ.",
            };
          }
          return { success: false, error: `Lỗi đăng nhập: ${error.message}` };
        }

        if (data?.user) {
          const isEmailAdmin = ADMIN_EMAILS.includes(cleanEmail);

          // Try loading from database profiles table
          try {
            const { data: dbProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();

            if (dbProfile) {
              const finalRole: UserRole = isEmailAdmin ? "admin" : (dbProfile.role as UserRole || "student");
              const verifiedUser: Profile = { ...dbProfile, role: finalRole };
              setUser(verifiedUser);
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(verifiedUser));
              setIsLoading(false);
              return { success: true };
            }
          } catch (_) {
            // Profiles table not available, fallback to user metadata
          }

          // Synthesize profile from Supabase user auth object
          const userMeta = data.user.user_metadata || {};
          const finalRole: UserRole = isEmailAdmin || userMeta.role === "admin" ? "admin" : "student";

          const userProfile: Profile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: userMeta.full_name || cleanEmail.split("@")[0].replace(".", " "),
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
            role: finalRole,
            grade_level: userMeta.grade_level || 12,
            xp: 150,
            level: 1,
            streak_days: 1,
            longest_streak: 1,
            last_active_date: new Date().toISOString().split("T")[0],
            created_at: data.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setUser(userProfile);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userProfile));
          setIsLoading(false);
          return { success: true };
        }
      }

      setIsLoading(false);
      return { success: false, error: "Không thể kết nối máy chủ xác thực. Vui lòng thử lại." };
    } catch (e: any) {
      setIsLoading(false);
      console.error("Login exception:", e);
      return { success: false, error: e.message || "Đã xảy ra lỗi không mong muốn khi đăng nhập." };
    }
  };

  const register = async (
    fullName: string,
    email: string,
    gradeLevel: 10 | 11 | 12,
    password?: string
  ) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Call server-side register API (auto-confirms email and sets correct role)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: cleanEmail,
          gradeLevel,
          password: password || "123456",
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: resData.error || "Đăng ký không thành công." };
      }

      // Auto login immediately after registration
      if (password) {
        const loginRes = await login(cleanEmail, password);
        if (loginRes.success) {
          setIsLoading(false);
          return { success: true };
        }
      }

      // Local state fallback if login didn't trigger
      const isEmailAdmin = ADMIN_EMAILS.includes(cleanEmail);
      const newUser: Profile = {
        id: resData.user?.id || "user-" + Date.now(),
        email: cleanEmail,
        full_name: fullName.trim(),
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
        role: isEmailAdmin ? "admin" : "student",
        grade_level: gradeLevel,
        xp: 100,
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
      return { success: false, error: e.message || "Đã xảy ra lỗi đăng ký tài khoản." };
    }
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (_) {}
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("it_master_demo_active");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setUser(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const isEmailAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
    // Regular users cannot grant themselves admin privileges
    const safeRole: UserRole = isEmailAdmin 
      ? "admin" 
      : (updates.role && updates.role !== "admin" ? updates.role : user.role);

    const updated = {
      ...user,
      ...updates,
      role: safeRole,
      updated_at: new Date().toISOString(),
    };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    const supabase = createClient();
    if (supabase) {
      try {
        const safeUpdates = { ...updates, role: safeRole };
        await supabase.from("profiles").update(safeUpdates).eq("id", user.id);
      } catch (_) {}
    }
  };

  const addXp = (amount: number, reason: string) => {
    if (!user) return;
    const newXp = (user.xp || 0) + amount;
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

    const supabase = createClient();
    if (supabase && user.id && !user.id.startsWith("user-demo") && !user.id.startsWith("usr-admin-demo")) {
      try {
        supabase.from("profiles").update({ xp: newXp, level, updated_at: new Date().toISOString() }).eq("id", user.id).then(() => {});
        supabase.auth.updateUser({ data: { xp: newXp, level } }).catch(() => {});
      } catch (_) {}
    }
  };

  const role: UserRole = user?.role || "student";
  // Strict admin check: must have admin role AND be verified
  const isAdmin = user ? (ADMIN_EMAILS.includes(user.email.toLowerCase()) || role === "admin") : false;

  // Demo user check: identifies whether user is using the guest/sample student trial
  const isDemo = Boolean(
    user && (
      user.email === "hocsinh.demo@itmaster.edu.vn" ||
      user.id === "user-demo-01" ||
      (typeof window !== "undefined" && sessionStorage.getItem("it_master_demo_active") === "true")
    )
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isAdmin,
        isDemo,
        login,
        register,
        logout,
        updateProfile,
        addXp,
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
