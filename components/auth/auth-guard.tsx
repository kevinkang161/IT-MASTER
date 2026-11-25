"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

// Exact routes accessible without authentication
const PUBLIC_EXACT_PATHS = [
  "/",
  "/learning",
  "/videos",
  "/exams",
  "/leaderboard",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Prefix routes accessible without authentication
const PUBLIC_PREFIX_PATHS = ["/api"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT_PATHS.includes(pathname)) {
    return true;
  }
  return PUBLIC_PREFIX_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

function AuthGuardInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading, isAdmin, isDemo, logout } = useAuth();
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

    // 2. Demo user navigating to /login or /register: end trial session cleanly
    if (user && isDemo && (pathname === "/login" || pathname === "/register")) {
      logout();
      return;
    }

    // 3. Authenticated real user trying to access /login or /register
    if (user && !isDemo && (pathname === "/login" || pathname === "/register")) {
      setIsRedirecting(true);
      const redirectTarget = searchParams?.get("redirect") || "/dashboard";
      router.replace(redirectTarget);
      return;
    }

    // 4. Non-admin trying to access /admin
    if (user && pathname.startsWith("/admin") && !isAdmin) {
      setIsRedirecting(true);
      router.replace("/dashboard");
      return;
    }

    setIsRedirecting(false);
  }, [user, isLoading, pathname, searchParams, isAdmin, isDemo, logout, router]);

  const publicRoute = isPublicPath(pathname);

  if (
    (isLoading && !publicRoute) ||
    (isRedirecting && !publicRoute) ||
    (isRedirecting && (pathname === "/login" || pathname === "/register"))
  ) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex flex-col items-center justify-center p-4 font-sans transition-colors">
        <div className="flex flex-col items-center max-w-sm text-center">
          <img
            src="/images/logo.jpg"
            alt="IT MASTER"
            className="w-12 h-12 rounded-xl object-cover border border-[var(--border)] mb-4"
          />
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
            IT MASTER
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1 mb-5">
            Nền tảng Học &amp; Ôn thi Tin học THPT
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-secondary)]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
            <span>Đang xác thực tài khoản...</span>
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
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      }
    >
      <AuthGuardInner>{children}</AuthGuardInner>
    </React.Suspense>
  );
}
