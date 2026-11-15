"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Share2,
  Bookmark,
  Award,
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CodeViewer } from "@/components/ui/code-viewer";
import { useAuth } from "@/lib/auth/auth-context";
import { recordLessonCompleted } from "@/lib/progress";
import { MOCK_LESSONS, MOCK_QUESTIONS } from "@/lib/mock-data";

export default function SingleLessonPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user, addXp } = useAuth();

  const lesson = MOCK_LESSONS.find((l) => l.slug === slug) || MOCK_LESSONS[0];
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Associated question for quick practice matching grade
  const sampleQuestion = MOCK_QUESTIONS.find((q) => q.grade_id === lesson.grade_id) || MOCK_QUESTIONS[0];

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      addXp(lesson.xp_reward, `Hoàn thành bài học: ${lesson.title}`);
      recordLessonCompleted(user?.id, lesson.slug);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* BREADCRUMB & BACK BUTTON */}
        <div className="flex items-center justify-between">
          <Link
            href="/learning"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại thư viện bài học</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                isSaved
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
              <span className="hidden sm:inline">{isSaved ? "Đã lưu" : "Lưu bài học"}</span>
            </button>
          </div>
        </div>

        {/* LESSON BANNER HEADER */}
        <div className="bg-white dark:bg-[#0f172a] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Khối Lớp {lesson.grade_id}</Badge>
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
                ? "Độ khó: Cơ bản"
                : lesson.difficulty === "trung_binh"
                ? "Độ khó: Trung bình"
                : "Độ khó: Nâng cao"}
            </Badge>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Nội dung chuẩn ma trận GDPT
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {lesson.title}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {lesson.introduction}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Thời gian học ước tính: ~{lesson.estimated_minutes} phút</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <Zap className="w-4 h-4 fill-emerald-500" />
                <span>Thưởng hoàn thành: +{lesson.xp_reward} XP</span>
              </div>
            </div>

            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                Đã hoàn thành (+{lesson.xp_reward} XP)
              </span>
            ) : (
              <Button size="sm" onClick={handleCompleteLesson} className="gap-1.5 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đánh dấu hoàn thành bài</span>
              </Button>
            )}
          </div>
        </div>

        {/* 2-COL READING LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* MAIN ARTICLE (3 COLS) */}
          <div className="lg:col-span-3 space-y-8">
            {/* LEARNING OBJECTIVES */}
            <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Mục tiêu bài học cần đạt</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {lesson.learning_objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* MAIN LESSON TEXT CONTENT */}
            <article className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-[#0f172a] p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Nội dung chi tiết bài học
                </h2>
                <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lesson.content_markdown}
                </div>
              </div>

              {/* CODE SNIPPETS SECTION */}
              {lesson.code_snippets && lesson.code_snippets.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Mã nguồn minh họa thực tế
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

            {/* QUICK PRACTICE QUESTION AT END OF LESSON */}
            <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Câu hỏi kiểm tra nhanh kiến thức vừa học
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-sm sm:text-base font-semibold text-slate-900">
                  {sampleQuestion.content}
                </p>

                <div className="space-y-2">
                  {sampleQuestion.options?.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition ${
                        quizAnswer === opt.id
                          ? "bg-blue-50 border-blue-500 text-blue-900 font-semibold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
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
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{opt.content}</span>
                      </div>

                      {quizSubmitted && opt.is_correct && (
                        <span className="text-xs font-bold text-emerald-600">✓ Đáp án đúng</span>
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
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                    <div className="font-bold text-slate-900">Giải thích chi tiết:</div>
                    <p className="text-slate-600 leading-relaxed">{sampleQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* BOTTOM LESSON ACTIONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <Link href="/learning">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  <span>Danh mục bài học</span>
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                {!isCompleted && (
                  <Button size="sm" onClick={handleCompleteLesson} className="gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hoàn thành & Nhận +{lesson.xp_reward} XP</span>
                  </Button>
                )}
                <Link href="/practice">
                  <Button variant="secondary" size="sm" className="gap-1.5">
                    <span>Luyện thêm bài tập</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* SIDEBAR NAVIGATION (1 COL) */}
          <div className="space-y-6">
            {/* OTHER LESSONS IN TOPIC */}
            <Card className="p-5 bg-white border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Bài học cùng Khối {lesson.grade_id}
              </h4>
              <div className="space-y-2 text-xs">
                {MOCK_LESSONS.filter((l) => l.grade_id === lesson.grade_id).map((l) => (
                  <Link
                    key={l.id}
                    href={`/learning/${l.slug}`}
                    className={`block p-2.5 rounded-xl transition ${
                      l.slug === lesson.slug
                        ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="line-clamp-2">{l.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1">~{l.estimated_minutes} phút • +{l.xp_reward} XP</div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* MOCK EXAM CALLOUT */}
            <Card className="p-5 bg-gradient-to-br from-blue-900 to-indigo-900 text-white space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                Thử thách kiến thức
              </span>
              <h4 className="text-sm font-bold">
                Kiểm tra 1 tiết Tin học 10
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Làm đề thi thử bấm giờ 45 phút để kiểm tra mức độ ghi nhớ kiến thức của bạn.
              </p>
              <Link href="/exams/kiem-tra-1-tiet-tin-hoc-10-python" className="block pt-2">
                <Button size="sm" className="w-full bg-white text-blue-900 hover:bg-slate-100 font-bold text-xs">
                  Vào thi ngay
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
