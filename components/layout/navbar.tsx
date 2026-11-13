"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Trophy,
  Flame,
  Zap,
  Menu,
  X,
  Code2,
  GraduationCap,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  const navLinks = [
    { href: "/learning", label: "Thư viện bài học", icon: BookOpen },
    { href: "/practice", label: "Luyện tập theo chủ đề", icon: CheckCircle2 },
    { href: "/exams", label: "Phòng thi thử THPT", icon: GraduationCap },
    { href: "/leaderboard", label: "Bảng vàng danh dự", icon: Trophy },
    { href: "/#contact", label: "Liên hệ", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-blue-400 flex items-center justify-center font-mono font-bold text-sm shadow-sm border border-slate-800 group-hover:bg-blue-900 group-hover:text-white transition-colors">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-slate-900">
                IT MASTER
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-normal">
                KNTT 10 · 11 · 12
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === "/#contact" ? false : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-blue-700" : "text-slate-400")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Gamification Stats & CTA / Profile */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                {/* Streak & XP Badges */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl text-xs font-semibold">
                  <div className="flex items-center gap-1 text-amber-600" title="Chuỗi học tập liên tục">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{user.streak_days} ngày</span>
                  </div>
                  <div className="w-px h-3.5 bg-slate-200" />
                  <div className="flex items-center gap-1 text-blue-600" title="Tổng điểm kinh nghiệm XP">
                    <Zap className="w-4 h-4 fill-blue-500 text-blue-500" />
                    <span>{user.xp.toLocaleString()} XP</span>
                  </div>
                </div>

                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>{user.full_name || "Bảng học tập"}</span>
                  </Button>
                </Link>

                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="secondary" size="sm" className="gap-1.5 bg-slate-800 text-xs">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Admin CMS</span>
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <LogIn className="w-4 h-4" />
                    <span>Đăng nhập</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Bắt đầu học ngay</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          {user && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-3">
              <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Chuỗi {user.streak_days} ngày</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 text-xs font-bold">
                <Zap className="w-4 h-4 fill-blue-500 text-blue-500" />
                <span>{user.xp.toLocaleString()} XP (Cấp {user.level})</span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === "/#contact" ? false : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-5 h-5 text-blue-600" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Vào bảng học tập của tôi</Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Trang Quản trị Admin (CMS)</Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Đăng nhập</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Tạo tài khoản học sinh</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
