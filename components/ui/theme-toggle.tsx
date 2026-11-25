"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("itmaster-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("itmaster-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("itmaster-theme", "dark");
      setIsDark(true);
    }
  };

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Chuyển chế độ Sáng / Tối"
      title={isDark ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer ${
        isDark ? "text-amber-300 hover:text-amber-200" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      } ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
