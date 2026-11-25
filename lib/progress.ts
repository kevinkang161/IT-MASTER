export interface ExamRecord {
  examId: string;
  examTitle: string;
  score: number;
  maxScore: number;
  accuracy: number;
  date: string;
}

export interface UserProgressData {
  completedLessons: string[];
  savedLessons: string[];
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  examHistory: ExamRecord[];
}

const DEFAULT_PROGRESS: UserProgressData = {
  completedLessons: [],
  savedLessons: [],
  totalQuestionsAnswered: 0,
  totalQuestionsCorrect: 0,
  examHistory: [],
};

function getStorageKey(userId?: string): string {
  return userId ? `itmaster_progress_${userId}` : "itmaster_progress_guest";
}

export function getUserProgress(userId?: string): UserProgressData {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      completedLessons: Array.isArray(parsed?.completedLessons) ? parsed.completedLessons : [],
      savedLessons: Array.isArray(parsed?.savedLessons) ? parsed.savedLessons : [],
      totalQuestionsAnswered: Number(parsed?.totalQuestionsAnswered) || 0,
      totalQuestionsCorrect: Number(parsed?.totalQuestionsCorrect) || 0,
      examHistory: Array.isArray(parsed?.examHistory) ? parsed.examHistory : [],
    };
  } catch (_) {
    return DEFAULT_PROGRESS;
  }
}

export function recordLessonCompleted(userId: string | undefined, lessonSlug: string): UserProgressData {
  const current = getUserProgress(userId);
  if (!current.completedLessons.includes(lessonSlug)) {
    const updated: UserProgressData = {
      ...current,
      completedLessons: [...current.completedLessons, lessonSlug],
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
    }
    return updated;
  }
  return current;
}

export function toggleLessonSaved(userId: string | undefined, lessonSlug: string): UserProgressData {
  const current = getUserProgress(userId);
  const exists = current.savedLessons.includes(lessonSlug);
  const updated: UserProgressData = {
    ...current,
    savedLessons: exists
      ? current.savedLessons.filter((s) => s !== lessonSlug)
      : [...current.savedLessons, lessonSlug],
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
  }
  return updated;
}

export function recordQuestionPracticed(
  userId: string | undefined,
  isCorrect: boolean
): UserProgressData {
  const current = getUserProgress(userId);
  const updated: UserProgressData = {
    ...current,
    totalQuestionsAnswered: current.totalQuestionsAnswered + 1,
    totalQuestionsCorrect: current.totalQuestionsCorrect + (isCorrect ? 1 : 0),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
  }
  return updated;
}

export function recordExamSubmitted(
  userId: string | undefined,
  record: ExamRecord
): UserProgressData {
  const current = getUserProgress(userId);
  const updated: UserProgressData = {
    ...current,
    examHistory: [record, ...current.examHistory],
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
  }
  return updated;
}
