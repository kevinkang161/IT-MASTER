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
      <div className={`w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Chuyển chế độ Sáng / Tối chống mỏi mắt"
      title={isDark ? "Chuyển sang chế độ Sáng dịu (#F8FAFC)" : "Chuyển sang chế độ Tối chống mỏi mắt (#0B1120)"}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors ${
        isDark
          ? "border-slate-700 bg-slate-900/80 text-amber-300 hover:bg-slate-800 hover:text-amber-200"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      } ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
