"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Trophy,
  Flame,
  Zap,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Timer,
  Award,
  Clock,
  Target,
  BarChart3,
  TrendingUp,
  Play,
  RotateCcw,
  ShieldCheck,
  User,
  Star,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth/auth-context";
import { calculateLevel } from "@/lib/utils";
import { getUserProgress } from "@/lib/progress";
import { MOCK_LESSONS, MOCK_EXAMS, MOCK_ACHIEVEMENTS } from "@/lib/mock-data";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();

  const [progressData, setProgressData] = useState(() => getUserProgress(user?.id));

  useEffect(() => {
    setProgressData(getUserProgress(user?.id));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const xpStats = calculateLevel(user?.xp || 0);
  const lessonsCompleted = progressData.completedLessons.length;
  const totalLessons = 44;
  const exercisesCompleted = progressData.totalQuestionsAnswered;
  const accuracyRate = exercisesCompleted > 0
    ? Math.round((progressData.totalQuestionsCorrect / exercisesCompleted) * 100)
    : 100;
  const avgExamScore = progressData.examHistory.length > 0
    ? Number((progressData.examHistory.reduce((acc, h) => acc + h.score, 0) / progressData.examHistory.length).toFixed(1))
    : 0;

  const currentLesson = MOCK_LESSONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* GUEST BANNER (If not logged in) */}
        {!user && (
          <div className="p-5 rounded-3xl bg-indigo-900 border border-indigo-700 text-white shadow-swiss flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300">
                Chế độ Khách trải nghiệm
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Bạn chưa đăng nhập tài khoản học sinh
              </h2>
              <p className="text-xs text-indigo-200 max-w-xl">
                Đăng ký tài khoản miễn phí để lưu lại toàn bộ tiến độ bài học, kết quả các đề thi thử THPT và tích lũy điểm kinh nghiệm XP của riêng bạn.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Link href="/login">
                <Button variant="outline" size="sm" className="bg-indigo-950/60 border-indigo-500/50 text-white hover:bg-indigo-800 text-xs font-semibold">
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  <span>Đăng nhập</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs shadow-sm">
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  <span>Đăng ký học sinh mới</span>
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* TOP WELCOME BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-swiss">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src={user?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80"}
                  alt={user?.full_name || "Học sinh"}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 text-xs font-black shadow-sm">
                  Cấp {xpStats.level}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {user ? `Chào mừng trở lại, ${user.full_name}!` : "Bảng học tập tổng quan"}
                  </h1>
                  {user && (
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      Lớp {user?.grade_level || 12}
                    </span>
                  )}
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Quản trị viên
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300">
                  {user
                    ? `Email: ${user.email} • Tiến độ học tập và rèn luyện kỹ năng Tin học THPT của bạn.`
                    : "Học tập chuẩn chương trình GDPT 2018 theo bộ sách Kết nối tri thức 10, 11 và 12."}
                </p>
              </div>
            </div>

            {/* Quick Actions (Admin CMS & Logout) */}
            <div className="flex flex-wrap items-center gap-2.5">
              {isAdmin && (
                <Link href="/admin">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs">
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    <span>Mở trang Quản trị CMS</span>
                  </Button>
                </Link>
              )}
              {user && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="border-slate-700 text-slate-300 hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-950/30 text-xs gap-1.5"
                  title="Đăng xuất khỏi tài khoản"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </Button>
              )}
            </div>
          </div>

          {/* XP & Level progress bar inside hero */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-cyan-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                  Tiến độ thăng Cấp {xpStats.level + 1}
                </span>
                <span className="text-slate-300">
                  {xpStats.currentXp} / {xpStats.nextLevelXp} XP ({xpStats.progress}%)
                </span>
              </div>
              <Progress value={xpStats.progress} indicatorColor="bg-gradient-to-r from-blue-400 to-cyan-400" className="h-2.5 bg-slate-800" />
            </div>

            <div className="flex items-center justify-start sm:justify-end gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold text-amber-300">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Chuỗi {user?.streak_days || 5} ngày</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-xl font-bold text-blue-300">
                <Trophy className="w-4 h-4 fill-blue-400 text-blue-400" />
                <span>Hạng 3 Tuần</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-5 bg-white border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Bài học hoàn thành</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{lessonsCompleted} / {totalLessons}</div>
            <div className="text-xs text-slate-500 mt-1">Đạt {Math.round((lessonsCompleted / totalLessons) * 100)}% toàn bộ khóa học</div>
          </Card>

          <Card className="p-5 bg-white border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Câu hỏi đã luyện</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{exercisesCompleted} câu</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Tỷ lệ đúng: 89.5%</div>
          </Card>

          <Card className="p-5 bg-white border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Điểm thi thử TB</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{avgExamScore} / 10</div>
            <div className="text-xs text-slate-500 mt-1">Dựa trên 3 lượt thi gần nhất</div>
          </Card>

          <Card className="p-5 bg-white border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Tổng điểm kinh nghiệm</span>
              <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{(user?.xp || 1250).toLocaleString()} XP</div>
            <div className="text-xs text-violet-600 font-medium mt-1">+150 XP trong tuần này</div>
          </Card>
        </div>

        {/* MAIN 2-COL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLS: RECENT LESSON & RECOMMENDED */}
          <div className="lg:col-span-2 space-y-8">
            {/* CONTINUOUS LEARNING CARD */}
            <Card className="border-blue-200/80 bg-gradient-to-br from-blue-50/50 to-white shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Đang học dở
                  </span>
                  <span className="text-xs text-slate-400">Khối lớp 10</span>
                </div>
                <CardTitle className="text-lg text-slate-900 mt-2">
                  {currentLesson.title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {currentLesson.introduction}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>~{currentLesson.estimated_minutes} phút</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Zap className="w-4 h-4 fill-emerald-500" />
                    <span>+{currentLesson.xp_reward} XP khi hoàn thành</span>
                  </div>
                </div>
                <Link href={`/learning/${currentLesson.slug}`} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto gap-2">
                    <Play className="w-4 h-4 fill-current" />
                    <span>Học tiếp bài này</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* RECOMMENDED LESSONS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Bài học gợi ý tiếp theo</span>
                </h3>
                <Link href="/learning" className="text-xs font-semibold text-blue-600 hover:underline">
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-3">
                {MOCK_LESSONS.map((lesson) => (
                  <Card key={lesson.id} className="p-4 hover:border-blue-300 transition-colors flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          Lớp {lesson.grade_id}
                        </Badge>
                        <Badge variant="primary" className="text-[10px]">
                          {lesson.difficulty === "co_ban" ? "Cơ bản" : lesson.difficulty === "trung_binh" ? "Trung bình" : "Nâng cao"}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition">
                        <Link href={`/learning/${lesson.slug}`}>{lesson.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{lesson.introduction}</p>
                    </div>

                    <Link href={`/learning/${lesson.slug}`} className="shrink-0">
                      <Button variant="outline" size="sm" className="gap-1">
                        <span>Học</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>

            {/* MOCK EXAMS CALLOUT */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Đề thi thử THPT sẵn sàng</span>
                </h3>
                <Link href="/exams" className="text-xs font-semibold text-blue-600 hover:underline">
                  Vào phòng thi
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_EXAMS.slice(0, 2).map((exam) => (
                  <Card key={exam.id} className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          Lớp {exam.grade_id}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Timer className="w-3.5 h-3.5" />
                          <span>{exam.duration_minutes} phút</span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2">
                        {exam.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {exam.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600">+{exam.xp_reward} XP</span>
                      <Link href={`/exams/${exam.slug}`}>
                        <Button size="sm" variant="secondary" className="gap-1 text-xs">
                          <span>Làm bài</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COL: DAILY GOALS & ACHIEVEMENTS */}
          <div className="space-y-6">
            {/* DAILY QUESTS */}
            <Card className="p-5 bg-white border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Nhiệm vụ hàng ngày (Daily Quests)</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">Đọc xong 1 bài lý thuyết mới</span>
                    <span className="text-blue-600 font-bold">+50 XP</span>
                  </div>
                  <Progress value={100} className="h-1.5" />
                  <div className="text-[11px] text-emerald-600 font-medium">✓ Đã hoàn thành</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">Làm đúng 10 câu trắc nghiệm</span>
                    <span className="text-blue-600 font-bold">+40 XP</span>
                  </div>
                  <Progress value={60} className="h-1.5" />
                  <div className="text-[11px] text-slate-400">Đã làm: 6/10 câu</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">Hoàn thành 1 bài thi thử</span>
                    <span className="text-blue-600 font-bold">+100 XP</span>
                  </div>
                  <Progress value={0} className="h-1.5" />
                  <div className="text-[11px] text-slate-400">Chưa bắt đầu</div>
                </div>
              </div>
            </Card>

            {/* ACHIEVEMENTS PREVIEW */}
            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Danh hiệu đã mở khóa</span>
                </h3>
                <Link href="/leaderboard" className="text-xs text-blue-600 hover:underline">
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-3">
                {MOCK_ACHIEVEMENTS.slice(0, 3).map((ach) => (
                  <div key={ach.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{ach.title}</h5>
                      <p className="text-[11px] text-slate-500 truncate">{ach.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                      +{ach.xp_bonus} XP
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
