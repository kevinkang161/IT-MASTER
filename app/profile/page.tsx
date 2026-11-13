"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Flame,
  Zap,
  Award,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Save,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-context";
import { calculateLevel } from "@/lib/utils";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [gradeLevel, setGradeLevel] = useState<10 | 11 | 12>(user?.grade_level || 12);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const xpStats = calculateLevel(user?.xp || 1250);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      grade_level: gradeLevel,
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        <div className="space-y-1">
          <Badge variant="primary">Hồ sơ cá nhân</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Thông tin học sinh & Lịch sử học tập
          </h1>
        </div>

        {/* PROFILE HEADER CARD */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80"}
            alt={user?.full_name || "Avatar"}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-blue-100 dark:border-blue-900 shadow-md"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.full_name || "Nguyễn Văn An"}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Lớp {user?.grade_level || 12}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Cấp độ {xpStats.level}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{user?.email || "hocsinh.demo@itmaster.edu.vn"}</span>
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-semibold">
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Chuỗi {user?.streak_days || 5} ngày (Kỷ lục: {user?.longest_streak || 12} ngày)</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Zap className="w-4 h-4 fill-blue-500" />
                <span>{(user?.xp || 1250).toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </Card>

        {/* EDIT PROFILE FORM */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cập nhật thông tin tài khoản
            </h3>
            {isSavedNotice && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã lưu thành công!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Họ và tên hiển thị
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Khối lớp học tập
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value) as 10 | 11 | 12)}
                className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>Lớp 10 (Chương trình Python & Máy tính)</option>
                <option value={11}>Lớp 11 (Chương trình SQL & CSDL)</option>
                <option value={12}>Lớp 12 (Chương trình AI, Web & Ôn thi THPT)</option>
              </select>
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm" className="gap-2">
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
