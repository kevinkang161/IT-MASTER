# IT MASTER — Nền tảng Học & Ôn thi Tin học Phổ thông Toàn diện

> **IT MASTER** là ứng dụng giáo dục chuẩn EdTech thương mại dành cho học sinh THPT các khối lớp 10, 11, 12 và thí sinh chuẩn bị kỳ thi Tốt nghiệp THPT Quốc gia theo chương trình Giáo dục Phổ thông mới.

---

## 🚀 Công nghệ chính (Technology Stack)

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript strict mode.
* **Styling & UI:** Tailwind CSS, shadcn/ui pattern, Lucide React icons.
* **Biểu mẫu & Xác thực:** React Hook Form, Zod validation.
* **Backend & Cơ sở dữ liệu:** Supabase PostgreSQL, Supabase Authentication, Row Level Security (RLS).
* **Kiến trúc dữ liệu kép:** Hỗ trợ song song Chế độ Demo/Mock Data thông minh và Chế độ Live Supabase đồng bộ thời gian thực.

---

## 📁 Cấu trúc thư mục dự án

```text
├── app/
│   ├── (public)/          # Landing page, SEO robots, sitemap
│   ├── admin/             # Trung tâm quản trị CMS dành cho Giáo viên/Admin
│   ├── dashboard/         # Bảng điều khiển cá nhân hóa học sinh
│   ├── learning/          # Thư viện bài giảng Lớp 10, 11, 12
│   │   └── [slug]/        # Giao diện đọc bài giảng, code snippet & kiểm tra nhanh
│   ├── practice/          # Hệ thống luyện tập trắc nghiệm 4 định dạng
│   ├── exams/             # Danh sách đề thi thử THPT
│   │   └── [slug]/        # Phòng thi đếm ngược 45 phút, lưu bài & chấm điểm
│   ├── leaderboard/       # Bảng vàng vinh danh (Top tuần, tháng, mọi thời điểm)
│   ├── profile/           # Quản lý thông tin & lịch sử học tập
│   ├── login/ & register/ # Đăng nhập & Đăng ký tài khoản học sinh
│   └── api/exams/submit/  # API chấm điểm bài thi an toàn trên server
├── components/
│   ├── ui/                # Button, Card, Badge, Progress, CodeViewer
│   └── layout/            # Navbar responsive, Footer chuẩn mực EdTech
├── lib/
│   ├── auth/              # AuthProvider & hook useAuth phân quyền RBAC
│   ├── supabase/          # Supabase Client, Server SSR, Middleware
│   ├── mock-data.ts       # Ngân hàng dữ liệu mẫu chuẩn GDPT 2018 & Đề 2025+
│   └── utils.ts           # Hàm tính level XP, format thời gian
├── types/                 # TypeScript interfaces chuẩn hóa DDL Database
└── supabase/
    └── migrations/        # 001_initial_schema.sql (22 bảng, RLS & triggers)
```

---

## ⚡ Hướng dẫn cài đặt & Khởi chạy (Local Development)

### 1. Khởi chạy máy chủ phát triển
```bash
pnpm dev
```
Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

### 2. Kiểm tra biên dịch Production Build
```bash
pnpm build
```

---

## 🗄️ Hướng dẫn kết nối Supabase của bạn

Dự án Supabase của bạn đã được nhận diện tại mã dự án: `cfitwhpxtdlsnfrbsreh`.

### Bước 1: Khởi tạo bảng dữ liệu trên Supabase
1. Đăng nhập [Supabase Dashboard](https://supabase.com/dashboard/project/cfitwhpxtdlsnfrbsreh).
2. Vào mục **SQL Editor** ở thanh menu bên trái.
3. Mở tệp `supabase/migrations/001_initial_schema.sql` trong dự án này, copy toàn bộ nội dung và dán vào SQL Editor.
4. Nhấn **Run** để tự động tạo 22 bảng, hệ thống chỉ mục và các chính sách bảo mật RLS.

### Bước 2: Cập nhật API Keys vào `.env.local`
1. Tại trang **API Keys** trên Supabase Dashboard:
   * Copy mã **Publishable key** (`sb_publishable_...` hoặc `anon key`).
   * Copy mã **Secret key** (`sb_secret_...` hoặc `service_role key`).
2. Mở tệp `.env.local` trong thư mục dự án và điền vào:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://cfitwhpxtdlsnfrbsreh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=dán_publishable_key_vào_đây
   SUPABASE_SERVICE_ROLE_KEY=dán_secret_key_vào_đây
   NEXT_PUBLIC_PLATFORM_MODE=live
   ```

---

## 🏆 Các tính năng đột phá đã hoàn thiện

1. **Format đề thi Tốt nghiệp THPT 2025+:**
   * Phần I: Trắc nghiệm 4 lựa chọn kinh điển.
   * Phần II: Trắc nghiệm Đúng / Sai (mỗi câu 4 ý khẳng định a, b, c, d).
   * Phần III: Câu hỏi trả lời ngắn (tự điền kết quả thuật toán Python/SQL).
2. **Phòng thi áp lực thời gian thực:**
   * Đồng hồ đếm ngược 45 phút, cảnh báo chớp nháy đỏ khi dưới 5 phút.
   * Bảng câu hỏi thông minh 4 trạng thái: *Đang làm, Đã chọn đáp án, Chưa làm, Đánh dấu xem lại*.
   * Tự động nộp bài khi hết giờ và tính điểm theo thang điểm 10.0.
3. **Gamification tạo động lực:**
   * Tích lũy XP qua từng hành động: đọc bài (+50 XP), làm đúng trắc nghiệm (+10 XP), hoàn thành thi thử (+100 XP).
   * Thăng cấp bậc (Level) kèm thanh tiến độ mượt mà.
   * Giữ chuỗi lửa học tập hàng ngày (Streak Days).
   * Bảng vàng danh dự với bục vinh danh Top 1, 2, 3 và danh sách thứ hạng tuần/tháng.
4. **Phân quyền bảo mật (RBAC):**
   * Học sinh chỉ truy cập bảng điều khiển cá nhân và làm bài.
   * Quản trị viên (Admin) sở hữu khu vực CMS chuyên biệt để đăng bài giảng, duyệt câu hỏi và xem lịch sử kiểm toán (Audit Logs).
