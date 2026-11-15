"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Timer,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
  FileQuestion,
  Award,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { isExamUnlockedForUser } from "@/lib/trial-limits";
import { MOCK_EXAMS, MOCK_GRADES } from "@/lib/mock-data";

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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* HEADER */}
        <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tabular-nums">
              Phòng thi trực tuyến
            </span>
            <span className="text-xs font-mono text-slate-400">Chuẩn ma trận Bộ GD&ĐT 2025</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Đề thi thử Tốt nghiệp THPT & Đánh giá định kỳ Tin học
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Hệ thống phòng thi chuẩn hóa với bố cục 2 cột Swiss Grid, bảng câu hỏi trắc nghiệm nhiều lựa chọn, bảng Đúng/Sai 4 ý, đồng hồ đếm ngược JetBrains Mono và tự động chấm điểm tức thì.
          </p>
        </div>

        {/* GRADE TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedGrade("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap border ${
              selectedGrade === "all"
                ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            Tất cả các đề thi
          </button>
          {MOCK_GRADES.map((grade) => (
            <button
              key={grade.id}
              onClick={() => setSelectedGrade(grade.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap border ${
                selectedGrade === grade.id
                  ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                  : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
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
            return (
              <div
                key={exam.id}
                className={`bg-white dark:bg-[#0f172a] border rounded-xl p-5 shadow-swiss hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-4 ${
                  !isUnlocked ? "border-amber-300/80 dark:border-amber-900/60" : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                      Lớp {exam.grade_id}
                    </span>
                    {!isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        <Lock className="w-3 h-3" />
                        Khóa học thử
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 tabular-nums">
                        <Timer className="w-3.5 h-3.5 text-amber-500" />
                        <span>{exam.duration_minutes} phút</span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {exam.title}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Số câu hỏi</span>
                      <strong className="text-slate-900 dark:text-slate-100 tabular-nums">
                        {exam.total_questions} câu
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Thang điểm</span>
                      <strong className="text-slate-900 dark:text-slate-100 tabular-nums">
                        {exam.max_score} điểm
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      +{exam.xp_reward} XP
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400">Giải thích chi tiết</span>
                  </div>

                  <Link href={`/exams/${exam.slug}`} className="block w-full pt-1">
                    {!isUnlocked ? (
                      <Button variant="outline" className="w-full border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold text-xs py-2 rounded-lg justify-between group">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Mở khóa với tài khoản thật</span>
                        </span>
                        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm py-2 rounded-lg">
                        <span>Vào phòng thi ngay</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* EXAM RULES NOTE */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2.5 shadow-swiss">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Quy chế và hướng dẫn phòng thi trực tuyến:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            <li>Đồng hồ đếm ngược kích hoạt ngay khi mở đề thi và dừng khi hoàn thành.</li>
            <li>Thanh bên phải luôn hiển thị trực quan số câu đã làm, chưa làm và đánh dấu xem lại.</li>
            <li>Thí sinh có thể chuyển nhanh đến bất kỳ câu hỏi nào bằng cách nhấp vào ô số tương ứng.</li>
            <li>Khi hết thời gian hoặc bấm nộp bài, hệ thống sẽ tự động đối chiếu đáp án chuẩn và phân tích ma trận kết quả.</li>
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
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120]">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-500 font-mono text-xs">
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
