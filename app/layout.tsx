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
    "Học và luyện thi Tin học lớp 10, 11, 12 và kỳ thi Tốt nghiệp THPT với lộ trình bài giảng chuẩn mực, hệ thống trắc nghiệm thông minh, phòng thi thử tính giờ và gamification hấp dẫn.",
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
      "Luyện tập câu hỏi phân loại theo độ khó, thi thử mô phỏng thời gian thực, tích lũy điểm kinh nghiệm và thăng hạng.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const attrs = ['bis_skin_checked', 'data-bis-skin-checked'];
                function stripAttrs(node) {
                  if (node && node.nodeType === 1) {
                    attrs.forEach(function(attr) {
                      if (node.hasAttribute(attr)) node.removeAttribute(attr);
                    });
                    if (node.querySelectorAll) {
                      attrs.forEach(function(attr) {
                        const els = node.querySelectorAll('[' + attr + ']');
                        for (let i = 0; i < els.length; i++) els[i].removeAttribute(attr);
                      });
                    }
                  }
                }
                stripAttrs(document.documentElement);
                const observer = new MutationObserver(function(mutations) {
                  for (let i = 0; i < mutations.length; i++) {
                    const m = mutations[i];
                    if (m.type === 'attributes' && attrs.indexOf(m.attributeName) !== -1) {
                      m.target.removeAttribute(m.attributeName);
                    } else if (m.type === 'childList') {
                      for (let j = 0; j < m.addedNodes.length; j++) {
                        stripAttrs(m.addedNodes[j]);
                      }
                    }
                  }
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                  attributeFilter: attrs
                });
              })();
            `,
          }}
        />
      </head>
      <body className={`${beVietnam.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#F8FAFC] dark:bg-[#070B19] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300`} suppressHydrationWarning>
        {/* GLOBAL ATMOSPHERIC BACKGROUND (TECH & MODERN CS) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* Top subtle illumination cone */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-indigo-500/10 dark:from-indigo-600/15 via-blue-500/5 dark:via-blue-600/5 to-transparent blur-3xl opacity-75" />
          {/* Global engineering grid */}
          <div className="absolute inset-0 bg-tech-grid mask-radial-fade opacity-80 dark:opacity-50" />
          {/* Ambient lighting spots for long scrolling pages */}
          <div className="absolute top-[35%] -right-48 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 blur-3xl rounded-full" />
          <div className="absolute top-[70%] -left-48 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 blur-3xl rounded-full" />
        </div>

        {/* CONTENT TREE */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <AuthProvider>
            <AuthGuard>{children}</AuthGuard>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
