"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth/auth-context";
import { calculateLevel } from "@/lib/utils";
import { MOCK_LESSONS, MOCK_EXAMS, MOCK_ACHIEVEMENTS } from "@/lib/mock-data";

export default function StudentDashboardPage() {
  const { user, isAdmin, toggleRoleForDemo } = useAuth();

  const xpStats = calculateLevel(user?.xp || 1250);
  const lessonsCompleted = 14;
  const totalLessons = 44;
  const exercisesCompleted = 86;
  const avgExamScore = 8.4;

  const currentLesson = MOCK_LESSONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* TOP WELCOME BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

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
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Chào mừng trở lại, {user?.full_name || "Nguyễn Văn An"}!
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                    Lớp {user?.grade_level || 12}
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  Hôm nay là một ngày tuyệt vời để bứt phá môn Tin học! Bạn đã duy trì chuỗi học tập liên tục.
                </p>
              </div>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={toggleRoleForDemo}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition flex items-center gap-1.5"
                title="Chuyển đổi vai trò để thử nghiệm giao diện Học sinh hoặc Quản trị Admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Vai trò hiện tại: <strong>{user?.role === "admin" ? "Admin CMS" : "Học sinh"}</strong></span>
                <span className="text-[10px] text-cyan-300 underline ml-1">Đổi vai trò</span>
              </button>
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
