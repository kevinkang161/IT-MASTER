-- ==============================================================================
-- IT MASTER - PostgreSQL & Supabase Database Migration
-- Version: 001_initial_schema
-- Description: Core tables, foreign keys, RLS security policies, and triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    grade_level INT NOT NULL DEFAULT 12 CHECK (grade_level IN (10, 11, 12)),
    xp INT NOT NULL DEFAULT 0 CHECK (xp >= 0),
    level INT NOT NULL DEFAULT 1 CHECK (level >= 1),
    streak_days INT NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
    longest_streak INT NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    last_active_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. GRADES TABLE
CREATE TABLE IF NOT EXISTS public.grades (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0
);

-- 3. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_id INT NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    grade_id INT NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    difficulty TEXT NOT NULL DEFAULT 'co_ban' CHECK (difficulty IN ('co_ban', 'trung_binh', 'nang_cao')),
    introduction TEXT NOT NULL DEFAULT '',
    learning_objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
    content_markdown TEXT NOT NULL DEFAULT '',
    code_snippets JSONB NOT NULL DEFAULT '[]'::jsonb,
    order_index INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_draft BOOLEAN NOT NULL DEFAULT false,
    xp_reward INT NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
    estimated_minutes INT NOT NULL DEFAULT 15 CHECK (estimated_minutes > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. LESSON_PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    last_position_seconds INT DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, lesson_id)
);

-- 8. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_id INT NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL DEFAULT 'single_choice' CHECK (question_type IN ('single_choice', 'multiple_select', 'true_false', 'short_answer')),
    difficulty TEXT NOT NULL DEFAULT 'nhan_biet' CHECK (difficulty IN ('nhan_biet', 'thong_hieu', 'van_dung', 'van_dung_cao')),
    content TEXT NOT NULL,
    image_url TEXT,
    code_snippet TEXT,
    accepted_answers JSONB DEFAULT '[]'::jsonb,
    explanation TEXT NOT NULL DEFAULT '',
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_draft BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. QUESTION_OPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    order_index INT NOT NULL DEFAULT 0,
    explanation TEXT
);

-- 10. EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_id INT NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    duration_minutes INT NOT NULL DEFAULT 45 CHECK (duration_minutes > 0),
    total_questions INT NOT NULL DEFAULT 40 CHECK (total_questions > 0),
    max_score NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    pass_score NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    difficulty TEXT NOT NULL DEFAULT 'thong_hieu' CHECK (difficulty IN ('nhan_biet', 'thong_hieu', 'van_dung', 'van_dung_cao')),
    immediate_explanation BOOLEAN NOT NULL DEFAULT true,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_draft BOOLEAN NOT NULL DEFAULT false,
    xp_reward INT NOT NULL DEFAULT 100 CHECK (xp_reward >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. EXAM_QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    order_index INT NOT NULL DEFAULT 0,
    point NUMERIC(5, 2) NOT NULL DEFAULT 0.25,
    UNIQUE(exam_id, question_id)
);

-- 12. EXAM_ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    submitted_at TIMESTAMPTZ,
    score NUMERIC(5, 2),
    total_correct INT DEFAULT 0,
    total_incorrect INT DEFAULT 0,
    total_unanswered INT DEFAULT 0,
    accuracy_rate NUMERIC(5, 2) DEFAULT 0.00,
    time_spent_seconds INT DEFAULT 0,
    is_graded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. EXAM_ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.exam_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    short_answer_text TEXT,
    is_correct BOOLEAN,
    is_marked_for_review BOOLEAN NOT NULL DEFAULT false,
    score_awarded NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(attempt_id, question_id)
);

-- 14. PRACTICE_ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.practice_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    grade_id INT REFERENCES public.grades(id) ON DELETE SET NULL,
    total_questions INT NOT NULL DEFAULT 0,
    correct_count INT NOT NULL DEFAULT 0,
    xp_earned INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('lesson', 'question', 'exam')),
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, item_type, item_id)
);

-- 16. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    badge_icon TEXT NOT NULL,
    xp_bonus INT NOT NULL DEFAULT 50,
    criterion_type TEXT NOT NULL,
    criterion_threshold INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. STUDENT_ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, achievement_id)
);

