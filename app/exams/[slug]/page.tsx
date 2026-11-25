"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Timer,
  CheckCircle2,
  XCircle,
  Flag,
  ArrowLeft,
  AlertTriangle,
  Award,
  RotateCcw,
  BookOpen,
  Send,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeViewer } from "@/components/ui/code-viewer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Footer } from "@/components/layout/footer";
import { formatTime } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { recordExamSubmitted } from "@/lib/progress";
import { MOCK_EXAMS } from "@/lib/mock-data";
import { Question } from "@/types/database";
import {
  getQuestionsForExam,
  gradeExam,
  GradeExamResult,
  DIFFICULTY_LABELS,
  getCodeLanguage,
} from "@/lib/exam-grading";
import { isExamUnlockedForUser } from "@/lib/trial-limits";
import { DemoLockedCard } from "@/components/auth/demo-trial-banner";

export default function ExamRoomPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user, isDemo, addXp } = useAuth();

  const exam = MOCK_EXAMS.find((e) => e.slug === slug);
  const isUnlocked = isExamUnlockedForUser(slug, isDemo);

  const questions: Question[] = useMemo(() => {
    if (!exam) return [];
    return getQuestionsForExam(exam);
  }, [exam]);

  const [timeLeft, setTimeLeft] = useState((exam?.duration_minutes || 45) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string>("");
  const [serverResult, setServerResult] = useState<GradeExamResult | null>(null);

  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<string, boolean>>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [reviewFlags, setReviewFlags] = useState<Record<string, boolean>>({});

  const hasSubmittedRef = useRef(false);

  // Reset exam state when switching exam slug
  useEffect(() => {
    if (!exam) return;
    setTimeLeft(exam.duration_minutes * 60);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setShowConfirmModal(false);
    setServerResult(null);
    setSingleAnswers({});
    setTfAnswers({});
    setShortAnswers({});
    setReviewFlags({});
    setActiveQuestionId(questions[0]?.id || "");
    hasSubmittedRef.current = false;
  }, [exam, questions]);

  // Countdown tick (only decrements state; auto-submit handled in separate effect with fresh state)
  useEffect(() => {
    if (!exam || !isUnlocked || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [exam, isUnlocked, isSubmitted]);

  const isQuestionAnswered = (q: Question): boolean => {
    if (q.question_type === "single_choice") {
      return !!singleAnswers[q.id];
    }
    if (q.question_type === "short_answer") {
      return !!shortAnswers[q.id]?.trim();
    }
    if (q.question_type === "true_false") {
      const answers = tfAnswers[q.id] || {};
      const requiredCount = q.options?.length || 4;
      return Object.keys(answers).length === requiredCount;
    }
    return false;
  };

  const answeredCount = useMemo(() => {
    return questions.filter(isQuestionAnswered).length;
  }, [questions, singleAnswers, tfAnswers, shortAnswers]);

  const flaggedCount = useMemo(() => {
    return Object.values(reviewFlags).filter(Boolean).length;
  }, [reviewFlags]);

  const unansweredCount = questions.length - answeredCount;

  const scrollToQuestion = (id: string) => {
    setActiveQuestionId(id);
    const element = document.getElementById(`q-${id}`);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleFinishExam = useCallback(async () => {
    if (!exam || hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    setShowConfirmModal(false);
    setIsSubmitting(true);

    const timeSpentSeconds = Math.max(0, exam.duration_minutes * 60 - timeLeft);

    let graded: GradeExamResult | null = null;
    try {
      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          singleAnswers,
          tfAnswers,
          shortAnswers,
          timeSpentSeconds,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success) {
          graded = data as GradeExamResult;
        }
      }
    } catch (_) {
      // Fallback to identical client grading formula if API unreachable
    }

    if (!graded) {
      graded = gradeExam({
        exam,
        questions,
        singleAnswers,
        tfAnswers,
        shortAnswers,
        timeSpentSeconds,
      });
    }

    setServerResult(graded);
    setIsSubmitted(true);
    setIsSubmitting(false);

    addXp(graded.xpEarned, `Hoàn thành bài thi: ${exam.title} (${graded.score}/${graded.maxScore} điểm)`);
    recordExamSubmitted(user?.id, {
      examId: exam.id,
      examTitle: exam.title,
      score: graded.score,
      maxScore: graded.maxScore,
      accuracy: graded.accuracy,
      date: new Date().toLocaleDateString("vi-VN"),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [exam, timeLeft, singleAnswers, tfAnswers, shortAnswers, questions, addXp, user?.id]);

  // Trigger automatic submission with fresh state when countdown reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted && !hasSubmittedRef.current && exam && isUnlocked) {
      handleFinishExam();
    }
  }, [timeLeft, isSubmitted, exam, isUnlocked, handleFinishExam]);

  const handleRetryExam = () => {
    if (!exam) return;
    hasSubmittedRef.current = false;
    setIsSubmitted(false);
    setServerResult(null);
    setTimeLeft(exam.duration_minutes * 60);
    setSingleAnswers({});
    setTfAnswers({});
    setShortAnswers({});
    setReviewFlags({});
    setActiveQuestionId(questions[0]?.id || "");
  };

  if (!exam) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
        <main className="flex-1 hallmark-container w-full py-20">
          <div className="max-w-lg mx-auto hallmark-surface p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-muted)] mx-auto flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Không tìm thấy đề thi
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Đề thi bạn yêu cầu không tồn tại hoặc đã bị gỡ khỏi hệ thống.
            </p>
            <Link href="/exams" className="inline-block">
              <Button size="sm">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách đề thi</span>
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
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex flex-col font-sans transition-colors p-4 sm:p-8">
        <div className="hallmark-container w-full mb-6 flex items-center justify-between">
          <Link
            href="/exams"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách phòng thi</span>
          </Link>
          <ThemeToggle />
        </div>
        <main className="flex-1 hallmark-container w-full">
          <DemoLockedCard itemType="đề thi" redirectUrl={`/exams/${slug}`} />
        </main>
      </div>
    );
  }

  const singleChoiceQuestions = questions.filter((q) => q.question_type === "single_choice");
  const trueFalseQuestions = questions.filter((q) => q.question_type === "true_false");
  const shortAnswerQuestions = questions.filter((q) => q.question_type === "short_answer");

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      {/* EXAM TOP BAR */}
      <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="hallmark-container h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/exams"
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors shrink-0"
              title="Quay lại danh sách đề thi"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 tabular-nums">
                  Khối {exam.grade_id}
                </span>
                <span className="text-xs text-[var(--text-muted)] hidden sm:inline font-mono tabular-nums">
                  Thang điểm {exam.max_score} · {questions.length} câu
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate">
                {exam.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />

            {!isSubmitted ? (
              <>
                <div
                  className={`lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold tabular-nums border ${
                    timeLeft < 300
                      ? "bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800 animate-pulse"
                      : "bg-[var(--bg-subtle)] text-[var(--text-primary)] border-[var(--border)]"
                  }`}
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>

                <Button
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmModal(true)}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Nộp bài</span>
                </Button>
              </>
            ) : (
              <span className="font-mono text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Đã nộp bài
              </span>
            )}
          </div>
        </div>
      </header>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center border border-amber-200 dark:border-amber-800 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Xác nhận nộp bài thi?
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
                  Thời gian còn lại: {formatTime(timeLeft)}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Số câu đã trả lời:</span>
                <strong className="font-mono tabular-nums text-blue-600 dark:text-blue-400">
                  {answeredCount} / {questions.length} câu
                </strong>
              </div>
              {unansweredCount > 0 && (
                <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                  <span>Câu chưa chọn đáp án:</span>
                  <span className="font-mono tabular-nums">{unansweredCount} câu</span>
                </div>
              )}
              {flaggedCount > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span>Câu đánh dấu xem lại:</span>
                  <span className="font-mono tabular-nums">{flaggedCount} câu</span>
                </div>
              )}
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Khi xác nhận, hệ thống sẽ chấm điểm ngay và lưu kết quả vào lịch sử học tập của bạn.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
              >
                Tiếp tục làm bài
              </Button>
              <Button
                size="sm"
                isLoading={isSubmitting}
                onClick={handleFinishExam}
              >
                Nộp bài ngay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EXAM VIEWPORT */}
      {!isSubmitted ? (
        <main className="flex-1 hallmark-container w-full py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN: QUESTIONS */}
            <div className="lg:col-span-8 space-y-8">
              {/* PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN */}
              {singleChoiceQuestions.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                    <div className="space-y-0.5">
                      <h2 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                        Phần I: Trắc nghiệm nhiều lựa chọn
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Trả lời từ câu 1 đến câu {singleChoiceQuestions.length}. Mỗi câu chọn một phương án đúng.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                      {singleChoiceQuestions.length} câu
                    </span>
                  </div>

                  <div className="space-y-5">
                    {singleChoiceQuestions.map((q, idx) => {
                      const isFlagged = reviewFlags[q.id];
                      const selectedOptId = singleAnswers[q.id];

                      return (
                        <article
                          key={q.id}
                          id={`q-${q.id}`}
                          onClick={() => setActiveQuestionId(q.id)}
                          className={`p-5 sm:p-6 rounded-xl border transition-colors bg-[var(--surface)] ${
                            activeQuestionId === q.id
                              ? "border-blue-600 dark:border-blue-500"
                              : "border-[var(--border)]"
                          }`}
                        >
                          <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--text-primary)] text-[var(--bg)] tabular-nums">
                                Câu {idx + 1}
                              </span>
                              <span className="text-[11px] text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5 rounded">
                                {DIFFICULTY_LABELS[q.difficulty]}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewFlags((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id],
                                }));
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border cursor-pointer ${
                                isFlagged
                                  ? "bg-amber-500 border-amber-600 text-white"
                                  : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              }`}
                            >
                              <Flag className={`w-3 h-3 ${isFlagged ? "fill-white" : ""}`} />
                              <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu"}</span>
                            </button>
                          </div>

                          <div className="py-4 space-y-3">
                            <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                              {q.content}
                            </p>

                            {q.code_snippet && (
                              <CodeViewer code={q.code_snippet} language={getCodeLanguage(q)} />
                            )}
                          </div>

                          <div className="space-y-2.5 pt-1">
                            {q.options?.map((opt, optIdx) => {
                              const letter = String.fromCharCode(65 + optIdx);
                              const isSelected = selectedOptId === opt.id;

                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() =>
                                    setSingleAnswers((prev) => ({
                                      ...prev,
                                      [q.id]: opt.id,
                                    }))
                                  }
                                  className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm flex items-start gap-3 cursor-pointer transition-colors select-none ${
                                    isSelected
                                      ? "bg-[var(--accent-subtle)] border-blue-600 dark:border-blue-500 text-[var(--text-primary)] font-medium"
                                      : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                  }`}
                                >
                                  <span
                                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${
                                      isSelected
                                        ? "bg-blue-600 text-white"
                                        : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
                                    }`}
                                  >
                                    {letter}
                                  </span>
                                  <span className="pt-0.5 leading-relaxed">{opt.content}</span>
                                </button>
                              );
                            })}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI */}
              {trueFalseQuestions.length > 0 && (
                <section className="space-y-4 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                    <div className="space-y-0.5">
                      <h2 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                        Phần II: Trắc nghiệm Đúng / Sai
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Trong mỗi ý a, b, c, d hãy chọn Đúng hoặc Sai.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                      {trueFalseQuestions.length} câu
                    </span>
                  </div>

                  <div className="space-y-5">
                    {trueFalseQuestions.map((q, idx) => {
                      const isFlagged = reviewFlags[q.id];
                      const qUserTf = tfAnswers[q.id] || {};
                      const absoluteIndex = singleChoiceQuestions.length + idx + 1;

                      return (
                        <article
                          key={q.id}
                          id={`q-${q.id}`}
                          onClick={() => setActiveQuestionId(q.id)}
                          className={`p-5 sm:p-6 rounded-xl border transition-colors bg-[var(--surface)] ${
                            activeQuestionId === q.id
                              ? "border-blue-600 dark:border-blue-500"
                              : "border-[var(--border)]"
                          }`}
                        >
                          <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--text-primary)] text-[var(--bg)] tabular-nums">
                                Câu {absoluteIndex}
                              </span>
                              <span className="text-[11px] text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5 rounded">
                                Đúng / Sai 4 ý
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewFlags((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id],
                                }));
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border cursor-pointer ${
                                isFlagged
                                  ? "bg-amber-500 border-amber-600 text-white"
                                  : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              }`}
                            >
                              <Flag className={`w-3 h-3 ${isFlagged ? "fill-white" : ""}`} />
                              <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu"}</span>
                            </button>
                          </div>

                          <div className="py-4 space-y-3">
                            <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                              {q.content}
                            </p>

                            {q.code_snippet && (
                              <CodeViewer code={q.code_snippet} language={getCodeLanguage(q)} />
                            )}
                          </div>

                          <div className="overflow-hidden border border-[var(--border)] rounded-lg">
                            <div className="grid grid-cols-12 bg-[var(--bg-subtle)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] border-b border-[var(--border)]">
                              <div className="col-span-8 sm:col-span-9">Nội dung khẳng định</div>
                              <div className="col-span-4 sm:col-span-3 text-center grid grid-cols-2">
                                <span>Đúng</span>
                                <span>Sai</span>
                              </div>
                            </div>

                            <div className="divide-y divide-[var(--border)]">
                              {q.options?.map((opt) => {
                                const val = qUserTf[opt.id];

                                return (
                                  <div
                                    key={opt.id}
                                    className="grid grid-cols-12 items-center p-3 sm:p-4 text-xs sm:text-sm hover:bg-[var(--bg-subtle)]/50 transition-colors gap-2"
                                  >
                                    <div className="col-span-8 sm:col-span-9 text-[var(--text-primary)] leading-relaxed pr-2">
                                      {opt.content}
                                    </div>
                                    <div className="col-span-4 sm:col-span-3 grid grid-cols-2 gap-1.5 justify-center">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setTfAnswers((prev) => ({
                                            ...prev,
                                            [q.id]: {
                                              ...(prev[q.id] || {}),
                                              [opt.id]: true,
                                            },
                                          }))
                                        }
                                        className={`py-1.5 rounded text-xs font-semibold transition-colors border cursor-pointer ${
                                          val === true
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        }`}
                                      >
                                        Đúng
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setTfAnswers((prev) => ({
                                            ...prev,
                                            [q.id]: {
                                              ...(prev[q.id] || {}),
                                              [opt.id]: false,
                                            },
                                          }))
                                        }
                                        className={`py-1.5 rounded text-xs font-semibold transition-colors border cursor-pointer ${
                                          val === false
                                            ? "bg-slate-700 dark:bg-slate-600 text-white border-slate-700 dark:border-slate-600"
                                            : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        }`}
                                      >
                                        Sai
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* PHẦN III: TRẢ LỜI NGẮN */}
              {shortAnswerQuestions.length > 0 && (
                <section className="space-y-4 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                    <div className="space-y-0.5">
                      <h2 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                        Phần III: Trả lời ngắn
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Giải bài toán và nhập trực tiếp giá trị số hoặc chuỗi kết quả vào ô bên dưới.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                      {shortAnswerQuestions.length} câu
                    </span>
                  </div>

                  <div className="space-y-5">
                    {shortAnswerQuestions.map((q, idx) => {
                      const isFlagged = reviewFlags[q.id];
                      const absoluteIndex =
                        singleChoiceQuestions.length + trueFalseQuestions.length + idx + 1;

                      return (
                        <article
                          key={q.id}
                          id={`q-${q.id}`}
                          onClick={() => setActiveQuestionId(q.id)}
                          className={`p-5 sm:p-6 rounded-xl border transition-colors bg-[var(--surface)] ${
                            activeQuestionId === q.id
                              ? "border-blue-600 dark:border-blue-500"
                              : "border-[var(--border)]"
                          }`}
                        >
                          <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--text-primary)] text-[var(--bg)] tabular-nums">
                                Câu {absoluteIndex}
                              </span>
                              <span className="text-[11px] text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5 rounded">
                                Trả lời ngắn
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewFlags((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id],
                                }));
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border cursor-pointer ${
                                isFlagged
                                  ? "bg-amber-500 border-amber-600 text-white"
                                  : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              }`}
                            >
                              <Flag className={`w-3 h-3 ${isFlagged ? "fill-white" : ""}`} />
                              <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu"}</span>
                            </button>
                          </div>

                          <div className="py-4 space-y-3">
                            <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                              {q.content}
                            </p>

                            {q.code_snippet && (
                              <CodeViewer code={q.code_snippet} language={getCodeLanguage(q)} />
                            )}
                          </div>

                          <div className="space-y-2 pt-1 max-w-sm">
                            <label className="block text-xs font-medium text-[var(--text-secondary)]">
                              Đáp án của bạn:
                            </label>
                            <input
                              type="text"
                              value={shortAnswers[q.id] || ""}
                              onChange={(e) =>
                                setShortAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: e.target.value,
                                }))
                              }
                              placeholder="Nhập số hoặc chuỗi kết quả..."
                              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-primary)] font-mono text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                            />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY HUD SIDEBAR */}
            <aside className="lg:col-span-4 sticky top-20 space-y-4">
              {/* TIMER HUD */}
              <div className="hallmark-surface p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">
                    Thời gian làm bài
                  </span>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                    {questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0}% hoàn thành
                  </span>
                </div>

                <div
                  className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${
                    timeLeft < 300
                      ? "bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800"
                      : "bg-[var(--bg-subtle)] text-[var(--text-primary)] border-[var(--border)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Timer className={`w-5 h-5 ${timeLeft < 300 ? "animate-pulse" : "text-blue-600 dark:text-blue-400"}`} />
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Còn lại</span>
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-bold tabular-nums tracking-wider">
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-[var(--accent-subtle)] border border-blue-200 dark:border-blue-900/60">
                    <span className="block font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      {answeredCount}
                    </span>
                    <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">Đã làm</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)]">
                    <span className="block font-mono text-xs font-bold text-[var(--text-secondary)] tabular-nums">
                      {unansweredCount}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">Chưa làm</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                    <span className="block font-mono text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {flaggedCount}
                    </span>
                    <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">Đánh dấu</span>
                  </div>
                </div>
              </div>

              {/* QUESTION MATRIX */}
              <div className="hallmark-surface p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    Chuyển nhanh câu hỏi
                  </h3>
                  <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                    {questions.length} câu
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isAns = isQuestionAnswered(q);
                    const isFlag = reviewFlags[q.id];
                    const isActive = activeQuestionId === q.id;

                    let stateClass =
                      "bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-muted)]";

                    if (isAns) {
                      stateClass = "bg-blue-600 text-white border-blue-600 font-bold";
                    }
                    if (isFlag) {
                      stateClass = "bg-amber-500 text-white border-amber-500 font-bold";
                    }
                    if (isActive) {
                      stateClass += " ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-[#111827]";
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => scrollToQuestion(q.id)}
                        className={`h-9 rounded-lg border text-xs font-mono font-semibold tabular-nums transition-colors flex items-center justify-center relative cursor-pointer ${stateClass}`}
                        title={`Chuyển tới câu ${idx + 1}`}
                      >
                        <span>{idx + 1}</span>
                        {isFlag && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 right-1" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-1.5 text-[11px] text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600 shrink-0" />
                    <span>Đã chọn đáp án ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded border border-[var(--border)] bg-[var(--bg)] shrink-0" />
                    <span>Chưa làm ({unansweredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0" />
                    <span>Đánh dấu xem lại ({flaggedCount})</span>
                  </div>
                </div>
              </div>

              {/* SUBMIT ACTION */}
              <div className="hallmark-surface p-5 space-y-3">
                <Button
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full font-semibold py-2.5 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Nộp bài thi</span>
                </Button>
                <p className="text-[11px] text-[var(--text-muted)] text-center">
                  Hệ thống tự động chấm điểm và hiển thị giải thích ngay sau khi nộp.
                </p>
              </div>
            </aside>
          </div>
        </main>
      ) : (
        /* POST-EXAM RESULTS SCREEN */
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          <div className="hallmark-surface p-6 sm:p-10 text-center space-y-6">
            <div className="w-14 h-14 rounded-xl bg-[var(--accent-subtle)] border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                Kết quả bài thi
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] font-mono tabular-nums">
                {serverResult?.score ?? 0}{" "}
                <span className="text-xl text-[var(--text-muted)] font-normal">
                  / {exam.max_score} điểm
                </span>
              </h2>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                {(serverResult?.score ?? 0) >= exam.pass_score
                  ? "Bạn đã đạt yêu cầu chuẩn đầu ra của bài thi thử này."
                  : "Bạn cần ôn tập thêm các chuyên đề chưa đạt điểm tối đa."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
              <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-left">
                <span className="text-[11px] text-[var(--text-muted)] block">Số câu đúng</span>
                <strong className="text-lg font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {serverResult?.correctCount ?? 0}{" "}
                  <span className="text-xs font-sans text-[var(--text-muted)] font-normal">câu</span>
                </strong>
              </div>
              <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-left">
                <span className="text-[11px] text-[var(--text-muted)] block">Chưa đạt tối đa</span>
                <strong className="text-lg font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                  {serverResult?.incorrectCount ?? 0}{" "}
                  <span className="text-xs font-sans text-[var(--text-muted)] font-normal">câu</span>
                </strong>
              </div>
              <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-left">
                <span className="text-[11px] text-[var(--text-muted)] block">Tỷ lệ đúng</span>
                <strong className="text-lg font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                  {serverResult?.accuracy ?? 0}%
                </strong>
              </div>
              <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-left">
                <span className="text-[11px] text-[var(--text-muted)] block">Thời gian làm</span>
                <strong className="text-lg font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                  {formatTime(serverResult?.timeSpentSeconds ?? 0)}
                </strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[var(--border)]">
              <Button variant="outline" onClick={handleRetryExam}>
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại đề này</span>
              </Button>
              <Link href="/exams">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Danh sách đề thi</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button>
                  <span>Về bảng học tập</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* DETAILED ANSWER KEY */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Đáp án đối chiếu &amp; Lời giải chi tiết
              </h3>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                let isFullCorrect = false;
                let userSummaryText = "";
                let correctSummaryText = "";

                if (q.question_type === "single_choice") {
                  const userOpt = q.options?.find((o) => o.id === singleAnswers[q.id]);
                  const correctOpt = q.options?.find((o) => o.is_correct);
                  isFullCorrect = !!userOpt?.is_correct;
                  userSummaryText = userOpt ? userOpt.content : "(Chưa chọn đáp án)";
                  correctSummaryText = correctOpt ? correctOpt.content : "";
                } else if (q.question_type === "short_answer") {
                  const userVal = shortAnswers[q.id]?.trim() || "";
                  isFullCorrect =
                    q.accepted_answers?.some(
                      (ans) => ans.trim().toLowerCase() === userVal.toLowerCase()
                    ) || false;
                  userSummaryText = userVal || "(Để trống)";
                  correctSummaryText = q.accepted_answers?.join(" hoặc ") || "";
                } else if (q.question_type === "true_false") {
                  const userTf = tfAnswers[q.id] || {};
                  let count = 0;
                  q.options?.forEach((opt) => {
                    if (userTf[opt.id] === opt.is_correct) count++;
                  });
                  isFullCorrect = count === (q.options?.length || 4);
                }

                return (
                  <div key={q.id} className="p-5 sm:p-6 hallmark-surface space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--text-primary)] text-[var(--bg)] tabular-nums">
                          Câu {idx + 1}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {q.question_type === "single_choice"
                            ? "Trắc nghiệm 4 lựa chọn"
                            : q.question_type === "true_false"
                            ? "Đúng / Sai 4 ý"
                            : "Trả lời ngắn"}
                        </span>
                      </div>

                      {isFullCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Chính xác</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                          <XCircle className="w-4 h-4" />
                          <span>Chưa chính xác</span>
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                      {q.content}
                    </p>

                    {q.code_snippet && (
                      <CodeViewer code={q.code_snippet} language={getCodeLanguage(q)} />
                    )}

                    {q.question_type === "true_false" && (
                      <div className="border border-[var(--border)] rounded-lg overflow-hidden text-xs">
                        {q.options?.map((opt) => {
                          const userVal = tfAnswers[q.id]?.[opt.id];
                          const isSubCorrect = userVal === opt.is_correct;

                          return (
                            <div
                              key={opt.id}
                              className="p-3 border-b last:border-b-0 border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <span className="text-[var(--text-secondary)] flex-1">
                                {opt.content}
                              </span>
                              <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                                <span>
                                  Bạn chọn:{" "}
                                  <strong className={isSubCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                                    {userVal === true ? "Đúng" : userVal === false ? "Sai" : "Chưa chọn"}
                                  </strong>
                                </span>
                                <span className="text-[var(--text-muted)]">|</span>
                                <span>
                                  Đáp án:{" "}
                                  <strong className="text-emerald-600 dark:text-emerald-400">
                                    {opt.is_correct ? "Đúng" : "Sai"}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.question_type !== "true_false" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)]">
                        <div>
                          <span className="text-[var(--text-muted)] block font-sans">Lựa chọn của bạn:</span>
                          <span className={isFullCorrect ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-rose-600 dark:text-rose-400 font-semibold"}>
                            {userSummaryText}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)] block font-sans">Đáp án đúng:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {correctSummaryText}
                          </span>
                        </div>
                      </div>
                    )}

                    {q.explanation && (
                      <div className="p-3.5 rounded-lg bg-[var(--accent-subtle)] border border-blue-200 dark:border-blue-900/60 text-xs text-[var(--text-secondary)] space-y-1">
                        <strong className="text-blue-700 dark:text-blue-300 block">
                          Lời giải chi tiết:
                        </strong>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {isSubmitted && <Footer />}
    </div>
  );
}
