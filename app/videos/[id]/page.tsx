import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Film, ExternalLink } from "lucide-react";
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
    description: `Học qua video: ${video.title}. Bám sát SGK Tin học Kết nối tri thức Lớp ${video.grade}. Kèm timeline bài giảng và bài tập trắc nghiệm thực hành trực tuyến.`,
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* BREADCRUMB */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/videos" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Kho Video bài giảng
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-md">
              {video.title}
            </span>
          </div>

          <Link
            href="/videos"
            className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại kho video</span>
          </Link>
        </div>

        {/* 2-COLUMN SPLIT-VIEW DETAIL PLAYER COMPONENT */}
        <VideoDetailPlayer video={video} />
      </main>

      <Footer />
    </div>
  );
}
