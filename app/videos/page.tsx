import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VideoLibrary } from "@/components/VideoLibrary";

export const metadata: Metadata = {
  title: "Kho Video Bài giảng Tin học 10, 11, 12 — IT MASTER",
  description:
    "Hệ thống video bài giảng môn Tin học SGK Kết nối tri thức Lớp 10, 11, 12. Hướng dẫn lập trình Python, CSDL SQL, Thiết kế Web và Giải thuật Khoa học máy tính.",
};

export default function VideosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] font-sans transition-colors">
      <Navbar />

      <main className="flex-1 hallmark-container w-full py-8 sm:py-10 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="font-medium text-[var(--text-primary)]">
            Kho video bài giảng
          </span>
        </div>

        <VideoLibrary
          title="Video bài giảng ôn thi"
          subtitle="Tổng hợp các bài giảng video bám sát SGK Kết nối tri thức 10, 11, 12. Kết hợp thực hành lập trình Python, CSDL SQL và thiết kế web."
        />
      </main>

      <Footer />
    </div>
  );
}
