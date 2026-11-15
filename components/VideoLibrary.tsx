"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Search,
  X,
  ExternalLink,
  Film,
  Sparkles,
  Layers,
  GraduationCap,
  Youtube,
  BookOpen,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import videosData from "@/lib/videos.json";

export interface VideoItem {
  grade: string;
  track: string;
  title: string;
  url: string;
}

// Extract YouTube Video ID from standard watch or share URLs
function getYouTubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]+)/);
  return match ? match[1] : "";
}

interface VideoLibraryProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showHeader?: boolean;
}

export function VideoLibrary({
  title = "Video Bài Giảng Ôn Thi (Kết Nối Tri Thức)",
  subtitle = "Hệ thống video bài giảng trực quan bám sát SGK Kết nối tri thức Lớp 10, 11 và 12, hỗ trợ cả hai định hướng Khoa học máy tính (CS) và Tin học ứng dụng (ICT).",
  limit,
  showHeader = true,
}: VideoLibraryProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const videos: VideoItem[] = videosData as VideoItem[];

  // Counts for tabs
  const countAll = videos.length;
  const count10 = videos.filter((v) => v.grade === "10").length;
  const count11 = videos.filter((v) => v.grade === "11").length;
  const count12 = videos.filter((v) => v.grade === "12").length;

  // Keyboard accessibility: Close modal on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    }
    if (activeVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeVideo]);

  const filteredVideos = useMemo(() => {
    let result = videos.filter((video) => {
      const matchGrade = selectedGrade === "all" || video.grade === selectedGrade;
      const matchTrack = selectedTrack === "all" || video.track === selectedTrack;
      const matchSearch =
        searchQuery.trim() === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.track.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGrade && matchTrack && matchSearch;
    });

    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }

    return result;
  }, [videos, selectedGrade, selectedTrack, searchQuery, limit]);

  return (
    <section className="w-full font-sans">
      {showHeader && (
        <div className="space-y-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div className="max-w-2xl space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/80">
                <Youtube className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono">Chuẩn SGK Kết nối tri thức</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 tabular-nums">
                Hiển thị: <strong className="text-slate-900 dark:text-white">{filteredVideos.length}/{videos.length}</strong> bài giảng
              </span>
            </div>
          </div>

          {/* FILTER CONTROLS (Clean Academic & Swiss Grid) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            {/* Grade Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "Tất cả", count: countAll },
                { id: "10", label: "Lớp 10", count: count10 },
                { id: "11", label: "Lớp 11", count: count11 },
                { id: "12", label: "Lớp 12", count: count12 },
              ].map((tab) => {
                const isActive = selectedGrade === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedGrade(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs"
                        : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md tabular-nums ${
                        isActive
                          ? "bg-indigo-700 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Track Selector & Search Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Optional Track Filter */}
              <div className="flex items-center gap-1 text-xs overflow-x-auto">
                {[
                  { id: "all", label: "Mọi định hướng" },
                  { id: "Chung", label: "Chung" },
                  { id: "Khoa học máy tính", label: "CS" },
                  { id: "Tin học ứng dụng", label: "ICT" },
                ].map((tr) => (
                  <button
                    key={tr.id}
                    onClick={() => setSelectedTrack(tr.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer whitespace-nowrap border ${
                      selectedTrack === tr.id
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 font-bold"
                        : "bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài học..."
                  className="w-full pl-9 pr-7 py-1.5 text-xs sm:text-sm bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO GRID (1 col mobile, 2-3 col desktop) */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, idx) => {
            const videoId = getYouTubeId(video.url);
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            const isCS = video.track.includes("Khoa học máy tính");
            const isICT = video.track.includes("Tin học ứng dụng");

            return (
              <div
                key={`${video.url}-${idx}`}
                onClick={() => setActiveVideo(video)}
                className="group flex flex-col justify-between bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-400/80 dark:hover:border-indigo-500/80 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* 16:9 THUMBNAIL WITH PLAY BUTTON */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient shadow overlay for high text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />

                  {/* Centered Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-13 h-13 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-950/50 group-hover:scale-115 transition-all duration-300 border border-white/20 pl-0.5">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>

                  {/* Top Badges: Khối lớp & Định hướng */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-950/90 text-white border border-slate-700/80 shadow-xs">
                      Lớp {video.grade}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border shadow-xs ${
                        isCS
                          ? "bg-emerald-950/90 text-emerald-300 border-emerald-700"
                          : isICT
                          ? "bg-amber-950/90 text-amber-300 border-amber-700"
                          : "bg-blue-950/90 text-blue-300 border-blue-700"
                      }`}
                    >
                      {video.track}
                    </span>
                  </div>

                  {/* YouTube Tag bottom-right */}
                  <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[11px] font-mono text-white/95 bg-black/70 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
                    <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
                    <span>Bài giảng</span>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {video.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Film className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Video ôn thi</span>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>Phát video</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <Film className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="font-bold text-slate-900 dark:text-white text-base">
            Không tìm thấy video bài giảng phù hợp
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Không có kết quả nào khớp với bộ lọc hoặc từ khóa tìm kiếm &ldquo;{searchQuery}&rdquo;.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedGrade("all");
              setSelectedTrack("all");
              setSearchQuery("");
            }}
            className="cursor-pointer"
          >
            Đặt lại bộ lọc
          </Button>
        </div>
      )}

      {/* YOUTUBE IFRAME MODAL (16:9 Aspect Ratio) */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0">
                  Lớp {activeVideo.grade} • {activeVideo.track}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                  {activeVideo.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800 transition"
                  title="Mở trên trang YouTube"
                >
                  <span className="hidden sm:inline">Mở trên YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Đóng video (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 16:9 IFRAME PLAYER */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.url)}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* MODAL FOOTER */}
            <div className="px-4 py-3 sm:px-6 bg-slate-900/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-mono">
                Chương trình SGK Kết nối tri thức 10, 11, 12 • Nền tảng IT MASTER
              </span>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Đóng trình phát [Esc]
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default VideoLibrary;