-- 18. XP_TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    reason TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('lesson', 'practice', 'exam', 'achievement', 'streak', 'admin_adjustment')),
    source_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 19. DAILY_ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.daily_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    lessons_completed INT NOT NULL DEFAULT 0,
    questions_answered INT NOT NULL DEFAULT 0,
    exams_taken INT NOT NULL DEFAULT 0,
    xp_gained INT NOT NULL DEFAULT 0,
    time_spent_seconds INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, activity_date)
);

-- 20. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('system', 'achievement', 'streak', 'exam')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 21. ADMIN_AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_chapters_grade ON public.chapters(grade_id);
CREATE INDEX IF NOT EXISTS idx_topics_chapter ON public.topics(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_topic ON public.lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_lessons_grade ON public.lessons(grade_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_grade ON public.questions(grade_id);
CREATE INDEX IF NOT EXISTS idx_question_options_q ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam ON public.exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON public.exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON public.exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_tx_user ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles can be read by authenticated users for leaderboard"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own permitted profile fields"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- CURRICULUM (READABLE BY EVERYONE, EDITABLE BY ADMIN)
CREATE POLICY "Grades read access" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Grades admin modify" ON public.grades FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Subjects read access" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Subjects admin modify" ON public.subjects FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Chapters read access" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Chapters admin modify" ON public.chapters FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Topics read access" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Topics admin modify" ON public.topics FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Lessons read published" ON public.lessons FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Lessons admin modify" ON public.lessons FOR ALL TO authenticated USING (public.is_admin());

-- LESSON PROGRESS
CREATE POLICY "Users can manage their own lesson progress"
    ON public.lesson_progress FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- QUESTIONS & OPTIONS
CREATE POLICY "Questions read published" ON public.questions FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Questions admin modify" ON public.questions FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Question options read" ON public.question_options FOR SELECT USING (true);
CREATE POLICY "Question options admin modify" ON public.question_options FOR ALL TO authenticated USING (public.is_admin());

-- EXAMS
CREATE POLICY "Exams read published" ON public.exams FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Exams admin modify" ON public.exams FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Exam questions read" ON public.exam_questions FOR SELECT USING (true);
CREATE POLICY "Exam questions admin modify" ON public.exam_questions FOR ALL TO authenticated USING (public.is_admin());

-- EXAM ATTEMPTS
CREATE POLICY "Users manage own attempts"
    ON public.exam_attempts FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- EXAM ANSWERS
CREATE POLICY "Users manage own answers"
    ON public.exam_answers FOR ALL
    TO authenticated
    USING (
      EXISTS (SELECT 1 FROM public.exam_attempts WHERE id = exam_answers.attempt_id AND (user_id = auth.uid() OR public.is_admin()))
    )
    WITH CHECK (
      EXISTS (SELECT 1 FROM public.exam_attempts WHERE id = exam_answers.attempt_id AND (user_id = auth.uid() OR public.is_admin()))
    );

-- PRACTICE ATTEMPTS
CREATE POLICY "Users manage own practice attempts"
    ON public.practice_attempts FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- BOOKMARKS
CREATE POLICY "Users manage own bookmarks"
    ON public.bookmarks FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ACHIEVEMENTS
CREATE POLICY "Achievements read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Achievements admin modify" ON public.achievements FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Student achievements read own"
    ON public.student_achievements FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- XP TRANSACTIONS (READ OWN, INSERT/UPDATE VIA SERVER SERVICE ROLE OR ADMIN)
CREATE POLICY "XP transactions read own"
    ON public.xp_transactions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- DAILY ACTIVITY
CREATE POLICY "Daily activity read own"
    ON public.daily_activity FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- NOTIFICATIONS
CREATE POLICY "Notifications read and update own"
    ON public.notifications FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ADMIN AUDIT LOGS (ADMIN ONLY)
CREATE POLICY "Admin audit logs viewable by admin only"
    ON public.admin_audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- ==============================================================================
-- AUTH TRIGGER: AUTO CREATE PROFILE ON USER SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, grade_level)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE((NEW.raw_user_meta_data->>'grade_level')::int, 12)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
