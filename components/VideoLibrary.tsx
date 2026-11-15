"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Search,
  X,
  ExternalLink,
  Film,
  Youtube,
  Clock,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Lightbulb,
  Check,
  ChevronRight,
  ListOrdered,
  BookCheck,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import videosData from "@/lib/videos.json";
import { VideoItem, VideoChapter, VideoExercise } from "@/types/video";

export type { VideoItem, VideoChapter, VideoExercise };

// Extract YouTube Video ID from standard watch or share URLs
function getYouTubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]+)/);
  return match ? match[1] : "";
}

const STORAGE_COMPLETED_KEY = "it_master_completed_videos";

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
  
  // Active Video Modal State
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Exercise State for Active Video
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [exerciseError, setExerciseError] = useState<string>("");

  // Completed Videos Tracking (Persisted in localStorage)
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  const videos: VideoItem[] = videosData as VideoItem[];

  // Load completed videos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (saved) {
        setCompletedVideos(JSON.parse(saved));
      }
    } catch (_) {
      // Ignore storage read error
    }
  }, []);

  // When opening a video, reset player & exercise states
  const handleOpenVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setCurrentSeconds(0);
    setActiveChapterIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setExerciseError("");
  };

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

  // Tab counts
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

  // Handle chapter click to seek video
  const handleSeekChapter = (chapter: VideoChapter, idx: number) => {
    setCurrentSeconds(chapter.seconds);
    setActiveChapterIndex(idx);
  };

  // Handle exercise option select
  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return; // Prevent changing after submit
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setExerciseError("");
  };

  // Check exercise results
  const handleSubmitExercise = () => {
    if (!activeVideo || !activeVideo.exercises) return;
    const totalQ = activeVideo.exercises.length;
    const answeredCount = Object.keys(userAnswers).length;

    if (answeredCount < totalQ) {
      setExerciseError(`Vui lòng hoàn thành đủ ${totalQ} câu hỏi trước khi kiểm tra!`);
      return;
    }

    setIsSubmitted(true);
    setExerciseError("");

    // Calculate score
    let correctCount = 0;
    activeVideo.exercises.forEach((ex, idx) => {
      if (userAnswers[idx] === ex.correctIndex) {
        correctCount++;
      }
    });

    // Mark as completed in localStorage if score >= 2 or all completed
    if (!completedVideos.includes(activeVideo.id)) {
      const updated = [...completedVideos, activeVideo.id];
      setCompletedVideos(updated);
      try {
        localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(updated));
      } catch (_) {}
    }
  };

  // Reset exercise
  const handleResetExercise = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setExerciseError("");
  };

  // Calculate score for active modal
  const exerciseScore = useMemo(() => {
    if (!activeVideo || !activeVideo.exercises || !isSubmitted) return 0;
    return activeVideo.exercises.reduce((acc, ex, idx) => {
      return acc + (userAnswers[idx] === ex.correctIndex ? 1 : 0);
    }, 0);
  }, [activeVideo, isSubmitted, userAnswers]);

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

          {/* FILTER CONTROLS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            {/* Grade Tabs */}
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
          {filteredVideos.map((video) => {
            const videoId = getYouTubeId(video.url);
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            const isCompleted = completedVideos.includes(video.id);

            const isCS = video.track.includes("Khoa học máy tính");
            const isICT = video.track.includes("Tin học ứng dụng");

            const chapterCount = video.chapters?.length || 4;
            const exerciseCount = video.exercises?.length || 3;

            return (
              <div
                key={video.id}
                onClick={() => handleOpenVideo(video)}
                className={`group flex flex-col justify-between bg-white dark:bg-[#0f172a] border rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer ${
                  isCompleted
                    ? "border-emerald-500/60 dark:border-emerald-500/40 ring-1 ring-emerald-500/20"
                    : "border-slate-200/90 dark:border-slate-800/90 hover:border-indigo-400/80 dark:hover:border-indigo-500/80"
                }`}
              >
                {/* 16:9 THUMBNAIL WITH PLAY BUTTON */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

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

                  {/* Top-Right: Completed Status Badge */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-mono font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-md shadow-md z-10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã hoàn thành</span>
                    </div>
                  )}

                  {/* Bottom Stats */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/95">
                    <span className="bg-black/70 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      <span>{chapterCount} mốc timeline</span>
                    </span>
                    <span className="bg-black/70 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs flex items-center gap-1">
                      <BookCheck className="w-3 h-3 text-emerald-400" />
                      <span>{exerciseCount} câu trắc nghiệm</span>
                    </span>
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
                      <span>Học 2 cột (Split-View)</span>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>Vào học ngay</span>
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

      {/* 2-COLUMN SPLIT-VIEW LEARNING MODAL */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-7xl h-[94vh] max-h-[900px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOP MODAL BAR */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/95 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0">
                  Lớp {activeVideo.grade} • {activeVideo.track}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                  {activeVideo.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {completedVideos.includes(activeVideo.id) && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã hoàn thành</span>
                  </span>
                )}
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800 transition"
                  title="Mở trên trang YouTube"
                >
                  <span className="hidden md:inline">Mở trên YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Đóng phòng học (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* SPLIT-VIEW CONTAINER (Desktop: 2 columns; Mobile: Stacked) */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              {/* LEFT COLUMN: VIDEO PLAYER (60% width) + TIMELINE */}
              <div className="w-full lg:w-[58%] xl:w-[60%] flex flex-col bg-black overflow-y-auto lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
                {/* 16:9 Aspect Video Player */}
                <div className="relative aspect-video w-full bg-black shrink-0 shadow-lg">
                  <iframe
                    key={`${activeVideo.id}-${currentSeconds}`}
                    src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.url)}?start=${currentSeconds}&autoplay=1&rel=0`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                {/* TIMELINE NỘI DUNG BÀI HỌC */}
                <div className="flex-1 flex flex-col p-4 sm:p-5 bg-slate-950 overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
                        Timeline nội dung bài học
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      Bấm vào mốc để tua nhanh video
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeVideo.chapters && activeVideo.chapters.length > 0 ? (
                      activeVideo.chapters.map((chap, idx) => {
                        const isCurrent = activeChapterIndex === idx;
                        return (
                          <button
                            key={`${chap.time}-${idx}`}
                            onClick={() => handleSeekChapter(chap, idx)}
                            className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition cursor-pointer border ${
                              isCurrent
                                ? "bg-indigo-950/80 border-indigo-500/80 text-white shadow-sm ring-1 ring-indigo-500/30"
                                : "bg-slate-900/60 hover:bg-slate-900 border-slate-800/90 text-slate-300 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md shrink-0 tabular-nums border ${
                                  isCurrent
                                    ? "bg-indigo-600 text-white border-indigo-400"
                                    : "bg-slate-800 text-indigo-300 border-slate-700"
                                }`}
                              >
                                {chap.time}
                              </span>
                              <span className="text-xs sm:text-sm font-medium truncate">
                                {chap.title}
                              </span>
                            </div>

                            <div className="shrink-0 pl-2">
                              {isCurrent ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 font-bold">
                                  <Play className="w-3 h-3 fill-current" />
                                  <span className="hidden sm:inline">Đang phát</span>
                                </span>
                              ) : (
                                <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 italic">Chưa có danh sách mốc thời gian.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: BÀI TẬP THỰC HÀNH NHANH (40% width) */}
              <div className="w-full lg:w-[42%] xl:w-[40%] flex flex-col bg-[#0B1120] overflow-hidden min-h-0">
                {/* PRACTICE HEADER */}
                <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <BookCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                        Bài tập thực hành nhanh
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Kiểm tra kiến thức trực tiếp sau bài giảng
                      </p>
                    </div>
                  </div>

                  {isSubmitted && (
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                        exerciseScore >= 2
                          ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                          : "bg-amber-950 text-amber-300 border-amber-700"
                      }`}
                    >
                      Đúng {exerciseScore}/{(activeVideo.exercises || []).length} ({Math.round((exerciseScore / ((activeVideo.exercises || []).length || 1)) * 100)}%)
                    </div>
                  )}
                </div>

                {/* SCROLLABLE QUESTIONS CONTAINER */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                  {exerciseError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{exerciseError}</span>
                    </div>
                  )}

                  {activeVideo.exercises && activeVideo.exercises.length > 0 ? (
                    activeVideo.exercises.map((ex, qIdx) => {
                      const selectedOpt = userAnswers[qIdx];
                      const isCorrect = isSubmitted && selectedOpt === ex.correctIndex;
                      const isWrong = isSubmitted && selectedOpt !== undefined && selectedOpt !== ex.correctIndex;

                      return (
                        <div
                          key={`q-${qIdx}`}
                          className={`p-4 rounded-2xl border transition-all ${
                            isSubmitted
                              ? isCorrect
                                ? "bg-emerald-950/20 border-emerald-800/80"
                                : "bg-rose-950/20 border-rose-800/80"
                              : "bg-slate-900/70 border-slate-800"
                          }`}
                        >
                          {/* Question Title & Number Badge */}
                          <div className="flex items-start gap-2.5 mb-3">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0">
                              Câu {qIdx + 1}
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                              {ex.question}
                            </p>
                          </div>

                          {/* Options List */}
                          <div className="space-y-2 mt-3">
                            {ex.options.map((opt, optIdx) => {
                              const isThisSelected = selectedOpt === optIdx;
                              const isThisCorrect = isSubmitted && optIdx === ex.correctIndex;
                              const isThisWrongSelection = isSubmitted && isThisSelected && optIdx !== ex.correctIndex;

                              let optionStyle = "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900";

                              if (!isSubmitted && isThisSelected) {
                                optionStyle = "bg-indigo-950/90 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500/30";
                              } else if (isSubmitted) {
                                if (isThisCorrect) {
                                  optionStyle = "bg-emerald-950/90 border-emerald-500 text-emerald-200 font-semibold shadow-xs ring-1 ring-emerald-500/40";
                                } else if (isThisWrongSelection) {
                                  optionStyle = "bg-rose-950/90 border-rose-500 text-rose-200 shadow-xs ring-1 ring-rose-500/40";
                                } else {
                                  optionStyle = "bg-slate-950/40 border-slate-800/50 text-slate-500 opacity-60";
                                }
                              }

                              return (
                                <button
                                  key={`opt-${optIdx}`}
                                  type="button"
                                  disabled={isSubmitted}
                                  onClick={() => handleSelectOption(qIdx, optIdx)}
                                  className={`w-full flex items-start gap-3 p-2.5 sm:p-3 rounded-xl border text-left text-xs transition cursor-pointer ${optionStyle}`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5 ${
                                      isSubmitted && isThisCorrect
                                        ? "bg-emerald-600 text-white border-emerald-500"
                                        : isSubmitted && isThisWrongSelection
                                        ? "bg-rose-600 text-white border-rose-500"
                                        : isThisSelected
                                        ? "bg-indigo-600 text-white border-indigo-500"
                                        : "bg-slate-800 text-slate-400 border-slate-700"
                                    }`}
                                  >
                                    {isSubmitted && isThisCorrect ? (
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    ) : isSubmitted && isThisWrongSelection ? (
                                      <X className="w-3 h-3 stroke-[3]" />
                                    ) : (
                                      String.fromCharCode(65 + optIdx)
                                    )}
                                  </div>
                                  <span className="flex-1 leading-relaxed">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation Box on Submit */}
                          {isSubmitted && (
                            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1 animate-in fade-in">
                              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                                <span>Giải thích đáp án:</span>
                              </div>
                              <p className="text-slate-400 leading-relaxed pl-5">
                                {ex.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 italic">Chưa có bài tập cho video này.</p>
                  )}
                </div>

                {/* PRACTICE FOOTER BUTTONS */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/90 shrink-0 flex flex-col gap-2">
                  {!isSubmitted ? (
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-xs sm:text-sm cursor-pointer shadow-md"
                      onClick={handleSubmitExercise}
                    >
                      <BookCheck className="w-4 h-4 mr-2" />
                      <span>Kiểm tra kết quả trắc nghiệm</span>
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                        onClick={handleResetExercise}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        <span>Làm lại bài tập</span>
                      </Button>
                      <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        onClick={() => setActiveVideo(null)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        <span>Hoàn thành & Đóng</span>
                      </Button>
                    </div>
                  )}
                  <p className="text-[11px] text-center text-slate-500 font-mono">
                    Kết quả làm bài sẽ tự động lưu vào trạng thái &ldquo;Đã hoàn thành&rdquo; của video.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default VideoLibrary;
