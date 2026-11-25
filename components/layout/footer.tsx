import React from "react";
import Link from "next/link";
import { ExternalLink, Phone, User, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--surface)] text-[var(--text-secondary)] border-t border-[var(--border)] mt-auto transition-colors">
      <div className="hallmark-container py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo.jpg"
                alt="IT Master Logo"
                className="w-9 h-9 rounded-lg object-cover border border-[var(--border)] shrink-0"
              />
              <span className="text-lg font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
                IT MASTER
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Nền tảng học tập và ôn thi Tin học THPT chuẩn chương trình Giáo dục Phổ thông 2018 dành cho học sinh Lớp 10, 11 và 12.
            </p>
            <div className="text-xs font-mono text-[var(--text-muted)]">
              SGK Kết nối tri thức · Định dạng thi THPT 2025
            </div>
          </div>

          {/* Col 1: Khối lớp */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Chương trình học
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/learning?grade=10" className="hover:text-[var(--text-primary)] transition-colors">
                  Tin học Lớp 10 (Python)
                </Link>
              </li>
              <li>
                <Link href="/learning?grade=11" className="hover:text-[var(--text-primary)] transition-colors">
                  Tin học Lớp 11 (SQL &amp; CSDL)
                </Link>
              </li>
              <li>
                <Link href="/learning?grade=12" className="hover:text-[var(--text-primary)] transition-colors">
                  Tin học Lớp 12 (AI &amp; Web)
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-[var(--text-primary)] transition-colors">
                  Kho video bài giảng
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Luyện thi */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Ôn tập &amp; Đánh giá
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/practice" className="hover:text-[var(--text-primary)] transition-colors">
                  Luyện câu hỏi theo chủ đề
                </Link>
              </li>
              <li>
                <Link href="/exams" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Phòng thi thử THPT
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-[var(--text-primary)] transition-colors">
                  Bảng vàng danh dự
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">
                  Tiến độ học tập cá nhân
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Liên hệ */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Thông tin liên hệ
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[var(--text-muted)] block text-[11px]">Phụ trách chuyên môn:</span>
                  <span className="font-semibold text-[var(--text-primary)]">Thái Doãn An Khang</span>
                </div>
              </li>
              <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[var(--text-muted)] block text-[11px]">Hotline / Zalo:</span>
                  <a
                    href="tel:0829109222"
                    className="text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors font-mono tabular-nums"
                  >
                    0829 109 222
                  </a>
                </div>
              </li>
              <li className="pt-0.5">
                <a
                  href="https://zalo.me/0829109222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Zalo trực tiếp</span>
                </a>
              </li>
              <li className="pt-0.5">
                <Link
                  href="/admin"
                  className="hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1 text-[var(--text-muted)]"
                >
                  <span>Trang quản trị nội dung</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-3">
          <p>© {new Date().getFullYear()} IT MASTER. Nền tảng ôn thi Tin học THPT.</p>
          <p>Chương trình GDPT 2018 · Bộ sách Kết nối tri thức</p>
        </div>
      </div>
    </footer>
  );
}
