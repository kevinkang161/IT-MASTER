import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";

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
      <body className={`${beVietnam.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col`} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
