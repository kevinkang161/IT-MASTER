"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, ArrowRight, CheckCircle2, UserPlus, LogIn } from "lucide-react";
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
      className={`bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border-b border-amber-300/40 dark:border-amber-500/20 px-4 py-2 text-xs text-slate-800 dark:text-slate-200 transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-500 text-white shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-amber-700 dark:text-amber-400 mr-1.5 font-mono">
              [TÀI KHOẢN HỌC THỬ]
            </span>
            <span>
              Bạn đang học thử (tối đa 3 bài học & 1 đề thi). Muốn học không giới hạn và lưu điểm số?
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRegister}
            className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 font-semibold shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            <span>Đăng ký tài khoản thật (Miễn phí)</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogin}
            className="h-7 text-xs border-amber-300 dark:border-amber-700/80 text-slate-700 dark:text-slate-300 px-2.5 font-medium hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 mr-1" />
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
    <div className="my-10 max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0f172a] border-2 border-indigo-200 dark:border-indigo-900 shadow-xl text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-sm">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          Giới hạn tài khoản học thử • Đăng nhập thật sự để mở khóa
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Nội dung này yêu cầu Tài khoản học sinh chính thức
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Tài khoản học sinh mẫu chỉ được phép trải nghiệm <strong>3 bài học thử</strong>. Để truy cập toàn bộ kho tư liệu và lưu lại tiến độ cá nhân của bạn, hãy đăng ký tài khoản thật sự.
        </p>
      </div>

      {/* VALUE HIGHLIGHTS */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-left space-y-2.5 text-xs sm:text-sm">
        <p className="font-bold text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wider text-center sm:text-left">
          Đặc quyền khi tạo tài khoản chính thức:
        </p>
        <div className="grid sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Mở khóa 100% 95+ bài học SGK Tin 10, 11, 12</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Lưu giữ trọn vẹn điểm số và lịch sử làm bài thi</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Luyện thi thử THPT bấm giờ 45 phút không giới hạn</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Tích lũy XP, thăng hạng bảng vàng danh dự</span>
          </div>
        </div>
      </div>

      {/* ACTIONS: Direct logout and redirect */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          onClick={handleRegister}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          <span>Tạo tài khoản học sinh ngay — Miễn phí 100%</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="outline"
          onClick={handleLogin}
          className="w-full sm:w-auto border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <LogIn className="w-4 h-4 mr-2" />
          <span>Đăng nhập tài khoản của bạn</span>
        </Button>
      </div>

      <div>
        <Link href="/learning" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition underline underline-offset-4">
          Quay lại danh sách các bài học thử miễn phí
        </Link>
      </div>
    </div>
  );
}
