"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Code2, Loader2, Sparkles } from "lucide-react";

// Routes that do NOT require authentication
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

function AuthGuardInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading, isAdmin } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const publicRoute = isPublicPath(pathname);

    // 1. Unauthenticated user trying to access protected content
    if (!user && !publicRoute) {
      setIsRedirecting(true);
      const queryString = searchParams?.toString();
      const currentFullUrl = queryString ? `${pathname}?${queryString}` : pathname;
      const redirectParam = encodeURIComponent(currentFullUrl);
      router.replace(`/login?redirect=${redirectParam}&required=1`);
      return;
    }

    // 2. Authenticated user trying to access /login or /register
    if (user && (pathname === "/login" || pathname === "/register")) {
      setIsRedirecting(true);
      const redirectTarget = searchParams?.get("redirect") || "/dashboard";
      router.replace(redirectTarget);
      return;
    }

    // 3. Non-admin trying to access /admin
    if (user && pathname.startsWith("/admin") && !isAdmin) {
      setIsRedirecting(true);
      router.replace("/dashboard");
      return;
    }

    setIsRedirecting(false);
  }, [user, isLoading, pathname, searchParams, isAdmin, router]);

  const publicRoute = isPublicPath(pathname);

  // While authenticating on protected routes, or while redirecting, show a smooth branded loading screen
  if ((isLoading && !publicRoute) || (isRedirecting && !publicRoute) || (isRedirecting && (pathname === "/login" || pathname === "/register"))) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex flex-col items-center justify-center p-4 font-sans transition-colors">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-blue-400 flex items-center justify-center font-mono font-bold text-xl shadow-lg border border-slate-800 mb-5 animate-pulse">
            <Code2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            IT MASTER
          </h2>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 mb-6">
            Nền tảng Học & Ôn thi Tin học Toàn diện
          </p>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span>Đang xác thực thông tin học sinh...</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <AuthGuardInner>{children}</AuthGuardInner>
    </React.Suspense>
  );
}
