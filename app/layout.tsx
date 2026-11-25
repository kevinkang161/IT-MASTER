import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";

const beVietnam = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IT MASTER — Nền tảng Học & Ôn thi Tin học Phổ thông Toàn diện",
  description:
    "Học và ôn thi môn Tin học lớp 10, 11, 12 theo chương trình GDPT 2018. Ma trận câu hỏi thi thử tốt nghiệp THPT chuẩn xác.",
  keywords: [
    "Tin học THPT",
    "Ôn thi tốt nghiệp THPT Tin học",
    "Luyện thi Tin học",
    "Tin học 10",
    "Tin học 11",
    "Tin học 12",
    "IT MASTER",
  ],
  authors: [{ name: "IT MASTER Team" }],
  openGraph: {
    title: "IT MASTER — Nền tảng Học & Ôn thi Tin học Phổ thông Toàn diện",
    description:
      "Luyện tập câu hỏi chuẩn hóa, thi thử thời gian thực 45 phút, phân loại theo ba phần thi chính thức.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('itmaster-theme');
                  var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${beVietnam.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white`} suppressHydrationWarning>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
