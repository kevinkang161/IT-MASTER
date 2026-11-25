import React from "react";
import Link from "next/link";
import {
  Code2,
  BookOpen,
  GraduationCap,
  Timer,
  ChevronRight,
  Database,
  Cpu,
  User,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { VideoLibrary } from "@/components/VideoLibrary";

export default function HomePage() {
  const grades = [
    {
      grade: 10,
      title: "Tin học 10",
      focus: "Nền tảng số và lập trình Python",
      href: "/learning?grade=10",
      topics: "Dữ liệu nhị phân, số bù 2, đồ họa vector và cú pháp lập trình Python cơ bản.",
      action: "Học Tin học 10",
    },
    {
      grade: 11,
      title: "Tin học 11",
      focus: "Cơ sở dữ liệu, SQL và giải thuật",
      href: "/learning?grade=11",
      topics: "Kiến trúc máy tính, mô hình CSDL quan hệ, truy vấn SQL, tìm kiếm và sắp xếp.",
      action: "Học Tin học 11",
    },
    {
      grade: 12,
      title: "Tin học 12",
      focus: "Trí tuệ nhân tạo, mạng và web",
      href: "/learning?grade=12",
      topics: "Đặc trưng AI, bộ giao thức TCP/IP, thiết bị chuyển mạch và lập trình HTML/CSS.",
      action: "Học Tin học 12",
    },
  ];

  const examStructure = [
    {
      part: "Phần I",
      name: "Trắc nghiệm nhiều lựa chọn",
      count: "24 câu",
      score: "6,0 điểm",
      desc: "Mỗi câu có 4 phương án, chọn 1 đáp án đúng duy nhất.",
    },
    {
      part: "Phần II",
      name: "Trắc nghiệm Đúng hoặc Sai",
      count: "4 câu",
      score: "4,0 điểm",
      desc: "Mỗi câu gồm 4 ý khẳng định a, b, c, d. Đánh giá tính đúng sai cho từng ý.",
    },
    {
      part: "Phần III",
      name: "Trả lời ngắn",
      count: "6 câu",
      score: "1,5 điểm",
      desc: "Tự tính toán và điền kết quả của thuật toán hoặc câu lệnh truy vấn dữ liệu.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION: Hallmark Rule 12 & 13 - Under 80 words, fits 1280x800 without scrolling */}
        <section className="border-b border-[var(--border)] pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="hallmark-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline, one sentence, actions */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-normal">
                  Chương trình GDPT 2018 · Định dạng thi 2025
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.12]">
                  Ôn thi môn Tin học THPT Quốc gia
                </h1>

                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
                  Ngân hàng câu hỏi trắc nghiệm bốn định dạng và phòng thi thử 45 phút chuẩn ma trận Bộ Giáo dục.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link href="/exams">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm"
                    >
                      <span>Vào thi thử ngay</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/learning">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] px-6 py-3 rounded-lg"
                    >
                      <span>Thư viện bài học</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Grounded Educational Matrix Card */}
              <div className="lg:col-span-5">
                <div className="hallmark-surface p-6 sm:p-7 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
                    <span className="font-medium text-[var(--text-primary)]">Cấu trúc đề thi thử</span>
                    <span className="font-mono tabular-nums">45 phút · 10 điểm</span>
                  </div>

                  <div className="space-y-3.5">
                    {examStructure.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-semibold text-[var(--text-primary)]">
                            {item.part}: {item.name}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-medium text-[var(--text-primary)] block tabular-nums">
                            {item.count}
                          </span>
                          <span className="text-[11px] font-mono text-[var(--text-muted)] block tabular-nums">
                            {item.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center">
                    <Link
                      href="/practice"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <span>Luyện tập theo từng phần thi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CURRICULUM DIRECTORY (Lớp 10, 11, 12) */}
        <section className="py-16 sm:py-20 border-b border-[var(--border)]">
          <div className="hallmark-container">
            <div className="max-w-xl mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Lộ trình bài giảng theo khối lớp
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Nội dung biên soạn bám sát sách giáo khoa Kết nối tri thức, hỗ trợ cả hai định hướng Khoa học máy tính và Tin học ứng dụng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {grades.map((item) => (
                <div
                  key={item.grade}
                  className="hallmark-surface p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        Khối {item.grade}
                      </span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {item.focus}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2.5">
                      {item.topics}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border)]">
                    <Link
                      href={item.href}
                      className="text-xs font-semibold text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{item.action}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: EXAM FEATURES & INTEGRITY */}
        <section className="py-16 sm:py-20 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="hallmark-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] mb-3">
                  <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Đồng hồ đếm ngược 45 phút
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Mô phỏng áp lực phòng thi thực tế với thông báo mốc thời gian và tự động nộp bài khi hết giờ.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] mb-3">
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Lưu bài tự động theo thời gian thực
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Mọi thao tác chọn đáp án được lưu tức thì vào máy chủ, tránh mất bài khi kết nối mạng gián đoạn.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] mb-3">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Giải thích chi tiết từng câu hỏi
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Ngay sau khi nộp bài, hệ thống chấm điểm trên thang điểm 10 và hiển thị đáp án kèm giải thích cụ thể.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: VIDEO LECTURES */}
        <section className="py-16 sm:py-20 border-b border-[var(--border)]">
          <div className="hallmark-container">
            <VideoLibrary
              title="Video bài giảng ôn thi"
              subtitle="Video hướng dẫn lý thuyết và thực hành lập trình bám sát sách giáo khoa Kết nối tri thức Lớp 10, 11 và 12."
              limit={6}
            />
            <div className="mt-8 text-center">
              <Link href="/videos">
                <Button
                  variant="outline"
                  className="text-xs font-semibold border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg-subtle)] px-6 py-2.5 rounded-lg"
                >
                  <span>Xem danh sách tất cả video</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 5: CONTACT & ADVISOR */}
        <section id="contact" className="py-16 sm:py-20">
          <div className="hallmark-container">
            <div className="max-w-2xl mx-auto hallmark-surface p-6 sm:p-8">
              <div className="text-xs text-[var(--text-muted)] font-mono mb-2">
                Thông tin liên hệ
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Cố vấn chuyên môn hệ thống
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Hỗ trợ giải đáp câu hỏi học tập, tài liệu ôn thi và góp ý phát triển nền tảng IT MASTER.
              </p>

              <div className="mt-6 pt-6 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>Thái Doãn An Khang</span>
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    Quản trị viên chuyên môn
                  </div>
                  <div className="text-xs font-mono mt-2 text-[var(--text-secondary)] tabular-nums">
                    Hotline: 0829 109 222
                  </div>
                </div>

                <div className="flex sm:justify-end">
                  <a
                    href="https://zalo.me/0829109222"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Nhắn tin qua Zalo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
