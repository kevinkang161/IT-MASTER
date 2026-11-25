"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Search,
  Clock,
  Zap,
  ArrowRight,
  ChevronRight,
  Lock,
  Library,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CodeViewer } from "@/components/ui/code-viewer";
import { useAuth } from "@/lib/auth/auth-context";
import { isLessonUnlockedForUser } from "@/lib/trial-limits";
import { MOCK_GRADES, MOCK_LESSONS, TEXTBOOK_SUMMARIES } from "@/lib/mock-data";

function LearningContent() {
  const { isDemo } = useAuth();
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
    })
      .map((sum) => ({
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
      }))
      .filter((sum) => sum.themes.length > 0);
  }, [selectedGrade, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors">
      <Navbar />

      <main className="flex-1 hallmark-container w-full py-8 sm:py-10 space-y-8">
        {/* HEADER SECTION */}
        <div className="space-y-3 pb-6 border-b border-[var(--border)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Chương trình GDPT 2018 · SGK Kết nối tri thức
            </span>
            <div className="flex items-center gap-1 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("lessons")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "lessons"
                    ? "bg-blue-600 text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bài giảng chi tiết ({filteredLessons.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("summaries")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "summaries"
                    ? "bg-blue-600 text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Library className="w-3.5 h-3.5" />
                <span>Tóm tắt SGK</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {viewMode === "lessons"
              ? "Thư viện bài học Tin học THPT"
              : "Sổ tay tóm tắt trọng tâm SGK Kết nối tri thức"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm max-w-3xl leading-relaxed">
            {viewMode === "lessons"
              ? `Hệ thống ${MOCK_LESSONS.length} bài học trọng tâm được biên soạn theo sách giáo khoa Kết nối tri thức Lớp 10, 11 và 12, kèm mã nguồn minh họa và câu hỏi kiểm tra nhanh.`
              : "Tổng hợp kiến thức trọng tâm 34 bài Lớp 10, 31 bài Lớp 11 (Phần chung, CS, ICT) và 30 bài Lớp 12 theo định hướng ôn thi tốt nghiệp THPT."}
          </p>
        </div>

        {/* CONTROLS: GRADE TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 hallmark-surface p-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedGrade("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border ${
                selectedGrade === "all"
                  ? "bg-blue-600 text-white border-blue-600 font-semibold"
                  : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
              }`}
            >
              Tất cả các khối
            </button>
            {MOCK_GRADES.map((grade) => (
              <button
                type="button"
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border ${
                  selectedGrade === grade.id
                    ? "bg-blue-600 text-white border-blue-600 font-semibold"
                    : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
                }`}
              >
                {grade.name}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chủ đề, bài học..."
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
            />
          </div>
        </div>

        {/* VIEW 1: LESSONS GRID */}
        {viewMode === "lessons" ? (
          filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => {
                const isUnlocked = isLessonUnlockedForUser(lesson.slug, isDemo);
                return (
                  <Card
                    key={lesson.id}
                    className={`hallmark-surface-hover flex flex-col justify-between ${
                      !isUnlocked ? "border-amber-300 dark:border-amber-800/80" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="primary" className="font-mono">
                          Lớp {lesson.grade_id}
                        </Badge>
                        {!isUnlocked ? (
                          <Badge variant="warning">
                            <Lock className="w-3 h-3" />
                            <span>Khóa học thử</span>
                          </Badge>
                        ) : (
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
                        )}
                      </div>
                      <CardTitle className="text-base sm:text-lg line-clamp-2">
                        {lesson.title}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm line-clamp-3 leading-relaxed mt-2">
                        {lesson.introduction}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                        <div className="flex items-center gap-1.5 font-mono tabular-nums">
                          <Clock className="w-3.5 h-3.5" />
                          <span>~{lesson.estimated_minutes} phút</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>+{lesson.xp_reward} XP</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                      <Link href={`/learning/${lesson.slug}`} className="w-full">
                        {!isUnlocked ? (
                          <Button
                            variant="outline"
                            className="w-full justify-between group border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                          >
                            <span className="flex items-center gap-1.5 font-semibold text-xs">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Mở khóa với tài khoản thật</span>
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full justify-between">
                            <span>Bắt đầu đọc bài</span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-14 hallmark-surface p-8 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-muted)] mx-auto flex items-center justify-center border border-[var(--border)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Không tìm thấy bài học phù hợp
              </h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
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
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                        {summary.gradeName} — {summary.bookSeries}
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                        Hệ thống {summary.totalLessons} bài học chuẩn ma trận kiến thức GDPT 2018
                      </p>
                    </div>
                    <Badge variant="primary" className="font-mono shrink-0">
                      Khối {summary.gradeId}
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    {summary.themes.map((theme) => (
                      <Card key={theme.id} className="p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
                          <div>
                            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                              {theme.lessonsRange}
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-0.5">
                              {theme.themeTitle}
                            </h3>
                          </div>
                          <Link href="/practice">
                            <Button variant="outline" size="sm" className="text-xs font-semibold">
                              <span>Luyện câu hỏi chủ đề này</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>

                        <div className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                          {theme.content}
                        </div>

                        {theme.table && (
                          <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)]">
                            <table className="w-full text-left text-xs sm:text-sm">
                              <thead className="bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold border-b border-[var(--border)]">
                                <tr>
                                  {theme.table.headers.map((h, idx) => (
                                    <th key={idx} className="p-3">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                                {theme.table.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-[var(--bg-subtle)]/60">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="p-3 text-[var(--text-secondary)]">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

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
              <div className="text-center py-14 hallmark-surface p-8 space-y-4">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Không tìm thấy chủ đề tóm tắt phù hợp
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
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
        <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)]">
          <Navbar />
          <main className="flex-1 hallmark-container w-full py-16 text-center text-sm text-[var(--text-muted)]">
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
