export const DEMO_MAX_TRIAL_LESSONS = 3;

// The 3 starter trial lessons unlocked for demo exploration:
export const DEMO_ALLOWED_LESSON_SLUGS = [
  "thong-tin-du-lieu-thiet-bi-thong-minh",
  "he-nhi-phan-va-bieu-dien-du-lieu",
  "mang-internet-va-an-toan-so",
];

/**
 * Checks if a lesson is unlocked for a given user.
 * - Real registered users have 100% full unlocked access to all 95+ lessons.
 * - Demo/sample student accounts are limited to the 3 trial lessons.
 */
export function isLessonUnlockedForUser(lessonSlug: string, isDemo: boolean): boolean {
  if (!isDemo) return true; // Full access for registered students!
  return DEMO_ALLOWED_LESSON_SLUGS.includes(lessonSlug);
}

/**
 * Checks if an exam is unlocked for a given user.
 * - Real registered students can take all exams and practice tests.
 * - Demo accounts can take the first trial exam (Đề số 01).
 */
export function isExamUnlockedForUser(examSlug: string, isDemo: boolean): boolean {
  if (!isDemo) return true;
  return examSlug === "de-thi-thu-tot-nghiep-thpt-tin-hoc-so-01";
}
