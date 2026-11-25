import React from "react";
import Link from "next/link";
import { Code2, Heart, Shield, Sparkles, BookOpen, ExternalLink, Phone, User, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--surface)] text-[var(--text-secondary)] border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo.jpg"
                alt="IT Master Logo"
                className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-sm shrink-0"
              />
              <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
                IT MASTER
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Hệ thống học tập, rèn luyện kỹ năng giải quyết vấn đề và ôn thi trắc nghiệm Tin học chuẩn hóa dành cho học sinh THPT các khối lớp 10, 11, 12 và thí sinh dự thi Tốt nghiệp THPT Quốc gia.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-950 text-blue-400 border border-blue-800">
                Chương trình GDPT 2018
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                Định dạng thi 2025+
              </span>
            </div>
          </div>

          {/* Col 1: Khối lớp */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Chương trình học tập
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/learning?grade=10" className="hover:text-white transition">
                  Tin học Lớp 10 (Python)
                </Link>
              </li>
              <li>
                <Link href="/learning?grade=11" className="hover:text-white transition">
                  Tin học Lớp 11 (SQL & CSDL)
                </Link>
              </li>
              <li>
                <Link href="/learning?grade=12" className="hover:text-white transition">
                  Tin học Lớp 12 (AI & Web)
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-white transition text-blue-400 font-medium">
                  Phòng thi thử THPT
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Tính năng */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Tính năng nổi bật
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/practice" className="hover:text-white transition">
                  Luyện câu hỏi theo chủ đề
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-white transition">
                  Đề thi bấm giờ mô phỏng
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition">
                  Bảng vàng vinh danh
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Tiến độ học tập cá nhân
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Thông tin liên hệ & Hỗ trợ */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Thông tin liên hệ
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2 text-slate-300">
                <User className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Người phụ trách:</span>
                  <span className="font-semibold text-white">Thái Doãn An Khang</span>
                </div>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Hotline / Zalo:</span>
                  <a href="tel:0829109222" className="text-emerald-400 hover:text-emerald-300 font-semibold transition font-mono">
                    0829 109 222
                  </a>
                </div>
              </li>
              <li className="pt-1">
                <a
                  href="https://zalo.me/0829109222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Zalo trực tiếp</span>
                </a>
              </li>
              <li className="pt-1">
                <Link href="/admin" className="hover:text-white transition flex items-center gap-1 text-slate-400">
                  <span>Trang quản trị CMS</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} IT MASTER. Bản quyền thuộc về nền tảng giáo dục Tin học Việt Nam.</p>
          <p className="flex items-center gap-1">
            Xây dựng với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> vì sự phát triển Tin học nước nhà
          </p>
        </div>
      </div>
    </footer>
  );
}
