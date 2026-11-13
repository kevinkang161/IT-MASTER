"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
  ArrowRight,
  RotateCcw,
  Zap,
  Code2,
  Bookmark,
  ChevronRight,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CodeViewer } from "@/components/ui/code-viewer";
import { useAuth } from "@/lib/auth/auth-context";
import { MOCK_QUESTIONS, MOCK_GRADES } from "@/lib/mock-data";
import { Question, QuestionDifficulty, QuestionType } from "@/types/database";

export default function PracticePage() {
  const { addXp } = useAuth();

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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-7">
        {/* HEADER & SCORE COUNTER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tabular-nums">
              Ôn luyện tương tác
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Luyện tập theo chuyên đề & Chuẩn đề thi 2025
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Kiểm tra tức thì, giải thích chi tiết từng bước, tích lũy điểm kinh nghiệm XP.
            </p>
          </div>

          {/* Quick Session Stats */}
          <div className="flex items-center gap-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-swiss text-xs font-mono">
            <div>
              <span className="text-slate-400">Đã làm: </span>
              <strong className="text-slate-900 dark:text-slate-100 tabular-nums">{scoreStats.answered}</strong>
            </div>
            <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-slate-400">Đúng: </span>
              <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">{scoreStats.correct}</strong>
            </div>
            <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="tabular-nums">+{scoreStats.xpEarned} XP</span>
            </div>
          </div>
        </div>

        {/* SWISS FILTERS GRID */}
        <div className="p-4 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-swiss grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Grade filter */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Khối lớp
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value === "all" ? "all" : Number(e.target.value));
                setCurrentIndex(0);
              }}
              className="w-full text-xs font-medium p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Tất cả khối lớp (10, 11, 12)</option>
              <option value={10}>Lớp 10 (Python & Phần cứng)</option>
              <option value={11}>Lớp 11 (SQL & Hệ điều hành)</option>
              <option value={12}>Lớp 12 (AI, HTML/CSS, Mạng)</option>
            </select>
          </div>

          {/* Difficulty filter */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Mức độ nhận thức
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full text-xs font-medium p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Mọi độ khó</option>
              <option value="nhan_biet">Nhận biết</option>
              <option value="thong_hieu">Thông hiểu</option>
              <option value="van_dung">Vận dụng</option>
              <option value="van_dung_cao">Vận dụng cao</option>
            </select>
          </div>

          {/* Question Type filter */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Định dạng câu hỏi
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full text-xs font-medium p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Tất cả định dạng</option>
              <option value="single_choice">Trắc nghiệm 4 lựa chọn</option>
              <option value="true_false">Đúng / Sai 4 ý (Chuẩn 2025)</option>
              <option value="short_answer">Trả lời ngắn</option>
            </select>
          </div>
        </div>

        {/* QUESTION DISPLAY CARD */}
        {currentQ ? (
          <article className="p-6 sm:p-8 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-swiss space-y-6">
            {/* Question Top Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-800 dark:text-indigo-300 tabular-nums uppercase">
                  Câu {currentIndex + 1} / {filteredQuestions.length}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                  Khối Lớp {currentQ.grade_id}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                  {currentQ.difficulty === "nhan_biet"
                    ? "Nhận biết"
                    : currentQ.difficulty === "thong_hieu"
                    ? "Thông hiểu"
                    : "Vận dụng"}
                </span>
              </div>

              <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
                {currentQ.question_type === "single_choice"
                  ? "Chọn 1 phương án đúng"
                  : currentQ.question_type === "true_false"
                  ? "Đúng / Sai 4 ý"
                  : "Nhập câu trả lời ngắn"}
              </span>
            </div>

            {/* Question Content */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                {currentQ.content}
              </p>

              {currentQ.code_snippet && (
                <CodeViewer code={currentQ.code_snippet} language="python" />
              )}
            </div>

            {/* OPTIONS RENDERING BASED ON TYPE */}
            {/* 1. Single Choice */}
            {currentQ.question_type === "single_choice" && currentQ.options && (
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optionStyles =
                    "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700";

                  if (isAnswerSubmitted) {
                    if (opt.is_correct) {
                      optionStyles =
                        "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-medium";
                    } else if (isSelected && !opt.is_correct) {
                      optionStyles =
                        "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 line-through";
                    } else {
                      optionStyles = "opacity-50 border-slate-200 dark:border-slate-800";
                    }
                  } else if (isSelected) {
                    optionStyles =
                      "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-slate-900 dark:text-white font-medium";
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3.5 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 cursor-pointer transition select-none ${optionStyles}`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 transition ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{opt.content}</span>
                      </div>

                      {isAnswerSubmitted && opt.is_correct && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isAnswerSubmitted && isSelected && !opt.is_correct && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. True / False Swiss Table Matrix */}
            {currentQ.question_type === "true_false" && currentQ.options && (
              <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="grid grid-cols-12 bg-slate-100/80 dark:bg-slate-850 px-4 py-2 text-[11px] font-mono uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <div className="col-span-8 sm:col-span-9">Nội dung khẳng định</div>
                  <div className="col-span-4 sm:col-span-3 text-center grid grid-cols-2">
                    <span>Đúng</span>
                    <span>Sai</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {currentQ.options.map((opt) => {
                    const currentSelection = trueFalseSelections[opt.id];
                    const isEvaluated = isAnswerSubmitted;
                    const isCorrectAnswer = opt.is_correct;
                    const userGotItRight = currentSelection === isCorrectAnswer;

                    return (
                      <div
                        key={opt.id}
                        className={`grid grid-cols-12 items-center p-3 sm:p-4 text-xs sm:text-sm transition gap-2 ${
                          isEvaluated
                            ? userGotItRight
                              ? "bg-emerald-50/40 dark:bg-emerald-950/20"
                              : "bg-rose-50/40 dark:bg-rose-950/20"
                            : "hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                        }`}
                      >
                        <div className="col-span-8 sm:col-span-9 text-slate-800 dark:text-slate-200 leading-relaxed pr-2">
                          {opt.content}
                        </div>

                        <div className="col-span-4 sm:col-span-3 grid grid-cols-2 gap-1.5 justify-center">
                          <button
                            type="button"
                            disabled={isAnswerSubmitted}
                            onClick={() => handleTrueFalseToggle(opt.id, true)}
                            className={`py-1.5 rounded text-xs font-mono font-bold transition border ${
                              currentSelection === true
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                          >
                            Đúng
                          </button>
                          <button
                            type="button"
                            disabled={isAnswerSubmitted}
                            onClick={() => handleTrueFalseToggle(opt.id, false)}
                            className={`py-1.5 rounded text-xs font-mono font-bold transition border ${
                              currentSelection === false
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
            )}

            {/* 3. Short Answer */}
            {currentQ.question_type === "short_answer" && (
              <div className="space-y-3 pt-2 max-w-md">
                <label className="block text-xs font-mono font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Nhập câu trả lời của bạn:
                </label>
                <input
                  type="text"
                  value={shortAnswerInput}
                  onChange={(e) => setShortAnswerInput(e.target.value)}
                  disabled={isAnswerSubmitted}
                  placeholder="Nhập số hoặc chuỗi kết quả..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                {isAnswerSubmitted && (
                  <div className="text-xs font-mono pt-1 text-slate-600 dark:text-slate-400">
                    Đáp án được chấp nhận:{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {currentQ.accepted_answers?.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                +10 XP cho câu trả lời đúng • +2 XP động viên
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm"
                  >
                    Kiểm tra kết quả
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm"
                  >
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>

            {/* EXPLANATION ACCORDION (SHOWN AFTER SUBMISSION) */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 sm:p-5 rounded-xl border text-xs sm:text-sm space-y-2 ${
                  isCorrectResult
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-200"
                    : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-200"
                }`}
              >
                <div className="flex items-center gap-2 font-bold font-mono">
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
                <p className="leading-relaxed text-slate-700 dark:text-slate-300 font-sans pl-6">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </article>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Không có câu hỏi theo bộ lọc này
            </h3>
            <p className="text-xs text-slate-500">Vui lòng điều chỉnh lại tiêu chí khối lớp hoặc độ khó.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
