"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Code2,
  ArrowRight,
  Lock,
  Mail,
  User,
  GraduationCap,
  AlertCircle,
  BookmarkCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isDemo, logout } = useAuth();

  // If entering register while in trial mode, automatically clear trial session
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
    if (password && password.length < 6) {
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
          Đăng ký tài khoản học sinh
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Đã có tài khoản?{" "}
          <Link
            href={`/login${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* VALUE PROPOSITION BANNER */}
        <div className="mb-4 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-950 dark:text-indigo-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Lưu trữ lịch sử & Thăng hạng học tập
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Tạo tài khoản miễn phí để hệ thống tự động ghi nhận bài làm, chấm điểm chi tiết và tích lũy +100 XP khởi đầu.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-swiss">
          {/* TAB SWITCHER */}
          <div className="grid grid-cols-2 p-1 mb-6 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
            <Link
              href={`/login${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="py-2 text-center rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              Đăng nhập
            </Link>
            <button
              type="button"
              className="py-2 text-center rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold"
            >
              Đăng ký tài khoản
            </button>
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
                Họ và tên học sinh
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Khối lớp hiện tại
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 11, 12].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGradeLevel(g as 10 | 11 | 12)}
                    className={`py-2 px-3 rounded-lg border text-xs sm:text-sm font-mono font-bold transition tabular-nums ${
                      gradeLevel === g
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Lớp {g}
                  </button>
                ))}
              </div>
            </div>

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
              <label className="block text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-2.5 text-sm mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" isLoading={isLoading}>
              <span>Tạo tài khoản & Nhận ngay +100 XP</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <p className="mt-4 text-[11px] text-center text-slate-500 leading-normal">
            Bằng việc đăng ký, bạn đồng ý với Quy chế học tập và Điều khoản sử dụng của IT MASTER.
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
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex items-center justify-center">
          <div className="animate-pulse text-indigo-600 font-bold">IT MASTER...</div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
