import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = [
  "thaidoanhoangbh@gmail.com",
  "admin@itmaster.edu.vn",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, gradeLevel } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ họ tên, email và mật khẩu." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có độ dài tối thiểu 6 ký tự." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const role = ADMIN_EMAILS.includes(cleanEmail) ? "admin" : "student";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Create user with email_confirm: true so student can login immediately
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName.trim(),
          grade_level: gradeLevel || 12,
          role,
        },
      });

      if (createError) {
        if (createError.message.includes("already registered") || createError.message.includes("already exists")) {
          return NextResponse.json(
            { error: "Email này đã được đăng ký. Vui lòng chuyển sang trang Đăng nhập." },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: `Lỗi đăng ký: ${createError.message}` },
          { status: 400 }
        );
      }

      // Try inserting into profiles table if it exists
      if (newUser?.user) {
        try {
          await adminClient.from("profiles").upsert({
            id: newUser.user.id,
            email: cleanEmail,
            full_name: fullName.trim(),
            role,
            grade_level: gradeLevel || 12,
            xp: 100,
            level: 1,
            streak_days: 1,
            longest_streak: 1,
            last_active_date: new Date().toISOString().split("T")[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } catch (_) {
          // Table may not be migrated yet, ignore gracefully
        }
      }

      return NextResponse.json({
        success: true,
        user: {
          id: newUser?.user?.id,
          email: cleanEmail,
          full_name: fullName.trim(),
          role,
          grade_level: gradeLevel || 12,
        },
      });
    }

    // Fallback if no Supabase credentials
    return NextResponse.json({
      success: true,
      user: {
        id: "usr-" + Date.now(),
        email: cleanEmail,
        full_name: fullName.trim(),
        role,
        grade_level: gradeLevel || 12,
      },
    });
  } catch (err: any) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { error: err.message || "Đã xảy ra lỗi máy chủ trong quá trình đăng ký." },
      { status: 500 }
    );
  }
}
