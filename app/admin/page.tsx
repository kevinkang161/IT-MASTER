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
  Eye,
  Activity,
  Lock,
  LogOut,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-context";
import { MOCK_LESSONS, MOCK_QUESTIONS, MOCK_EXAMS, MOCK_LEADERBOARD } from "@/lib/mock-data";

type AdminTab = "overview" | "lessons" | "questions" | "exams" | "users";

interface AuditEntry {
  id: string;
  action: string;
  detail: string;
  time: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const [lessonsList, setLessonsList] = useState(MOCK_LESSONS);
  const [questionsList] = useState(MOCK_QUESTIONS);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    {
      id: "log-1",
      action: "Dữ liệu mẫu khởi tạo",
      detail: `${MOCK_LESSONS.length} bài giảng, ${MOCK_QUESTIONS.length} câu hỏi và ${MOCK_EXAMS.length} đề thi`,
      time: "Phiên hiện tại",
    },
  ]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] font-sans transition-colors">
        <Navbar />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-14 h-14 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
              403 · Quyền truy cập bị từ chối
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Khu vực Quản trị viên
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Trang quản trị nội dung chỉ dành cho giáo viên và quản trị viên hệ thống IT MASTER. Tài khoản của bạn không có quyền truy cập khu vực này.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full">Quay lại bảng học tập</Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Về trang chủ
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
      title: newLessonTitle.trim(),
      slug: "bai-hoc-moi-" + Date.now(),
      is_draft: true,
      created_at: new Date().toISOString(),
    };

    setLessonsList([newLes, ...lessonsList]);
    setAuditLogs((prev) => [
      {
        id: "log-" + Date.now(),
        action: "Thêm bản nháp bài giảng",
        detail: newLes.title,
        time: new Date().toLocaleTimeString("vi-VN"),
      },
      ...prev,
    ]);
    setNewLessonTitle("");
    setShowAddLessonModal(false);
  };

  const handleDeleteLesson = (id: string) => {
    const removed = lessonsList.find((l) => l.id === id);
    setLessonsList(lessonsList.filter((l) => l.id !== id));
    if (removed) {
      setAuditLogs((prev) => [
        {
          id: "log-" + Date.now(),
          action: "Xóa bài giảng khỏi danh sách phiên",
          detail: removed.title,
          time: new Date().toLocaleTimeString("vi-VN"),
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors">
      <Navbar />

      <main className="flex-1 hallmark-container w-full py-8 sm:py-10 space-y-6">
        {/* ADMIN HEADER */}
        <div className="hallmark-surface p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[var(--accent-subtle)] border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Trung tâm Quản trị Nội dung
                </h1>
                <Badge variant="primary">Quản trị viên</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Quản lý thư viện bài giảng, ngân hàng câu hỏi, đề thi thử và danh sách học sinh.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-[var(--bg-subtle)] px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] font-mono">
              {user?.email}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
              className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </Button>
          </div>
        </div>

        {/* SAMPLE MODE CLARITY NOTICE */}
        <div className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Lưu ý dữ liệu mẫu:</strong> Số liệu học sinh và thao tác thêm/xóa bài giảng ở trang này đang phản ánh bộ dữ liệu seed cục bộ trong phiên trình duyệt (chưa ghi xuống Supabase khi chạy ở chế độ Demo).
          </span>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3 overflow-x-auto">
          {(
            [
              { id: "overview", label: "Tổng quan", icon: Activity },
              { id: "lessons", label: "Bài giảng", icon: BookOpen },
              { id: "questions", label: "Ngân hàng câu hỏi", icon: FileQuestion },
              { id: "exams", label: "Đề thi thử", icon: GraduationCap },
              { id: "users", label: "Học sinh mẫu", icon: Users },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 font-semibold"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <Card className="p-5">
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  Tài khoản học sinh mẫu
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1 tabular-nums">
                  {MOCK_LEADERBOARD.length}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  Dữ liệu minh họa
                </div>
              </Card>

              <Card className="p-5">
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  Bài giảng hiện có
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1 tabular-nums">
                  {lessonsList.length} bài
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  3 khối lớp 10, 11, 12
                </div>
              </Card>

              <Card className="p-5">
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  Ngân hàng câu hỏi
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1 tabular-nums">
                  {questionsList.length} câu
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Đầy đủ 3 định dạng
                </div>
              </Card>

              <Card className="p-5">
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  Đề thi thử THPT
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1 tabular-nums">
                  {MOCK_EXAMS.length} đề
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  Ma trận GDPT 2018
                </div>
              </Card>
            </div>

            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Nhật ký thao tác phiên làm việc
              </h3>

              <div className="divide-y divide-[var(--border)] text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-[var(--text-primary)]">{log.action}:</strong>{" "}
                      <span className="text-[var(--text-secondary)]">{log.detail}</span>
                    </div>
                    <span className="text-[var(--text-muted)] font-mono shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: LESSONS MANAGEMENT */}
        {activeTab === "lessons" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Danh sách bài giảng ({lessonsList.length})
              </h3>
              <Button size="sm" onClick={() => setShowAddLessonModal(true)}>
                <Plus className="w-4 h-4" />
                <span>Thêm bài giảng</span>
              </Button>
            </div>

            {showAddLessonModal && (
              <div className="p-5 hallmark-surface border-blue-300 dark:border-blue-800 space-y-3">
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Thêm bản nháp bài giảng mới (trong phiên hiện tại)
                </h4>
                <form onSubmit={handleAddLesson} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="Tiêu đề bài giảng (ví dụ: Bài 2: Vòng lặp For trong Python)..."
                    className="flex-1 p-2.5 text-xs sm:text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <Button type="submit" size="sm">Lưu bài học</Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddLessonModal(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="hallmark-surface overflow-hidden divide-y divide-[var(--border)]">
              {lessonsList.map((lesson) => (
                <div key={lesson.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" className="font-mono">
                        Lớp {lesson.grade_id}
                      </Badge>
                      <Badge variant={lesson.is_draft ? "warning" : "success"}>
                        {lesson.is_draft ? "Bản nháp" : "Đã xuất bản"}
                      </Badge>
                    </div>
                    <h5 className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {lesson.title}
                    </h5>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                      {lesson.introduction}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/learning/${lesson.slug}`} target="_blank">
                      <Button variant="outline" size="sm" title="Xem trước bài học">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Ngân hàng câu hỏi ({questionsList.length})
            </h3>

            <div className="space-y-3">
              {questionsList.map((q, idx) => (
                <div key={q.id} className="p-5 hallmark-surface space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-[var(--text-primary)]">
                        Câu {idx + 1}
                      </span>
                      <Badge variant="primary" className="font-mono">
                        Lớp {q.grade_id}
                      </Badge>
                      <span className="text-[var(--text-muted)]">
                        {q.question_type === "single_choice"
                          ? "Trắc nghiệm 4 lựa chọn"
                          : q.question_type === "true_false"
                          ? "Đúng / Sai 4 ý"
                          : "Trả lời ngắn"}
                      </span>
                    </div>

                    <Badge variant="success">Đã duyệt</Badge>
                  </div>

                  <p className="text-sm font-semibold text-[var(--text-primary)] whitespace-pre-line">
                    {q.content}
                  </p>
                  <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-subtle)] p-3 rounded-lg border border-[var(--border)]">
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
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Quản lý đề thi thử ({MOCK_EXAMS.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_EXAMS.map((exam) => (
                <Card key={exam.id} className="p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="primary" className="font-mono">
                        Lớp {exam.grade_id}
                      </Badge>
                      <Badge variant="success">Đang mở</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{exam.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{exam.description}</p>
                    <div className="text-xs text-[var(--text-muted)] pt-2 font-mono">
                      Thời lượng: <strong className="text-[var(--text-primary)]">{exam.duration_minutes} phút</strong> · Tổng câu:{" "}
                      <strong className="text-[var(--text-primary)]">{exam.total_questions} câu</strong>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--border)]">
                    <Link href={`/exams/${exam.slug}`}>
                      <Button variant="outline" size="sm">
                        Xem phòng thi
                      </Button>
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
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Danh sách học sinh mẫu ({MOCK_LEADERBOARD.length})
            </h3>

            <div className="hallmark-surface overflow-hidden divide-y divide-[var(--border)]">
              {MOCK_LEADERBOARD.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-[var(--text-primary)]">{u.name}</h5>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        {u.grade} · Cấp {u.level} · {u.xp.toLocaleString()} XP
                      </span>
                    </div>
                  </div>

                  <Badge variant="default">Học sinh</Badge>
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
