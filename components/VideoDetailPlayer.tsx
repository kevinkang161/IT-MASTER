"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, ExternalLink, Share2 } from "lucide-react";
import { VideoItem } from "@/types/video";
import {
  VideoSplitWorkspace,
  STORAGE_COMPLETED_VIDEOS_KEY,
} from "@/components/VideoSplitWorkspace";

export function VideoDetailPlayer({ video }: { video: VideoItem }) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_VIDEOS_KEY);
      if (saved) {
        const list: string[] = JSON.parse(saved);
        if (list.includes(video.id)) {
          setIsCompleted(true);
        }
      }
    } catch (_) {}
  }, [video.id]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="w-full hallmark-surface overflow-hidden flex flex-col">
      {/* TOP HEADER */}
      <div className="px-4 sm:px-6 py-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border)] shrink-0">
            Lớp {video.grade} · {video.track}
          </span>
          <h1 className="font-bold text-sm sm:text-base text-[var(--text-primary)] truncate max-w-xl">
            {video.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã hoàn thành</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleShare}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            title="Sao chép liên kết bài học"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copySuccess ? "Đã sao chép" : "Chia sẻ"}</span>
          </button>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
            title="Mở trên YouTube"
          >
            <span className="hidden sm:inline">YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <VideoSplitWorkspace
        video={video}
        onComplete={() => setIsCompleted(true)}
        containerClassName="flex flex-col lg:flex-row min-h-[600px] lg:h-[740px]"
      />
    </div>
  );
}
