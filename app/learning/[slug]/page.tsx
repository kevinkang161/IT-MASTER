"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  HelpCircle,
  Bookmark,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CodeViewer } from "@/components/ui/code-viewer";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getUserProgress,
  recordLessonCompleted,
  toggleLessonSaved,
} from "@/lib/progress";
import { MOCK_LESSONS, MOCK_QUESTIONS, MOCK_EXAMS } from "@/lib/mock-data";
import { isLessonUnlockedForUser } from "@/lib/trial-limits";
import { DemoLockedCard } from "@/components/auth/demo-trial-banner";

export default function SingleLessonPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user, isDemo, addXp } = useAuth();

  const lesson = MOCK_LESSONS.find((l) => l.slug === slug);
  const isUnlocked = isLessonUnlockedForUser(slug, isDemo);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Sync completion & saved state from localStorage for the active user/lesson
  useEffect(() => {
    if (!lesson) return;
    const progress = getUserProgress(user?.id);
    setIsCompleted(progress.completedLessons.includes(lesson.slug));
    setIsSaved(progress.savedLessons.includes(lesson.slug));
    setQuizAnswer(null);
    setQuizSubmitted(false);
  }, [user?.id, lesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors">
        <Navbar />
        <main className="flex-1 hallmark-container w-full py-16">
          <div className="max-w-lg mx-auto hallmark-surface p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-muted)] mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Không tìm thấy bài học
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Bài học bạn yêu cầu không tồn tại hoặc đã được di chuyển.
            </p>
            <Link href="/learning" className="inline-block">
              <Button size="sm">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại thư viện bài học</span>
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors">
        <Navbar />
        <main className="flex-1 hallmark-container w-full py-12">
          <DemoLockedCard itemType="bài học" redirectUrl={`/learning/${slug}`} />
        </main>
        <Footer />
      </div>
    );
  }

  const sampleQuestion =
    MOCK_QUESTIONS.find((q) => q.grade_id === lesson.grade_id && q.question_type === "single_choice") ||
    MOCK_QUESTIONS.find((q) => q.question_type === "single_choice") ||
    MOCK_QUESTIONS[0];

  const matchingExam =
    MOCK_EXAMS.find((e) => e.grade_id === lesson.grade_id) || MOCK_EXAMS[0];

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      addXp(lesson.xp_reward, `Hoàn thành bài học: ${lesson.title}`);
      recordLessonCompleted(user?.id, lesson.slug);
    }
  };

  const handleToggleSaved = () => {
    const updated = toggleLessonSaved(user?.id, lesson.slug);
    setIsSaved(updated.savedLessons.includes(lesson.slug));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors">
      <Navbar />

      <main className="flex-1 hallmark-container w-full py-8 space-y-8">
        {/* BREADCRUMB & SAVE */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/learning"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại thư viện bài học</span>
          </Link>

          <button
            type="button"
            onClick={handleToggleSaved}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              isSaved
                ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">{isSaved ? "Đã lưu bài" : "Lưu bài học"}</span>
          </button>
        </div>

        {/* LESSON HEADER */}
        <div className="hallmark-surface p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" className="font-mono">
              Khối Lớp {lesson.grade_id}
            </Badge>
            <Badge
              variant={
                lesson.difficulty === "co_ban"
                  ? "success"
                  : lesson.difficulty === "trung_binh"
                  ? "warning"
                  : "danger"
              }
            >
              {lesson.difficulty === "co_ban"
                ? "Cơ bản"
                : lesson.difficulty === "trung_binh"
                ? "Trung bình"
                : "Nâng cao"}
            </Badge>
            <Badge variant="default">Chuẩn SGK Kết nối tri thức</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight leading-snug">
            {lesson.title}
          </h1>

          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
            {lesson.introduction}
          </p>

          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-mono tabular-nums">
                <Clock className="w-4 h-4" />
                <span>Ước tính ~{lesson.estimated_minutes} phút</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                <Zap className="w-4 h-4 fill-current" />
                <span>+{lesson.xp_reward} XP</span>
              </div>
            </div>

            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã hoàn thành</span>
              </span>
            ) : (
              <Button size="sm" onClick={handleCompleteLesson}>
                <CheckCircle2 className="w-4 h-4" />
                <span>Đánh dấu hoàn thành</span>
              </Button>
            )}
          </div>
        </div>

        {/* 2-COL READING LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* MAIN ARTICLE (3 COLS) */}
          <div className="lg:col-span-3 space-y-8">
            {/* LEARNING OBJECTIVES */}
            <div className="p-5 sm:p-6 rounded-xl bg-[var(--accent-subtle)] border border-blue-200 dark:border-blue-900/70 space-y-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Mục tiêu bài học
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                {lesson.learning_objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* MAIN LESSON CONTENT */}
            <article className="hallmark-surface p-6 sm:p-8 space-y-6 text-[var(--text-primary)] leading-relaxed text-sm sm:text-base">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
                  Nội dung bài học
                </h2>
                <div className="whitespace-pre-line text-[var(--text-secondary)] leading-relaxed">
                  {lesson.content_markdown}
                </div>
              </div>

              {lesson.code_snippets && lesson.code_snippets.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    Mã nguồn minh họa
                  </h3>
                  {lesson.code_snippets.map((snip, idx) => (
                    <CodeViewer
                      key={idx}
                      code={snip.code}
                      language={snip.language}
                      caption={snip.caption}
                    />
                  ))}
                </div>
              )}
            </article>

            {/* QUICK PRACTICE QUESTION */}
            {sampleQuestion && sampleQuestion.options && sampleQuestion.options.length > 0 && (
              <Card className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-[var(--accent-subtle)] text-blue-600 dark:text-blue-400">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Câu hỏi kiểm tra nhanh
                  </h3>
                </div>

                <div className="space-y-4">
                  <p className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                    {sampleQuestion.content}
                  </p>

                  <div className="space-y-2">
                    {sampleQuestion.options.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-3.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors ${
                          quizAnswer === opt.id
                            ? "bg-[var(--accent-subtle)] border-blue-600 dark:border-blue-500 text-[var(--text-primary)] font-semibold"
                            : "bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="quickQuiz"
                            value={opt.id}
                            checked={quizAnswer === opt.id}
                            onChange={() => setQuizAnswer(opt.id)}
                            disabled={quizSubmitted}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                          />
                          <span>{opt.content}</span>
                        </div>

                        {quizSubmitted && opt.is_correct && (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Đáp án đúng
                          </span>
                        )}
                      </label>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <Button
                      size="sm"
                      disabled={!quizAnswer}
                      onClick={() => {
                        setQuizSubmitted(true);
                        const isCorrect = sampleQuestion.options?.find((o) => o.id === quizAnswer)?.is_correct;
                        if (isCorrect) {
                          addXp(10, "Làm đúng câu hỏi kiểm tra nhanh bài học");
                        }
                      }}
                    >
                      Kiểm tra đáp án
                    </Button>
                  ) : (
                    <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] space-y-1.5 text-xs sm:text-sm">
                      <div className="font-bold text-[var(--text-primary)]">Giải thích chi tiết:</div>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {sampleQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* BOTTOM LESSON ACTIONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
              <Link href="/learning">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Danh mục bài học</span>
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                {!isCompleted && (
                  <Button size="sm" onClick={handleCompleteLesson}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hoàn thành (+{lesson.xp_reward} XP)</span>
                  </Button>
                )}
                <Link href="/practice">
                  <Button variant="secondary" size="sm">
                    <span>Luyện thêm bài tập</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* SIDEBAR NAVIGATION (1 COL) */}
          <div className="space-y-6">
            <Card className="p-5">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-3">
                Bài học cùng Khối {lesson.grade_id}
              </h4>
              <div className="space-y-2 text-xs">
                {MOCK_LESSONS.filter((l) => l.grade_id === lesson.grade_id).map((l) => (
                  <Link
                    key={l.id}
                    href={`/learning/${l.slug}`}
                    className={`block p-2.5 rounded-lg transition-colors border ${
                      l.slug === lesson.slug
                        ? "bg-[var(--accent-subtle)] text-blue-700 dark:text-blue-300 font-semibold border-blue-200 dark:border-blue-800"
                        : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="line-clamp-2">{l.title}</div>
                    <div className="text-[11px] font-mono text-[var(--text-muted)] mt-1 tabular-nums">
                      ~{l.estimated_minutes} phút · +{l.xp_reward} XP
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                Kiểm tra Khối {matchingExam.grade_id}
              </span>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                {matchingExam.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Làm đề thi thử bấm giờ {matchingExam.duration_minutes} phút để kiểm tra mức độ ghi nhớ kiến thức.
              </p>
              <Link href={`/exams/${matchingExam.slug}`} className="block pt-1">
                <Button size="sm" className="w-full text-xs">
                  <span>Vào thi ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
