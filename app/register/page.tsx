"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isDemo, logout } = useAuth();

  useEffect(() => {
    if (isDemo) {
      logout();
    }
  }, [isDemo, logout]);

  const redirectUrl = searchParams?.get("redirect") || "/dashboard";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gradeLevel, setGradeLevel] = useState<10 | 11 | 12>(12);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có độ dài tối thiểu 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    const result = await register(fullName, email, gradeLevel, password);
    setIsLoading(false);

    if (result.success) {
      router.push(redirectUrl);
    } else {
      setError(result.error || "Đăng ký không thành công. Vui lòng thử lại.");
    }
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
          Đăng ký tài khoản học sinh
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)]">
          Đã có tài khoản?{" "}
          <Link
            href={`/login${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="p-6 sm:p-8 hallmark-surface">
          <div className="grid grid-cols-2 p-1 mb-6 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-xs font-semibold">
            <Link
              href={`/login${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="py-2 text-center rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Đăng nhập
            </Link>
            <button
              type="button"
              className="py-2 text-center rounded-md bg-[var(--surface)] text-[var(--text-primary)] shadow-sm font-semibold"
            >
              Đăng ký tài khoản
            </button>
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
                Họ và tên học sinh
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Khối lớp hiện tại
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 11, 12].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGradeLevel(g as 10 | 11 | 12)}
                    className={`py-2 px-3 rounded-lg border text-xs sm:text-sm font-mono font-semibold transition-colors tabular-nums cursor-pointer ${
                      gradeLevel === g
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Lớp {g}
                  </button>
                ))}
              </div>
            </div>

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
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-2.5 text-sm mt-2" isLoading={isLoading}>
              <span>Tạo tài khoản học sinh</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-4 text-[11px] text-center text-[var(--text-muted)] leading-normal">
            Tài khoản miễn phí mở khóa toàn bộ bài học, đề thi thử và lưu điểm XP cá nhân (+100 XP khởi đầu).
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <div className="text-sm text-[var(--text-muted)]">Đang tải...</div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
