"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  HelpCircle,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeViewer } from "@/components/ui/code-viewer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { formatTime } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { MOCK_EXAMS, MOCK_QUESTIONS } from "@/lib/mock-data";
import { Question } from "@/types/database";

export default function ExamRoomPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { addXp } = useAuth();

  const exam = MOCK_EXAMS.find((e) => e.slug === slug) || MOCK_EXAMS[0];
  const questions: Question[] = MOCK_QUESTIONS;

  const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string>(questions[0]?.id || "");

  // User answers state
  // Single choice: { [qId]: optionId }
  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({});
  // True False: { [qId]: { [optId]: boolean } }
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<string, boolean>>>({});
  // Short answer: { [qId]: string }
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  // Marked for review flags: { [qId]: boolean }
  const [reviewFlags, setReviewFlags] = useState<Record<string, boolean>>({});

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Track which question is answering
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

  // Jump to question smoothly
  const scrollToQuestion = (id: string) => {
    setActiveQuestionId(id);
    const element = document.getElementById(`q-${id}`);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Grade calculation following 2025 Ministry guidelines
  const handleFinishExam = () => {
    setShowConfirmModal(false);
    setIsSubmitted(true);

    let rawScore = 0;
    const basePerQuestion = exam.max_score / questions.length;

    questions.forEach((q) => {
      if (q.question_type === "single_choice") {
        const selected = singleAnswers[q.id];
        const opt = q.options?.find((o) => o.id === selected);
        if (opt?.is_correct) {
          rawScore += basePerQuestion;
        }
      } else if (q.question_type === "short_answer") {
        const val = shortAnswers[q.id]?.trim().toLowerCase();
        if (q.accepted_answers?.some((ans) => ans.trim().toLowerCase() === val)) {
          rawScore += basePerQuestion;
        }
      } else if (q.question_type === "true_false") {
        const userTf = tfAnswers[q.id] || {};
        let subCorrect = 0;
        q.options?.forEach((opt) => {
          if (userTf[opt.id] === opt.is_correct) {
            subCorrect += 1;
          }
        });
        // Ministry 2025 partial credit rules for 4 statements
        if (subCorrect === 1) rawScore += basePerQuestion * 0.1;
        else if (subCorrect === 2) rawScore += basePerQuestion * 0.25;
        else if (subCorrect === 3) rawScore += basePerQuestion * 0.5;
        else if (subCorrect === 4) rawScore += basePerQuestion * 1.0;
      }
    });

    const finalScore = Number(Math.min(exam.max_score, rawScore).toFixed(2));
    const xpReward = Math.round(exam.xp_reward * (finalScore / exam.max_score));
    addXp(xpReward, `Hoàn thành bài thi: ${exam.title} (${finalScore}/${exam.max_score} điểm)`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Results evaluation for detailed review
  const results = useMemo(() => {
    if (!isSubmitted) return null;

    let correctTotal = 0;
    let rawScore = 0;
    const basePerQuestion = exam.max_score / questions.length;

    questions.forEach((q) => {
      if (q.question_type === "single_choice") {
        const selected = singleAnswers[q.id];
        const opt = q.options?.find((o) => o.id === selected);
        if (opt?.is_correct) {
          correctTotal += 1;
          rawScore += basePerQuestion;
        }
      } else if (q.question_type === "short_answer") {
        const val = shortAnswers[q.id]?.trim().toLowerCase();
        if (q.accepted_answers?.some((ans) => ans.trim().toLowerCase() === val)) {
          correctTotal += 1;
          rawScore += basePerQuestion;
        }
      } else if (q.question_type === "true_false") {
        const userTf = tfAnswers[q.id] || {};
        let subCorrect = 0;
        q.options?.forEach((opt) => {
          if (userTf[opt.id] === opt.is_correct) {
            subCorrect += 1;
          }
        });
        if (subCorrect === 4) {
          correctTotal += 1;
          rawScore += basePerQuestion;
        } else if (subCorrect === 3) rawScore += basePerQuestion * 0.5;
        else if (subCorrect === 2) rawScore += basePerQuestion * 0.25;
        else if (subCorrect === 1) rawScore += basePerQuestion * 0.1;
      }
    });

    const finalScore = Number(Math.min(exam.max_score, rawScore).toFixed(2));
    const accuracy = Math.round((correctTotal / questions.length) * 100);
    const timeSpent = exam.duration_minutes * 60 - timeLeft;

    return {
      score: finalScore,
      correct: correctTotal,
      incorrect: questions.length - correctTotal,
      accuracy,
      timeSpent,
    };
  }, [isSubmitted, questions, singleAnswers, tfAnswers, shortAnswers, exam, timeLeft]);

  // Group questions by parts
  const singleChoiceQuestions = questions.filter((q) => q.question_type === "single_choice");
  const trueFalseQuestions = questions.filter((q) => q.question_type === "true_false");
  const shortAnswerQuestions = questions.filter((q) => q.question_type === "short_answer");

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* SWISS TOP BAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Exam info */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/exams"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition shrink-0"
              title="Quay lại danh sách đề thi"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tabular-nums">
                  Khối {exam.grade_id}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Thang điểm {exam.max_score} • {questions.length} câu
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {exam.title}
              </h1>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />

            {!isSubmitted ? (
              <>
                {/* Mobile timer pill */}
                <div
                  className={`lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold tabular-nums border ${
                    timeLeft < 300
                      ? "bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800 animate-pulse"
                      : "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>

                <Button
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 rounded-lg shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Nộp bài</span>
                </Button>
              </>
            ) : (
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Đã nộp bài
              </span>
            )}
          </div>
        </div>
      </header>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center border border-amber-200 dark:border-amber-800 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Xác nhận nộp bài thi?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Thời gian còn: {formatTime(timeLeft)}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Số câu đã trả lời:</span>
                <strong className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
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

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Khi bấm xác nhận, bài thi sẽ được chấm điểm ngay và kết quả được lưu vào học bạ cá nhân của bạn.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Tiếp tục làm bài
              </Button>
              <Button
                size="sm"
                onClick={handleFinishExam}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Nộp bài ngay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EXAM VIEWPORT */}
      {!isSubmitted ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN: QUESTION FEED (8 COLS) */}
            <div className="lg:col-span-8 space-y-8">
              {/* PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN */}
              {singleChoiceQuestions.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-mono">
                        Phần I: Câu trắc nghiệm nhiều phương án lựa chọn
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Thí sinh trả lời từ câu 1 đến câu {singleChoiceQuestions.length}. Mỗi câu hỏi chỉ chọn một phương án.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {singleChoiceQuestions.length} câu
                    </span>
                  </div>

                  <div className="space-y-6">
                    {singleChoiceQuestions.map((q, idx) => {
                      const isFlagged = reviewFlags[q.id];
                      const selectedOptId = singleAnswers[q.id];

                      return (
                        <article
                          key={q.id}
                          id={`q-${q.id}`}
                          className={`p-5 sm:p-6 rounded-xl border transition-colors bg-white dark:bg-[#0f172a] shadow-swiss ${
                            activeQuestionId === q.id
                              ? "border-indigo-400 dark:border-indigo-600 ring-1 ring-indigo-400 dark:ring-indigo-600"
                              : "border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          {/* Metabar */}
                          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-800 dark:text-indigo-300 tabular-nums uppercase">
                                Câu {idx + 1}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                                {q.difficulty === "nhan_biet"
                                  ? "Nhận biết"
                                  : q.difficulty === "thong_hieu"
                                  ? "Thông hiểu"
                                  : "Vận dụng"}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setReviewFlags((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id],
                                }))
                              }
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition border ${
                                isFlagged
                                  ? "bg-amber-500 border-amber-600 text-white"
                                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              <Flag className={`w-3 h-3 ${isFlagged ? "fill-white" : ""}`} />
                              <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu"}</span>
                            </button>
                          </div>

                          {/* Content */}
                          <div className="py-4 space-y-3">
                            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                              {q.content}
                            </p>

                            {q.code_snippet && (
                              <CodeViewer code={q.code_snippet} language="python" />
                            )}
                          </div>

                          {/* Options grid */}
                          <div className="space-y-2.5 pt-1">
                            {q.options?.map((opt, optIdx) => {
                              const letter = String.fromCharCode(65 + optIdx);
                              const isSelected = selectedOptId === opt.id;

                              return (
                                <div
                                  key={opt.id}
                                  onClick={() =>
                                    setSingleAnswers((prev) => ({
                                      ...prev,
                                      [q.id]: opt.id,
                                    }))
                                  }
                                  className={`p-3.5 rounded-lg border text-xs sm:text-sm flex items-start gap-3 cursor-pointer transition select-none ${
                                    isSelected
                                      ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-slate-900 dark:text-white font-medium"
                                      : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850"
                                  }`}
                                >
                                  <span
                                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 transition ${
                                      isSelected
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                    }`}
                                  >
                                    {letter}
                                  </span>
                                  <span className="pt-0.5 leading-relaxed">{opt.content}</span>
                                </div>
                              );
                            })}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (4 Ý) */}
              {trueFalseQuestions.length > 0 && (
                <section className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-mono">
                        Phần II: Câu trắc nghiệm Đúng / Sai (Mẫu mới Bộ GD&ĐT 2025)
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Thí sinh trả lời cho từng ý a, b, c, d. Trong mỗi ý, hãy chọn tính chất là Đúng hoặc Sai.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {trueFalseQuestions.length} câu
                    </span>
                  </div>

                  <div className="space-y-6">
                    {trueFalseQuestions.map((q, idx) => {
                      const isFlagged = reviewFlags[q.id];
                      const qUserTf = tfAnswers[q.id] || {};
                      const absoluteIndex = singleChoiceQuestions.length + idx + 1;

                      return (
                        <article
                          key={q.id}
                          id={`q-${q.id}`}
                          className={`p-5 sm:p-6 rounded-xl border transition-colors bg-white dark:bg-[#0f172a] shadow-swiss ${
                            activeQuestionId === q.id
                              ? "border-indigo-400 dark:border-indigo-600 ring-1 ring-indigo-400 dark:ring-indigo-600"
                              : "border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          {/* Metabar */}
                          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-800 dark:text-indigo-300 tabular-nums uppercase">
                                Câu {absoluteIndex}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                                Đúng / Sai 4 ý
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setReviewFlags((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id],
                                }))
                              }
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition border ${
                                isFlagged
                                  ? "bg-amber-500 border-amber-600 text-white"
                                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              <Flag className={`w-3 h-3 ${isFlagged ? "fill-white" : ""}`} />
                              <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu"}</span>
                            </button>
                          </div>

                          {/* Content */}
                          <div className="py-4 space-y-3">
                            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                              {q.content}
                            </p>

                            {q.code_snippet && (
                              <CodeViewer code={q.code_snippet} language="python" />
                            )}
                          </div>

                          {/* SWISS TRUE/FALSE TABLE MATRIX */}
                          <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg">
                            <div className="grid grid-cols-12 bg-slate-100/80 dark:bg-slate-850 px-4 py-2 text-[11px] font-mono uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                              <div className="col-span-8 sm:col-span-9">Nội dung khẳng định</div>
                              <div className="col-span-4 sm:col-span-3 text-center grid grid-cols-2">
                                <span>Đúng</span>
                                <span>Sai</span>
                              </div>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                              {q.options?.map((opt) => {
                                const val = qUserTf[opt.id];

                                return (
                                  <div
                                    key={opt.id}
                                    className="grid grid-cols-12 items-center p-3 sm:p-4 text-xs sm:text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition gap-2"
                                  >
                                    <div className="col-span-8 sm:col-span-9 text-slate-800 dark:text-slate-200 leading-relaxed pr-2">
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
                                        className={`py-1.5 rounded text-xs font-mono font-bold transition border ${
                                          val === true
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                                        className={`py-1.5 rounded text-xs font-mono font-bold transition border ${
                                          val === false
                                            ? "bg-slate-700 dark:bg-slate-600 text-white border-slate-700 dark:border-slate-600 shadow-sm"
                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                <section className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-mono">
                        Phần III: Câu trắc nghiệm trả lời ngắn
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Thí sinh giải bài toán và nhập trực tiếp giá trị số hoặc chuỗi kết quả vào ô trả lời.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {shortAnswerQuestions.length} câu
                    </span>
                  </div>

                  <div className="space-y-6">
                    {shortAnswerQuestions.map((q, idx) => {
                      const isFlagged = reviewFlags[q.id];
                      const absoluteIndex =
                        singleChoiceQuestions.length + trueFalseQuestions.length + idx + 1;

                      return (
                        <article
                          key={q.id}
                          id={`q-${q.id}`}
                          className={`p-5 sm:p-6 rounded-xl border transition-colors bg-white dark:bg-[#0f172a] shadow-swiss ${
                            activeQuestionId === q.id
                              ? "border-indigo-400 dark:border-indigo-600 ring-1 ring-indigo-400 dark:ring-indigo-600"
                              : "border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          {/* Metabar */}
                          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-800 dark:text-indigo-300 tabular-nums uppercase">
                                Câu {absoluteIndex}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                                Trả lời ngắn
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setReviewFlags((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id],
                                }))
                              }
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition border ${
                                isFlagged
                                  ? "bg-amber-500 border-amber-600 text-white"
                                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              <Flag className={`w-3 h-3 ${isFlagged ? "fill-white" : ""}`} />
                              <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu"}</span>
                            </button>
                          </div>

                          {/* Content */}
                          <div className="py-4 space-y-3">
                            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                              {q.content}
                            </p>

                            {q.code_snippet && (
                              <CodeViewer code={q.code_snippet} language="python" />
                            )}
                          </div>

                          {/* Short answer input */}
                          <div className="space-y-2 pt-1 max-w-sm">
                            <label className="block text-xs font-mono font-semibold uppercase text-slate-500 dark:text-slate-400">
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
                              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY HUD SIDEBAR (4 COLS) */}
            <aside className="lg:col-span-4 sticky top-20 space-y-4">
              {/* CARD 1: TIMER HUD */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-swiss space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Thời gian làm bài
                  </span>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                    {Math.round((answeredCount / questions.length) * 100)}% hoàn thành
                  </span>
                </div>

                {/* Digital countdown clock */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                    timeLeft < 300
                      ? "bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800"
                      : "bg-slate-50 text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Timer className={`w-5 h-5 ${timeLeft < 300 ? "animate-pulse" : "text-indigo-600 dark:text-indigo-400"}`} />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Còn lại</span>
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-bold tabular-nums tracking-wider">
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60">
                    <span className="block font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {answeredCount}
                    </span>
                    <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-medium">Đã làm</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="block font-mono text-xs font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                      {unansweredCount}
                    </span>
                    <span className="text-[10px] text-slate-500">Chưa làm</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/60">
                    <span className="block font-mono text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {flaggedCount}
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">Đánh dấu</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: SWISS QUESTION MATRIX */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-swiss space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Lưới chuyển nhanh câu hỏi
                  </h3>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {questions.length} ô
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isAns = isQuestionAnswered(q);
                    const isFlag = reviewFlags[q.id];
                    const isActive = activeQuestionId === q.id;

                    let stateClass =
                      "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400";

                    if (isAns) {
                      stateClass = "bg-indigo-600 text-white border-indigo-600 font-bold";
                    }
                    if (isFlag) {
                      stateClass = "bg-amber-500 text-white border-amber-500 font-bold";
                    }
                    if (isActive) {
                      stateClass += " ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#0B1120]";
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => scrollToQuestion(q.id)}
                        className={`h-9 rounded-lg border text-xs font-mono font-bold tabular-nums transition flex items-center justify-center relative ${stateClass}`}
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

                {/* Swiss Legend */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-600 shrink-0" />
                    <span>Đã chọn đáp án ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shrink-0" />
                    <span>Chưa làm ({unansweredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0" />
                    <span>Đánh dấu cần xem lại ({flaggedCount})</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: SUBMIT ACTION */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-swiss space-y-3">
                <Button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-sm text-sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>Nộp bài thi ngay</span>
                </Button>
                <p className="text-[11px] text-slate-500 text-center">
                  Hệ thống tự động chấm điểm và lập tức phân tích chi tiết.
                </p>
              </div>
            </aside>
          </div>
        </main>
      ) : (
        /* POST-EXAM RESULTS SCREEN */
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* Result card */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-swiss text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                Bảng điểm tổng hợp
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {results?.score} <span className="text-xl text-slate-400 font-normal">/ {exam.max_score} điểm</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {results?.score! >= exam.pass_score
                  ? "Xuất sắc! Bạn đã đạt yêu cầu chuẩn đầu ra của kỳ thi thử này."
                  : "Bạn cần tiếp tục rèn luyện thêm các chủ đề chưa đạt điểm tối đa."}
              </p>
            </div>

            {/* Swiss KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-left">
                <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">Số câu đúng</span>
                <strong className="text-lg font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {results?.correct} <span className="text-xs font-sans text-slate-400 font-normal">câu</span>
                </strong>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-left">
                <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">Số câu sai</span>
                <strong className="text-lg font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                  {results?.incorrect} <span className="text-xs font-sans text-slate-400 font-normal">câu</span>
                </strong>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-left">
                <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">Tỷ lệ chính xác</span>
                <strong className="text-lg font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {results?.accuracy}%
                </strong>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-left">
                <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">Thời gian làm</span>
                <strong className="text-lg font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                  {formatTime(results?.timeSpent || 0)}
                </strong>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setTimeLeft(exam.duration_minutes * 60);
                  setSingleAnswers({});
                  setTfAnswers({});
                  setShortAnswers({});
                  setReviewFlags({});
                }}
                className="border-slate-200 dark:border-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                <span>Làm lại đề này</span>
              </Button>
              <Link href="/exams">
                <Button variant="outline" className="border-slate-200 dark:border-slate-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Danh sách đề thi</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <span>Về Bảng học tập</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* DETAILED ANSWER KEY & EXPLANATIONS */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Đáp án đối chiếu & Lời giải chi tiết
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
                  isFullCorrect = q.accepted_answers?.some(
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
                  userSummaryText = `Đúng ${count}/${q.options?.length || 4} ý`;
                }

                return (
                  <div
                    key={q.id}
                    className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-swiss space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-800 dark:text-indigo-300 tabular-nums">
                          Câu {idx + 1}
                        </span>
                        <span className="text-xs text-slate-500">
                          {q.question_type === "single_choice"
                            ? "Trắc nghiệm 4 lựa chọn"
                            : q.question_type === "true_false"
                            ? "Đúng / Sai 4 ý"
                            : "Trả lời ngắn"}
                        </span>
                      </div>

                      {isFullCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Chính xác</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                          <XCircle className="w-4 h-4" />
                          <span>Chưa chính xác</span>
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                      {q.content}
                    </p>

                    {q.code_snippet && (
                      <CodeViewer code={q.code_snippet} language="python" />
                    )}

                    {/* True/False specific review */}
                    {q.question_type === "true_false" && (
                      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
                        {q.options?.map((opt) => {
                          const userVal = tfAnswers[q.id]?.[opt.id];
                          const isSubCorrect = userVal === opt.is_correct;

                          return (
                            <div
                              key={opt.id}
                              className="p-3 border-b last:border-b-0 border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
                            >
                              <span className="text-slate-700 dark:text-slate-300 flex-1">
                                {opt.content}
                              </span>
                              <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                                <span>
                                  Bạn chọn:{" "}
                                  <strong className={isSubCorrect ? "text-emerald-600" : "text-rose-600"}>
                                    {userVal === true ? "Đúng" : userVal === false ? "Sai" : "Chưa chọn"}
                                  </strong>
                                </span>
                                <span className="text-slate-400">|</span>
                                <span>
                                  Đáp án:{" "}
                                  <strong className="text-emerald-600">
                                    {opt.is_correct ? "Đúng" : "Sai"}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Single choice & short answer summary */}
                    {q.question_type !== "true_false" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-slate-500 block">Lựa chọn của bạn:</span>
                          <span className={isFullCorrect ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                            {userSummaryText}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Đáp án chính xác:</span>
                          <span className="text-emerald-600 font-bold">{correctSummaryText}</span>
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        <strong className="font-mono text-indigo-700 dark:text-indigo-400 block uppercase">
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
    </div>
  );
}
