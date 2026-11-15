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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import videosData from "@/lib/videos.json";

export interface VideoItem {
  grade: string;
  track: string;
  title: string;
  url: string;
}

// Extract YouTube Video ID from standard or share URLs
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
  title = "Kho Video Bài giảng Tin học Trực quan",
  subtitle = "Hệ thống video bài giảng trực quan bám sát SGK Kết nối tri thức Lớp 10, 11 và 12, phân loại rõ ràng theo khối lớp và định hướng CS / ICT.",
  limit,
  showHeader = true,
}: VideoLibraryProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const videos: VideoItem[] = videosData as VideoItem[];

  // Close modal on Escape key
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
    <section className="w-full">
      {showHeader && (
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 mb-2">
                <Youtube className="w-3.5 h-3.5 fill-current" />
                <span>Video Bài giảng SGK Kết nối tri thức</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              Tổng số: <strong className="text-slate-900 dark:text-white">{filteredVideos.length}</strong> video
            </div>
          </div>

          {/* FILTER CONTROLS */}
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Grade Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "Tất cả các khối" },
                { id: "10", label: "Lớp 10" },
                { id: "11", label: "Lớp 11" },
                { id: "12", label: "Lớp 12" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGrade(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap border ${
                    selectedGrade === tab.id
                      ? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs"
                      : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài giảng..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs sm:text-sm bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIDEO GRID */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, idx) => {
            const videoId = getYouTubeId(video.url);
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            // Track badge color
            const isCS = video.track.includes("Khoa học máy tính");
            const isICT = video.track.includes("Tin học ứng dụng");

            return (
              <div
                key={`${video.url}-${idx}`}
                onClick={() => setActiveVideo(video)}
                className="group flex flex-col justify-between bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-400/60 dark:hover:border-indigo-600/60 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {/* THUMBNAIL CONTAINER */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-red-500 transition-all duration-300 pl-0.5">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                  </div>

                  {/* Grade Badge over thumbnail */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900/90 text-white border border-slate-700/80 backdrop-blur-xs">
                      Lớp {video.grade}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs border ${
                        isCS
                          ? "bg-emerald-950/90 text-emerald-300 border-emerald-800"
                          : isICT
                          ? "bg-amber-950/90 text-amber-300 border-amber-800"
                          : "bg-blue-950/90 text-blue-300 border-blue-800"
                      }`}
                    >
                      {video.track}
                    </span>
                  </div>

                  {/* YouTube Indicator bottom right */}
                  <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[11px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                    <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
                    <span>Bài giảng</span>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {video.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Film className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Video trực quan</span>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                      <span>Mở xem</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
          <Film className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            Không tìm thấy video bài giảng phù hợp
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thử thay đổi bộ lọc khối lớp hoặc từ khóa tìm kiếm của bạn.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedGrade("all");
              setSelectedTrack("all");
              setSearchQuery("");
            }}
          >
            Đặt lại bộ lọc
          </Button>
        </div>
      )}

      {/* YOUTUBE IFRAME MODAL */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
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
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition"
                  title="Mở trên YouTube"
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

            {/* IFRAME PLAYER */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(activeVideo.url)}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* MODAL FOOTER */}
            <div className="px-4 py-3 sm:px-6 bg-slate-900/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-mono">
                Môn Tin học • Chương trình GDPT 2018 Kết nối tri thức
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
