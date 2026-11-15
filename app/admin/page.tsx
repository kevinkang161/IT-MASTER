"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  BookOpen,
  FileQuestion,
  GraduationCap,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  ArrowLeft,
  Activity,
  Layers,
  Database,
  Lock,
  LogOut,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-context";
import { MOCK_LESSONS, MOCK_QUESTIONS, MOCK_EXAMS, MOCK_LEADERBOARD } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "questions" | "exams" | "users">("overview");

  // Local state for admin lessons to allow creating/deleting in demo
  const [lessonsList, setLessonsList] = useState(MOCK_LESSONS);
  const [questionsList, setQuestionsList] = useState(MOCK_QUESTIONS);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);

  // If user is not admin, display role access restriction (403 Forbidden)
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans transition-colors">
        <Navbar />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              403 • Quyền truy cập bị từ chối
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Khu vực Quản trị viên (Admin Only)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Trang CMS quản trị chỉ dành riêng cho Giáo viên và Quản trị viên hệ thống IT MASTER. Tài khoản của bạn hiện không có thẩm quyền truy cập khu vực này.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Quay lại Bảng học tập
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-slate-200 dark:border-slate-800">
                Về Trang chủ
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    const newLes = {
      ...MOCK_LESSONS[0],
      id: "les-" + Date.now(),
      title: newLessonTitle,
      slug: "bai-hoc-moi-" + Date.now(),
      is_draft: true,
      created_at: new Date().toISOString(),
    };

    setLessonsList([newLes, ...lessonsList]);
    setNewLessonTitle("");
    setShowAddLessonModal(false);
  };

  const handleDeleteLesson = (id: string) => {
    setLessonsList(lessonsList.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* ADMIN TOP BANNER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-sm border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Trung tâm Quản trị Nội dung (Admin CMS)
                </h1>
                <Badge variant="primary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
                  Toàn quyền Admin
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Quản lý thư viện bài giảng, ngân hàng câu hỏi trắc nghiệm, đề thi thử và phân quyền tài khoản.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/80 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono">{user?.email || "thaidoanhoangbh@gmail.com"}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
              className="border-slate-700 text-slate-300 hover:text-rose-400 hover:bg-rose-950/40 text-xs gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </Button>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: "overview", label: "Tổng quan thống kê", icon: Activity },
            { id: "lessons", label: "Quản lý bài giảng", icon: BookOpen },
            { id: "questions", label: "Ngân hàng câu hỏi", icon: FileQuestion },
            { id: "exams", label: "Quản lý đề thi thử", icon: GraduationCap },
            { id: "users", label: "Quản lý học sinh", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="p-5 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Tổng học sinh</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,482</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">+12 học sinh hôm nay</div>
              </Card>

              <Card className="p-5 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Bài giảng đã xuất bản</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{lessonsList.length} bài</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">3 khối lớp 10, 11, 12</div>
              </Card>

              <Card className="p-5 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Ngân hàng câu hỏi</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{questionsList.length} câu</div>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">Đầy đủ 4 định dạng</div>
              </Card>

              <Card className="p-5 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Đề thi thử THPT</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{MOCK_EXAMS.length} đề</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Chuẩn ma trận Bộ GD&ĐT</div>
              </Card>
            </div>

            {/* AUDIT LOG RECENT ACTIVITIES */}
            <Card className="p-6 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Nhật ký kiểm toán hệ thống (Admin Audit Logs)
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Admin đã xuất bản bài học:</strong>{" "}
                    <span className="text-slate-600 dark:text-slate-400">Bài 1: Làm quen với ngôn ngữ Python</span>
                  </div>
                  <span className="text-slate-400">10 phút trước</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Admin đã cập nhật đáp án:</strong>{" "}
                    <span className="text-slate-600 dark:text-slate-400">Câu hỏi q-04 (Format Đúng/Sai 2025)</span>
                  </div>
                  <span className="text-slate-400">25 phút trước</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Admin đã tạo đề thi thử:</strong>{" "}
                    <span className="text-slate-600 dark:text-slate-400">Đề thi thử Tốt nghiệp THPT Tin học số 01</span>
                  </div>
                  <span className="text-slate-400">1 giờ trước</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: LESSONS MANAGEMENT */}
        {activeTab === "lessons" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Danh sách bài giảng ({lessonsList.length})
              </h3>
              <Button size="sm" onClick={() => setShowAddLessonModal(true)} className="gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Thêm bài giảng mới</span>
              </Button>
            </div>

            {showAddLessonModal && (
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-blue-200 dark:border-blue-800 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Nhập thông tin bài giảng mới</h4>
                <form onSubmit={handleAddLesson} className="flex gap-2">
                  <input
                    type="text"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="Tiêu đề bài giảng (ví dụ: Bài 2: Vòng lặp For trong Python)..."
                    className="flex-1 p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <Button type="submit" size="sm">Lưu bài học</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddLessonModal(false)}>Hủy</Button>
                </form>
              </div>
            )}

            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {lessonsList.map((lesson) => (
                <div key={lesson.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        Lớp {lesson.grade_id}
                      </span>
                      <Badge variant={lesson.is_draft ? "warning" : "success"} className="text-[10px]">
                        {lesson.is_draft ? "DRAFT (Bản nháp)" : "Đã xuất bản"}
                      </Badge>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">{lesson.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{lesson.introduction}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/learning/${lesson.slug}`} target="_blank">
                      <Button variant="outline" size="sm" className="p-2 dark:border-slate-700" title="Xem trước bài học">
                        <Eye className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Xóa bài học"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QUESTIONS MANAGEMENT */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ngân hàng câu hỏi trắc nghiệm ({questionsList.length})
              </h3>
            </div>

            <div className="space-y-3">
              {questionsList.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Câu {idx + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                        Lớp {q.grade_id}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {q.question_type === "single_choice"
                          ? "Trắc nghiệm 4 lựa chọn"
                          : q.question_type === "true_false"
                          ? "Đúng / Sai (2025)"
                          : "Trả lời ngắn"}
                      </span>
                    </div>

                    <Badge variant="success" className="text-[10px]">Đã duyệt</Badge>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{q.content}</p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <strong>Giải thích:</strong> {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EXAMS MANAGEMENT */}
        {activeTab === "exams" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Quản lý đề thi thử ({MOCK_EXAMS.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_EXAMS.map((exam) => (
                <Card key={exam.id} className="p-5 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        Lớp {exam.grade_id}
                      </span>
                      <Badge variant="success">Hoạt động</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{exam.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{exam.description}</p>
                    <div className="text-xs text-slate-600 dark:text-slate-400 pt-2">
                      Thời lượng: <strong>{exam.duration_minutes} phút</strong> • Tổng câu: <strong>{exam.total_questions} câu</strong>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link href={`/exams/${exam.slug}`}>
                      <Button variant="outline" size="sm" className="dark:border-slate-700">Xem phòng thi</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Danh sách tài khoản học sinh
            </h3>

            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_LEADERBOARD.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</h5>
                      <span className="text-xs text-slate-400">{u.grade} • Cấp {u.level} • {u.xp} XP</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                      Học sinh
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
