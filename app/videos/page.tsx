import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Film, ArrowLeft, Youtube, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VideoLibrary } from "@/components/VideoLibrary";

export const metadata: Metadata = {
  title: "Kho Video Bài giảng Tin học 10, 11, 12 — IT MASTER",
  description:
    "Hệ thống video bài giảng trực quan môn Tin học SGK Kết nối tri thức Lớp 10, 11, 12. Hướng dẫn lập trình Python, CSDL SQL, Thiết kế Web và Giải thuật Khoa học máy tính.",
};

export default function VideosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Kho Video bài giảng
          </span>
        </div>

        {/* EMBEDDED VIDEO LIBRARY CLIENT COMPONENT */}
        <VideoLibrary
          title="Kho Video Bài giảng Tin học Trực quan"
          subtitle="Tổng hợp các bài giảng video chọn lọc bám sát SGK Kết nối tri thức 10, 11, 12. Kết hợp thực hành Python, thao tác CSDL SQL và thiết kế web tương tác."
        />
      </main>

      <Footer />
    </div>
  );
}
