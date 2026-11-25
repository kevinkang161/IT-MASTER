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
  ArrowRight,
  ArrowUpRight,
  Film,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { VideoLibrary } from "@/components/VideoLibrary";
import { ParticleNetwork } from "@/components/ParticleNetwork";

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
      accent: "from-blue-500/10 to-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
      icon: Code2,
      topics: [
        "Biểu diễn dữ liệu nhị phân & Số bù 2",
        "Thiết kế đồ hoạ vector Inkscape",
        "Cú pháp & Thuật toán cơ bản với Python",
      ],
    },
    {
      grade: 11,
      title: "Tin học 11",
      focus: "Hệ điều hành, CSDL & Giải thuật",
      curriculum: "31 bài học gồm Phần chung, CS và ICT",
      summary:
        "Kiến trúc máy tính Von Neumann, nguyên lý CSDL quan hệ, ngôn ngữ SQL, thuật toán tìm kiếm nhị phân, sắp xếp và đánh giá độ phức tạp Big-O.",
      href: "/learning?grade=11",
      accent: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400",
      icon: Database,
      topics: [
        "Mô hình CSDL quan hệ & Thực hành SQL",
        "Thuật toán tìm kiếm nhị phân & sắp xếp",
        "Đánh giá độ phức tạp thời gian Big-O",
      ],
    },
    {
      grade: 12,
      title: "Tin học 12",
      focus: "Trí tuệ nhân tạo, Mạng & Web",
      curriculum: "30 bài học trọng tâm chuẩn ma trận thi tốt nghiệp",
      summary:
        "5 đặc trưng AI cốt lõi, bộ giao thức TCP/IP, thiết bị Switch/Router, thiết kế trang web HTML5/CSS3 với Box Model và Khoa học dữ liệu lớn (Big Data 5V).",
      href: "/learning?grade=12",
      accent: "from-violet-500/10 to-indigo-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400",
      icon: Cpu,
      topics: [
        "Trí tuệ nhân tạo (AI) & Học máy (ML)",
        "Giao thức TCP/IP & Thiết bị mạng",
        "Thiết kế web HTML5/CSS3 & Big Data",
      ],
    },
  ];

  const highlights = [
    {
      icon: CheckCircle2,
      label: "Chuẩn ma trận thi mới 2025+",
      desc: "Cập nhật đầy đủ 3 phần: Trắc nghiệm nhiều lựa chọn, Trắc nghiệm Đúng/Sai và Câu hỏi trả lời ngắn.",
    },
    {
      icon: BookOpen,
      label: "Sổ tay tóm tắt SGK toàn diện",
      desc: "Hệ thống hóa toàn bộ kiến thức SGK Kết nối tri thức 10, 11 và 12, có bảng so sánh và code mẫu trực quan.",
    },
    {
      icon: Timer,
      label: "Phòng thi bấm giờ mô phỏng",
      desc: "Đồng hồ đếm ngược 45 phút, chấm điểm máy chủ tức thì và phân tích chi tiết từng đáp án sai.",
    },
    {
      icon: Trophy,
      label: "Tự học theo tiến độ cá nhân",
      desc: "Theo dõi điểm kinh nghiệm XP, chuỗi ngày học tập và huy hiệu thành tích để duy trì thói quen mỗi ngày.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION: Atmospheric Tech & Modern CS */}
        <section className="bg-[#070B19] text-white pt-20 pb-24 border-b border-slate-900 relative overflow-hidden">
          {/* 1. Dynamic Video Background (Dark mode, autoPlay, loop, muted, playsInline, opacity-40) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40 dark:block hidden pointer-events-none"
            src="/videos/hero-bg.mp4"
          />

          {/* 2. Gradient Overlays for Cinematic Atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B19] via-[#070B19]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B19] via-transparent to-transparent pointer-events-none" />

          {/* 3. Tech Grid Mask on Hero */}
          <div className="absolute inset-0 bg-tech-grid mask-radial-fade opacity-30 pointer-events-none" />

          {/* 4. Interactive Particle Network Canvas */}
          <ParticleNetwork />

          {/* Foreground Hero Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-slate-900/70 backdrop-blur-md text-xs font-mono text-indigo-300 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle" />
                <span className="tracking-wide uppercase font-semibold">
                  Chương trình GDPT 2018 · Định dạng thi tốt nghiệp 2025+
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.14]">
                Học & Ôn thi môn Tin học{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                  Phổ thông chuẩn mực
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                Nền tảng học tập bám sát sách giáo khoa Kết nối tri thức Lớp 10, 11 và 12. Kết hợp tóm tắt lý thuyết cô đọng, code mẫu thực hành, ngân hàng trắc nghiệm 4 định dạng và phòng thi thử bấm giờ 45 phút.
              </p>

              {/* Action Buttons Group */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-md hover:shadow-indigo-500/25 transition-all inline-flex items-center gap-2"
                  >
                    <span>Tạo tài khoản học sinh</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/learning">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-700 bg-slate-900/80 backdrop-blur-sm text-slate-200 hover:bg-slate-800 hover:text-white px-6 inline-flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Khám phá bài học</span>
                  </Button>
                </Link>
                <Link href="/exams">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-700 bg-slate-900/80 backdrop-blur-sm text-slate-200 hover:bg-slate-800 hover:text-white px-6 inline-flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    <span>Phòng thi thử THPT</span>
                  </Button>
                </Link>
                <Link
                  href="/login"
                  className="text-xs text-slate-400 hover:text-slate-200 underline ml-1 transition"
                >
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
            </div>

            {/* QUICK BENCHMARK STRIP */}
            <div className="mt-16 rounded-2xl border border-slate-800/80 bg-slate-950/50 backdrop-blur-md p-6 sm:p-7 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
                <div className="pt-2 sm:pt-0 sm:px-4 first:pl-0">
                  <div className="flex items-center gap-2 text-indigo-400 mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Khối Lớp</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">3 Khối lớp</div>
                  <div className="text-xs text-slate-400 mt-1">Lớp 10, 11 & 12 KNTT</div>
                </div>

                <div className="pt-4 sm:pt-0 sm:px-4">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Học Liệu</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono tabular-nums">95 Bài học</div>
                  <div className="text-xs text-slate-400 mt-1">Tóm tắt lý thuyết 3 năm</div>
                </div>

                <div className="pt-4 sm:pt-0 sm:px-4">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Khảo Thí</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono tabular-nums">4 Định dạng</div>
                  <div className="text-xs text-slate-400 mt-1">Chuẩn đề thi THPT 2025+</div>
                </div>

                <div className="pt-4 sm:pt-0 sm:px-4 last:pr-0">
                  <div className="flex items-center gap-2 text-cyan-400 mb-1">
                    <Code2 className="w-4 h-4" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Đáp Án</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono tabular-nums">100% Giải thích</div>
                  <div className="text-xs text-slate-400 mt-1">Phân tích rõ từng phương án</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THREE CORE PILLARS (GRADE GRID) */}
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/60 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>// Lộ trình học theo khối lớp</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
              Chương trình Tin học chuẩn quốc gia 2026–2027
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Được tổ chức tuần tự theo từng năm học, hỗ trợ cả hai định hướng Khoa học máy tính (CS) và Tin học ứng dụng (ICT).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.grade}
                  className="tech-card p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    {/* Top bar with grade badge & curriculum */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                        <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Khối {item.grade}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {item.curriculum}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {item.focus}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                      {item.summary}
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Chủ đề then chốt:
                      </div>
                      {item.topics.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <Link href={item.href} className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-between text-xs font-semibold border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300 transition"
                      >
                        <span>Vào học {item.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SYSTEM HIGHLIGHTS: Clean tech feature cards */}
        <section className="py-16 sm:py-20 border-y border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>// Đặc điểm nền tảng</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Thiết kế chuyên biệt cho việc học và thi Tin học
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((h, idx) => {
                const Icon = h.icon;
                return (
                  <div
                    key={idx}
                    className="tech-card p-5 sm:p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{h.label}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* VIDEO LECTURES SHOWCASE */}
        <section id="videos" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/60 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              <Film className="w-3.5 h-3.5" />
              <span>// Học qua video trực quan</span>
            </div>
          </div>
          <VideoLibrary
            title="Video Bài Giảng Ôn Thi (Kết Nối Tri Thức)"
            subtitle="Tập hợp các video bài giảng chọn lọc bám sát chương trình Tin học 10, 11, 12 Kết nối tri thức: từ cú pháp Python căn bản, thuật toán tìm kiếm đến thực hành CSDL SQL và thiết kế web."
            limit={6}
          />
          <div className="mt-8 text-center">
            <Link href="/videos">
              <Button
                variant="outline"
                className="text-xs font-bold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 gap-2 px-6 py-2.5 shadow-sm"
              >
                <span>Xem tất cả video bài giảng ôn thi</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CALL TO ACTION: MOCK EXAMS (COMMAND-CENTER CARD) */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#070B19] via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-2xl">
            {/* Subtle background grid pattern */}
            <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-indigo-400 bg-indigo-950/80 border border-indigo-800/80 px-2.5 py-1 rounded-md">
                  <Timer className="w-3.5 h-3.5 text-indigo-400" />
                  <span>PHÒNG THI MÔ PHỎNG THỜI GIAN THỰC</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Thử sức với đề thi chuẩn ma trận Tốt nghiệp THPT
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Đề thi chuẩn hóa ma trận 2025+, thời gian làm bài 45 phút, lưu bài tự động theo thời gian thực và chấm điểm chi tiết từng câu ngay khi nộp bài.
                </p>
              </div>

              <div className="shrink-0 flex flex-wrap items-center gap-3">
                <Link href="/exams">
                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>Vào thi ngay</span>
                  </Button>
                </Link>
                <Link href="/practice">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white"
                  >
                    Luyện theo câu
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION: Academic Advisor Card */}
        <section id="contact" className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/60 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-2">
                <Phone className="w-3.5 h-3.5" />
                <span>// Thông tin kết nối</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Liên hệ & Cố vấn chuyên môn
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
                Mọi thắc mắc về tài liệu ôn tập, giải bài tập lập trình hoặc góp ý cho hệ thống, vui lòng liên hệ trực tiếp người phụ trách.
              </p>
            </div>

            <div className="tech-card p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Advisor Info */}
                <div className="space-y-1.5 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold mb-3 border border-indigo-200 dark:border-indigo-800">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Người phụ trách chuyên môn</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Thái Doãn An Khang</span>
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  </div>
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
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-md hover:shadow-indigo-500/25"
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
