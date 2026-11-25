"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

export function DemoTrialBanner({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleRegister = async () => {
    await logout();
    router.push("/register");
  };

  const handleLogin = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div
      className={`bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/60 py-2 text-xs text-[var(--text-primary)] transition-colors ${className}`}
    >
      <div className="hallmark-container flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300 dark:border-amber-800">
            Chế độ học thử
          </span>
          <span className="text-[var(--text-secondary)]">
            Giới hạn 3 bài học và 1 đề thi. Đăng ký miễn phí để lưu tiến độ và mở khóa toàn bộ.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRegister}
            className="h-7 text-xs px-3 font-semibold"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng ký miễn phí</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogin}
            className="h-7 text-xs px-2.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DemoLockedCard({
  itemType = "bài học",
  redirectUrl,
}: {
  itemType?: "bài học" | "đề thi";
  redirectUrl?: string;
}) {
  const router = useRouter();
  const { logout } = useAuth();

  const registerTarget = redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register";
  const loginTarget = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login";

  const handleRegister = async () => {
    await logout();
    router.push(registerTarget);
  };

  const handleLogin = async () => {
    await logout();
    router.push(loginTarget);
  };

  return (
    <div className="my-10 max-w-2xl mx-auto p-6 sm:p-8 hallmark-surface text-center space-y-6">
      <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
        <Lock className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
          Giới hạn tài khoản học thử
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Nội dung này dành cho tài khoản học sinh chính thức
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          Tài khoản học thử được trải nghiệm <strong>3 bài học</strong> và <strong>1 đề thi</strong> mẫu. Hãy đăng ký tài khoản miễn phí để mở khóa toàn bộ kho {itemType} và lưu lại kết quả cá nhân.
        </p>
      </div>

      <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-left space-y-2.5 text-xs sm:text-sm">
        <p className="font-semibold text-[var(--text-primary)]">
          Quyền lợi khi tạo tài khoản chính thức:
        </p>
        <div className="grid sm:grid-cols-2 gap-2 text-[var(--text-secondary)]">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Mở khóa toàn bộ bài học Tin 10, 11, 12</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Lưu điểm số và lịch sử làm bài thi</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Luyện thi thử THPT 45 phút không giới hạn</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Tích lũy XP và theo dõi tiến độ học tập</span>
          </div>
        </div>
      </div>

      <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button onClick={handleRegister} className="w-full sm:w-auto font-semibold px-5">
          <UserPlus className="w-4 h-4" />
          <span>Tạo tài khoản miễn phí</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={handleLogin} className="w-full sm:w-auto">
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập tài khoản của bạn</span>
        </Button>
      </div>

      <div>
        <Link
          href={itemType === "đề thi" ? "/exams" : "/learning"}
          className="text-xs font-medium text-[var(--text-muted)] hover:text-blue-600 dark:hover:text-blue-400 transition underline underline-offset-4"
        >
          Quay lại danh sách {itemType}
        </Link>
      </div>
    </div>
  );
}
