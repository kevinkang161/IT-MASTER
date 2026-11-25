"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Timer,
  Zap,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { isExamUnlockedForUser } from "@/lib/trial-limits";
import { MOCK_EXAMS, MOCK_GRADES } from "@/lib/mock-data";
import { getQuestionsForExam } from "@/lib/exam-grading";

function ExamsContent() {
  const { isDemo } = useAuth();
  const searchParams = useSearchParams();
  const gradeParam = searchParams.get("grade");

  const [selectedGrade, setSelectedGrade] = useState<number | "all">(() => {
    if (gradeParam && (gradeParam === "10" || gradeParam === "11" || gradeParam === "12")) {
      return Number(gradeParam);
    }
    return "all";
  });

  useEffect(() => {
    const g = searchParams.get("grade");
    if (g && (g === "10" || g === "11" || g === "12")) {
      setSelectedGrade(Number(g));
    } else if (!g) {
      setSelectedGrade("all");
    }
  }, [searchParams]);

  const filteredExams = MOCK_EXAMS.filter((exam) => {
    return selectedGrade === "all" || exam.grade_id === selectedGrade;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] font-sans transition-colors">
      <Navbar />

      <main className="flex-1 hallmark-container w-full py-8 sm:py-10 space-y-8">
        {/* HEADER */}
        <div className="space-y-2 pb-5 border-b border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <span>Phòng thi trực tuyến</span>
            <span>·</span>
            <span>Chuẩn ma trận Bộ GD&amp;ĐT 2025</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Đề thi thử Tốt nghiệp THPT &amp; Kiểm tra định kỳ
          </h1>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm max-w-3xl leading-relaxed">
            Phòng thi có đồng hồ đếm ngược 45 phút, bảng điều hướng câu hỏi theo trạng thái và tự động chấm điểm kèm giải thích chi tiết ngay sau khi nộp bài.
          </p>
        </div>

        {/* GRADE TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedGrade("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap border cursor-pointer ${
              selectedGrade === "all"
                ? "bg-blue-600 text-white border-blue-600 font-semibold"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
            }`}
          >
            Tất cả đề thi
          </button>
          {MOCK_GRADES.map((grade) => (
            <button
              type="button"
              key={grade.id}
              onClick={() => setSelectedGrade(grade.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap border cursor-pointer ${
                selectedGrade === grade.id
                  ? "bg-blue-600 text-white border-blue-600 font-semibold"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
              }`}
            >
              Đề thi Khối {grade.id}
            </button>
          ))}
        </div>

        {/* EXAMS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const isUnlocked = isExamUnlockedForUser(exam.slug, isDemo);
            const questionCount = getQuestionsForExam(exam).length;

            return (
              <div
                key={exam.id}
                className={`hallmark-surface hallmark-surface-hover p-5 flex flex-col justify-between space-y-4 ${
                  !isUnlocked ? "border-amber-300 dark:border-amber-800/80" : ""
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="font-mono">
                      Lớp {exam.grade_id}
                    </Badge>
                    {!isUnlocked ? (
                      <Badge variant="warning">
                        <Lock className="w-3 h-3" />
                        <span>Khóa học thử</span>
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] tabular-nums">
                        <Timer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{exam.duration_minutes} phút</span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                    {exam.title}
                  </h2>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono">
                    <div>
                      <span className="text-[var(--text-muted)] block text-[11px] font-sans">Số câu hỏi</span>
                      <strong className="text-[var(--text-primary)] tabular-nums">
                        {questionCount} câu
                      </strong>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block text-[11px] font-sans">Thang điểm</span>
                      <strong className="text-[var(--text-primary)] tabular-nums">
                        {exam.max_score} điểm
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono flex items-center gap-1 tabular-nums">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      +{exam.xp_reward} XP
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Có lời giải chi tiết
                    </span>
                  </div>

                  <Link href={`/exams/${exam.slug}`} className="block w-full pt-1">
                    {!isUnlocked ? (
                      <Button
                        variant="outline"
                        className="w-full border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold text-xs justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Mở khóa với tài khoản thật</span>
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button className="w-full font-semibold text-xs sm:text-sm">
                        <span>Vào phòng thi</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* EXAM RULES NOTE */}
        <div className="p-5 hallmark-surface text-xs sm:text-sm text-[var(--text-secondary)] space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Hướng dẫn phòng thi trực tuyến</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-xs leading-relaxed">
            <li>Đồng hồ đếm ngược bắt đầu ngay khi mở đề thi và tự động nộp bài khi hết giờ.</li>
            <li>Lưới câu hỏi bên phải hiển thị trạng thái đã làm, chưa làm và câu đánh dấu xem lại.</li>
            <li>Bạn có thể nhấn vào từng ô số để chuyển nhanh tới bất kỳ câu hỏi nào.</li>
            <li>Sau khi nộp bài, hệ thống chấm điểm theo thang 10 và hiển thị đáp án kèm giải thích.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ExamsListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[var(--bg)]">
          <Navbar />
          <main className="flex-1 hallmark-container w-full py-16 text-center text-sm text-[var(--text-muted)]">
            Đang tải dữ liệu phòng thi...
          </main>
          <Footer />
        </div>
      }
    >
      <ExamsContent />
    </Suspense>
  );
}
