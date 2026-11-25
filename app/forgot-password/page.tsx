"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      if (!supabase) {
        setError(
          "Hệ thống đang chạy ở chế độ Demo cục bộ (chưa kết nối máy chủ email Supabase). Vui lòng dùng tài khoản học thử hoặc liên hệ quản trị viên để được hỗ trợ."
        );
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;

      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể gửi email khôi phục.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <img
            src="/images/logo.jpg"
            alt="IT Master Logo"
            className="w-9 h-9 rounded-lg object-cover border border-[var(--border)] shrink-0"
          />
          <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
            IT MASTER
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Khôi phục mật khẩu
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Nhập email đăng ký để nhận liên kết đặt lại mật khẩu.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Kiểm tra hộp thư của bạn
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến địa chỉ{" "}
                <strong className="text-[var(--text-primary)]">{email}</strong>. Vui lòng kiểm tra cả thư mục Spam nếu không thấy.
              </p>
              <Link href="/login" className="inline-block mt-4 w-full">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại đăng nhập</span>
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Địa chỉ Email đăng ký
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hocsinh@thpt.edu.vn"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-2.5 text-sm mt-2" isLoading={isLoading}>
                Gửi liên kết khôi phục
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại trang đăng nhập</span>
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
