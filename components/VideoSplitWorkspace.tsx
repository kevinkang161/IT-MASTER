"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoItem, VideoChapter } from "@/types/video";

export const STORAGE_COMPLETED_VIDEOS_KEY = "it_master_completed_videos";

export function getYouTubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]+)/);
  return match ? match[1] : "";
}

export function markVideoCompletedInStorage(videoId: string): string[] {
  if (typeof window === "undefined") return [videoId];
  try {
    const saved = localStorage.getItem(STORAGE_COMPLETED_VIDEOS_KEY);
    const list: string[] = saved ? JSON.parse(saved) : [];
    if (!list.includes(videoId)) {
      const updated = [...list, videoId];
      localStorage.setItem(STORAGE_COMPLETED_VIDEOS_KEY, JSON.stringify(updated));
      return updated;
    }
    return list;
  } catch (_) {
    return [videoId];
  }
}

interface VideoSplitWorkspaceProps {
  video: VideoItem;
  onComplete?: (videoId: string) => void;
  footerAction?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Shared 2-column video player + timeline + practice quiz workspace.
 * Used by both the VideoLibrary modal and the dedicated /videos/[id] page.
 */
export function VideoSplitWorkspace({
  video,
  onComplete,
  footerAction,
  containerClassName = "flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0",
}: VideoSplitWorkspaceProps) {
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [exerciseError, setExerciseError] = useState<string>("");

  const exercises = video.exercises || [];

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
    const totalQ = exercises.length;
    if (totalQ === 0) return;

    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < totalQ) {
      setExerciseError(`Vui lòng hoàn thành đủ ${totalQ} câu hỏi trước khi kiểm tra.`);
      return;
    }

    setIsSubmitted(true);
    setExerciseError("");
    markVideoCompletedInStorage(video.id);
    onComplete?.(video.id);
  };

  const handleResetExercise = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setExerciseError("");
  };

  const exerciseScore = useMemo(() => {
    if (!isSubmitted || exercises.length === 0) return 0;
    return exercises.reduce((acc, ex, idx) => {
      return acc + (userAnswers[idx] === ex.correctIndex ? 1 : 0);
    }, 0);
  }, [exercises, isSubmitted, userAnswers]);

  const passThreshold = Math.ceil((exercises.length || 1) / 2);

  return (
    <div className={containerClassName}>
      {/* LEFT COLUMN: VIDEO PLAYER + TIMELINE */}
      <div className="w-full lg:w-[58%] xl:w-[60%] flex flex-col bg-[var(--surface)] overflow-y-auto lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--border)]">
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
        <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[var(--surface)] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                Mốc nội dung bài học
              </h4>
            </div>
            <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">
              Chọn mốc để chuyển nhanh đoạn video
            </span>
          </div>

          <div className="space-y-2">
            {video.chapters && video.chapters.length > 0 ? (
              video.chapters.map((chap, idx) => {
                const isCurrent = activeChapterIndex === idx;
                return (
                  <button
                    key={`${chap.time}-${idx}`}
                    type="button"
                    onClick={() => handleSeekChapter(chap, idx)}
                    className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg text-left transition-colors cursor-pointer border ${
                      isCurrent
                        ? "bg-[var(--accent-subtle)] border-blue-500/70 text-[var(--text-primary)]"
                        : "bg-[var(--bg-subtle)] hover:bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`font-mono text-xs font-semibold px-2 py-0.5 rounded shrink-0 tabular-nums border ${
                          isCurrent
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-[var(--surface)] text-blue-600 dark:text-blue-400 border-[var(--border)]"
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
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                          <Play className="w-3 h-3 fill-current" />
                          <span className="hidden sm:inline">Đang phát</span>
                        </span>
                      ) : (
                        <Play className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-[var(--text-muted)]">Chưa có danh sách mốc thời gian.</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: QUICK PRACTICE QUIZ */}
      <div className="w-full lg:w-[42%] xl:w-[40%] flex flex-col bg-[var(--bg)] overflow-hidden min-h-0">
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <BookCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                Bài tập kiểm tra nhanh
              </h4>
              <p className="text-[11px] text-[var(--text-muted)]">
                Củng cố kiến thức ngay sau bài giảng
              </p>
            </div>
          </div>

          {isSubmitted && (
            <div
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold border tabular-nums shrink-0 ${
                exerciseScore >= passThreshold
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              }`}
            >
              {exerciseScore}/{exercises.length} ({Math.round((exerciseScore / (exercises.length || 1)) * 100)}%)
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {exerciseError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{exerciseError}</span>
            </div>
          )}

          {exercises.length > 0 ? (
            exercises.map((ex, qIdx) => {
              const selectedOpt = userAnswers[qIdx];
              const isCorrect = isSubmitted && selectedOpt === ex.correctIndex;

              return (
                <div
                  key={`q-${qIdx}`}
                  className={`p-4 rounded-xl border transition-colors ${
                    isSubmitted
                      ? isCorrect
                        ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                        : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
                      : "bg-[var(--surface)] border-[var(--border)]"
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-3">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border)] shrink-0 tabular-nums">
                      Câu {qIdx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-snug whitespace-pre-line">
                      {ex.question}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {ex.options.map((opt, optIdx) => {
                      const isThisSelected = selectedOpt === optIdx;
                      const isThisCorrect = isSubmitted && optIdx === ex.correctIndex;
                      const isThisWrongSelection = isSubmitted && isThisSelected && optIdx !== ex.correctIndex;

                      let optionStyle =
                        "bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]";

                      if (!isSubmitted && isThisSelected) {
                        optionStyle =
                          "bg-[var(--accent-subtle)] border-blue-600 dark:border-blue-500 text-[var(--text-primary)] font-medium";
                      } else if (isSubmitted) {
                        if (isThisCorrect) {
                          optionStyle =
                            "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-medium";
                        } else if (isThisWrongSelection) {
                          optionStyle =
                            "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200";
                        } else {
                          optionStyle =
                            "bg-[var(--bg)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60";
                        }
                      }

                      return (
                        <button
                          key={`opt-${optIdx}`}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer disabled:cursor-default ${optionStyle}`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono font-semibold text-[11px] shrink-0 mt-0.5 ${
                              isSubmitted && isThisCorrect
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : isSubmitted && isThisWrongSelection
                                ? "bg-rose-600 text-white border-rose-600"
                                : isThisSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]"
                            }`}
                          >
                            {isSubmitted && isThisCorrect ? (
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            ) : isSubmitted && isThisWrongSelection ? (
                              <X className="w-3 h-3 stroke-[2.5]" />
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
                    <div className="mt-3 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                        <span>Giải thích:</span>
                      </div>
                      <p className="text-[var(--text-secondary)] leading-relaxed pl-5">
                        {ex.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-[var(--text-muted)]">Chưa có bài tập cho video này.</p>
          )}
        </div>

        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] shrink-0 flex flex-col gap-2">
          {!isSubmitted ? (
            <Button
              className="w-full font-semibold py-2.5 text-xs sm:text-sm"
              onClick={handleSubmitExercise}
              disabled={exercises.length === 0}
            >
              <BookCheck className="w-4 h-4" />
              <span>Kiểm tra kết quả</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1 text-xs font-semibold"
                onClick={handleResetExercise}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </Button>
              {footerAction}
            </div>
          )}
          <p className="text-[11px] text-center text-[var(--text-muted)]">
            Kết quả được lưu vào trạng thái hoàn thành của video trên trình duyệt.
          </p>
        </div>
      </div>
    </div>
  );
}
