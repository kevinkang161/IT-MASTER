"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Zap,
  Award,
  Star,
  Medal,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MOCK_LEADERBOARD, MOCK_ACHIEVEMENTS } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth/auth-context";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("week");

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="primary">Bảng vàng vinh danh & Thành tích</Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bảng Xếp Hạng Học Sinh Xuất Sắc
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Thi đua tích lũy điểm kinh nghiệm (XP), giữ chuỗi học tập (Streak) và chinh phục những đỉnh cao mới của bộ môn Tin học THPT.
          </p>
        </div>

        {/* TIMEFRAME TABS */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setTimeframe("week")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              timeframe === "week"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Bảng xếp hạng Tuần này
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              timeframe === "month"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Bảng xếp hạng Tháng này
          </button>
          <button
            onClick={() => setTimeframe("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              timeframe === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Tất cả các thời điểm
          </button>
        </div>

        {/* PODIUM TOP 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 items-end">
          {/* #2 Silver */}
          <div className="order-2 md:order-1 bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-3 relative hover:-translate-y-1 transition duration-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700 font-extrabold flex items-center justify-center mx-auto text-lg">
              2
            </div>
            <img
              src={MOCK_LEADERBOARD[1].avatar}
              alt={MOCK_LEADERBOARD[1].name}
              className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-slate-300 dark:border-slate-700"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{MOCK_LEADERBOARD[1].name}</h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">{MOCK_LEADERBOARD[1].grade}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1 font-black text-blue-600 dark:text-blue-400 text-sm">
              <Zap className="w-4 h-4 fill-blue-500" />
              <span>{MOCK_LEADERBOARD[1].xp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* #1 Gold */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-[#0f172a] p-6 sm:p-8 rounded-3xl border-2 border-amber-300 dark:border-amber-500/50 shadow-md text-center space-y-4 relative md:-translate-y-4 hover:-translate-y-5 transition duration-200">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-amber-400 text-amber-950 font-black shadow-md flex items-center gap-1 text-xs">
              <Trophy className="w-4 h-4" />
              <span>Quán Quân</span>
            </div>
            <div className="w-14 h-14 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center mx-auto text-xl shadow-inner mt-2">
              1
            </div>
            <img
              src={MOCK_LEADERBOARD[0].avatar}
              alt={MOCK_LEADERBOARD[0].name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-sm"
            />
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{MOCK_LEADERBOARD[0].name}</h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">{MOCK_LEADERBOARD[0].grade}</span>
            </div>
            <div className="pt-2 border-t border-amber-100 dark:border-slate-800 flex items-center justify-center gap-1 font-black text-blue-600 dark:text-blue-400 text-base">
              <Zap className="w-5 h-5 fill-blue-500" />
              <span>{MOCK_LEADERBOARD[0].xp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="order-3 bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-3 relative hover:-translate-y-1 transition duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-2 border-amber-400/50 dark:border-amber-700/50 font-extrabold flex items-center justify-center mx-auto text-lg">
              3
            </div>
            <img
              src={MOCK_LEADERBOARD[2].avatar}
              alt={MOCK_LEADERBOARD[2].name}
              className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-amber-400/50 dark:border-amber-700/50"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{MOCK_LEADERBOARD[2].name}</h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">{MOCK_LEADERBOARD[2].grade}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1 font-black text-blue-600 dark:text-blue-400 text-sm">
              <Zap className="w-4 h-4 fill-blue-500" />
              <span>{MOCK_LEADERBOARD[2].xp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* FULL LEADERBOARD TABLE */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden max-w-4xl mx-auto">
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Chi tiết thứ hạng tuần này</h3>
            <span className="text-xs text-slate-400">Cập nhật thời gian thực</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {MOCK_LEADERBOARD.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition ${
                  item.name.includes("Bạn") ? "bg-blue-50/70 dark:bg-blue-950/40" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="w-6 text-center text-sm font-black text-slate-400">
                    {idx + 1}
                  </span>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.name.includes("Bạn") && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          Bạn
                        </span>
                      )}
                    </h5>
                    <span className="text-xs text-slate-400">{item.grade} • Cấp {item.level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="hidden sm:flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Flame className="w-4 h-4 fill-amber-500" />
                    <span>{item.streak} ngày</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <Zap className="w-4 h-4 fill-blue-500" />
                    <span>{item.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACHIEVEMENTS GRID */}
        <div className="max-w-4xl mx-auto space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Huy hiệu thành tích có thể mở khóa</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_ACHIEVEMENTS.map((ach) => (
              <Card key={ach.id} className="p-5 flex items-start gap-4 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{ach.xp_bonus} XP</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ach.description}</p>
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
