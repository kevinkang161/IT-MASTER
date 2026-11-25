import { Exam, Question, QuestionDifficulty, QuestionType } from "@/types/database";
import { MOCK_QUESTIONS } from "@/lib/mock-data";

export const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  nhan_biet: "Nhận biết",
  thong_hieu: "Thông hiểu",
  van_dung: "Vận dụng",
  van_dung_cao: "Vận dụng cao",
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single_choice: "Trắc nghiệm 4 lựa chọn",
  multiple_select: "Chọn nhiều đáp án",
  true_false: "Đúng / Sai 4 ý",
  short_answer: "Trả lời ngắn",
};

export function getCodeLanguage(question: Question): string {
  const snippet = question.code_snippet || "";
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|FROM|WHERE)\b/i.test(snippet)) {
    return "sql";
  }
  if (/^\s*</.test(snippet) || /\{[^}]*:[^}]*\}/.test(snippet)) {
    return "html";
  }
  return "python";
}

/**
 * Selects the questions belonging to a specific exam.
 * Comprehensive THPT mock exams include the full cross-grade bank;
 * grade-specific periodic exams filter strictly by grade_id.
 */
export function getQuestionsForExam(exam: Exam, allQuestions: Question[] = MOCK_QUESTIONS): Question[] {
  if (exam.id === "exam-thpt-01") {
    return allQuestions;
  }
  const byGrade = allQuestions.filter((q) => q.grade_id === exam.grade_id);
  return byGrade.length > 0 ? byGrade : allQuestions;
}

export interface GradeExamInput {
  exam: Exam;
  questions: Question[];
  singleAnswers: Record<string, string>;
  tfAnswers: Record<string, Record<string, boolean>>;
  shortAnswers: Record<string, string>;
  timeSpentSeconds: number;
}

export interface GradeExamResult {
  score: number;
  maxScore: number;
  passScore: number;
  isPassed: boolean;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  timeSpentSeconds: number;
  xpEarned: number;
}

/**
 * Shared grading calculation (used by both ExamRoomPage and POST /api/exams/submit).
 * Applies Ministry 2025 partial-credit rules for 4-statement true/false questions:
 * 1 right -> 10%, 2 right -> 25%, 3 right -> 50%, 4 right -> 100% of question weight.
 */
export function gradeExam({
  exam,
  questions,
  singleAnswers,
  tfAnswers,
  shortAnswers,
  timeSpentSeconds,
}: GradeExamInput): GradeExamResult {
  if (questions.length === 0) {
    return {
      score: 0,
      maxScore: exam.max_score,
      passScore: exam.pass_score,
      isPassed: false,
      totalQuestions: 0,
      correctCount: 0,
      incorrectCount: 0,
      accuracy: 0,
      timeSpentSeconds,
      xpEarned: 0,
    };
  }

  let correctCount = 0;
  let rawScore = 0;
  const basePerQuestion = exam.max_score / questions.length;

  questions.forEach((q) => {
    if (q.question_type === "single_choice") {
      const selectedOptId = singleAnswers[q.id];
      const opt = q.options?.find((o) => o.id === selectedOptId);
      if (opt?.is_correct) {
        correctCount += 1;
        rawScore += basePerQuestion;
      }
    } else if (q.question_type === "short_answer") {
      const input = (shortAnswers[q.id] || "").trim().toLowerCase();
      if (input && q.accepted_answers?.some((ans) => ans.trim().toLowerCase() === input)) {
        correctCount += 1;
        rawScore += basePerQuestion;
      }
    } else if (q.question_type === "true_false") {
      const answers = tfAnswers[q.id] || {};
      let subCorrect = 0;
      q.options?.forEach((opt) => {
        if (answers[opt.id] === opt.is_correct) {
          subCorrect += 1;
        }
      });

      if (subCorrect === 4) {
        correctCount += 1;
        rawScore += basePerQuestion;
      } else if (subCorrect === 3) {
        rawScore += basePerQuestion * 0.5;
      } else if (subCorrect === 2) {
        rawScore += basePerQuestion * 0.25;
      } else if (subCorrect === 1) {
        rawScore += basePerQuestion * 0.1;
      }
    }
  });

  const score = Number(Math.min(exam.max_score, rawScore).toFixed(2));
  const accuracy = Math.round((correctCount / questions.length) * 100);
  const xpEarned = Math.round(exam.xp_reward * (score / exam.max_score));

  return {
    score,
    maxScore: exam.max_score,
    passScore: exam.pass_score,
    isPassed: score >= exam.pass_score,
    totalQuestions: questions.length,
    correctCount,
    incorrectCount: questions.length - correctCount,
    accuracy,
    timeSpentSeconds,
    xpEarned,
  };
}
