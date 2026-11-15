"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronDown,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DemoTrialBanner } from "@/components/auth/demo-trial-banner";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, isDemo, logout } = useAuth();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/learning", label: "Thư viện bài học", icon: BookOpen },
    { href: "/practice", label: "Luyện tập theo chủ đề", icon: CheckCircle2 },
    { href: "/exams", label: "Phòng thi thử THPT", icon: GraduationCap },
    { href: "/leaderboard", label: "Bảng vàng danh dự", icon: Trophy },
    { href: "/#contact", label: "Liên hệ", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md transition-colors">
      {isDemo && <DemoTrialBanner />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-blue-400 flex items-center justify-center font-mono font-bold text-sm shadow-sm border border-slate-800 group-hover:bg-blue-900 group-hover:text-white transition-colors">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                IT MASTER
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-normal">
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
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Gamification Stats & CTA / Profile */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                {/* Streak & XP Badges */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-2.5 py-1 rounded-xl text-xs font-semibold">
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400" title="Chuỗi học tập liên tục">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-mono tabular-nums">{user.streak_days || 1} ngày</span>
                  </div>
                  <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />
                  <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400" title="Tổng điểm kinh nghiệm XP">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="font-mono tabular-nums">{(user.xp || 0).toLocaleString()} XP</span>
                  </div>
                </div>

                {/* USER ACCOUNT DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition shadow-sm"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="max-w-[120px] truncate">{user.full_name || "Tài khoản"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-100">
                      {/* User Info Header */}
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {user.full_name}
                          </p>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isAdmin 
                              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                              : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          }`}>
                            {isAdmin ? "Admin" : `Lớp ${user.grade_level || 12}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                          {user.email}
                        </p>
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Cấp độ {user.level || 1}</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{(user.xp || 0).toLocaleString()} XP</span>
                        </div>
                      </div>

                      {/* Navigation links */}
                      <div className="py-1 text-xs">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Bảng học tập cá nhân</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        >
                          <UserCircle className="w-4 h-4 text-slate-400" />
                          <span>Thông tin & Hồ sơ cá nhân</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-semibold"
                          >
                            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Trung tâm Quản trị CMS</span>
                          </Link>
                        )}
                      </div>

                      {/* Explicit Logout Action */}
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Đăng xuất tài khoản</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct quick logout icon button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Đăng xuất khỏi tài khoản"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="gap-1.5 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng nhập</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm">
                    <span>Đăng ký học sinh</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 pt-2 pb-6 space-y-3">
          {user ? (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{user.full_name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  {isAdmin ? "Admin" : `Lớp ${user.grade_level || 12}`}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold font-mono">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Chuỗi {user.streak_days || 1} ngày</span>
                </div>
                <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{(user.xp || 0).toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1 mb-2">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Bạn chưa đăng nhập</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Đăng nhập hoặc đăng ký để lưu tiến độ và nhận điểm XP.</p>
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
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    <span>Bảng học tập cá nhân</span>
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    <UserCircle className="w-4 h-4 mr-2" />
                    <span>Hồ sơ & Đổi thông tin</span>
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      <ShieldCheck className="w-4 h-4 mr-2 text-indigo-600" />
                      <span>Trang Quản trị Admin (CMS)</span>
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2 text-rose-500" />
                  <span>Đăng xuất tài khoản</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
                    <LogIn className="w-4 h-4 mr-2" />
                    <span>Đăng nhập</span>
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    <span>Tạo tài khoản học sinh (Đăng ký)</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
