"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CodeViewer } from "@/components/ui/code-viewer";
import { MOCK_GRADES, MOCK_CHAPTERS, MOCK_LESSONS, TEXTBOOK_SUMMARIES } from "@/lib/mock-data";

function LearningContent() {
  const searchParams = useSearchParams();
  const gradeParam = searchParams.get("grade");

  const [selectedGrade, setSelectedGrade] = useState<number | "all">(() => {
    if (gradeParam && (gradeParam === "10" || gradeParam === "11" || gradeParam === "12")) {
      return Number(gradeParam);
    }
    return "all";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"lessons" | "summaries">("lessons");

  useEffect(() => {
    const g = searchParams.get("grade");
    if (g && (g === "10" || g === "11" || g === "12")) {
      setSelectedGrade(Number(g));
    } else if (!g) {
      setSelectedGrade("all");
    }
  }, [searchParams]);

  const filteredLessons = useMemo(() => {
    return MOCK_LESSONS.filter((lesson) => {
      const matchGrade = selectedGrade === "all" || lesson.grade_id === selectedGrade;
      const matchSearch =
        searchQuery.trim() === "" ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.introduction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.content_markdown.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGrade && matchSearch;
    });
  }, [selectedGrade, searchQuery]);

  const filteredSummaries = useMemo(() => {
    return TEXTBOOK_SUMMARIES.filter((sum) => {
      return selectedGrade === "all" || sum.gradeId === selectedGrade;
    }).map((sum) => ({
      ...sum,
      themes: sum.themes.filter((th) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          th.themeTitle.toLowerCase().includes(q) ||
          th.description.toLowerCase().includes(q) ||
          th.content.toLowerCase().includes(q)
        );
      }),
    })).filter((sum) => sum.themes.length > 0);
  }, [selectedGrade, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* HEADER SECTION */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge variant="primary">Chương trình chuẩn Bộ GD&ĐT 2026–2027</Badge>
            <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-semibold">
              <button
                onClick={() => setViewMode("lessons")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === "lessons"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Thư viện bài học ({filteredLessons.length})</span>
              </button>
              <button
                onClick={() => setViewMode("summaries")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === "summaries"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Sổ tay tóm tắt SGK KNTT</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {viewMode === "lessons" ? "Thư Viện Bài Học Tin Học THPT" : "Sổ Tay Tóm Tắt Trọng Tâm SGK Kết Nối Tri Thức"}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            {viewMode === "lessons"
              ? "Hệ thống 16 bài học chuẩn mực được biên soạn từ sách giáo khoa Kết nối tri thức Lớp 10, 11 và 12. Tích lũy kiến thức lý thuyết, mã nguồn mẫu và làm bài trắc nghiệm kiểm tra nhận điểm XP."
              : "Toàn bộ kiến thức cô đọng của 34 bài Lớp 10, 31 bài Lớp 11 (Phần chung, CS, ICT) và 30 bài Lớp 12 theo khung ma trận thi tốt nghiệp THPT Quốc gia 2025+."}
          </p>
        </div>

        {/* CONTROLS: GRADE TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Grade selection tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedGrade("all")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                selectedGrade === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Tất cả các khối
            </button>
            {MOCK_GRADES.map((grade) => (
              <button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  selectedGrade === grade.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {grade.name}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chủ đề, bài học..."
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* VIEW 1: LESSONS GRID */}
        {viewMode === "lessons" ? (
          filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between bg-white"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-700">
                        Lớp {lesson.grade_id}
                      </span>
                      <Badge
                        variant={
                          lesson.difficulty === "co_ban"
                            ? "success"
                            : lesson.difficulty === "trung_binh"
                            ? "warning"
                            : "danger"
                        }
                        className="text-[10px]"
                      >
                        {lesson.difficulty === "co_ban"
                          ? "Cơ bản"
                          : lesson.difficulty === "trung_binh"
                          ? "Trung bình"
                          : "Nâng cao"}
                      </Badge>
                    </div>
                    <CardTitle className="text-base sm:text-lg text-slate-900 line-clamp-2">
                      {lesson.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mt-2">
                      {lesson.introduction}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>~{lesson.estimated_minutes} phút</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-emerald-600">
                        <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                        <span>+{lesson.xp_reward} XP</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Link href={`/learning/${lesson.slug}`} className="w-full">
                      <Button variant="outline" className="w-full justify-between group">
                        <span>Bắt đầu đọc bài</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Không tìm thấy bài học phù hợp</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Không có bài học nào khớp với từ khóa &ldquo;{searchQuery}&rdquo; trong khối lớp đã chọn.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedGrade("all");
                  setSearchQuery("");
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          )
        ) : (
          /* VIEW 2: TEXTBOOK SUMMARIES */
          <div className="space-y-10">
            {filteredSummaries.length > 0 ? (
              filteredSummaries.map((summary) => (
                <div key={summary.gradeId} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                        {summary.gradeName} — {summary.bookSeries}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Hệ thống {summary.totalLessons} bài học chuẩn ma trận kiến thức GDPT mới
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      Khối {summary.gradeId}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {summary.themes.map((theme) => (
                      <Card key={theme.id} className="p-6 sm:p-8 bg-white border-slate-200 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                              {theme.lessonsRange}
                            </span>
                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                              {theme.themeTitle}
                            </h3>
                          </div>
                          <Link href={`/practice`}>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold text-blue-600">
                              <span>Luyện câu hỏi chủ đề này</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>

                        {/* Content text */}
                        <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
                          {theme.content}
                        </div>

                        {/* Comparison Table if exists */}
                        {theme.table && (
                          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left text-xs sm:text-sm">
                              <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                                <tr>
                                  {theme.table.headers.map((h, idx) => (
                                    <th key={idx} className="p-3">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 bg-white">
                                {theme.table.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-50">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="p-3 text-slate-700 font-medium">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Code snippet if exists */}
                        {theme.codeSnippet && (
                          <div className="mt-4">
                            <CodeViewer
                              code={theme.codeSnippet.code}
                              language={theme.codeSnippet.language}
                              caption={theme.codeSnippet.caption}
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Không tìm thấy chủ đề tóm tắt phù hợp</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Vui lòng điều chỉnh lại bộ lọc khối lớp hoặc từ khóa tìm kiếm.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedGrade("all");
                    setSearchQuery("");
                  }}
                >
                  Xem toàn bộ sổ tay
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function LearningLibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-500">
            Đang tải thư viện bài học Tin học...
          </main>
          <Footer />
        </div>
      }
    >
      <LearningContent />
    </Suspense>
  );
}
