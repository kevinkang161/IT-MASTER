import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Timer,
  ChevronRight,
  Database,
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
      focus: "Nền tảng số và Python",
      href: "/learning?grade=10",
      topics: "Dữ liệu nhị phân, số bù 2, đồ họa vector và cú pháp lập trình Python cơ bản.",
      action: "Học Tin học 10",
    },
    {
      grade: 11,
      title: "Tin học 11",
      focus: "CSDL, SQL và giải thuật",
      href: "/learning?grade=11",
      topics: "Kiến trúc máy tính, mô hình CSDL quan hệ, truy vấn SQL, tìm kiếm và sắp xếp.",
      action: "Học Tin học 11",
    },
    {
      grade: 12,
      title: "Tin học 12",
      focus: "AI, mạng và thiết kế web",
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
      desc: "Mỗi câu có 4 phương án, chọn 1 đáp án đúng duy nhất (0,25 điểm/câu).",
    },
    {
      part: "Phần II",
      name: "Trắc nghiệm Đúng hoặc Sai",
      count: "4 câu",
      score: "4,0 điểm",
      desc: "Gồm 2 câu chung và 2 câu theo định hướng CS hoặc ICT, mỗi câu 4 ý a, b, c, d.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="border-b border-[var(--border)] pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="hallmark-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase">
                  Chương trình GDPT 2018 · Định dạng thi 2025
                </span>

                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15]">
                  Ôn thi môn Tin học THPT Quốc gia
                </h1>

                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
                  Ngân hàng câu hỏi ba định dạng và phòng thi thử 45 phút bám sát ma trận đề thi của Bộ Giáo dục.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href="/exams">
                    <Button size="lg" className="font-medium">
                      <span>Vào thi thử ngay</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/learning">
                    <Button variant="outline" size="lg">
                      <span>Thư viện bài học</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Exam Structure Matrix Card (exact 10.0 total points) */}
              <div className="lg:col-span-5">
                <div className="hallmark-surface p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Cấu trúc đề thi tốt nghiệp 2025
                    </span>
                    <span className="font-mono tabular-nums">45 phút · 10,0 điểm</span>
                  </div>

                  <div className="space-y-3">
                    {examStructure.map((item) => (
                      <div
                        key={item.part}
                        className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-semibold text-[var(--text-primary)]">
                            {item.part}: {item.name}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                            {item.desc}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-semibold text-[var(--text-primary)] block tabular-nums">
                            {item.count}
                          </span>
                          <span className="text-[11px] font-mono text-[var(--text-muted)] block tabular-nums">
                            {item.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg border border-dashed border-[var(--border)] flex items-center justify-between gap-3 text-xs">
                    <span className="text-[var(--text-secondary)]">
                      Luyện thêm câu trả lời ngắn (Python &amp; SQL)
                    </span>
                    <Link
                      href="/practice"
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium shrink-0"
                    >
                      <span>Luyện tập</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CURRICULUM DIRECTORY */}
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
                  className="hallmark-surface hallmark-surface-hover p-6 flex flex-col justify-between"
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

        {/* SECTION 3: EXAM FEATURES */}
        <section className="py-14 sm:py-16 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="hallmark-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-3">
                  <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Đồng hồ đếm ngược 45 phút
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Mô phỏng áp lực phòng thi thực tế với cảnh báo mốc thời gian và tự động nộp bài khi hết giờ.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-3">
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Lưu tiến độ học tập cá nhân
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Theo dõi số bài đã học, lịch sử làm đề và mức độ hoàn thành từng chuyên đề.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Giải thích chi tiết từng câu hỏi
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Ngay sau khi nộp bài, hệ thống chấm điểm trên thang 10 và hiển thị lời giải cho từng ý.
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
                <Button variant="outline" size="md" className="text-xs font-semibold">
                  <span>Xem danh sách tất cả video</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 5: CONTACT & ADVISOR */}
        <section id="contact" className="py-16 sm:py-20">
          <div className="hallmark-container">
            <div className="max-w-2xl mx-auto hallmark-surface p-6 sm:p-8">
              <div className="text-xs text-[var(--text-muted)] font-mono mb-1.5">
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
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
