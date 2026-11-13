import React from "react";
import Link from "next/link";
import {
  Code2,
  BookOpen,
  CheckCircle2,
  Trophy,
  GraduationCap,
  Timer,
  ChevronRight,
  Database,
  Cpu,
  Globe2,
  Phone,
  User,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { MOCK_GRADES } from "@/lib/mock-data";

export default function HomePage() {
  const pillars = [
    {
      grade: 10,
      title: "Tin học 10",
      focus: "Nền tảng số & Lập trình Python",
      curriculum: "34 bài học theo 6 chủ đề SGK Kết nối tri thức",
      summary:
        "Xử lý dữ liệu nhị phân, số bù 2, bảng mã ASCII/Unicode, đồ họa vector Inkscape và toàn bộ kỹ thuật lập trình Python từ biến, vòng lặp đến hàm.",
      href: "/learning?grade=10",
      topics: ["Biểu diễn dữ liệu nhị phân", "Thiết kế vector Inkscape", "Thuật toán cơ bản với Python"],
    },
    {
      grade: 11,
      title: "Tin học 11",
      focus: "Hệ điều hành, CSDL & Giải thuật",
      curriculum: "31 bài học gồm Phần chung, CS và ICT",
      summary:
        "Kiến trúc máy tính Von Neumann, nguyên lý CSDL quan hệ, ngôn ngữ SQL, thuật toán tìm kiếm nhị phân, sắp xếp và đánh giá độ phức tạp Big-O.",
      href: "/learning?grade=11",
      topics: ["Mô hình CSDL quan hệ & SQL", "Thuật toán tìm kiếm & sắp xếp", "Độ phức tạp thời gian Big-O"],
    },
    {
      grade: 12,
      title: "Tin học 12",
      focus: "Trí tuệ nhân tạo, Mạng & Web",
      curriculum: "30 bài học trọng tâm chuẩn ma trận thi tốt nghiệp",
      summary:
        "5 đặc trưng AI cốt lõi, bộ giao thức TCP/IP, thiết bị Switch/Router, thiết kế trang web HTML5/CSS3 với Box Model và Khoa học dữ liệu lớn (Big Data 5V).",
      href: "/learning?grade=12",
      topics: ["Trí tuệ nhân tạo & Học máy", "Giao thức TCP/IP & Thiết bị mạng", "Lập trình web HTML5/CSS3"],
    },
  ];

  const highlights = [
    {
      label: "Chuẩn ma trận thi mới 2025+",
      desc: "Cập nhật đầy đủ 3 phần: Trắc nghiệm nhiều lựa chọn, Trắc nghiệm Đúng/Sai và Câu hỏi trả lời ngắn.",
    },
    {
      label: "Sổ tay tóm tắt SGK toàn diện",
      desc: "Hệ thống hóa toàn bộ kiến thức SGK Kết nối tri thức 10, 11 và 12, có bảng so sánh và code mẫu trực quan.",
    },
    {
      label: "Phòng thi bấm giờ mô phỏng",
      desc: "Đồng hồ đếm ngược 45 phút, chấm điểm máy chủ tức thì và phân tích chi tiết từng đáp án sai.",
    },
    {
      label: "Tự học theo tiến độ cá nhân",
      desc: "Theo dõi điểm kinh nghiệm XP, chuỗi ngày học tập và huy hiệu thành tích để duy trì thói quen mỗi ngày.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION: Clear, editorial, confident */}
        <section className="bg-slate-950 text-white pt-20 pb-24 border-b border-slate-900 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-semibold text-blue-400 tracking-wider mb-4">
                Chương trình Giáo dục phổ thông 2018 • Định dạng thi tốt nghiệp 2025+
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Học & Ôn thi môn Tin học Phổ thông chuẩn mực
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Nền tảng học tập bám sát sách giáo khoa Kết nối tri thức Lớp 10, 11 và 12. 
                Kết hợp tóm tắt lý thuyết cô đọng, code mẫu thực hành, ngân hàng trắc nghiệm 4 định dạng và phòng thi thử bấm giờ.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/learning">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-sm">
                    Khám phá bài học
                  </Button>
                </Link>
                <Link href="/exams">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white px-6"
                  >
                    Vào phòng thi thử
                  </Button>
                </Link>
                <Link href="/#contact" className="text-xs text-slate-400 hover:text-slate-200 underline ml-2">
                  Liên hệ chuyên môn
                </Link>
              </div>
            </div>

            {/* QUICK BENCHMARK STRIP */}
            <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">3 Khối lớp</div>
                <div className="text-xs text-slate-400 mt-1">Lớp 10, 11 & 12 KNTT</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono tabular-nums">95 Bài học</div>
                <div className="text-xs text-slate-400 mt-1">Tóm tắt chi tiết 3 năm</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono tabular-nums">4 Định dạng</div>
                <div className="text-xs text-slate-400 mt-1">Trắc nghiệm thi THPT 2025+</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono tabular-nums">100% Giải thích</div>
                <div className="text-xs text-slate-400 mt-1">Phân tích rõ từng phương án</div>
              </div>
            </div>
          </div>
        </section>

        {/* THREE CORE PILLARS (GRADE GRID) */}
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Lộ trình học theo khối lớp</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
              Chương trình Tin học chuẩn quốc gia 2026–2027
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Được tổ chức tuần tự theo từng năm học, hỗ trợ cả hai định hướng Khoa học máy tính (CS) và Tin học ứng dụng (ICT).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((item) => (
              <div
                key={item.grade}
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 shadow-swiss transition"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                      Khối {item.grade}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.curriculum}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{item.focus}</div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                    {item.summary}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[11px] font-mono font-bold text-slate-500">Chủ đề then chốt:</div>
                    {item.topics.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link href={item.href} className="block">
                    <Button variant="outline" className="w-full justify-between text-xs font-semibold border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <span>Vào học {item.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SYSTEM HIGHLIGHTS: Clean editorial list */}
        <section className="py-16 bg-white dark:bg-[#0e1626] border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Đặc điểm nền tảng</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Thiết kế chuyên biệt cho việc học và thi Tin học
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((h, idx) => (
                <div key={idx} className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{h.label}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION: MOCK EXAMS */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-swiss">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono font-semibold text-indigo-400">Phòng thi thử trực tuyến</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Thử sức với đề thi chuẩn ma trận Tốt nghiệp THPT
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Đề thi chuẩn hóa, thời gian làm bài 45 phút, lưu bài tự động theo thời gian thực và chấm điểm chi tiết ngay khi nộp bài.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <Link href="/exams">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6">
                  Vào thi ngay
                </Button>
              </Link>
              <Link href="/practice">
                <Button variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                  Luyện theo câu
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION: Academic advisor card */}
        <section id="contact" className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Thông tin kết nối</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Liên hệ & Cố vấn chuyên môn
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
                Mọi thắc mắc về tài liệu ôn tập, giải bài tập lập trình hoặc góp ý cho hệ thống, vui lòng liên hệ trực tiếp người phụ trách.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-swiss">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Advisor Info */}
                <div className="space-y-1 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold mb-3 border border-indigo-200 dark:border-indigo-800">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Người phụ trách chuyên môn</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">Thái Doãn An Khang</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Quản trị viên hệ thống IT MASTER</div>
                </div>

                {/* Hotline call */}
                <div className="space-y-1 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hotline tư vấn & hỗ trợ:</div>
                  <a
                    href="tel:0829109222"
                    className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition block font-mono tabular-nums"
                  >
                    0829 109 222
                  </a>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hỗ trợ học sinh và giáo viên trong giờ hành chính.</p>
                </div>

                {/* Zalo Action */}
                <div className="space-y-3 md:col-span-1 flex flex-col justify-center">
                  <a
                    href="https://zalo.me/0829109222"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Nhắn tin qua Zalo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <div className="text-[11px] text-center text-slate-400">
                    Trao đổi tài liệu và bài tập ôn thi THPT
                  </div>
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
