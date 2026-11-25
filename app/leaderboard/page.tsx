"use client";

import React, { useState, useMemo } from "react";
import {
  Trophy,
  Flame,
  Zap,
  Award,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MOCK_LEADERBOARD, MOCK_ACHIEVEMENTS } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth/auth-context";
import { calculateLevel } from "@/lib/utils";

type Timeframe = "week" | "month" | "all";

interface LeaderboardEntry {
  id: string;
  name: string;
  grade: string;
  xp: number;
  level: number;
  streak: number;
  avatar: string;
  isCurrentUser?: boolean;
}

const TIMEFRAME_META: Record<
  Timeframe,
  { label: string; heading: string; multiplier: number; streakOffset: number }
> = {
  week: {
    label: "Tuần này",
    heading: "Thứ hạng tuần này",
    multiplier: 1,
    streakOffset: 0,
  },
  month: {
    label: "Tháng này",
    heading: "Thứ hạng tháng này",
    multiplier: 3.4,
    streakOffset: 6,
  },
  all: {
    label: "Tất cả thời gian",
    heading: "Bảng xếp hạng tổng tích lũy",
    multiplier: 8.5,
    streakOffset: 12,
  },
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<Timeframe>("week");

  const entries: LeaderboardEntry[] = useMemo(() => {
    const meta = TIMEFRAME_META[timeframe];
    const basePeers = MOCK_LEADERBOARD.filter((item) => item.id !== "u-3").map((item) => {
      const scaledXp = Math.round(item.xp * meta.multiplier);
      return {
        id: item.id,
        name: item.name,
        grade: item.grade,
        xp: scaledXp,
        level: calculateLevel(scaledXp).level,
        streak: item.streak + meta.streakOffset,
        avatar: item.avatar,
        isCurrentUser: false,
      };
    });

    if (user) {
      const userEntry: LeaderboardEntry = {
        id: user.id,
        name: `${user.full_name} (Bạn)`,
        grade: `Lớp ${user.grade_level || 12}`,
        xp: user.xp ?? 0,
        level: calculateLevel(user.xp ?? 0).level,
        streak: user.streak_days ?? 1,
        avatar:
          user.avatar_url ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        isCurrentUser: true,
      };
      return [...basePeers, userEntry].sort((a, b) => b.xp - a.xp);
    }

    const guestPlaceholder = MOCK_LEADERBOARD.find((item) => item.id === "u-3");
    if (guestPlaceholder) {
      basePeers.push({
        id: guestPlaceholder.id,
        name: "Học sinh mẫu",
        grade: guestPlaceholder.grade,
        xp: Math.round(guestPlaceholder.xp * meta.multiplier),
        level: calculateLevel(Math.round(guestPlaceholder.xp * meta.multiplier)).level,
        streak: guestPlaceholder.streak + meta.streakOffset,
        avatar: guestPlaceholder.avatar,
        isCurrentUser: false,
      });
    }

    return basePeers.sort((a, b) => b.xp - a.xp);
  }, [timeframe, user]);

  const topThree = entries.slice(0, 3);
  const currentUserRank = user ? entries.findIndex((e) => e.isCurrentUser) + 1 : null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors">
      <Navbar />

      <main className="flex-1 hallmark-container w-full py-8 sm:py-10 space-y-8">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Bảng vàng vinh danh · Dữ liệu minh họa kết hợp thứ hạng cá nhân
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Bảng xếp hạng học sinh
          </h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Tích lũy điểm kinh nghiệm (XP) thông qua đọc bài giảng, luyện tập trắc nghiệm và hoàn thành đề thi thử.
          </p>
        </div>

        {/* TIMEFRAME TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(["week", "month", "all"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors border cursor-pointer ${
                timeframe === tf
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              {TIMEFRAME_META[tf].label}
            </button>
          ))}
        </div>

        {/* PODIUM TOP 3 */}
        {topThree.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto pt-2 items-end">
            {/* #2 Silver */}
            <div className="order-2 md:order-1 hallmark-surface p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border)] font-mono font-bold flex items-center justify-center mx-auto text-sm">
                #2
              </div>
              <img
                src={topThree[1].avatar}
                alt={topThree[1].name}
                className="w-14 h-14 rounded-full mx-auto object-cover border border-[var(--border)]"
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">{topThree[1].name}</h4>
                <span className="text-xs text-[var(--text-muted)]">{topThree[1].grade}</span>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-center gap-1 font-mono font-bold text-blue-600 dark:text-blue-400 text-sm tabular-nums">
                <Zap className="w-4 h-4 fill-current" />
                <span>{topThree[1].xp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* #1 Gold */}
            <div className="order-1 md:order-2 hallmark-surface p-6 sm:p-7 border-amber-400 dark:border-amber-600/80 text-center space-y-3.5 relative">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-semibold">
                <Trophy className="w-3.5 h-3.5" />
                <span>Hạng 1</span>
              </div>
              <img
                src={topThree[0].avatar}
                alt={topThree[0].name}
                className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-amber-400"
              />
              <div>
                <h4 className="text-base font-bold text-[var(--text-primary)]">{topThree[0].name}</h4>
                <span className="text-xs text-[var(--text-muted)]">{topThree[0].grade}</span>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-center gap-1 font-mono font-bold text-blue-600 dark:text-blue-400 text-base tabular-nums">
                <Zap className="w-4 h-4 fill-current" />
                <span>{topThree[0].xp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* #3 Bronze */}
            <div className="order-3 hallmark-surface p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono font-bold flex items-center justify-center mx-auto text-sm">
                #3
              </div>
              <img
                src={topThree[2].avatar}
                alt={topThree[2].name}
                className="w-14 h-14 rounded-full mx-auto object-cover border border-[var(--border)]"
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">{topThree[2].name}</h4>
                <span className="text-xs text-[var(--text-muted)]">{topThree[2].grade}</span>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-center gap-1 font-mono font-bold text-blue-600 dark:text-blue-400 text-sm tabular-nums">
                <Zap className="w-4 h-4 fill-current" />
                <span>{topThree[2].xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        )}

        {/* FULL LEADERBOARD TABLE */}
        <div className="hallmark-surface overflow-hidden max-w-4xl mx-auto">
          <div className="p-4 sm:px-6 border-b border-[var(--border)] flex items-center justify-between gap-3">
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              {TIMEFRAME_META[timeframe].heading}
            </h3>
            {currentUserRank && (
              <Badge variant="primary" className="font-mono">
                Vị trí của bạn: #{currentUserRank}
              </Badge>
            )}
          </div>

          <div className="divide-y divide-[var(--border)]">
            {entries.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
                  item.isCurrentUser
                    ? "bg-[var(--accent-subtle)]/70"
                    : "hover:bg-[var(--bg-subtle)]/60"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className="w-6 text-center text-sm font-mono font-bold text-[var(--text-muted)] tabular-nums shrink-0">
                    {idx + 1}
                  </span>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-[var(--border)] shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 truncate">
                      <span className="truncate">{item.name}</span>
                      {item.isCurrentUser && (
                        <Badge variant="primary" className="text-[10px] shrink-0">
                          Bạn
                        </Badge>
                      )}
                    </h5>
                    <span className="text-xs text-[var(--text-muted)]">
                      {item.grade} · Cấp {item.level}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                  <div className="hidden sm:flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono tabular-nums">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{item.streak} ngày</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-mono font-bold tabular-nums">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{item.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACHIEVEMENTS GRID */}
        <div className="max-w-4xl mx-auto space-y-4 pt-4">
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Huy hiệu thành tích</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_ACHIEVEMENTS.map((ach) => (
              <Card key={ach.id} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {ach.title}
                    </h4>
                    <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                      +{ach.xp_bonus} XP
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
