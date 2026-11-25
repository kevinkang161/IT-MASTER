"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Search,
  X,
  ExternalLink,
  Film,
  Clock,
  CheckCircle2,
  BookCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import videosData from "@/lib/videos.json";
import { VideoItem } from "@/types/video";
import {
  VideoSplitWorkspace,
  STORAGE_COMPLETED_VIDEOS_KEY,
  getYouTubeId,
} from "@/components/VideoSplitWorkspace";

export type { VideoItem };

interface VideoLibraryProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showHeader?: boolean;
}

export function VideoLibrary({
  title = "Video bài giảng ôn thi",
  subtitle = "Hệ thống video bài giảng bám sát SGK Kết nối tri thức Lớp 10, 11 và 12, hỗ trợ cả hai định hướng Khoa học máy tính (CS) và Tin học ứng dụng (ICT).",
  limit,
  showHeader = true,
}: VideoLibraryProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  const videos: VideoItem[] = videosData as VideoItem[];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_VIDEOS_KEY);
      if (saved) {
        setCompletedVideos(JSON.parse(saved));
      }
    } catch (_) {}
  }, []);

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

  const countAll = videos.length;
  const count10 = videos.filter((v) => v.grade === "10").length;
  const count11 = videos.filter((v) => v.grade === "11").length;
  const count12 = videos.filter((v) => v.grade === "12").length;

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

  const handleVideoComplete = (videoId: string) => {
    setCompletedVideos((prev) => (prev.includes(videoId) ? prev : [...prev, videoId]));
  };

  return (
    <section className="w-full font-sans">
      {showHeader && (
        <div className="space-y-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="max-w-2xl space-y-1.5">
              <span className="text-xs font-mono text-[var(--text-muted)]">
                SGK Kết nối tri thức
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="shrink-0">
              <span className="text-xs font-mono text-[var(--text-muted)] px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] tabular-nums">
                Hiển thị:{" "}
                <strong className="text-[var(--text-primary)]">
                  {filteredVideos.length}/{videos.length}
                </strong>{" "}
                bài giảng
              </span>
            </div>
          </div>

          {/* FILTER CONTROLS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
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
                    type="button"
                    onClick={() => setSelectedGrade(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded tabular-nums ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "bg-[var(--bg-subtle)] text-[var(--text-muted)]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-1 text-xs overflow-x-auto">
                {[
                  { id: "all", label: "Mọi định hướng" },
                  { id: "Chung", label: "Chung" },
                  { id: "Khoa học máy tính", label: "CS" },
                  { id: "Tin học ứng dụng", label: "ICT" },
                ].map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setSelectedTrack(tr.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap border ${
                      selectedTrack === tr.id
                        ? "bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)] font-semibold"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-subtle)]"
                    }`}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài giảng..."
                  className="w-full pl-9 pr-7 py-1.5 text-xs sm:text-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 cursor-pointer"
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

      {/* VIDEO GRID */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const videoId = getYouTubeId(video.url);
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            const isCompleted = completedVideos.includes(video.id);
            const chapterCount = video.chapters?.length || 4;
            const exerciseCount = video.exercises?.length || 3;

            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className={`group hallmark-surface hallmark-surface-hover flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isCompleted ? "border-emerald-500/60 dark:border-emerald-500/40" : ""
                }`}
              >
                {/* Clean 16:9 Thumbnail */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden border-b border-[var(--border)]">
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-slate-900/85 group-hover:bg-blue-600 text-white flex items-center justify-center border border-white/25 transition-colors pl-0.5">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-white bg-emerald-600 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Đã hoàn thành</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-mono font-semibold text-[var(--text-muted)]">
                        Lớp {video.grade}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium truncate">
                        {video.track}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {video.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-3 font-mono tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{chapterCount} mốc</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookCheck className="w-3.5 h-3.5" />
                        <span>{exerciseCount} câu</span>
                      </span>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      Xem bài
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-14 px-4 hallmark-surface space-y-3">
          <Film className="w-9 h-9 text-[var(--text-muted)] mx-auto" />
          <p className="font-bold text-[var(--text-primary)] text-base">
            Không tìm thấy video bài giảng phù hợp
          </p>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            Không có kết quả nào khớp với bộ lọc hoặc từ khóa tìm kiếm hiện tại.
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

      {/* SPLIT-VIEW VIDEO MODAL */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-7xl h-[92vh] max-h-[880px] bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 sm:px-6 border-b border-[var(--border)] flex items-center justify-between gap-3 bg-[var(--surface)] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border)] shrink-0">
                  Lớp {activeVideo.grade} · {activeVideo.track}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                  {activeVideo.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {completedVideos.includes(activeVideo.id) && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã hoàn thành</span>
                  </span>
                )}
                <Link
                  href={`/videos/${activeVideo.id}`}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 hidden md:inline"
                >
                  Mở trang riêng
                </Link>
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--bg-subtle)] transition-colors"
                  title="Mở trên YouTube"
                >
                  <span className="hidden md:inline">YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                  title="Đóng (Esc)"
                  aria-label="Đóng cửa sổ video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <VideoSplitWorkspace
              key={activeVideo.id}
              video={activeVideo}
              onComplete={handleVideoComplete}
              footerAction={
                <Button
                  variant="success"
                  className="flex-1 text-xs font-semibold"
                  onClick={() => setActiveVideo(null)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hoàn thành &amp; Đóng</span>
                </Button>
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default VideoLibrary;
