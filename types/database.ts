export type UserRole = "student" | "admin";

export interface Profile {
  id: string; // matches auth.users.id
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  grade_level: 10 | 11 | 12;
  xp: number;
  level: number;
  streak_days: number;
  longest_streak: number;
  last_active_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: number;
  name: string; // e.g. "Lớp 10", "Lớp 11", "Lớp 12"
  slug: string;
  description: string;
  order_index: number;
}

export interface Subject {
  id: string;
  name: string; // "Tin học"
  code: string; // "INFO"
  description: string;
  created_at?: string;
}

export interface Chapter {
  id: string;
  grade_id: number;
  subject_id: string;
  title: string;
  order_index: number;
  description?: string;
}

export interface Topic {
  id: string;
  chapter_id: string;
  title: string;
  order_index: number;
  description?: string;
}

export type LessonDifficulty = "co_ban" | "trung_binh" | "nang_cao";

export interface Lesson {
  id: string;
  topic_id: string;
  title: string;
  slug: string;
  grade_id: number;
  difficulty: LessonDifficulty;
  introduction: string;
  learning_objectives: string[];
  content_markdown: string;
  code_snippets?: { language: string; code: string; caption?: string }[];
  order_index: number;
  is_published: boolean;
  is_draft: boolean; // unverified AI generated flagged as draft
  xp_reward: number;
  estimated_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  last_position_seconds?: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export type QuestionType = "single_choice" | "multiple_select" | "true_false" | "short_answer";
export type QuestionDifficulty = "nhan_biet" | "thong_hieu" | "van_dung" | "van_dung_cao";

export interface QuestionOption {
  id: string;
  question_id: string;
  content: string;
  is_correct: boolean;
  order_index: number;
  explanation?: string;
}

export interface Question {
  id: string;
  grade_id: number;
  topic_id: string;
  question_type: QuestionType;
  difficulty: QuestionDifficulty;
  content: string;
  image_url?: string;
  code_snippet?: string;
  accepted_answers?: string[]; // for short_answer questions
  explanation: string;
  is_published: boolean;
  is_draft: boolean;
  options?: QuestionOption[];
  created_at: string;
  updated_at: string;
}

export interface Exam {
  id: string;
  title: string;
  slug: string;
  grade_id: number;
  description: string;
  duration_minutes: number;
  total_questions: number;
  max_score: number;
  pass_score: number;
  difficulty: QuestionDifficulty;
  is_published: boolean;
  is_draft: boolean;
  immediate_explanation: boolean; // show explanations right after submit or keep locked
  xp_reward: number;
  created_at: string;
  updated_at: string;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_id: string;
  order_index: number;
  point: number;
  question?: Question;
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  user_id: string;
  started_at: string;
  submitted_at?: string;
  score?: number;
  total_correct?: number;
  total_incorrect?: number;
  total_unanswered?: number;
  accuracy_rate?: number;
  time_spent_seconds?: number;
  is_graded: boolean;
  created_at: string;
}

export interface ExamAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_ids: string[];
  short_answer_text?: string;
  is_correct?: boolean;
  is_marked_for_review: boolean;
  score_awarded: number;
  created_at: string;
}

export interface PracticeAttempt {
  id: string;
  user_id: string;
  topic_id?: string;
  grade_id?: number;
  total_questions: number;
  correct_count: number;
  xp_earned: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  badge_icon: string;
  xp_bonus: number;
  criterion_type: string;
  criterion_threshold: number;
  created_at: string;
}

export interface StudentAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  source_type: "lesson" | "practice" | "exam" | "achievement" | "streak" | "admin_adjustment";
  source_id?: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  item_type: "lesson" | "question" | "exam";
  item_id: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_read: boolean;
  type: "system" | "achievement" | "streak" | "exam";
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_table: string;
  target_id?: string;
  details?: Record<string, any>;
  created_at: string;
}
