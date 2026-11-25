"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Flame,
  Zap,
  CheckCircle2,
  Save,
  LogOut,
  LogIn,
  UserPlus,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-context";
import { calculateLevel } from "@/lib/utils";
import { getUserProgress, UserProgressData } from "@/lib/progress";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAdmin, updateProfile, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [gradeLevel, setGradeLevel] = useState<10 | 11 | 12>(user?.grade_level || 12);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [progressData, setProgressData] = useState<UserProgressData>(() =>
    getUserProgress(user?.id)
  );

  // Sync local form state and progress when user finishes loading asynchronously
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setGradeLevel(user.grade_level || 12);
      setProgressData(getUserProgress(user.id));
    }
  }, [user]);

  const xpStats = calculateLevel(user?.xp ?? 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await updateProfile({
      full_name: fullName.trim(),
      grade_level: gradeLevel,
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-14 h-14 rounded-xl bg-[var(--accent-subtle)] border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <User className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Bạn chưa đăng nhập
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Vui lòng đăng nhập hoặc tạo tài khoản mới để xem và chỉnh sửa thông tin hồ sơ học sinh.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full">
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <UserPlus className="w-4 h-4" />
                <span>Đăng ký học sinh mới</span>
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[var(--text-muted)]">Hồ sơ cá nhân</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Thông tin học sinh &amp; Lịch sử học tập
            </h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </Button>
        </div>

        {/* PROFILE HEADER CARD */}
        <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={
              user.avatar_url ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80"
            }
            alt={user.full_name || "Avatar"}
            className="w-20 h-20 rounded-2xl object-cover border border-[var(--border)]"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.full_name}</h2>
              <Badge variant="primary" className="font-mono">
                Lớp {user.grade_level || 12}
              </Badge>
              <Badge variant="warning" className="font-mono">
                Cấp {xpStats.level}
              </Badge>
              {isAdmin && <Badge variant="success">Quản trị viên</Badge>}
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-center justify-center sm:justify-start gap-1.5 font-mono">
              <Mail className="w-4 h-4 text-[var(--text-muted)]" />
              <span>{user.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-semibold font-mono tabular-nums">
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="w-4 h-4 fill-current" />
                <span>
                  Chuỗi {user.streak_days || 1} ngày (Kỷ lục: {user.longest_streak || 1} ngày)
                </span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Zap className="w-4 h-4 fill-current" />
                <span>{(user.xp ?? 0).toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </Card>

        {/* LEARNING HISTORY SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Bài đã hoàn thành</span>
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
              {progressData.completedLessons.length} bài
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Câu hỏi đã luyện</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
              {progressData.totalQuestionsAnswered} câu
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Lượt thi đã hoàn thành</span>
              <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
              {progressData.examHistory.length} đề
            </div>
          </Card>
        </div>

        {/* RECENT EXAM HISTORY */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Lịch sử làm đề thi gần đây
            </h3>
            <Link
              href="/exams"
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Làm thêm đề mới
            </Link>
          </div>

          {progressData.examHistory.length > 0 ? (
            <div className="divide-y divide-[var(--border)] text-xs">
              {progressData.examHistory.slice(0, 6).map((item, idx) => (
                <div key={`${item.examId}-${idx}`} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-[var(--text-primary)] truncate">
                      {item.examTitle}
                    </div>
                    <div className="text-[var(--text-muted)] mt-0.5 font-mono">
                      Ngày làm: {item.date} · Chính xác {item.accuracy}%
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 shrink-0 tabular-nums">
                    {item.score} / {item.maxScore}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-secondary)]">
              Bạn chưa hoàn thành bài thi thử nào. Hãy vào{" "}
              <Link href="/exams" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Phòng thi thử
              </Link>{" "}
              để bắt đầu.
            </p>
          )}
        </Card>

        {/* EDIT PROFILE FORM */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Cập nhật thông tin tài khoản
            </h3>
            {isSavedNotice && (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã lưu thay đổi</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Họ và tên hiển thị
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Khối lớp học tập
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value) as 10 | 11 | 12)}
                className="w-full p-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={10}>Lớp 10 (Python &amp; Nền tảng số)</option>
                <option value={11}>Lớp 11 (SQL &amp; Cơ sở dữ liệu)</option>
                <option value={12}>Lớp 12 (AI, Web &amp; Ôn thi THPT)</option>
              </select>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <Button type="submit" size="sm">
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản</span>
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
