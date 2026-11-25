"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flame,
  Zap,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  UserCircle,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    { href: "/learning", label: "Bài học" },
    { href: "/videos", label: "Video" },
    { href: "/practice", label: "Luyện tập" },
    { href: "/exams", label: "Thi thử" },
    { href: "/leaderboard", label: "Bảng vàng" },
    { href: "/#contact", label: "Liên hệ" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm transition-colors">
      {isDemo && <DemoTrialBanner />}
      <div className="hallmark-container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/images/logo.jpg"
              alt="IT Master Logo"
              className="w-9 h-9 rounded-lg object-cover border border-[var(--border)] shrink-0"
            />
            <div className="flex flex-col leading-tight whitespace-nowrap">
              <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
                IT MASTER
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] whitespace-nowrap">
                KNTT 10 · 11 · 12
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/#contact" ? false : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Controls */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                {/* Streak & XP compact counter */}
                <div className="flex items-center gap-2 bg-[var(--bg-subtle)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg text-xs font-medium">
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400" title="Chuỗi ngày học liên tục">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono tabular-nums">{user.streak_days || 1} ngày</span>
                  </div>
                  <div className="w-px h-3.5 bg-[var(--border)]" />
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400" title="Tổng điểm kinh nghiệm XP">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono tabular-nums">{(user.xp || 0).toLocaleString()} XP</span>
                  </div>
                </div>

                {/* User Account Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-semibold transition cursor-pointer"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="max-w-[110px] truncate">{user.full_name || "Tài khoản"}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-[var(--text-muted)] transition-transform", userDropdownOpen && "rotate-180")} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-lg py-1.5 z-50 divide-y divide-[var(--border)]">
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                            {user.full_name}
                          </p>
                          <span
                            className={cn(
                              "text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border shrink-0",
                              isAdmin
                                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            )}
                          >
                            {isAdmin ? "Quản trị" : `Lớp ${user.grade_level || 12}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                          {user.email}
                        </p>
                        <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                          <span>Cấp độ {user.level || 1}</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
                            {(user.xp || 0).toLocaleString()} XP
                          </span>
                        </div>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[var(--text-muted)]" />
                          <span>Bảng học tập cá nhân</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition"
                        >
                          <UserCircle className="w-4 h-4 text-[var(--text-muted)]" />
                          <span>Hồ sơ &amp; Lịch sử học</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition font-semibold"
                          >
                            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>Quản trị nội dung</span>
                          </Link>
                        )}
                      </div>

                      {isDemo && (
                        <div className="py-1 bg-amber-50/70 dark:bg-amber-950/30 text-xs">
                          <button
                            type="button"
                            onClick={async () => {
                              setUserDropdownOpen(false);
                              await logout();
                              router.push("/register");
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 font-semibold text-blue-700 dark:text-blue-300 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition text-left cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>Đăng ký tài khoản thật</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              setUserDropdownOpen(false);
                              await logout();
                              router.push("/login");
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition text-left cursor-pointer"
                          >
                            <LogIn className="w-4 h-4" />
                            <span>Đăng nhập tài khoản cá nhân</span>
                          </button>
                        </div>
                      )}

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    <span>Đăng nhập</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    <span>Đăng ký</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 pt-3 pb-6 space-y-3">
          <div className="hallmark-container !px-0 space-y-3">
            {user ? (
              <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">{user.full_name}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">{user.email}</div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                    {isAdmin ? "Quản trị" : `Lớp ${user.grade_level || 12}`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs">
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold font-mono tabular-nums">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{user.streak_days || 1} ngày</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold font-mono tabular-nums">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{(user.xp || 0).toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-center space-y-1">
                <p className="text-xs font-semibold text-[var(--text-primary)]">Bạn chưa đăng nhập</p>
                <p className="text-[11px] text-[var(--text-muted)]">Đăng nhập hoặc đăng ký để lưu tiến độ học tập.</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {navLinks.map((link) => {
                const isActive = link.href === "/#contact" ? false : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex flex-col sm:flex-row gap-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button className="w-full" size="sm">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Bảng học tập</span>
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <UserCircle className="w-4 h-4" />
                      <span>Hồ sơ cá nhân</span>
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Quản trị</span>
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <LogIn className="w-4 h-4" />
                      <span>Đăng nhập</span>
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button className="w-full" size="sm">
                      <span>Đăng ký tài khoản</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
