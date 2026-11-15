"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Code2,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isDemo, logout } = useAuth();

  // If entering login while in trial mode, automatically clear trial session
  useEffect(() => {
    if (isDemo) {
      logout();
    }
  }, [isDemo, logout]);

  const redirectUrl = searchParams?.get("redirect") || "/dashboard";
  const isRequired = searchParams?.get("required") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push(redirectUrl);
    } else {
      setError(result.error || "Đăng nhập không thành công. Vui lòng kiểm tra lại email hoặc mật khẩu.");
    }
  };

  const handleDemoStudentLogin = async () => {
    setIsLoading(true);
    await login("hocsinh.demo@itmaster.edu.vn", "demo123456");
    setIsLoading(false);
    router.push(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
          <img
            src="/images/logo.jpg"
            alt="IT Master Logo"
            className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-sm shrink-0"
          />
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            IT MASTER
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Đăng nhập vào hệ thống
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Chưa có tài khoản?{" "}
          <Link
            href={`/register${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Đăng ký học sinh mới
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* REQUIRE AUTH NOTICE BANNER */}
        {isRequired && (
          <div className="mb-4 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-950 dark:text-indigo-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm animate-in fade-in duration-300">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Yêu cầu đăng nhập trước khi vào học
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Đăng nhập hoặc đăng ký để hệ thống lưu giữ toàn bộ kết quả bài thi, lịch sử luyện tập và điểm XP của bạn.
              </p>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-swiss">
          {/* TAB SWITCHER */}
          <div className="grid grid-cols-2 p-1 mb-6 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
            <button
              type="button"
              className="py-2 text-center rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold"
            >
              Đăng nhập
            </button>
            <Link
              href={`/register${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="py-2 text-center rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              Đăng ký tài khoản
            </Link>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hocsinh@thpt.edu.vn"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300">
                  Mật khẩu
                </label>
                <Link href="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-2.5 text-sm mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" isLoading={isLoading}>
              <span>Đăng nhập</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* DEMO SHORTCUTS */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-[11px] text-center font-mono text-slate-400 uppercase tracking-wider mb-2">
              Hoặc trải nghiệm nhanh (1-click):
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={handleDemoStudentLogin}
              disabled={isLoading}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
              Trải nghiệm nhanh — Học sinh Mẫu (Giới hạn 3 bài)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex items-center justify-center">
          <div className="animate-pulse text-indigo-600 font-bold">IT MASTER...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
