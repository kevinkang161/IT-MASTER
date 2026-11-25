import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import videosData from "@/lib/videos.json";
import { VideoItem } from "@/types/video";
import { VideoDetailPlayer } from "@/components/VideoDetailPlayer";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const videos = videosData as VideoItem[];
  return videos.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const videos = videosData as VideoItem[];
  const video = videos.find((v) => v.id === resolvedParams.id);

  if (!video) {
    return { title: "Không tìm thấy video — IT MASTER" };
  }

  return {
    title: `${video.title} — Lớp ${video.grade} (${video.track}) — IT MASTER`,
    description: `Học qua video: ${video.title}. Bám sát SGK Tin học Kết nối tri thức Lớp ${video.grade}. Kèm mốc nội dung và bài tập trắc nghiệm thực hành.`,
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const videos = videosData as VideoItem[];
  const video = videos.find((v) => v.id === resolvedParams.id);

  if (!video) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] font-sans transition-colors">
      <Navbar />

      <main className="flex-1 hallmark-container w-full py-6 sm:py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/videos" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0">
              Kho video
            </Link>
            <span>/</span>
            <span className="font-medium text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-md">
              {video.title}
            </span>
          </div>

          <Link
            href="/videos"
            className="inline-flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại kho video</span>
          </Link>
        </div>

        <VideoDetailPlayer video={video} />
      </main>

      <Footer />
    </div>
  );
}
