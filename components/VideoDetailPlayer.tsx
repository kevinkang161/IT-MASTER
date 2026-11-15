"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  Clock,
  BookCheck,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Lightbulb,
  Check,
  X,
  ExternalLink,
  Youtube,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoItem, VideoChapter } from "@/types/video";

function getYouTubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]+)/);
  return match ? match[1] : "";
}

const STORAGE_COMPLETED_KEY = "it_master_completed_videos";

export function VideoDetailPlayer({ video }: { video: VideoItem }) {
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [exerciseError, setExerciseError] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Check completed status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (saved) {
        const list: string[] = JSON.parse(saved);
        if (list.includes(video.id)) {
          setIsCompleted(true);
        }
      }
    } catch (_) {}
  }, [video.id]);

  const handleSeekChapter = (chapter: VideoChapter, idx: number) => {
    setCurrentSeconds(chapter.seconds);
    setActiveChapterIndex(idx);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setExerciseError("");
  };

  const handleSubmitExercise = () => {
    if (!video.exercises) return;
    const totalQ = video.exercises.length;
    const answeredCount = Object.keys(userAnswers).length;

    if (answeredCount < totalQ) {
      setExerciseError(`Vui lòng trả lời đủ ${totalQ} câu hỏi trước khi kiểm tra!`);
      return;
    }

    setIsSubmitted(true);
    setExerciseError("");
    setIsCompleted(true);

    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_KEY);
      const list: string[] = saved ? JSON.parse(saved) : [];
      if (!list.includes(video.id)) {
        const updated = [...list, video.id];
        localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(updated));
      }
    } catch (_) {}
  };

  const handleResetExercise = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setExerciseError("");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const exerciseScore = useMemo(() => {
    if (!video.exercises || !isSubmitted) return 0;
    return video.exercises.reduce((acc, ex, idx) => {
      return acc + (userAnswers[idx] === ex.correctIndex ? 1 : 0);
    }, 0);
  }, [video.exercises, isSubmitted, userAnswers]);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* TOP HEADER */}
      <div className="px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/95">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0">
            Lớp {video.grade} • {video.track}
          </span>
          <h1 className="font-bold text-sm sm:text-base text-white truncate max-w-xl">
            {video.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã hoàn thành</span>
            </span>
          )}
          <button
            onClick={handleShare}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800 transition cursor-pointer"
            title="Sao chép link bài học"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copySuccess ? "Đã chép link!" : "Chia sẻ"}</span>
          </button>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800 transition"
            title="Mở trên YouTube"
          >
            <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span className="hidden sm:inline">YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2-COLUMN SPLIT-VIEW */}
      <div className="flex flex-col lg:flex-row min-h-[600px] lg:h-[750px]">
        {/* LEFT COLUMN: 60% VIDEO + TIMELINE */}
        <div className="w-full lg:w-[60%] flex flex-col bg-black border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto">
          {/* 16:9 Aspect Video */}
          <div className="relative aspect-video w-full bg-black shrink-0">
            <iframe
              key={`${video.id}-${currentSeconds}`}
              src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}?start=${currentSeconds}&autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* TIMELINE */}
          <div className="p-5 bg-slate-950 flex-1 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Timeline nội dung bài học
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Bấm vào mốc để tua video
              </span>
            </div>

            <div className="space-y-2">
              {video.chapters && video.chapters.map((chap, idx) => {
                const isCurrent = activeChapterIndex === idx;
                return (
                  <button
                    key={`${chap.time}-${idx}`}
                    onClick={() => handleSeekChapter(chap, idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition cursor-pointer border ${
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
                          <span>Đang phát</span>
                        </span>
                      ) : (
                        <Play className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 40% BÀI TẬP THỰC HÀNH */}
        <div className="w-full lg:w-[40%] flex flex-col bg-[#0B1120] overflow-hidden">
          {/* PRACTICE HEADER */}
          <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <BookCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  Bài tập thực hành nhanh
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ôn luyện kiến thức cốt lõi ngay sau khi xem video
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
                Đúng {exerciseScore}/{(video.exercises || []).length}
              </div>
            )}
          </div>

          {/* QUESTIONS LIST */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {exerciseError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{exerciseError}</span>
              </div>
            )}

            {video.exercises && video.exercises.map((ex, qIdx) => {
              const selectedOpt = userAnswers[qIdx];
              const isCorrect = isSubmitted && selectedOpt === ex.correctIndex;

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
                  <div className="flex items-start gap-2.5 mb-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0">
                      Câu {qIdx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                      {ex.question}
                    </p>
                  </div>

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
            })}
          </div>

          {/* FOOTER ACTION */}
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
              <Button
                variant="outline"
                className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                onClick={handleResetExercise}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span>Làm lại bài tập</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
