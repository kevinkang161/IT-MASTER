"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isDemo, logout } = useAuth();

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
      setError(
        result.error || "Đăng nhập không thành công. Vui lòng kiểm tra lại email hoặc mật khẩu."
      );
    }
  };

  const handleDemoStudentLogin = async () => {
    setIsLoading(true);
    await login("hocsinh.demo@itmaster.edu.vn", "demo123456");
    setIsLoading(false);
    router.push(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <img
            src="/images/logo.jpg"
            alt="IT Master Logo"
            className="w-9 h-9 rounded-lg object-cover border border-[var(--border)] shrink-0"
          />
          <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
            IT MASTER
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Đăng nhập vào hệ thống
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)]">
          Chưa có tài khoản?{" "}
          <Link
            href={`/register${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Đăng ký học sinh mới
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {isRequired && (
          <div className="mb-4 p-3.5 rounded-xl bg-[var(--accent-subtle)] border border-blue-200 dark:border-blue-800/80 text-[var(--text-primary)] text-xs sm:text-sm flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-xs sm:text-sm">
                Yêu cầu đăng nhập trước khi vào học hoặc làm bài
              </p>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                Đăng nhập hoặc dùng thử để lưu kết quả bài thi, lịch sử luyện tập và điểm XP của bạn.
              </p>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 hallmark-surface">
          <div className="grid grid-cols-2 p-1 mb-6 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-xs font-semibold">
            <button
              type="button"
              className="py-2 text-center rounded-md bg-[var(--surface)] text-[var(--text-primary)] shadow-sm font-semibold"
            >
              Đăng nhập
            </button>
            <Link
              href={`/register${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="py-2 text-center rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Đăng ký tài khoản
            </Link>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hocsinh@thpt.edu.vn"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-2.5 text-sm mt-2" isLoading={isLoading}>
              <span>Đăng nhập</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-2.5">
            <div className="text-xs text-center text-[var(--text-muted)]">
              Hoặc dùng thử nhanh không cần tạo tài khoản:
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs font-semibold"
              onClick={handleDemoStudentLogin}
              disabled={isLoading}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Học thử — Tài khoản Mẫu (Giới hạn 3 bài)</span>
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
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <div className="text-sm text-[var(--text-muted)]">Đang tải...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
