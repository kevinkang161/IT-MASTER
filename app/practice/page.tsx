"use client";

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CodeViewer } from "@/components/ui/code-viewer";
import { useAuth } from "@/lib/auth/auth-context";
import { recordQuestionPracticed } from "@/lib/progress";
import { MOCK_QUESTIONS } from "@/lib/mock-data";
import { DIFFICULTY_LABELS, getCodeLanguage } from "@/lib/exam-grading";
import { Question } from "@/types/database";

export default function PracticePage() {
  const { user, addXp } = useAuth();

  const [selectedGrade, setSelectedGrade] = useState<number | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [shortAnswerInput, setShortAnswerInput] = useState<string>("");
  const [trueFalseSelections, setTrueFalseSelections] = useState<Record<string, boolean>>({});

  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrectResult, setIsCorrectResult] = useState<boolean | null>(null);

  const [scoreStats, setScoreStats] = useState({
    answered: 0,
    correct: 0,
    xpEarned: 0,
  });

  const filteredQuestions = useMemo(() => {
    return MOCK_QUESTIONS.filter((q) => {
      const matchGrade = selectedGrade === "all" || q.grade_id === selectedGrade;
      const matchDiff = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
      const matchType = selectedType === "all" || q.question_type === selectedType;
      return matchGrade && matchDiff && matchType;
    });
  }, [selectedGrade, selectedDifficulty, selectedType]);

  const currentQ: Question | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  const resetQuestionState = () => {
    setCurrentIndex(0);
    setIsAnswerSubmitted(false);
    setIsCorrectResult(null);
    setSelectedOptionId("");
    setShortAnswerInput("");
    setTrueFalseSelections({});
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleTrueFalseToggle = (optId: string, val: boolean) => {
    if (isAnswerSubmitted) return;
    setTrueFalseSelections((prev) => ({
      ...prev,
      [optId]: val,
    }));
  };

  const handleSubmitAnswer = () => {
    if (!currentQ || isAnswerSubmitted) return;

    let correct = false;

    if (currentQ.question_type === "single_choice") {
      const opt = currentQ.options?.find((o) => o.id === selectedOptionId);
      correct = !!opt?.is_correct;
    } else if (currentQ.question_type === "short_answer") {
      const cleanInput = shortAnswerInput.trim().toLowerCase();
      correct = !!currentQ.accepted_answers?.some((ans) => ans.trim().toLowerCase() === cleanInput);
    } else if (currentQ.question_type === "true_false") {
      correct = currentQ.options?.every((opt) => trueFalseSelections[opt.id] === opt.is_correct) ?? false;
    }

    setIsCorrectResult(correct);
    setIsAnswerSubmitted(true);

    const xp = correct ? 10 : 2;
    addXp(xp, `Luyện tập câu hỏi: ${currentQ.id}`);
    recordQuestionPracticed(user?.id, correct);

    setScoreStats((prev) => ({
      answered: prev.answered + 1,
      correct: correct ? prev.correct + 1 : prev.correct,
      xpEarned: prev.xpEarned + xp,
    }));
  };

  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false);
    setIsCorrectResult(null);
    setSelectedOptionId("");
    setShortAnswerInput("");
    setTrueFalseSelections({});

    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* HEADER & SCORE COUNTER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border)]">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Ôn luyện tương tác
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Luyện tập theo chuyên đề
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Kiểm tra đáp án tức thì, xem lời giải chi tiết và tích lũy điểm XP.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-lg text-xs font-mono">
            <div>
              <span className="text-[var(--text-muted)]">Đã làm: </span>
              <strong className="text-[var(--text-primary)] tabular-nums">{scoreStats.answered}</strong>
            </div>
            <div className="w-px h-3.5 bg-[var(--border)]" />
            <div>
              <span className="text-[var(--text-muted)]">Đúng: </span>
              <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">{scoreStats.correct}</strong>
            </div>
            <div className="w-px h-3.5 bg-[var(--border)]" />
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="tabular-nums">+{scoreStats.xpEarned} XP</span>
            </div>
          </div>
        </div>

        {/* FILTERS GRID */}
        <div className="p-4 hallmark-surface grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Khối lớp
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value === "all" ? "all" : Number(e.target.value));
                resetQuestionState();
              }}
              className="w-full text-xs sm:text-sm p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">Tất cả khối lớp (10, 11, 12)</option>
              <option value={10}>Lớp 10 (Python &amp; Phần cứng)</option>
              <option value={11}>Lớp 11 (SQL &amp; Hệ điều hành)</option>
              <option value={12}>Lớp 12 (AI, HTML/CSS, Mạng)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Mức độ nhận thức
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                resetQuestionState();
              }}
              className="w-full text-xs sm:text-sm p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">Mọi độ khó</option>
              <option value="nhan_biet">Nhận biết</option>
              <option value="thong_hieu">Thông hiểu</option>
              <option value="van_dung">Vận dụng</option>
              <option value="van_dung_cao">Vận dụng cao</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Định dạng câu hỏi
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                resetQuestionState();
              }}
              className="w-full text-xs sm:text-sm p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">Tất cả định dạng</option>
              <option value="single_choice">Trắc nghiệm 4 lựa chọn</option>
              <option value="true_false">Đúng / Sai 4 ý</option>
              <option value="short_answer">Trả lời ngắn</option>
            </select>
          </div>
        </div>

        {/* QUESTION DISPLAY CARD */}
        {currentQ ? (
          <article className="p-6 sm:p-8 hallmark-surface space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-[var(--text-primary)] text-[var(--bg)] tabular-nums">
                  Câu {currentIndex + 1} / {filteredQuestions.length}
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5 rounded">
                  Lớp {currentQ.grade_id}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] border border-[var(--border)] px-2 py-0.5 rounded">
                  {DIFFICULTY_LABELS[currentQ.difficulty]}
                </span>
              </div>

              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {currentQ.question_type === "single_choice"
                  ? "Chọn 1 phương án đúng"
                  : currentQ.question_type === "true_false"
                  ? "Đúng / Sai 4 ý"
                  : "Nhập câu trả lời ngắn"}
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-base sm:text-lg font-medium text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                {currentQ.content}
              </p>

              {currentQ.code_snippet && (
                <CodeViewer code={currentQ.code_snippet} language={getCodeLanguage(currentQ)} />
              )}
            </div>

            {/* 1. Single Choice */}
            {currentQ.question_type === "single_choice" && currentQ.options && (
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optionStyles =
                    "bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]";

                  if (isAnswerSubmitted) {
                    if (opt.is_correct) {
                      optionStyles =
                        "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-medium";
                    } else if (isSelected && !opt.is_correct) {
                      optionStyles =
                        "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 line-through";
                    } else {
                      optionStyles = "opacity-50 border-[var(--border)]";
                    }
                  } else if (isSelected) {
                    optionStyles =
                      "bg-[var(--accent-subtle)] border-blue-600 dark:border-blue-500 text-[var(--text-primary)] font-medium";
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 cursor-pointer disabled:cursor-default transition-colors select-none ${optionStyles}`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{opt.content}</span>
                      </div>

                      {isAnswerSubmitted && opt.is_correct && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswerSubmitted && isSelected && !opt.is_correct && (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. True / False Matrix */}
            {currentQ.question_type === "true_false" && currentQ.options && (
              <div className="overflow-hidden border border-[var(--border)] rounded-lg">
                <div className="grid grid-cols-12 bg-[var(--bg-subtle)] px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] border-b border-[var(--border)]">
                  <div className="col-span-8 sm:col-span-9">Nội dung khẳng định</div>
                  <div className="col-span-4 sm:col-span-3 text-center grid grid-cols-2">
                    <span>Đúng</span>
                    <span>Sai</span>
                  </div>
                </div>

                <div className="divide-y divide-[var(--border)]">
                  {currentQ.options.map((opt) => {
                    const currentSelection = trueFalseSelections[opt.id];
                    const isEvaluated = isAnswerSubmitted;
                    const userGotItRight = currentSelection === opt.is_correct;

                    return (
                      <div
                        key={opt.id}
                        className={`grid grid-cols-12 items-center p-3 sm:p-4 text-xs sm:text-sm transition-colors gap-2 ${
                          isEvaluated
                            ? userGotItRight
                              ? "bg-emerald-50/40 dark:bg-emerald-950/20"
                              : "bg-rose-50/40 dark:bg-rose-950/20"
                            : "hover:bg-[var(--bg-subtle)]/50"
                        }`}
                      >
                        <div className="col-span-8 sm:col-span-9 text-[var(--text-primary)] leading-relaxed pr-2">
                          {opt.content}
                        </div>

                        <div className="col-span-4 sm:col-span-3 grid grid-cols-2 gap-1.5 justify-center">
                          <button
                            type="button"
                            disabled={isAnswerSubmitted}
                            onClick={() => handleTrueFalseToggle(opt.id, true)}
                            className={`py-1.5 rounded text-xs font-semibold transition-colors border cursor-pointer disabled:cursor-default ${
                              currentSelection === true
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                          >
                            Đúng
                          </button>
                          <button
                            type="button"
                            disabled={isAnswerSubmitted}
                            onClick={() => handleTrueFalseToggle(opt.id, false)}
                            className={`py-1.5 rounded text-xs font-semibold transition-colors border cursor-pointer disabled:cursor-default ${
                              currentSelection === false
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
            )}

            {/* 3. Short Answer */}
            {currentQ.question_type === "short_answer" && (
              <div className="space-y-2.5 pt-2 max-w-md">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">
                  Nhập câu trả lời của bạn:
                </label>
                <input
                  type="text"
                  value={shortAnswerInput}
                  onChange={(e) => setShortAnswerInput(e.target.value)}
                  disabled={isAnswerSubmitted}
                  placeholder="Nhập số hoặc chuỗi kết quả..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-primary)] font-mono text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                />
                {isAnswerSubmitted && (
                  <div className="text-xs font-mono pt-1 text-[var(--text-secondary)]">
                    Đáp án được chấp nhận:{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {currentQ.accepted_answers?.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
              <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
                +10 XP khi trả lời đúng · +2 XP động viên
              </span>

              <div className="flex items-center gap-2 ml-auto">
                {!isAnswerSubmitted ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={
                      currentQ.question_type === "single_choice"
                        ? !selectedOptionId
                        : currentQ.question_type === "short_answer"
                        ? !shortAnswerInput.trim()
                        : Object.keys(trueFalseSelections).length < (currentQ.options?.length || 0)
                    }
                  >
                    Kiểm tra kết quả
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handleNextQuestion}>
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* EXPLANATION */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 sm:p-5 rounded-lg border text-xs sm:text-sm space-y-2 ${
                  isCorrectResult
                    ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200"
                    : "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {isCorrectResult ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Chính xác (+10 XP)</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Chưa chính xác (+2 XP) — Lời giải chi tiết:</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed text-[var(--text-secondary)] pl-6">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </article>
        ) : (
          <div className="p-12 text-center hallmark-surface space-y-3">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Không có câu hỏi theo bộ lọc này
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Vui lòng điều chỉnh lại tiêu chí khối lớp hoặc độ khó.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedGrade("all");
                setSelectedDifficulty("all");
                setSelectedType("all");
                resetQuestionState();
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
