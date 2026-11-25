"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Trophy,
  Flame,
  Zap,
  ArrowRight,
  GraduationCap,
  Timer,
  Award,
  Clock,
  Target,
  Play,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth/auth-context";
import { calculateLevel } from "@/lib/utils";
import { getUserProgress, UserProgressData } from "@/lib/progress";
import { MOCK_LESSONS, MOCK_EXAMS, MOCK_ACHIEVEMENTS } from "@/lib/mock-data";

export default function StudentDashboardPage() {
  const { user, isAdmin } = useAuth();
  const [progressData, setProgressData] = useState<UserProgressData>(() =>
    getUserProgress(user?.id)
  );

  useEffect(() => {
    setProgressData(getUserProgress(user?.id));
  }, [user?.id]);

  const userXp = user?.xp ?? 0;
  const userStreak = user?.streak_days ?? 0;
  const xpStats = calculateLevel(userXp);

  const lessonsCompleted = progressData.completedLessons.length;
  const totalLessons = MOCK_LESSONS.length;
  const lessonPercent = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

  const exercisesCompleted = progressData.totalQuestionsAnswered;
  const questionsCorrect = progressData.totalQuestionsCorrect;
  const accuracyRate =
    exercisesCompleted > 0 ? Math.round((questionsCorrect / exercisesCompleted) * 100) : null;

  const examCount = progressData.examHistory.length;
  const avgExamScore =
    examCount > 0
      ? Number(
          (
            progressData.examHistory.reduce((acc, h) => acc + h.score, 0) / examCount
          ).toFixed(1)
        )
      : null;

  const bestExamScore =
    examCount > 0
      ? Math.max(...progressData.examHistory.map((h) => h.score))
      : 0;

  const nextLesson =
    MOCK_LESSONS.find((l) => !progressData.completedLessons.includes(l.slug)) || MOCK_LESSONS[0];

  const goals = [
    {
      title: "Hoàn thành 1 bài học lý thuyết",
      reward: "+50 XP",
      progress: lessonsCompleted >= 1 ? 100 : 0,
      status: lessonsCompleted >= 1 ? "Đã hoàn thành" : "Chưa bắt đầu",
      done: lessonsCompleted >= 1,
    },
    {
      title: "Trả lời đúng 10 câu hỏi luyện tập",
      reward: "+100 XP",
      progress: Math.min(100, Math.round((questionsCorrect / 10) * 100)),
      status:
        questionsCorrect >= 10
          ? "Đã hoàn thành"
          : `Đã đúng ${questionsCorrect}/10 câu`,
      done: questionsCorrect >= 10,
    },
    {
      title: "Hoàn thành 1 đề thi thử THPT",
      reward: "+150 XP",
      progress: examCount >= 1 ? 100 : 0,
      status: examCount >= 1 ? "Đã hoàn thành" : "Chưa bắt đầu",
      done: examCount >= 1,
    },
  ];

  const isAchievementUnlocked = (criterionType: string, threshold: number): boolean => {
    switch (criterionType) {
      case "lessons_completed":
        return lessonsCompleted >= threshold;
      case "streak_days":
        return userStreak >= threshold;
      case "questions_answered":
        return exercisesCompleted >= threshold;
      case "perfect_exam":
        return bestExamScore >= 10;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] font-sans transition-colors">
      <Navbar />

      <main className="flex-1 hallmark-container w-full py-8 sm:py-10 space-y-8">
        {/* TOP SUMMARY HEADER */}
        <div className="hallmark-surface p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <img
                  src={
                    user?.avatar_url ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80"
                  }
                  alt={user?.full_name || "Học sinh"}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-[var(--border)]"
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-blue-600 text-white text-[11px] font-mono font-bold">
                  Cấp {xpStats.level}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    {user ? `Xin chào, ${user.full_name}` : "Bảng học tập tổng quan"}
                  </h1>
                  {user && (
                    <Badge variant="primary" className="font-mono">
                      Lớp {user.grade_level || 12}
                    </Badge>
                  )}
                  {isAdmin && (
                    <Badge variant="success">Quản trị viên</Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {user
                    ? `${user.email} · Theo dõi tiến độ học tập và luyện thi Tin học THPT.`
                    : "Tổng quan lộ trình Tin học THPT chuẩn SGK Kết nối tri thức."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {isAdmin && (
                <Link href="/admin">
                  <Button size="sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Quản trị CMS</span>
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button size="sm" variant="outline">
                  <span>Hồ sơ &amp; Lịch sử</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-5 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-semibold">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Tiến độ thăng Cấp {xpStats.level + 1}</span>
                </span>
                <span className="text-[var(--text-secondary)] font-mono tabular-nums">
                  {xpStats.currentXp} / {xpStats.nextLevelXp} XP ({xpStats.progress}%)
                </span>
              </div>
              <Progress value={xpStats.progress} />
            </div>

            <div className="flex items-center justify-start sm:justify-end gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-lg font-semibold text-amber-800 dark:text-amber-300 font-mono tabular-nums">
                <Flame className="w-4 h-4 fill-current" />
                <span>{userStreak} ngày liên tiếp</span>
              </div>
              <Link
                href="/leaderboard"
                className="flex items-center gap-1.5 bg-[var(--bg-subtle)] border border-[var(--border)] px-3 py-1.5 rounded-lg font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Bảng vàng</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 REAL STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <Card className="p-5">
            <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
              <span className="text-xs font-medium">Bài học hoàn thành</span>
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
              {lessonsCompleted} / {totalLessons}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Đạt {lessonPercent}% lộ trình bài giảng
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
              <span className="text-xs font-medium">Câu hỏi đã luyện</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
              {exercisesCompleted} câu
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              {accuracyRate !== null ? `Tỷ lệ đúng: ${accuracyRate}%` : "Chưa có dữ liệu luyện tập"}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
              <span className="text-xs font-medium">Điểm thi thử TB</span>
              <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
              {avgExamScore !== null ? `${avgExamScore} / 10` : "— / 10"}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {examCount > 0 ? `Dựa trên ${examCount} lượt thi` : "Chưa có lượt thi nào"}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
              <span className="text-xs font-medium">Tổng điểm kinh nghiệm</span>
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
              {userXp.toLocaleString()} XP
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Hiện tại ở Cấp {xpStats.level}
            </div>
          </Card>
        </div>

        {/* MAIN 2-COL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLS */}
          <div className="lg:col-span-2 space-y-8">
            {/* NEXT RECOMMENDED LESSON */}
            <Card className="overflow-hidden border-blue-200 dark:border-blue-900/70">
              <CardHeader className="border-b border-[var(--border)] pb-4 bg-[var(--accent-subtle)]/50">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">
                    {lessonsCompleted > 0 ? "Bài học tiếp theo" : "Bắt đầu học"}
                  </Badge>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Khối lớp {nextLesson.grade_id}
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">{nextLesson.title}</CardTitle>
                <CardDescription>{nextLesson.introduction}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] font-mono tabular-nums">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>~{nextLesson.estimated_minutes} phút</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>+{nextLesson.xp_reward} XP</span>
                  </div>
                </div>
                <Link href={`/learning/${nextLesson.slug}`} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto">
                    <Play className="w-4 h-4 fill-current" />
                    <span>Vào học ngay</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* LESSON LIST PREVIEW */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Bài học gợi ý
                </h2>
                <Link
                  href="/learning"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Xem tất cả ({MOCK_LESSONS.length})
                </Link>
              </div>

              <div className="space-y-3">
                {MOCK_LESSONS.slice(0, 4).map((lesson) => {
                  const done = progressData.completedLessons.includes(lesson.slug);
                  return (
                    <Card
                      key={lesson.id}
                      className="p-4 hallmark-surface-hover flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            Lớp {lesson.grade_id}
                          </Badge>
                          <Badge variant={done ? "success" : "primary"} className="text-[10px]">
                            {done
                              ? "Đã hoàn thành"
                              : lesson.difficulty === "co_ban"
                              ? "Cơ bản"
                              : lesson.difficulty === "trung_binh"
                              ? "Trung bình"
                              : "Nâng cao"}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                          <Link href={`/learning/${lesson.slug}`}>{lesson.title}</Link>
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                          {lesson.introduction}
                        </p>
                      </div>

                      <Link href={`/learning/${lesson.slug}`} className="shrink-0">
                        <Button variant="outline" size="sm">
                          <span>{done ? "Xem lại" : "Học"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* MOCK EXAMS CALLOUT */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Đề thi thử sẵn sàng
                </h2>
                <Link
                  href="/exams"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Vào phòng thi
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_EXAMS.slice(0, 2).map((exam) => (
                  <Card key={exam.id} className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="primary" className="font-mono">
                          Lớp {exam.grade_id}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] tabular-nums">
                          <Timer className="w-3.5 h-3.5" />
                          <span>{exam.duration_minutes} phút</span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 mb-2">
                        {exam.title}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                        {exam.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[var(--border)] flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        +{exam.xp_reward} XP
                      </span>
                      <Link href={`/exams/${exam.slug}`}>
                        <Button size="sm" variant="secondary" className="text-xs">
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

          {/* RIGHT 1 COL: GOALS & ACHIEVEMENTS */}
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Mục tiêu học tập</span>
              </h3>

              <div className="space-y-3 text-xs">
                {goals.map((goal) => (
                  <div
                    key={goal.title}
                    className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] space-y-1.5"
                  >
                    <div className="flex justify-between gap-2 font-semibold">
                      <span className="text-[var(--text-primary)]">{goal.title}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono shrink-0">
                        {goal.reward}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-1.5" />
                    <div
                      className={`text-[11px] font-medium ${
                        goal.done
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      {goal.status}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Danh hiệu học tập</span>
                </h3>
                <Link
                  href="/leaderboard"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-3">
                {MOCK_ACHIEVEMENTS.slice(0, 3).map((ach) => {
                  const unlocked = isAchievementUnlocked(ach.criterion_type, ach.criterion_threshold);
                  return (
                    <div
                      key={ach.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                        unlocked
                          ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/70"
                          : "bg-[var(--bg-subtle)] border-[var(--border)] opacity-75"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          unlocked
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                            : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${unlocked ? "fill-current" : ""}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {ach.title}
                        </h5>
                        <p className="text-[11px] text-[var(--text-secondary)] truncate">
                          {ach.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded shrink-0">
                        {unlocked ? "Đã đạt" : `+${ach.xp_bonus} XP`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
